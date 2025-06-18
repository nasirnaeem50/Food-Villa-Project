import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const foodImages = [
    '/images/kabab.jpeg',
    '/images/lamb.jpeg',
    '/images/pulao.jpg',
    '/images/boti.jpg',
    '/images/saji.jpeg',
    '/images/dumba.jpg'
  ];

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-amber-900/10">
      {/* Animated Image Grid */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {foodImages.map((src, index) => (
          <motion.div
            key={index}
            className="relative h-full w-full overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: [0, 0.7, 0.7, 0], // Fade in and out
              scale: [1.1, 1, 1, 1.1]    // Zoom effect
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatDelay: 2,
              delay: index * 1.5,
              ease: "easeInOut"
            }}
          >
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ 
                display: 'block',
                transform: 'scale(1.2)' // Slightly zoomed to show details
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Content Card */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div 
          className="max-w-4xl rounded-2xl bg-white/10 p-8 backdrop-blur-md shadow-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="mb-6 text-4xl font-bold text-amber-50 md:text-6xl lg:text-7xl"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Peshawari Spice
            </span>
            <br />
            <span className="text-amber-50">& Global Bites</span>
          </motion.h1>

          <motion.p
            className="mb-10 text-lg text-amber-100 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Savor authentic Peshawari flavors with our 2025 special menu
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link
              to="/menu"
              className="group mx-auto flex w-fit transform items-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl"
            >
              Explore Our Menu <FaArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900/30 to-transparent" />
    </div>
  );
};

export default HeroSection;