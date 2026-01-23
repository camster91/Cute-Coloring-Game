/**
 * Visual indicator for lazy brush mode
 * Shows the brush position, mouse position, and connecting line
 */
export default function LazyBrushIndicator({
  enabled = false,
  brushPosition,  // { x, y } - current brush/drawing position
  mousePosition,  // { x, y } - current mouse position
  radius = 30,
  brushSize = 12,
  color = '#6366f1',
  visible = true,
}) {
  if (!enabled || !visible || !brushPosition || !mousePosition) return null;

  return (
    <g className="lazy-brush-indicator" pointerEvents="none">
      {/* Connecting line (the "string") */}
      <line
        x1={brushPosition.x}
        y1={brushPosition.y}
        x2={mousePosition.x}
        y2={mousePosition.y}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="4 2"
        opacity={0.6}
      />

      {/* Radius circle around mouse (the "allowed area") */}
      <circle
        cx={mousePosition.x}
        cy={mousePosition.y}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.3}
      />

      {/* Mouse position indicator */}
      <circle
        cx={mousePosition.x}
        cy={mousePosition.y}
        r={4}
        fill={color}
        opacity={0.5}
      />

      {/* Brush position indicator (where drawing happens) */}
      <circle
        cx={brushPosition.x}
        cy={brushPosition.y}
        r={brushSize / 2}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.8}
      />

      {/* Center dot of brush */}
      <circle
        cx={brushPosition.x}
        cy={brushPosition.y}
        r={2}
        fill={color}
      />
    </g>
  );
}
