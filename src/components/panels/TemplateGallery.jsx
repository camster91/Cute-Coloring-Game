import React, { useState, useMemo } from 'react';

/**
 * Template Gallery - Better organized template picker with categories and previews
 */
export default function TemplateGallery({
  templates,
  categories,
  getTemplatesByCategory,
  currentTemplate,
  onSelectTemplate,
  onClose,
  darkMode = false,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    active: darkMode
      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
      : 'bg-indigo-50 border-indigo-500 text-indigo-700',
    card: darkMode ? 'bg-gray-800' : 'bg-gray-50',
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result = selectedCategory === 'all'
      ? templates
      : templates.filter(t => t.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [templates, selectedCategory, searchQuery]);

  // SVG thumbnail renderer
  const TemplateThumbnail = ({ template, size = 80 }) => (
    <svg
      viewBox="0 0 420 300"
      width={size}
      height={size * 0.714}
      className="rounded-lg"
      style={{ backgroundColor: darkMode ? '#1f2937' : '#f9fafb' }}
    >
      {template.paths.map((path, i) => (
        <path
          key={path.id || i}
          d={path.d}
          fill="none"
          stroke={darkMode ? '#9ca3af' : '#6b7280'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm`}>
      <div className={`
        ${theme.bg} rounded-2xl shadow-2xl border ${theme.border}
        w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border}`}>
          <div>
            <h2 className={`text-lg font-semibold ${theme.text}`}>Choose a Template</h2>
            <p className={`text-sm ${theme.textMuted}`}>
              {filteredTemplates.length} templates available
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.hover}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Categories */}
        <div className={`p-4 border-b ${theme.border} space-y-3`}>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-xl border ${theme.border}
                ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50
              `}
            />
            <svg
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${selectedCategory === 'all'
                  ? 'bg-indigo-500 text-white'
                  : `${theme.card} ${theme.text} ${theme.hover}`
                }
              `}
            >
              All ({templates.length})
            </button>
            {categories.map(cat => {
              const count = templates.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${selectedCategory === cat.id
                      ? 'bg-indigo-500 text-white'
                      : `${theme.card} ${theme.text} ${theme.hover}`
                    }
                  `}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTemplates.length === 0 ? (
            <div className={`text-center py-12 ${theme.textMuted}`}>
              <div className="text-4xl mb-2">🔍</div>
              <p>No templates found</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-indigo-500 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTemplates.map((template, index) => {
                const globalIndex = templates.findIndex(t => t.name === template.name);
                const isSelected = currentTemplate === globalIndex;

                return (
                  <button
                    key={template.name}
                    onClick={() => {
                      onSelectTemplate(globalIndex);
                      onClose();
                    }}
                    className={`
                      group relative p-3 rounded-xl border-2 transition-all
                      ${isSelected
                        ? theme.active
                        : `border-transparent ${theme.card} ${theme.hover}`
                      }
                      hover:scale-105 hover:shadow-lg
                    `}
                  >
                    {/* Thumbnail */}
                    <div className="flex justify-center mb-2">
                      <TemplateThumbnail template={template} />
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <div className="text-2xl mb-1">{template.icon}</div>
                      <div className={`text-sm font-medium ${theme.text} truncate`}>
                        {template.name}
                      </div>
                      <div className={`text-xs ${theme.textMuted} capitalize`}>
                        {template.category}
                      </div>
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} flex justify-between items-center`}>
          <span className={`text-sm ${theme.textMuted}`}>
            Tip: Click a template to start coloring
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl ${theme.hover} ${theme.text} text-sm font-medium`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
