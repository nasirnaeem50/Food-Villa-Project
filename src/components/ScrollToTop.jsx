import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Optional: For browsers that don't support smooth scrolling
    if (!('scrollBehavior' in document.documentElement.style)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;