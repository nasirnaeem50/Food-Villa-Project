// src/components/FoodCard.jsx
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const FoodCard = ({ food, cardSize = 'medium' }) => {
  const { addItem } = useCart();
  const [currentPromo, setCurrentPromo] = useState(null);
  
  useEffect(() => {
    // Check for active promotions for this food item
    const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    const now = new Date();
    
    const applicablePromos = promotions.filter(promo => {
      if (!promo.isActive) return false;
      
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      if (now < startDate || now > endDate) return false;
      
      if (promo.targetType === 'all') return true;
      if (promo.targetType === 'items' && promo.targetItems.includes(food.id)) return true;
      if (promo.targetType === 'categories' && promo.targetCategories.includes(food.category)) return true;
      
      return false;
    });
    
    if (applicablePromos.length > 0) {
      setCurrentPromo(applicablePromos[0]);
    }
  }, [food.id, food.category]);

  const calculateDiscountedPrice = () => {
    if (!currentPromo) return food.price;
    
    if (currentPromo.discountType === 'percentage') {
      return food.price * (1 - currentPromo.discountValue / 100);
    } else {
      return Math.max(0, food.price - currentPromo.discountValue);
    }
  };

  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount = discountedPrice !== food.price;

  const handleAddToCart = () => {
    addItem({
      ...food,
      originalPrice: food.price,
      price: discountedPrice,
      appliedPromo: currentPromo?.id || null
    });
  };

  const textClasses = { 
    large: 'text-lg', 
    medium: 'text-base' 
  };
  
  const cardVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0 }, 
    hover: { 
      scale: 1.02, 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
    } 
  };
  
  const buttonVariants = { 
    rest: { scale: 1 }, 
    hover: { scale: 1.05 }, 
    tap: { scale: 0.95 } 
  };

  return (
    <motion.div 
      variants={cardVariants} 
      initial="hidden" 
      animate="visible" 
      whileHover="hover" 
      className="group flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border relative"
    >
      {/* Image container */}
      <div className="relative overflow-hidden">
        <motion.img 
          src={food.image || '/images/food-placeholder.jpg'} 
          alt={food.name} 
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.1 }} 
          transition={{ duration: 0.5 }} 
          onError={(e) => { e.target.src = '/images/food-placeholder.jpg'; }} 
        />
        
        {/* Promotion badge */}
        {currentPromo && (
          <div className="absolute top-3 left-3 flex flex-col items-start space-y-2">
            <motion.span 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {currentPromo.discountType === 'percentage' 
                ? `${currentPromo.discountValue}% OFF` 
                : `PKR ${currentPromo.discountValue} OFF`}
            </motion.span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
          {food.premium && (
            <motion.span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              PREMIUM
            </motion.span>
          )}
          {food.yearSpecial && (
            <motion.span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              NEW
            </motion.span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex space-x-2">
          {food.isVegetarian && (
            <motion.span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              {food.vegan ? 'VEGAN' : 'VEG'}
            </motion.span>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-bold text-gray-800 dark:text-white ${textClasses[cardSize]}`}>
            {food.name}
          </h3>
          {food.bestSeller && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
              BESTSELLER
            </span>
          )}
        </div>
        
        <p className={`flex-grow text-gray-600 dark:text-gray-300 mb-4 ${textClasses[cardSize]} line-clamp-2`}>
          {food.description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            {hasDiscount ? (
              <>
                <span className={`font-bold text-orange-500 ${textClasses[cardSize]}`}>
                  PKR {discountedPrice.toLocaleString()}
                </span>
                <span className="ml-2 line-through text-gray-400 text-sm">
                  PKR {food.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className={`font-bold text-orange-500 ${textClasses[cardSize]}`}>
                PKR {food.price.toLocaleString()}
              </span>
            )}
            {food.serves && (
              <span className="ml-2 text-sm text-gray-500">
                • Serves {food.serves}
              </span>
            )}
          </div>
          <motion.button 
            onClick={handleAddToCart} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium" 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
          >
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;