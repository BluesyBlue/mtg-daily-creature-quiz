import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardDisplay } from '@/app/components/CardDisplay';
import { GuessInput } from '@/app/components/GuessInput';
import mtgLogo from '@/assets/7ff308a699b32bb3b895a6ef5d6e0be72a0eb43a.png';
import backgroundImage from '@/assets/98979b0f5e399b241bb8df95439e5b5fc2870918.png';
import bg2 from '@/assets/18032718c486d507b9c6e42e027d45d06b91a4d4.png';
import bg3 from '@/assets/9c7472bd2ded2ddfa7ec4a05aee54dbd491a4d72.png';
import bg4 from '@/assets/532ea2f37bdba6e5f11da466a979974232b6cf1d.png';
import bg5 from '@/assets/dd1ce1eff63ff211413b05f485ce7ccf7b4cfe33.png';
import bg6 from '@/assets/72df7e7ec070a8e7a17a3d21ced66036ffab2125.png';
import bg7 from '@/assets/c48f2f8eb7ea15f17e6b21a010ac6f8535f9e1e6.png';
import bg8 from '@/assets/646724c259269d01f029e6bbe8d5d4e73a5fb4fb.png';
import bg9 from '@/assets/c161309eb8b3ab38f16140c55bd14c72fbcd1ea0.png';
import bg10 from '@/assets/27f097f642699a1b4af8e8df3c0843091017367c.png';
import bg11 from '@/assets/deb57d6e4b4048d5f28ccdb503768b1449fafb77.png';
import bg12 from '@/assets/d729aeb0cd692371062b93e3f6f9921eb630cb4c.png';
import bg13 from '@/assets/0fcbc6792bc198acf05882901b521472cfdf9edf.png';
import bg14 from '@/assets/f267388b24777fc8de17a0bf6d8b9bb7bc15b772.png';
import bg15 from '@/assets/84d189b609d892976fa9c3fd8b03908f606197a1.png';
import bg16 from '@/assets/ad76032f7b9e1601e52e5e99d3fa0a66681854ee.png';
import bg17 from '@/assets/8a7c6f8d4051885aed4254b8e953fb305f63387a.png';
import bg18 from '@/assets/0841ec44d1663ce5a870b2bc2f40f5cb17b9adbb.png';
import bg19 from '@/assets/a3f37faf1efbbd979fec80eb44d2c4c7938b110d.png';
import bg20 from '@/assets/ebc64196c5142502ba031c49958eb2bcf0a0ae7e.png';
import bg21 from '@/assets/7bc2d5122dbcba43fc1fc358f6112e114cf350e8.png';

const RESULT_BACKGROUNDS = [backgroundImage, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19, bg20, bg21];

interface Card {
  id: string;
  name: string;
  image_uris: {
    normal: string;
  };
  type_line: string;
}

interface CardScore {
  cardIndex: number;
  points: number;
  card: Card;
  guesses: string[];
}

// Supabase configuration
const projectId = "lewwlvzooauwjpvbnnib";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxld3dsdnpvb2F1d2pwdmJubmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzcyMzksImV4cCI6MjA4NTI1MzIzOX0.Z0BvuhNKYH-jn-m-bskI3z7o_mJZ0OkI8wG2BBdq28A";

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guesses, setGuesses] = useState<string[]>(['', '', '', '']);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardScores, setCardScores] = useState<CardScore[]>([]);
  const [resultBgIndex, setResultBgIndex] = useState(0);
  const [showArtOnly, setShowArtOnly] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const particlesRef = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 5,
      delay: Math.random() * 0.35,
      duration: Math.random() * 0.5 + 0.45,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
      rise: -(Math.random() * 80 + 40),
    }))
  );

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a4df6fde/daily-cards`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching daily cards:', errorData);
        throw new Error(errorData.error || 'Failed to fetch daily cards');
      }
      
      const data = await response.json();
      console.log('Fetched daily cards:', data.cached ? '(cached)' : '(new)');
      setCards(data.cards);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError(String(error));
      setLoading(false);
    }
  };

  const extractCreatureTypes = (typeLine: string): string[] => {
    // Type line format: "Creature — Dragon Wizard" or "Legendary Creature — Human Knight"
    const parts = typeLine.split('—');
    if (parts.length < 2) return [];
    
    const types = parts[1].trim().split(' ').map(t => t.trim());
    
    // Filter out invalid types: "//", "Instant", and "Sorcery"
    const invalidTypes = ['//', 'instant', 'sorcery'];
    const filteredTypes = types.filter(t => 
      t && !invalidTypes.includes(t.toLowerCase())
    );
    
    return filteredTypes;
  };

  const handleSubmit = () => {
    if (!guesses[0].trim()) {
      alert('Please fill in at least the first creature type!');
      return;
    }

    const currentCard = cards[currentCardIndex];
    const actualTypes = extractCreatureTypes(currentCard.type_line).map(t => t.toLowerCase());
    
    // Get unique user guesses only (prevent duplicate entries for exploitation)
    const userGuesses = guesses
      .filter(g => g.trim())
      .map(g => g.toLowerCase().trim());
    const uniqueUserGuesses = [...new Set(userGuesses)];

    // Calculate score: 1 point for each correct unique type
    let points = 0;
    uniqueUserGuesses.forEach(guess => {
      if (actualTypes.includes(guess)) {
        points++;
      }
    });

    setScore(score + points);
    setRevealed(true);

    // Store the score for the current card
    const newCardScore: CardScore = {
      cardIndex: currentCardIndex,
      points: points,
      card: currentCard,
      guesses: uniqueUserGuesses
    };
    setCardScores([...cardScores, newCardScore]);
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setGuesses(['', '', '', '']);
      setRevealed(false);
    } else {
      setResultBgIndex(Math.floor(Math.random() * RESULT_BACKGROUNDS.length));
      setGameComplete(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setGuesses(['', '', '', '']);
    setRevealed(false);
    setScore(0);
    setGameComplete(false);
    setCardScores([]);
    setResultBgIndex(0);
    setShowArtOnly(false);
    setIsTransitioning(false);
    fetchCards();
  };

  const handleShowArt = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 900);
    setShowArtOnly(true);
  };

  const handleShowResults = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 900);
    setShowArtOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3/4 w-[800px] h-[800px] bg-white/15 rounded-full blur-3xl"></div>
        <div className="text-center relative z-10">
          <img 
            src={mtgLogo} 
            alt="Loading" 
            className="w-24 h-24 animate-spin mx-auto mb-4"
          />
          <p className="text-white text-xl">Rounding up the creatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3/4 w-[800px] h-[800px] bg-white/15 rounded-full blur-3xl"></div>
        <div className="text-center bg-slate-800 p-8 rounded-lg shadow-2xl max-w-md relative z-10">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Cards</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={fetchCards}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    // Calculate total possible creature types across all cards
    const totalPossible = cards.reduce((total, card) => {
      return total + extractCreatureTypes(card.type_line).length;
    }, 0);

    return (
      <div className="min-h-dvh w-full relative overflow-y-auto">
        {/* Fixed background image - always fills the screen */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url(${RESULT_BACKGROUNDS[resultBgIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Fixed dark overlay - animated */}
        <AnimatePresence>
          {!showArtOnly && (
            <motion.div
              className="fixed inset-0 bg-black/40 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {/* Magical sparkle particles during transition */}
        <AnimatePresence>
          {isTransitioning && (
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
              {particlesRef.current.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  initial={{ opacity: 0, scale: 0, rotate: p.rotation, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0], rotate: p.rotation + 180, x: p.drift, y: p.rise }}
                  transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
                >
                  <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#fbbf24" opacity="0.9" />
                  </svg>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Art-only mode: small Results button in top-right corner */}
        <AnimatePresence>
          {showArtOnly && (
            <motion.button
              onClick={handleShowResults}
              className="fixed top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 backdrop-blur-sm"
              initial={{ opacity: 0, x: 24, y: -24 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 24, y: -24 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
            >
              Results
            </motion.button>
          )}
        </AnimatePresence>

        {/* All results content - animated */}
        <AnimatePresence>
          {!showArtOnly && (
            <motion.div
              className="relative z-10 min-h-dvh flex flex-col items-center py-8 px-4"
              initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              {/* Ornate results panel */}
              <div className="max-w-2xl w-full mb-8">
                <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 p-12 rounded-lg shadow-2xl border-4 border-yellow-700 relative" style={{
                  boxShadow: '0 0 0 2px #78350f, 0 0 0 6px #b45309, 0 0 0 8px #78350f, 0 20px 60px rgba(0,0,0,0.8)',
                }}>
                  {/* Texture overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(139,69,19,.8)_2px,rgba(139,69,19,.8)_4px)] rounded-lg pointer-events-none"></div>
                  <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(139,69,19,.8)_2px,rgba(139,69,19,.8)_4px)] rounded-lg pointer-events-none"></div>
                  
                  {/* Corner decorations */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-500 rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-500 rounded-br-lg"></div>
                  
                  {/* Inner corner accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-600/50"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-600/50"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-600/50"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-600/50"></div>
                  
                  <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-bold text-amber-950 mb-6" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                      Quest Complete!
                    </h1>
                    
                    <div className="bg-gradient-to-b from-yellow-600 via-yellow-700 to-yellow-800 p-6 rounded-lg border-2 border-yellow-900 mb-6">
                      <p className="text-3xl text-amber-100 mb-2">
                        <span className="font-bold">Final Score:</span>
                      </p>
                      <p className="text-5xl font-bold text-white">
                        {score} / {totalPossible}
                      </p>
                    </div>
                    
                    <p className="text-xl text-amber-900 mb-8 leading-relaxed">
                      Come back tomorrow to guess new set of 10 creatures.
                    </p>
                    
                    <div className="flex flex-col items-center gap-3 mt-2">
                      <button
                        onClick={handleReset}
                        className="bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 hover:from-purple-500 hover:via-purple-600 hover:to-purple-800 text-amber-100 px-12 py-5 rounded-lg font-bold text-2xl transition border-2 border-purple-950 shadow-lg shadow-purple-900/50"
                      >
                        Try again!
                      </button>
                      <button
                        onClick={handleShowArt}
                        className="text-amber-800 hover:text-amber-950 text-sm underline underline-offset-2 transition"
                      >
                        No, show me the cool art!
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ko-fi support button */}
              <div className="flex justify-center my-6">
                <a
                  href="https://ko-fi.com/bluesyblue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#fcbf47', color: '#323842' }}
                >
                  <img
                    src="https://storage.ko-fi.com/cdn/logomarkLogo.png"
                    alt="Ko-fi"
                    className="w-6 h-6 object-contain"
                  />
                  Buy Me a Support Booster
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              </div>

              {/* Summary Section */}
              <div className="max-w-6xl w-full bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 p-8 rounded-lg shadow-2xl border-4 border-yellow-700 relative" style={{
                boxShadow: '0 0 0 2px #78350f, 0 0 0 6px #b45309, 0 0 0 8px #78350f, 0 20px 60px rgba(0,0,0,0.8)',
              }}>
                {/* Texture overlay */}
                <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(139,69,19,.8)_2px,rgba(139,69,19,.8)_4px)] rounded-lg pointer-events-none"></div>
                <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(139,69,19,.8)_2px,rgba(139,69,19,.8)_4px)] rounded-lg pointer-events-none"></div>
                
                {/* Corner decorations */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-500 rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-500 rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-500 rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-500 rounded-br-lg"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-amber-950 mb-6 text-center" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                    Record of Your Knowledge
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cardScores.map((cardScore, idx) => {
                      const actualTypes = extractCreatureTypes(cardScore.card.type_line);
                      const actualTypesLower = actualTypes.map(t => t.toLowerCase());
                      
                      return (
                        <div key={idx} className="bg-white/50 p-4 rounded-lg border-2 border-amber-700/50">
                          <div className="flex flex-col sm:flex-row items-start gap-4 mb-3">
                            <img 
                              src={cardScore.card.image_uris.normal} 
                              alt={cardScore.card.name}
                              className="w-full sm:w-48 h-auto rounded border-2 border-yellow-700 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 w-full">
                              <h3 className="font-bold text-amber-950 text-2xl mb-2">{cardScore.card.name}</h3>
                              <div className="text-lg text-amber-800 mb-4">
                                Points: <span className="font-bold">{cardScore.points} / {actualTypes.length}</span>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <p className="text-lg font-semibold text-amber-900 mb-2">Your Guesses:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {cardScore.guesses.length > 0 ? (
                                      cardScore.guesses.map((guess, i) => {
                                        const isCorrect = actualTypesLower.includes(guess.toLowerCase());
                                        return (
                                          <span
                                            key={i}
                                            className={`px-3 py-1.5 rounded-lg font-semibold text-base border-2 ${
                                              isCorrect
                                                ? 'bg-green-600 text-white border-green-400'
                                                : 'bg-red-600 text-white border-red-400'
                                            }`}
                                          >
                                            {guess}
                                          </span>
                                        );
                                      })
                                    ) : (
                                      <span className="text-amber-700 italic text-base">No guesses</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-lg font-semibold text-amber-900 mb-2">Correct Answer:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {actualTypes.map((type, i) => (
                                      <span
                                        key={i}
                                        className="bg-amber-950 text-yellow-100 px-3 py-1.5 rounded-lg font-semibold text-base border-2 border-yellow-600"
                                      >
                                        {type}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-dvh w-full bg-black relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] bg-white/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="min-h-dvh flex flex-col relative z-10">
        {/* Header - Full Width Panel */}
        <div className="w-full bg-gradient-to-b from-yellow-600 via-yellow-700 to-yellow-800 shadow-2xl relative flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,.3)_2px,rgba(0,0,0,.3)_4px)]\"></div>
          <div className="max-w-6xl mx-auto px-8 relative z-10 pt-3 pb-6 md:pt-4 md:pb-8">
            <h1 className="text-3xl md:text-[4.48rem] font-bold text-white text-center drop-shadow-lg leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontFamily: "'Cinzel', serif" }}>
              Daily Creature Quiz
            </h1>
          </div>
          {/* Wavy bottom border */}
          <svg className="absolute bottom-0 left-0 w-full h-4" preserveAspectRatio="none" viewBox="0 0 1200 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,6 Q5,2 10,6 T20,6 T30,6 T40,6 T50,6 T60,6 T70,6 T80,6 T90,6 T100,6 T110,6 T120,6 T130,6 T140,6 T150,6 T160,6 T170,6 T180,6 T190,6 T200,6 T210,6 T220,6 T230,6 T240,6 T250,6 T260,6 T270,6 T280,6 T290,6 T300,6 T310,6 T320,6 T330,6 T340,6 T350,6 T360,6 T370,6 T380,6 T390,6 T400,6 T410,6 T420,6 T430,6 T440,6 T450,6 T460,6 T470,6 T480,6 T490,6 T500,6 T510,6 T520,6 T530,6 T540,6 T550,6 T560,6 T570,6 T580,6 T590,6 T600,6 T610,6 T620,6 T630,6 T640,6 T650,6 T660,6 T670,6 T680,6 T690,6 T700,6 T710,6 T720,6 T730,6 T740,6 T750,6 T760,6 T770,6 T780,6 T790,6 T800,6 T810,6 T820,6 T830,6 T840,6 T850,6 T860,6 T870,6 T880,6 T890,6 T900,6 T910,6 T920,6 T930,6 T940,6 T950,6 T960,6 T970,6 T980,6 T990,6 T1000,6 T1010,6 T1020,6 T1030,6 T1040,6 T1050,6 T1060,6 T1070,6 T1080,6 T1090,6 T1100,6 T1110,6 T1120,6 T1130,6 T1140,6 T1150,6 T1160,6 T1170,6 T1180,6 T1190,6 T1200,6 L1200,12 L0,12 Z" fill="#000000" />
            <path d="M0,6 Q5,2 10,6 T20,6 T30,6 T40,6 T50,6 T60,6 T70,6 T80,6 T90,6 T100,6 T110,6 T120,6 T130,6 T140,6 T150,6 T160,6 T170,6 T180,6 T190,6 T200,6 T210,6 T220,6 T230,6 T240,6 T250,6 T260,6 T270,6 T280,6 T290,6 T300,6 T310,6 T320,6 T330,6 T340,6 T350,6 T360,6 T370,6 T380,6 T390,6 T400,6 T410,6 T420,6 T430,6 T440,6 T450,6 T460,6 T470,6 T480,6 T490,6 T500,6 T510,6 T520,6 T530,6 T540,6 T550,6 T560,6 T570,6 T580,6 T590,6 T600,6 T610,6 T620,6 T630,6 T640,6 T650,6 T660,6 T670,6 T680,6 T690,6 T700,6 T710,6 T720,6 T730,6 T740,6 T750,6 T760,6 T770,6 T780,6 T790,6 T800,6 T810,6 T820,6 T830,6 T840,6 T850,6 T860,6 T870,6 T880,6 T890,6 T900,6 T910,6 T920,6 T930,6 T940,6 T950,6 T960,6 T970,6 T980,6 T990,6 T1000,6 T1010,6 T1020,6 T1030,6 T1040,6 T1050,6 T1060,6 T1070,6 T1080,6 T1090,6 T1100,6 T1110,6 T1120,6 T1130,6 T1140,6 T1150,6 T1160,6 T1170,6 T1180,6 T1190,6 T1200,6" stroke="#000000" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            {/* Card Display and Guess Input - Side by Side on Large Screens */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Card Display */}
              <div className="flex-shrink-0 w-full lg:w-auto lg:self-start flex justify-center">
                <CardDisplay card={currentCard} revealed={revealed} cardIndex={currentCardIndex} />
              </div>

              {/* Guess Input */}
              <div className="flex-1 w-full">
                <GuessInput
                  guesses={guesses}
                  setGuesses={setGuesses}
                  revealed={revealed}
                  onSubmit={handleSubmit}
                  onNext={handleNext}
                  currentCard={currentCard}
                  extractCreatureTypes={extractCreatureTypes}
                  currentCardIndex={currentCardIndex}
                  score={score}
                />
                
                {/* Card Progress Section */}
                <div className="mt-6 bg-gradient-to-b from-amber-900/40 to-amber-950/40 rounded-lg p-6 border border-amber-700/50 shadow-2xl relative overflow-hidden">
                  {/* Background texture */}
                  <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,.1)_2px,rgba(255,255,255,.1)_4px)]"></div>
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-lg font-semibold text-amber-200">Card Progress</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-amber-200 text-lg">
                        <span>Total Score:</span>{' '}
                        <span className="font-bold">{score}</span>
                      </div>
                      <div className="text-amber-200 text-lg">
                        <span>Card:</span>{' '}
                        <span className="font-bold">{currentCardIndex + 1} / 10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-10 gap-2 relative z-10">
                    {Array.from({ length: 10 }, (_, i) => {
                      const cardScore = cardScores.find(cs => cs.cardIndex === i);
                      const isCompleted = cardScore !== undefined;
                      
                      return (
                        <div
                          key={i}
                          className="relative aspect-[63/88] rounded-md overflow-hidden border-2 transition-all duration-300"
                          style={{
                            borderColor: isCompleted ? '#fbbf24' : '#78716c',
                            backgroundColor: isCompleted ? '#0a0a0a' : '#292524'
                          }}
                        >
                          {/* Placeholder - shows card number when not completed */}
                          {!isCompleted && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl font-bold text-stone-600/30">{i + 1}</span>
                            </div>
                          )}
                          
                          {/* Completed card - shows image and score badge */}
                          {isCompleted && (
                            <>
                              <img
                                src={cardScore.card.image_uris.normal}
                                alt={cardScore.card.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Score badge */}
                              <div 
                                className={`absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full border flex items-center justify-center shadow-lg ${
                                  cardScore.points === 0
                                    ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-200'
                                    : 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                }`}
                              >
                                <span className={`text-[10px] font-bold ${
                                  cardScore.points === 0 ? 'text-red-950' : 'text-green-950'
                                }`}>{cardScore.points}</span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ko-fi support button */}
                <div className="mt-6 flex justify-center">
                  <a
                    href="https://ko-fi.com/bluesyblue"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#fcbf47', color: '#323842' }}
                  >
                    <img
                      src="https://storage.ko-fi.com/cdn/logomarkLogo.png"
                      alt="Ko-fi"
                      className="w-6 h-6 object-contain"
                    />
                    Buy Me a Support Booster
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer footer */}
        <footer className="mt-auto w-full px-6 py-3 text-center">
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
            This is an unofficial fan project and is not affiliated with, endorsed by, or sponsored by Wizards of the Coast. Magic: The Gathering, all card images, and art are property of Wizards of the Coast LLC. Used under the{' '}
            <a
              href="https://company.wizards.com/en/legal/fancontentpolicy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300 transition-colors"
            >
              Fan Content Policy
            </a>.
            {' '}Card data and images provided by{' '}
            <a
              href="https://scryfall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300 transition-colors"
            >
              Scryfall
            </a>.
            {' '}New cards every day at midnight UTC.
          </p>
        </footer>
      </div>
    </div>
  );
}