import { useState } from 'react';

/**
 * Reusable TabPanel component for organizing content into tabs
 * @param {Object} props
 * @param {Array} props.tabs - Array of { id, icon, label } objects
 * @param {string} props.activeTab - Currently active tab id
 * @param {function} props.onChange - Callback when tab changes
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Tab content
 */
export default function TabPanel({ tabs, activeTab, onChange, darkMode = false, children }) {
  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className={`flex flex-col h-full ${theme.bg} rounded-lg overflow-hidden`}>
      {/* Tab Headers */}
      <div className={`flex border-b ${theme.border}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? theme.active
                : `${theme.textMuted} ${theme.hover}`
            }`}
            title={tab.label}
          >
            <span className="block text-base">{tab.icon}</span>
            <span className="block mt-0.5 truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {children}
      </div>
    </div>
  );
}
