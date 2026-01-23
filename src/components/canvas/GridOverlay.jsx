/**
 * Grid overlay for the drawing canvas
 */
export default function GridOverlay({
  width = 420,
  height = 300,
  gridSize = 20,
  visible = true,
  darkMode = false,
}) {
  if (!visible) return null;

  const strokeColor = darkMode ? '#374151' : '#e5e7eb';
  const lines = [];

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={strokeColor}
        strokeWidth={0.5}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={strokeColor}
        strokeWidth={0.5}
      />
    );
  }

  return (
    <g className="grid-overlay" pointerEvents="none">
      {lines}
    </g>
  );
}
