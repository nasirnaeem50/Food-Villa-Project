import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSkeleton from '../components/LoadingSkeleton';
import OfferCarousel from '../components/OfferCarousel';
import FoodCard from '../components/FoodCard';
import HeroSection from '../components/HeroSection';
import { restaurants, offers, getAndInitializeFoodItems } from '../data/mockData';

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [moreFoods, setMoreFoods] = useState([]);
  const restaurant = restaurants[0];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foodItems = getAndInitializeFoodItems(); // Fetch fresh data
      const featured = foodItems
        .filter(food => food.restaurantId === restaurant.id && 
               (food.bestSeller || food.chefSpecial || food.yearSpecial))
        .slice(0, 6);
      setFeaturedFoods(featured);

      const additionalFoods = foodItems
        .filter(food => food.restaurantId === restaurant.id && 
               !food.bestSeller && !food.chefSpecial && !food.yearSpecial)
        .slice(0, 6);
      setMoreFoods(additionalFoods);
      
      setLoading(false);
    }, 800);
  }, [restaurant.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection restaurant={restaurant} />

      {/* Special Offers Carousel */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="mb-12 bg-white dark:bg-gray-800 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400">
              Today's Special Offers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Limited-time culinary delights
            </p>
          </motion.div>
          <OfferCarousel offers={offers} />
        </div>
      </motion.section>

      {/* Featured Foods Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400">
              Our Signature Dishes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-3">
              Taste our chef's most celebrated creations
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <Link 
                to="/menu" 
                className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-sm font-medium inline-flex items-center"
              >
                View All <span className="ml-1">→</span>
              </Link>
            </motion.div>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <LoadingSkeleton key={n} type="card" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredFoods.map((food) => (
                <motion.div 
                  key={food.id} 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodCard 
                    food={food} 
                    cardSize="medium"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* More Menu Items Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-16 bg-gray-100 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400">
              Explore Our Menu
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-3">
              Discover more culinary delights from our kitchen
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <LoadingSkeleton key={n} type="card" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {moreFoods.map((food) => (
                <motion.div 
                  key={food.id} 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodCard 
                    food={food} 
                    cardSize="medium"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/menu" 
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all duration-300"
            >
              View Full Menu
              <svg className="ml-3 -mr-1 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Restaurant Info Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-amber-800 dark:text-amber-400 pb-4">
              About {restaurant.name}
            </h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {restaurant.description}
            </motion.p>
            <motion.div 
              className="mt-8 flex justify-center space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="h-6 w-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg">{restaurant.rating} Rating</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="h-6 w-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">{restaurant.deliveryTime} Delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;