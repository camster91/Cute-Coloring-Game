import { useState, useRef, useEffect } from 'react';

/**
 * Reusable TabPanel component with animated gradient indicator
 * @param {Object} props
 * @param {Array} props.tabs - Array of { id, icon, label } objects
 * @param {string} props.activeTab - Currently active tab id
 * @param {function} props.onChange - Callback when tab changes
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Tab content
 * @param {string} props.variant - 'default' | 'pills' | 'underline'
 */
export default function TabPanel({
  tabs,
  activeTab,
  onChange,
  darkMode = false,
  children,
  variant = 'default',
}) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef([]);

  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/80',
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-500' : 'text-gray-400',
    hover: darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50',
    active: darkMode ? 'text-white' : 'text-indigo-600',
    activeBg: darkMode ? 'bg-white/10' : 'bg-indigo-50',
  };

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.id === activeTab);
    const activeTabEl = tabsRef.current[activeIndex];

    if (activeTabEl) {
      setIndicatorStyle({
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  const isPills = variant === 'pills';

  return (
    <div className={`flex flex-col h-full ${theme.bg} rounded-xl overflow-hidden`}>
      {/* Tab Headers */}
      <div className={`
        relative flex
        ${isPills ? 'p-1.5 gap-1' : `border-b ${theme.border}`}
        ${isPills ? (darkMode ? 'bg-gray-900/50' : 'bg-gray-100/80') : ''}
      `}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={el => tabsRef.current[index] = el}
              onClick={() => onChange(tab.id)}
              className={`
                flex-1 px-3 py-2.5 text-xs font-medium
                transition-all duration-200 ease-out
                flex flex-col items-center gap-1
                ${isPills ? 'rounded-lg' : 'rounded-none'}
                ${isActive
                  ? `${theme.active} ${isPills ? theme.activeBg : ''}`
                  : `${theme.textMuted} ${theme.hover}`
                }
                ${isActive && isPills ? 'shadow-sm' : ''}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
              `}
              title={tab.label}
            >
              <span className={`
                text-lg leading-none
                transition-all duration-200
                ${isActive ? 'scale-110 drop-shadow-sm' : 'opacity-70'}
              `}>
                {tab.icon}
              </span>
              <span className={`
                truncate text-[10px] font-medium uppercase tracking-wide
                transition-opacity duration-200
                ${isActive ? 'opacity-100' : 'opacity-60'}
              `}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Animated gradient indicator (not for pills variant) */}
        {!isPills && (
          <div
            className="absolute bottom-0 h-0.5 transition-all duration-300 ease-out rounded-full"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              background: 'linear-gradient(90deg, #818cf8, #6366f1, #4f46e5)',
            }}
          />
        )}
      </div>

      {/* Tab Content with smooth transition */}
      <div className={`
        flex-1 overflow-y-auto p-4
        scrollbar-thin
        ${darkMode ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300'}
      `}>
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}
