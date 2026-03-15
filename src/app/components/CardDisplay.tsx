import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

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
}

export function CardDisplay({ card, revealed }: CardDisplayProps) {
  return (
    <div className="flex justify-center">
      <div className="relative inline-block">
        <ImageWithFallback
          src={card.image_uris.normal}
          alt={card.name}
          className="rounded-lg shadow-2xl max-w-full h-auto"
          style={{ maxHeight: '600px' }}
          crossOrigin="anonymous"
        />
        
        {/* Cover for the type line - positioned approximately where type line appears on MTG cards */}
        {!revealed && (
          <div
            className="absolute left-0 right-0 bg-slate-900 border-2 border-yellow-500 flex items-center justify-center md:h-[5.5%] h-[11%]"
            style={{
              top: '51%',
              borderRadius: '8px',
            }}
          >
            <span className="text-yellow-400 font-bold text-sm">
              ???
            </span>
          </div>
        )}
      </div>
    </div>
  );
}