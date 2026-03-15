import { ArrowRight, Check, X } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface Card {
  id: string;
  name: string;
  image_uris: {
    normal: string;
  };
  type_line: string;
}

interface GuessInputProps {
  guesses: string[];
  setGuesses: (guesses: string[]) => void;
  revealed: boolean;
  onSubmit: () => void;
  onNext: () => void;
  currentCard: Card;
  extractCreatureTypes: (typeLine: string) => string[];
  currentCardIndex: number;
  score: number;
}

export function GuessInput({
  guesses,
  setGuesses,
  revealed,
  onSubmit,
  onNext,
  currentCard,
  extractCreatureTypes,
  currentCardIndex,
  score,
}: GuessInputProps) {
  const actualTypes = extractCreatureTypes(currentCard.type_line);

  // Calculate points for current card when revealed
  const calculateCurrentCardPoints = () => {
    if (!revealed) return 0;
    
    const actualTypesLower = actualTypes.map(t => t.toLowerCase());
    const userGuesses = guesses
      .filter(g => g.trim())
      .map(g => g.toLowerCase().trim());
    const uniqueUserGuesses = [...new Set(userGuesses)];

    let points = 0;
    uniqueUserGuesses.forEach(guess => {
      if (actualTypesLower.includes(guess)) {
        points++;
      }
    });
    
    return points;
  };

  // Helper function to determine field status
  const getFieldStatus = (guess: string, index: number) => {
    if (!revealed) return null;

    // Fields beyond the number of actual types are always neutral (yellow)
    if (index >= actualTypes.length) return null;

    const trimmedGuess = guess.trim();
    // Empty field within the required range = missed type = red
    if (!trimmedGuess) return false;

    return actualTypes.map(t => t.toLowerCase()).includes(trimmedGuess.toLowerCase());
  };

  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // On touch devices, track a window after each card transition during which
  // any browser-initiated auto-focus on inputs should be immediately cancelled.
  // User-tap-initiated focus happens outside this window and works normally.
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const justTransitioned = useRef(isTouchDevice); // true on initial load for touch devices

  const setTransitioned = () => {
    if (!isTouchDevice) return;
    justTransitioned.current = true;
    setTimeout(() => { justTransitioned.current = false; }, 600);
  };

  // Reset justTransitioned flag on mount (handles initial page load)
  useEffect(() => {
    if (isTouchDevice) {
      const timer = setTimeout(() => { justTransitioned.current = false; }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Focus Next Card button on reveal (desktop only)
  useEffect(() => {
    if (revealed && nextButtonRef.current && !isTouchDevice) {
      nextButtonRef.current.focus();
    }
  }, [revealed]);

  // Focus first input on new card (desktop only)
  useEffect(() => {
    if (!revealed && inputRefs.current[0] && !isTouchDevice) {
      inputRefs.current[0].focus();
    }
    if (isTouchDevice) setTransitioned();
  }, [currentCardIndex, revealed]);

  return (
    <div ref={containerRef} className="bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 p-8 rounded-lg shadow-2xl border-4 border-yellow-700 relative" style={{
      boxShadow: '0 0 0 2px #78350f, 0 0 0 6px #b45309, 0 0 0 8px #78350f, 0 10px 30px rgba(0,0,0,0.5)',
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
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-amber-950 mb-2">
          Guess the Creature Type(s)
        </h2>
        <p className="text-black mb-4">
          Enter at least 1 creature type. Typically creature has 1-3 types.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {guesses.map((guess, index) => {
            const correct = getFieldStatus(guess, index);
            
            return (
              <div key={index} className="flex flex-col">
                <label htmlFor={`guess-${index}`} className="text-amber-900 mb-2 text-sm font-semibold">
                  Type {index + 1} {index === 0 && <span className="text-red-600">*</span>}
                </label>
                <div className="relative">
                  <input
                    ref={(el) => void (inputRefs.current[index] = el)}
                    id={`guess-${index}`}
                    type="text"
                    value={guess}
                    onFocus={(e) => {
                      // Block browser-initiated auto-focus on touch devices during transition window
                      if (justTransitioned.current) {
                        e.currentTarget.blur();
                      }
                    }}
                    onChange={(e) => setGuesses([...guesses.slice(0, index), e.target.value, ...guesses.slice(index + 1)])}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !revealed) {
                        if (index < 3 && guesses[index].trim()) {
                          // Move to next input
                          const nextInput = document.getElementById(`guess-${index + 1}`);
                          nextInput?.focus();
                        } else if (guesses[0].trim()) {
                          onSubmit();
                        }
                      }
                    }}
                    disabled={revealed}
                    placeholder={index === 0 ? "Required" : "Optional"}
                    className={`w-full px-4 py-3 rounded-lg font-semibold text-lg transition ${
                      revealed
                        ? correct === true
                          ? 'bg-green-600 text-white border-2 border-green-400 pr-12'
                          : correct === false
                          ? 'bg-red-600 text-white border-2 border-red-400 pr-12'
                          : 'bg-amber-200 text-amber-800 border-2 border-amber-400'
                        : 'bg-white text-amber-950 border-2 border-yellow-700 focus:border-yellow-600 focus:outline-none placeholder:text-gray-400'
                    }`}
                  />
                  {revealed && correct !== null && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {correct === true ? (
                        <Check className="size-6 text-white stroke-[3]" />
                      ) : (
                        <X className="size-6 text-white stroke-[3]" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed height container for correct answer section */}
        <div className="mb-6 min-h-[120px]">
          {revealed && (
            <div className="bg-gradient-to-b from-yellow-600 via-yellow-700 to-yellow-800 p-4 rounded-lg border-2 border-yellow-900">
              <p className="text-amber-100 mb-2">
                <span className="font-bold">Correct Answer:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {actualTypes.map((type, index) => (
                  <span
                    key={index}
                    className="bg-amber-950 text-yellow-100 px-4 py-2 rounded-lg font-bold border-2 border-yellow-600"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 flex-wrap">
          {/* Score Display - Shows scored points when revealed */}
          {revealed && (
            <div className="flex gap-4">
              <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 px-6 py-4 rounded-lg">
                <span className="text-amber-800 text-lg">Scored points:</span>{' '}
                <span className="font-bold text-amber-950 text-lg">{calculateCurrentCardPoints()}</span>
              </div>
            </div>
          )}
          
          {/* Button - Right aligned */}
          {!revealed ? (
            <button
              onClick={() => {
                onSubmit();
                setTransitioned();
                if (window.innerWidth < 768) {
                  setTimeout(() => {
                    if (containerRef.current) {
                      const y = containerRef.current.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 80);
                }
              }}
              disabled={!guesses[0].trim()}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2 border-2 shadow-lg ${
                guesses[0].trim()
                  ? 'bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 hover:from-purple-500 hover:via-purple-600 hover:to-purple-800 text-amber-100 border-purple-950 shadow-purple-900/50 cursor-pointer'
                  : 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 text-gray-400 border-gray-900 cursor-not-allowed'
              }`}
            >
              Take a Guess <ArrowRight className="size-5" />
            </button>
          ) : (
            <button
              ref={nextButtonRef}
              onClick={() => {
                // Blur before unmounting to prevent Chrome redistributing focus to the first input
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                setTransitioned();
                onNext();
                if (window.innerWidth < 768 && currentCardIndex < 9) {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 50);
                }
              }}
              className="bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 hover:from-purple-500 hover:via-purple-600 hover:to-purple-800 text-amber-100 px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2 border-2 border-purple-950 shadow-lg shadow-purple-900/50"
            >
              {currentCardIndex === 9 ? 'Show Results' : 'Next Card'} <ArrowRight className="size-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}