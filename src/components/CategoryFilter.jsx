// src/components/CategoryFilter.js (Tabbed Redesign)

import { useState, useMemo } from 'react';
import { categories } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' or 'all'

  // Memoize the list of categories to display based on the active tab
  const categoriesToDisplay = useMemo(() => {
    if (activeTab === 'featured') {
      return categories.filter(c => c.featured);
    }
    return categories;
  }, [activeTab]);

  const TabButton = ({ name, label, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`relative py-3 px-4 text-sm font-bold transition-colors ${
        activeTab === name
          ? 'text-orange-500'
          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {label}
      {activeTab === name && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
          layoutId="tab-underline" // This makes the underline animate
        />
      )}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <TabButton name="featured" label="Featured" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="all" label="All Categories" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Categories List with Animation */}
        <div className="py-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // This tells AnimatePresence to re-animate when the key changes
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex items-center space-x-3 overflow-x-auto pb-3 -mb-3"
            >
              {/* The "All" button to clear filters, shown only in the 'all' tab */}
              {activeTab === 'all' && (
                <button
                  onClick={() => onCategoryChange('')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-colors flex-shrink-0 ${
                    !selectedCategory
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  View All
                </button>
              )}

              {/* Category Capsules */}
              {categoriesToDisplay.map((category) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.name)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-200 flex items-center space-x-2 flex-shrink-0 ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;