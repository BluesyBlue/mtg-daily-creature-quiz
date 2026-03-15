import { useMemo } from 'react';
import { ImageWithFallback } from '@/app/components/shared/ImageWithFallback';

interface Card {
  id: string;
  name: string;
  image_uris: {
    normal: string;
  };
  type_line: string;
}

interface CardDisplayProps {
  card: Card;
  revealed: boolean;
  cardIndex: number;
}

export function CardDisplay({ card, revealed, cardIndex }: CardDisplayProps) {
  // Derive a stable per-card tilt offset (-1, 0, or +1) from the card id
  const tiltOffset = useMemo(() => {
    const hash = card.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return (hash % 3) - 1;
  }, [card.id]);

  // Desktop: base 6deg ± 1deg. Mobile: alternates sign each card ± small offset.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const mobileSign = cardIndex % 2 === 0 ? 1 : -1;
  const rotateY = isMobile
    ? mobileSign * (2 + tiltOffset * 0.5)
    : (6 + tiltOffset * 1);
  const rotateX = (isMobile ? 1 : 2) + tiltOffset * 0.3;
  const transform = `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  const flat = 'perspective(800px) rotateY(0deg) rotateX(0deg)';

  return (
    <div className="flex justify-center">
      {/* Outer wrapper applies the tilt */}
      <div className="relative" style={{ transform, transition: 'transform 300ms ease-out' }}>
        {/* Glow behind the card */}
        <div
          className="absolute inset-0 blur-2xl opacity-60 pointer-events-none"
          style={{ borderRadius: '20px', background: 'radial-gradient(ellipse at 60% 50%, #fbbf24 0%, #b45309 50%, transparent 80%)', transform: 'scale(1.15) translateX(8px)' }}
        />
        {/* White border wrapper with hover flatten */}
        <div
          className="relative bg-white"
          style={{ borderRadius: '12px', padding: '4px', transform, transition: 'transform 300ms ease-out' }}
          onMouseEnter={e => (e.currentTarget.style.transform = flat)}
          onMouseLeave={e => (e.currentTarget.style.transform = transform)}
        >
          <ImageWithFallback
            src={card.image_uris.normal}
            alt={card.name}
            className="rounded-lg shadow-2xl max-w-full h-auto block"
            style={{ maxHeight: '600px', borderRadius: '8px' }}
            crossOrigin="anonymous"
          />

          {/* Cover for the type line */}
          {!revealed && (
            <div
              className="absolute left-0 right-0 bg-slate-900 border-2 border-yellow-500 flex items-center justify-center top-[52%] md:top-[55%] h-[11%] md:h-[calc(5.5%_+_10px)]"
              style={{ borderRadius: '8px' }}
            >
              <span className="text-yellow-400 font-bold text-sm">???</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
