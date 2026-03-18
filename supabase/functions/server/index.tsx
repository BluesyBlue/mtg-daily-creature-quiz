// @ts-nocheck
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

type SupportedLang = 'en' | 'es' | 'fr' | 'de' | 'it';
const SUPPORTED_LANGS: SupportedLang[] = ['en', 'es', 'fr', 'de', 'it'];

interface Card {
  id: string;
  name: string;
  image_uris: {
    normal: string;
  };
  type_line: string;
  /** Localized type line used for answer validation and display. Equals type_line for English. */
  display_type_line: string;
}

const app = new Hono();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const allowedOrigins = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") ?? defaultAllowedOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const resolveCorsOrigin = (origin?: string) => {
  if (!origin) {
    return defaultAllowedOrigins[0];
  }

  return allowedOrigins.has(origin) ? origin : "";
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: (origin) => resolveCorsOrigin(origin),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a4df6fde/health", (c) => {
  return c.json({ status: "ok" });
});

// Get daily cards endpoint
app.get("/make-server-a4df6fde/daily-cards", async (c) => {
  try {
    // Validate language param – default to 'en' for backward compatibility
    const rawLang = c.req.query('lang') ?? 'en';
    const lang: SupportedLang = SUPPORTED_LANGS.includes(rawLang as SupportedLang)
      ? (rawLang as SupportedLang)
      : 'en';

    // Get current date in YYYY-MM-DD format (UTC)
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

    // Keep the legacy key format for English to avoid cache busting existing entries
    const dateKey = lang === 'en'
      ? `daily-cards-${dateStr}`
      : `daily-cards-${dateStr}-${lang}`;
    
    console.log(`Checking for daily cards with key: ${dateKey}`);
    
    // Check if cards already exist for today
    const existingCards = await kv.get(dateKey);
    
    if (existingCards) {
      console.log(`Found existing cards for ${dateKey}`);
      return c.json({ cards: existingCards, cached: true });
    }
    
    console.log(`No existing cards found. Fetching new cards from Scryfall (lang=${lang})...`);
    
    // Fetch 10 random creature cards from Scryfall
    const cards: Card[] = [];
    let attempts = 0;
    const maxAttempts = 60; // Safety limit (higher for non-English, fewer available cards)
    
    // For non-English we filter to cards that actually have a printing in that language
    const scryfallQuery = lang === 'en'
      ? 'type:creature'
      : `type:creature+lang:${lang}`;

    while (cards.length < 10 && attempts < maxAttempts) {
      attempts++;
      try {
        const response = await fetch(
          `https://api.scryfall.com/cards/random?q=${scryfallQuery}&lang=${lang}`
        );
        
        if (!response.ok) {
          console.error(`Scryfall API error: ${response.status} ${response.statusText}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }
        
        const data = await response.json();
        
        // Must have card art at the top level (filters out DFCs / split cards)
        if (!data.image_uris || !data.type_line || !data.type_line.includes('Creature')) {
          continue;
        }

        // Skip cards with no real scan (Scryfall placeholder = "Localized Image Not Available")
        if (data.image_status === 'missing' || data.image_status === 'placeholder') {
          continue;
        }

        // Determine the localized type line to use for answer validation
        let displayTypeLine: string;
        if (lang === 'en') {
          displayTypeLine = data.type_line;
        } else {
          // For non-English: require printed_type_line that contains a subtype separator
          if (!data.printed_type_line) continue;
          const parts = data.printed_type_line.split('—');
          if (parts.length < 2) continue;
          const subtypes = parts[1].trim().split(' ').filter((t: string) => t && t !== '//' && t !== 'et' && t !== 'y' && t !== 'und' && t !== 'e');
          if (subtypes.length === 0) continue;
          displayTypeLine = data.printed_type_line;
        }

        cards.push({
          id: data.id,
          name: data.name,
          image_uris: {
            normal: data.image_uris.normal
          },
          type_line: data.type_line,
          display_type_line: displayTypeLine,
        });
        console.log(`Fetched card ${cards.length}/10: ${data.name}`);
        
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching card (attempt ${attempts}):`, error);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    if (cards.length < 10) {
      console.error(`Only fetched ${cards.length} cards after ${attempts} attempts`);
      return c.json({ error: `Only able to fetch ${cards.length} cards. Please try again.` }, 500);
    }
    
    // Store cards in KV store for today
    await kv.set(dateKey, cards);
    console.log(`Successfully stored ${cards.length} cards for ${dateKey}`);
    
    return c.json({ cards, cached: false });
  } catch (error) {
    console.error('Error in /daily-cards endpoint:', error);
    return c.json({ error: 'Failed to fetch daily cards' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

Deno.serve(app.fetch);