import { Hexagram } from '@/data/cosmologicalMapping';
import { cn } from '@/lib/utils';

interface HexagramDisplayProps {
  hexagram: Hexagram;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  changingLines?: number[]; // 1-6, lines that are changing
  className?: string;
}

const HexagramDisplay = ({
  hexagram,
  size = 'md',
  showDetails = true,
  changingLines = [],
  className,
}: HexagramDisplayProps) => {
  const sizeConfig = {
    sm: { lineWidth: 24, lineHeight: 3, gap: 2, fontSize: 'text-xs' },
    md: { lineWidth: 40, lineHeight: 5, gap: 3, fontSize: 'text-sm' },
    lg: { lineWidth: 60, lineHeight: 7, gap: 4, fontSize: 'text-base' },
  };

  const config = sizeConfig[size];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* Hexagram Number and Chinese Name */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">{hexagram.number}</span>
        <span className="text-xl text-muted-foreground">{hexagram.chineseName}</span>
      </div>

      {/* Hexagram Lines */}
      <div className="flex flex-col items-center gap-0.5">
        {/* Upper Trigram Label */}
        {showDetails && (
          <span className="text-[10px] text-muted-foreground mb-1">
            {hexagram.upperTrigram} ☰
          </span>
        )}
        
        {/* Lines - rendered from top to bottom (index 5 to 0) */}
        {[...hexagram.lines].reverse().map((solid, visualIdx) => {
          const lineIdx = 5 - visualIdx; // Actual line number (5 at top, 0 at bottom)
          const isChanging = changingLines.includes(lineIdx + 1);
          
          return (
            <div 
              key={visualIdx}
              className="flex items-center gap-1"
              style={{ height: config.lineHeight + config.gap }}
            >
              {solid ? (
                // Solid Yang Line (━━━━━)
                <div 
                  className={cn(
                    'rounded-full transition-colors',
                    isChanging ? 'bg-amber-500' : 'bg-foreground'
                  )}
                  style={{ 
                    width: config.lineWidth, 
                    height: config.lineHeight,
                  }}
                />
              ) : (
                // Broken Yin Line (━ ━)
                <div className="flex gap-1" style={{ width: config.lineWidth }}>
                  <div 
                    className={cn(
                      'rounded-full transition-colors',
                      isChanging ? 'bg-amber-500' : 'bg-foreground'
                    )}
                    style={{ 
                      width: config.lineWidth * 0.4, 
                      height: config.lineHeight,
                    }}
                  />
                  <div 
                    className={cn(
                      'rounded-full transition-colors',
                      isChanging ? 'bg-amber-500' : 'bg-foreground'
                    )}
                    style={{ 
                      width: config.lineWidth * 0.4, 
                      height: config.lineHeight,
                    }}
                  />
                </div>
              )}
              
              {/* Changing line indicator */}
              {isChanging && (
                <span className="text-amber-500 text-[10px]">○</span>
              )}
            </div>
          );
        })}
        
        {/* Lower Trigram Label */}
        {showDetails && (
          <span className="text-[10px] text-muted-foreground mt-1">
            {hexagram.lowerTrigram} ☷
          </span>
        )}
      </div>

      {/* Name and Meaning */}
      {showDetails && (
        <div className="text-center mt-2">
          <h4 className={cn('font-semibold', config.fontSize)}>{hexagram.name}</h4>
          <p className="text-xs text-muted-foreground">{hexagram.meaning}</p>
          
          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {hexagram.keywords.map((keyword, idx) => (
              <span 
                key={idx}
                className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HexagramDisplay;
