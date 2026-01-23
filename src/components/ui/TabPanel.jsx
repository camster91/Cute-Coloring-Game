import { useState, useRef, useEffect } from 'react';

/**
 * Reusable TabPanel component with animated tab indicator
 * @param {Object} props
 * @param {Array} props.tabs - Array of { id, icon, label } objects
 * @param {string} props.activeTab - Currently active tab id
 * @param {function} props.onChange - Callback when tab changes
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Tab content
 */
export default function TabPanel({ tabs, activeTab, onChange, darkMode = false, children }) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef([]);

  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    hover: darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
    active: darkMode ? 'text-indigo-400' : 'text-indigo-600',
    indicator: darkMode ? 'bg-indigo-400' : 'bg-indigo-500',
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

  return (
    <div className={`flex flex-col h-full ${theme.bg} rounded-lg overflow-hidden`}>
      {/* Tab Headers */}
      <div className={`relative flex border-b ${theme.border}`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabsRef.current[index] = el}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 px-2 py-2 text-xs font-medium
              transition-all duration-200 ease-out
              ${activeTab === tab.id ? theme.active : `${theme.textMuted} ${theme.hover}`}
            `}
            title={tab.label}
          >
            <span className={`block text-base transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
            <span className="block mt-0.5 truncate">{tab.label}</span>
          </button>
        ))}

        {/* Animated indicator */}
        <div
          className={`absolute bottom-0 h-0.5 ${theme.indicator} transition-all duration-300 ease-out`}
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>

      {/* Tab Content with fade transition */}
      <div className="flex-1 overflow-y-auto p-3 animate-fadeIn">
        {children}
      </div>
    </div>
  );
}
