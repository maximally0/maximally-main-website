interface PixelLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

const PixelLoader = ({ size = 'md' }: PixelLoaderProps) => {
  const squareSizes = {
    sm: 10,
    md: 15,
    lg: 20
  };

  const gaps = {
    sm: 5,
    md: 7,
    lg: 10
  };

  const squareSize = squareSizes[size];
  const gap = gaps[size];
  const color = '#f9771b';

  return (
    <div className="flex items-center justify-center">
      <style>{`
        @keyframes loader_5191 {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <div 
        className="relative"
        style={{ 
          width: squareSize * 3 + gap * 2,
          height: squareSize * 3 + gap * 2
        }}
      >
        {/* Row 1 */}
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: 0,
            left: 0,
            animation: 'loader_5191 675ms ease-in-out 0s infinite alternate'
          }}
        />
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: 0,
            left: squareSize + gap,
            animation: 'loader_5191 675ms ease-in-out 75ms infinite alternate'
          }}
        />
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: 0,
            left: (squareSize + gap) * 2,
            animation: 'loader_5191 675ms ease-in-out 150ms infinite alternate'
          }}
        />
        
        {/* Row 2 */}
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: squareSize + gap,
            left: 0,
            animation: 'loader_5191 675ms ease-in-out 225ms infinite alternate'
          }}
        />
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: squareSize + gap,
            left: squareSize + gap,
            animation: 'loader_5191 675ms ease-in-out 300ms infinite alternate'
          }}
        />
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: squareSize + gap,
            left: (squareSize + gap) * 2,
            animation: 'loader_5191 675ms ease-in-out 375ms infinite alternate'
          }}
        />
        
        {/* Row 3 */}
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: (squareSize + gap) * 2,
            left: 0,
            animation: 'loader_5191 675ms ease-in-out 450ms infinite alternate'
          }}
        />
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: (squareSize + gap) * 2,
            left: squareSize + gap,
            animation: 'loader_5191 675ms ease-in-out 525ms infinite alternate'
          }}
        />
        <div 
          className="absolute"
          style={{ 
            width: squareSize,
            height: squareSize,
            background: color,
            top: (squareSize + gap) * 2,
            left: (squareSize + gap) * 2,
            animation: 'loader_5191 675ms ease-in-out 600ms infinite alternate'
          }}
        />
      </div>
    </div>
  );
};

export default PixelLoader;
