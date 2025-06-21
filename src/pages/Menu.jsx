// src/pages/Menu.jsx - With Correct Vertical Alignment in Sidebar

import { useState, useEffect, useMemo, useRef } from 'react';
import { restaurants, getAndInitializeFoodItems, categories as allCategoriesData } from '../data/mockData';
import CategoryFilter from '../components/CategoryFilter';
import FoodCard from '../components/FoodCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';

const categoryIcons = allCategoriesData.reduce((acc, cat) => {
  acc[cat.name] = cat.icon;
  return acc;
}, {});

const Menu = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [visibleCategory, setVisibleCategory] = useState(allCategoriesData[0]?.name || '');
  
  const menuContainerRef = useRef(null);
  const categoryRefs = useRef({});

  const restaurant = restaurants[0];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const items = getAndInitializeFoodItems();
      setAllFoodItems(items);
      setLoading(false);
      if (allCategoriesData.length > 0) {
        setVisibleCategory(allCategoriesData[0].name);
      }
    }, 800);
  }, []);

  const groupedMenuData = useMemo(() => {
    let items = allFoodItems;
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [allFoodItems, searchQuery]);

  const categories = Object.keys(groupedMenuData);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCategory(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0,
      }
    );

    const refs = categoryRefs.current;
    categories.forEach((category) => {
      if (refs[category]) observer.observe(refs[category]);
    });

    return () => {
      categories.forEach((category) => {
        if (refs[category]) observer.unobserve(refs[category]);
      });
    };
  }, [categories]);

  const handleCategoryClick = (category) => {
    categoryRefs.current[category]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const [mobileCategory, setMobileCategory] = useState('');
  const mobileFilteredData = useMemo(() => {
    if (!mobileCategory) return groupedMenuData;
    return { [mobileCategory]: groupedMenuData[mobileCategory] || [] };
  }, [mobileCategory, groupedMenuData]);


  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-60 md:h-72 bg-black">
        <img src={restaurant.image} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">{restaurant.name}</h1>
          <p className="mt-2 text-lg max-w-2xl drop-shadow-md">{restaurant.description}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* ===== DESKTOP: Sidebar with CORRECTED Alignment ===== */}
          <aside className="hidden lg:block lg:col-span-3 py-10">
            <nav className="sticky top-24">
              <h3 className="px-2 mb-3 text-base font-bold text-slate-900 dark:text-white tracking-wide">
                Categories
              </h3>
              <div className="relative flex flex-col space-y-1 border border-slate-200 dark:border-slate-800 rounded-xl p-2">
                {categories.map((category) => {
                  const isActive = visibleCategory === category;
                  return (
                    <a
                      key={category}
                      href={`#${category}`}
                      onClick={(e) => { e.preventDefault(); handleCategoryClick(category); }}
                      // The `flex` and `items-center` classes are confirmed here for perfect alignment
                      className="relative flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out"
                    >
                      {/* Active Pill background */}
                      {isActive && (
                        <motion.div
                          layoutId="active-category-pill"
                          className="absolute inset-0 bg-orange-500 rounded-lg shadow-md z-0"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon - z-10 ensures it's on top of the pill */}
                      <span className={`relative z-10 text-xl transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-slate-500'
                      }`}>
                        {categoryIcons[category] || '🍽️'}
                      </span>
                      
                      {/* Text - z-10 ensures it's on top of the pill */}
                      <span className={`relative z-10 ml-3 text-base transition-colors duration-200 ${
                        isActive
                          ? 'font-bold text-white'
                          : 'font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}>
                        {category}
                      </span>
                    </a>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* ===== MOBILE: Tabbed Category Filter (Unchanged) ===== */}
          <div className="lg:hidden sticky top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md -mx-4 sm:-mx-6 lg:mx-0">
            <CategoryFilter 
              selectedCategory={mobileCategory}
              onCategoryChange={setMobileCategory}
            />
          </div>

          {/* ===== Main Menu Content (Unchanged) ===== */}
          <main ref={menuContainerRef} className="lg:col-span-9 py-10">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[...Array(9)].map((_, i) => <LoadingSkeleton key={i} type="card" />)}
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-12">
                <div className="hidden lg:block space-y-12">
                   {categories.map((category) => (
                    <section key={category} id={category} ref={(el) => (categoryRefs.current[category] = el)} className="scroll-mt-24">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white mb-6">{category}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {groupedMenuData[category].map(item => <FoodCard key={item.id} food={item} />)}
                      </div>
                    </section>
                  ))}
                </div>
                <div className="lg:hidden space-y-12">
                   {Object.keys(mobileFilteredData).map((category) => (
                     groupedMenuData[category] && groupedMenuData[category].length > 0 && (
                      <section key={category}>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white mb-6">{category}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {mobileFilteredData[category].map(item => <FoodCard key={item.id} food={item} />)}
                        </div>
                      </section>
                     )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-24">
                 <FaUtensils className="mx-auto h-20 w-20 text-slate-400" />
                <h3 className="mt-4 text-2xl font-semibold text-slate-800 dark:text-slate-200">No Dishes Found</h3>
                <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                  {searchQuery ? `We couldn't find anything for "${searchQuery}".` : "This restaurant's menu is currently empty."}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Menu;