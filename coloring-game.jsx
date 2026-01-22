import React, { useState } from 'react';

const colorPalettes = {
  soft: ['#FFB5BA', '#FFDAB3', '#FFF4B5', '#B5EAAA', '#B5D8EB', '#D4B5EB', '#F5CAE0', '#C9E4CA'],
  nature: ['#8FBC8F', '#DEB887', '#87CEEB', '#F0E68C', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'],
  ocean: ['#5DADE2', '#48C9B0', '#76D7C4', '#85C1E9', '#A3E4D7', '#D4E6F1', '#FADBD8', '#F5B7B1'],
};

const drawings = [
  {
    name: 'Bunny',
    icon: '🐰',
    paths: [
      { id: 'body', d: 'M150 200 Q150 140 180 120 Q210 100 240 120 Q270 140 270 200 Q270 280 210 300 Q150 280 150 200', name: 'body' },
      { id: 'head', d: 'M170 130 Q170 80 210 60 Q250 80 250 130 Q250 160 210 170 Q170 160 170 130', name: 'head' },
      { id: 'ear-left', d: 'M175 70 Q160 20 170 -20 Q190 -10 195 40 Q195 60 185 70', name: 'left ear' },
      { id: 'ear-right', d: 'M245 70 Q260 20 250 -20 Q230 -10 225 40 Q225 60 235 70', name: 'right ear' },
      { id: 'tail', d: 'M265 240 Q290 230 295 250 Q290 270 265 260', name: 'tail' },
      { id: 'nose', d: 'M200 120 Q210 115 220 120 Q215 130 210 130 Q205 130 200 120', name: 'nose' },
    ]
  },
  {
    name: 'Flower',
    icon: '🌸',
    paths: [
      { id: 'petal1', d: 'M210 100 Q240 60 210 20 Q180 60 210 100', name: 'top petal' },
      { id: 'petal2', d: 'M210 100 Q270 100 290 70 Q260 40 210 100', name: 'right petal' },
      { id: 'petal3', d: 'M210 100 Q270 140 290 180 Q240 160 210 100', name: 'bottom right' },
      { id: 'petal4', d: 'M210 100 Q180 160 150 180 Q150 140 210 100', name: 'bottom left' },
      { id: 'petal5', d: 'M210 100 Q150 100 130 70 Q160 40 210 100', name: 'left petal' },
      { id: 'center', d: 'M210 100 m-25 0 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0', name: 'center' },
      { id: 'stem', d: 'M200 125 Q200 200 195 280 Q205 285 215 280 Q220 200 220 125', name: 'stem' },
      { id: 'leaf', d: 'M200 200 Q150 180 130 200 Q150 220 200 210', name: 'leaf' },
    ]
  },
  {
    name: 'Star',
    icon: '⭐',
    paths: [
      { id: 'star-outer', d: 'M210 20 L240 90 L320 100 L260 150 L280 230 L210 190 L140 230 L160 150 L100 100 L180 90 Z', name: 'star' },
      { id: 'star-inner', d: 'M210 60 L225 100 L270 105 L240 130 L250 175 L210 155 L170 175 L180 130 L150 105 L195 100 Z', name: 'inner glow' },
      { id: 'sparkle1', d: 'M320 50 L325 60 L335 55 L325 65 L330 75 L320 65 L310 70 L315 60 Z', name: 'sparkle' },
      { id: 'sparkle2', d: 'M90 150 L95 160 L105 155 L95 165 L100 175 L90 165 L80 170 L85 160 Z', name: 'sparkle' },
      { id: 'sparkle3', d: 'M180 260 L185 270 L195 265 L185 275 L190 285 L180 275 L170 280 L175 270 Z', name: 'sparkle' },
    ]
  },
  {
    name: 'Fish',
    icon: '🐠',
    paths: [
      { id: 'body', d: 'M80 150 Q120 80 200 80 Q300 80 340 150 Q300 220 200 220 Q120 220 80 150', name: 'body' },
      { id: 'tail', d: 'M70 150 Q30 100 50 60 Q60 100 80 150 Q60 200 50 240 Q30 200 70 150', name: 'tail' },
      { id: 'fin-top', d: 'M180 85 Q200 40 220 85', name: 'top fin' },
      { id: 'fin-bottom', d: 'M180 215 Q200 260 220 215', name: 'bottom fin' },
      { id: 'eye', d: 'M280 130 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0', name: 'eye' },
      { id: 'stripe1', d: 'M150 100 Q160 150 150 200 Q170 150 150 100', name: 'stripe' },
      { id: 'stripe2', d: 'M200 90 Q210 150 200 210 Q220 150 200 90', name: 'stripe' },
    ]
  },
  {
    name: 'Cloud',
    icon: '☁️',
    paths: [
      { id: 'cloud-main', d: 'M100 180 Q60 180 60 140 Q60 100 100 100 Q100 60 150 60 Q180 40 220 60 Q260 40 290 70 Q340 70 340 120 Q370 120 370 160 Q370 200 330 200 L100 200 Q60 200 60 180', name: 'cloud' },
      { id: 'sun', d: 'M300 80 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0', name: 'sun' },
      { id: 'ray1', d: 'M300 35 L300 15', name: 'ray' },
      { id: 'ray2', d: 'M335 50 L350 35', name: 'ray' },
      { id: 'ray3', d: 'M350 80 L370 80', name: 'ray' },
      { id: 'rainbow1', d: 'M80 220 Q150 180 220 220', name: 'rainbow' },
      { id: 'rainbow2', d: 'M90 230 Q150 195 210 230', name: 'rainbow' },
      { id: 'rainbow3', d: 'M100 240 Q150 210 200 240', name: 'rainbow' },
    ]
  },
  {
    name: 'Butterfly',
    icon: '🦋',
    paths: [
      { id: 'wing-tl', d: 'M200 150 Q150 100 100 80 Q80 120 100 160 Q140 180 200 150', name: 'top left wing' },
      { id: 'wing-tr', d: 'M220 150 Q270 100 320 80 Q340 120 320 160 Q280 180 220 150', name: 'top right wing' },
      { id: 'wing-bl', d: 'M200 170 Q150 200 120 240 Q150 260 180 240 Q200 210 200 170', name: 'bottom left wing' },
      { id: 'wing-br', d: 'M220 170 Q270 200 300 240 Q270 260 240 240 Q220 210 220 170', name: 'bottom right wing' },
      { id: 'body', d: 'M200 100 Q205 100 210 100 Q215 150 215 200 Q215 250 210 280 Q205 280 200 280 Q195 250 195 200 Q195 150 200 100', name: 'body' },
      { id: 'spot1', d: 'M140 120 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0', name: 'spot' },
      { id: 'spot2', d: 'M280 120 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0', name: 'spot' },
      { id: 'antenna1', d: 'M200 100 Q180 60 160 50', name: 'antenna' },
      { id: 'antenna2', d: 'M220 100 Q240 60 260 50', name: 'antenna' },
    ]
  },
];

export default function ColoringGame() {
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [currentPalette, setCurrentPalette] = useState('soft');
  const [selectedColor, setSelectedColor] = useState(colorPalettes.soft[0]);
  const [filledColors, setFilledColors] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);

  const handlePathClick = (pathId) => {
    setFilledColors(prev => ({
      ...prev,
      [`${currentDrawing}-${pathId}`]: selectedColor
    }));
    
    // Check if all paths are filled
    const drawing = drawings[currentDrawing];
    const newFilled = { ...filledColors, [`${currentDrawing}-${pathId}`]: selectedColor };
    const allFilled = drawing.paths.every(p => newFilled[`${currentDrawing}-${p.id}`]);
    
    if (allFilled) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const clearDrawing = () => {
    const keysToRemove = Object.keys(filledColors).filter(k => k.startsWith(`${currentDrawing}-`));
    const newColors = { ...filledColors };
    keysToRemove.forEach(k => delete newColors[k]);
    setFilledColors(newColors);
  };

  const switchDrawing = (index) => {
    setCurrentDrawing(index);
  };

  const drawing = drawings[currentDrawing];
  const colors = colorPalettes[currentPalette];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          🎨 Color Time! 🎨
        </h1>
        <p className="text-purple-300 text-lg">Tap a color, then tap to fill!</p>
      </div>

      {/* Drawing Selector */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {drawings.map((d, i) => (
          <button
            key={d.name}
            onClick={() => switchDrawing(i)}
            className={`px-4 py-2 rounded-full text-xl transition-all duration-300 ${
              currentDrawing === i 
                ? 'bg-purple-300 text-white scale-110 shadow-lg' 
                : 'bg-white text-purple-400 hover:bg-purple-100'
            }`}
          >
            {d.icon} {d.name}
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div className="relative bg-white rounded-3xl shadow-xl p-4 mb-4" style={{ width: '420px', height: '340px' }}>
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl z-10">
            <div className="text-center animate-bounce">
              <div className="text-6xl mb-2">🌟</div>
              <p className="text-2xl text-purple-400 font-bold">Beautiful!</p>
            </div>
          </div>
        )}
        
        <svg viewBox="0 0 420 300" className="w-full h-full">
          {drawing.paths.map((path) => {
            const fillColor = filledColors[`${currentDrawing}-${path.id}`] || '#FFFFFF';
            const isStroke = path.id.includes('ray') || path.id.includes('antenna') || path.id.includes('rainbow');
            
            return (
              <path
                key={path.id}
                d={path.d}
                fill={isStroke ? 'none' : fillColor}
                stroke={isStroke ? (filledColors[`${currentDrawing}-${path.id}`] || '#E0E0E0') : '#9CA3AF'}
                strokeWidth={isStroke ? 4 : 2}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={() => handlePathClick(path.id)}
                style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))' }}
              />
            );
          })}
        </svg>
      </div>

      {/* Color Palette */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        {/* Palette Tabs */}
        <div className="flex gap-2 mb-3 justify-center">
          {Object.keys(colorPalettes).map((palette) => (
            <button
              key={palette}
              onClick={() => {
                setCurrentPalette(palette);
                setSelectedColor(colorPalettes[palette][0]);
              }}
              className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                currentPalette === palette
                  ? 'bg-purple-200 text-purple-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {palette}
            </button>
          ))}
        </div>
        
        {/* Color Buttons */}
        <div className="flex gap-3 justify-center flex-wrap max-w-md">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                selectedColor === color 
                  ? 'ring-4 ring-purple-300 scale-110 shadow-lg' 
                  : 'hover:scale-105 shadow-md'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={clearDrawing}
        className="px-6 py-2 bg-pink-200 text-pink-600 rounded-full text-lg hover:bg-pink-300 transition-all shadow-md hover:shadow-lg"
      >
        🧹 Start Over
      </button>

      {/* Current Color Indicator */}
      <div className="mt-4 flex items-center gap-2 text-purple-400">
        <span>Your color:</span>
        <div 
          className="w-8 h-8 rounded-full border-2 border-purple-300 shadow-inner"
          style={{ backgroundColor: selectedColor }}
        />
      </div>
    </div>
  );
}
