/**
 * Skeleton loading component for panel placeholders
 * @param {Object} props
 * @param {string} props.variant - 'text' | 'circle' | 'rect' | 'button'
 * @param {string} props.width - CSS width
 * @param {string} props.height - CSS height
 * @param {boolean} props.darkMode - Dark mode state
 * @param {number} props.count - Number of skeleton items
 * @param {string} props.className - Additional classes
 */
export default function Skeleton({
  variant = 'rect',
  width,
  height,
  darkMode = false,
  count = 1,
  className = '',
}) {
  const baseClass = darkMode
    ? 'bg-gray-700 animate-pulse'
    : 'bg-gray-200 animate-pulse';

  const variants = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    button: 'h-9 rounded-lg',
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={{
        width: width || (variant === 'circle' ? '40px' : '100%'),
        height: height || (variant === 'circle' ? '40px' : variant === 'text' ? '16px' : '40px'),
      }}
    />
  ));

  return count === 1 ? items[0] : <div className="space-y-2">{items}</div>;
}

/**
 * Panel skeleton for loading states
 */
export function PanelSkeleton({ darkMode = false }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Section header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" darkMode={darkMode} />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="rect" height="36px" darkMode={darkMode} />
          ))}
        </div>
      </div>

      {/* Color grid */}
      <div className="space-y-2">
        <Skeleton variant="text" width="40%" darkMode={darkMode} />
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <Skeleton key={i} variant="circle" width="32px" height="32px" darkMode={darkMode} />
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Skeleton variant="text" width="50%" darkMode={darkMode} />
        <Skeleton variant="rect" height="8px" darkMode={darkMode} />
      </div>
    </div>
  );
}

/**
 * Layer skeleton for loading state
 */
export function LayerSkeleton({ darkMode = false, count = 3 }) {
  return (
    <div className="space-y-1 animate-fadeIn">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-2 p-2">
          <Skeleton variant="circle" width="20px" height="20px" darkMode={darkMode} />
          <Skeleton variant="circle" width="20px" height="20px" darkMode={darkMode} />
          <Skeleton variant="text" width="60%" darkMode={darkMode} />
        </div>
      ))}
    </div>
  );
}
