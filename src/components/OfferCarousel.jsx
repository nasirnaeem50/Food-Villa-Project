// src/components/OfferCarousel.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { offers as mockOffers } from '../data/mockData';

const OfferCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [offers, setOffers] = useState([]);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [progress, setProgress] = useState(0);

  // Load promotions effect - combines mock data and localStorage promotions
  useEffect(() => {
    const loadPromotions = () => {
      try {
        // Get promotions from localStorage with proper fallback
        const storedPromotions = JSON.parse(localStorage.getItem('promotions') || '[]');
        
        // Filter active promotions from localStorage
        const activeStoredPromotions = storedPromotions
          .filter(promo => {
            if (!promo.isActive) return false;
            const now = new Date();
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);
            return now >= startDate && now <= endDate;
          })
          .map(promo => ({
            id: promo.id,
            title: promo.title,
            description: promo.description,
            code: promo.code,
            image: promo.image || '/images/promo-placeholder.jpg',
            validUntil: promo.endDate
          }));

        // Process mock offers to match format and check validity
        const activeMockOffers = mockOffers.filter(offer => {
          const now = new Date();
          const validUntil = new Date(offer.validUntil);
          return now <= validUntil;
        });

        // Combine both sources with mock offers first
        const combinedOffers = [...activeMockOffers, ...activeStoredPromotions];
        setOffers(combinedOffers);
      } catch (error) {
        console.error('Failed to load promotions', error);
        // Fallback to mock data if error occurs
        setOffers(mockOffers.filter(offer => {
          const now = new Date();
          const validUntil = new Date(offer.validUntil);
          return now <= validUntil;
        }));
      }
    };

    loadPromotions();
  }, []);

  // Progress bar animation effect
  useEffect(() => {
    if (offers.length <= 1) return;
    
    let animationFrame;
    let startTime;
    let lastTime;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      if (!lastTime) lastTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      if (!isHovered) {
        setProgress(Math.min(elapsed / 3000, 1));
      }
      
      if (elapsed < 3000) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setProgress(0);
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % offers.length);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [currentIndex, isHovered, offers.length]);

  // Early return for empty offers
  if (offers.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl flex items-center justify-center shadow-lg dark:from-gray-800 dark:to-gray-700 my-8">
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          No active promotions available
        </p>
      </div>
    );
  }

  // Navigation functions
  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
    setProgress(0);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % offers.length);
    setProgress(0);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  return (
    <div className="my-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Arrows - only show if multiple offers */}
        {offers.length > 1 && (
          <>
            <button 
              onClick={goToPrev}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
              aria-label="Previous offer"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <button 
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
              aria-label="Next offer"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Slides */}
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={offers[currentIndex].image}
            alt={offers[currentIndex].title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/promo-placeholder.jpg';
              e.target.className = 'w-full h-full object-cover';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center">
            <div className="text-white max-w-4xl mx-auto text-center px-6">
              <motion.h3 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {offers[currentIndex].title}
              </motion.h3>
              <motion.p 
                className="text-lg md:text-xl mb-6 drop-shadow-lg max-w-2xl mx-auto"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {offers[currentIndex].description}
              </motion.p>
              {offers[currentIndex].code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg px-6 py-2 rounded-full font-medium shadow-lg">
                    Use code: {offers[currentIndex].code}
                  </span>
                </motion.div>
              )}
              {offers[currentIndex].validUntil && (
                <motion.p
                  className="mt-4 text-sm text-orange-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Valid until: {new Date(offers[currentIndex].validUntil).toLocaleDateString()}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation Dots - only show if multiple offers */}
        {offers.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            {offers.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-orange-500 w-8' 
                    : 'bg-white/50 w-4 hover:bg-white/70'
                }`}
                aria-label={`View offer ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress Bar - only show if multiple offers */}
        {offers.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
              style={{ width: `${progress * 100}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OfferCarousel;