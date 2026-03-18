import { useState, useRef, useEffect } from 'react';
import { type SupportedLang, LANG_LABELS, LANG_CARD_COUNTS } from '@/i18n/translations';

interface LanguageSelectorProps {
  currentLang: SupportedLang;
  onSelect: (lang: SupportedLang) => void;
}

const LANGS: SupportedLang[] = ['en', 'es', 'fr', 'de', 'it'];

export function LanguageSelector({ currentLang, onSelect }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = LANG_LABELS[currentLang];

  return (
    <div ref={ref} className="relative z-[9999]">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white font-semibold px-3 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition select-none"
        aria-label="Select language"
      >
        <img
          src={`https://flagcdn.com/24x18/${current.flagCode}.png`}
          width={24}
          height={18}
          alt={current.native}
          className="rounded-sm shadow-sm flex-shrink-0"
        />
        <span className="text-sm">{current.native}</span>
        <svg
          className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-stone-900/95 border border-white/15 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm z-[9999]">
          {LANGS.map(lang => {
            const label = LANG_LABELS[lang];
            const count = LANG_CARD_COUNTS[lang];
            const isActive = lang === currentLang;
            return (
              <button
                key={lang}
                onClick={() => {
                  setOpen(false);
                  if (lang !== currentLang) onSelect(lang);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                  isActive
                    ? 'bg-yellow-700/50 text-yellow-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <img
                  src={`https://flagcdn.com/24x18/${label.flagCode}.png`}
                  width={24}
                  height={18}
                  alt={label.native}
                  className="rounded-sm shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{label.native}</p>
                  <p className="text-xs text-white/50 leading-tight">~{count.toLocaleString()} creatures</p>
                </div>
                {isActive && (
                  <svg className="size-4 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
