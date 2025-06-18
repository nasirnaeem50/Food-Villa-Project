import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success(`Thank you for subscribing with ${email}!`);
      e.target.reset();
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const handleNavigation = (path) => {
    if (path === '/profile' && !user) {
      toast.error('Please login to view your profile');
      return;
    }
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-b from-orange-50 to-orange-100 text-gray-800 pt-12 pb-6 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <FaUtensils className="text-orange-500 text-2xl mr-2" />
              <h3 className="text-xl font-bold text-orange-600">Food Villa</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Delivering authentic Pakistani flavors to your doorstep since 2024.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-600 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-600 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-600 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-600 border-b border-orange-200 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/')}
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/menu')}
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> My Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation(user ? '/profile' : '/')}
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-600 border-b border-orange-200 pb-2">Contact Us</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                <span>Peshawar Pakistan</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-orange-500" />
                <a href="tel:+923001234567" className="hover:text-orange-600 transition-colors">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-orange-500" />
                <a href="mailto:info@foodvilla.com" className="hover:text-orange-600 transition-colors">
                  nasirnaeem66@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-600 border-b border-orange-200 pb-2">Newsletter</h4>
            <p className="text-gray-600 mb-4">
              Subscribe to get updates on special offers and discounts.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-orange-200 mt-8 pt-6 text-center text-gray-600">
          <p className="flex items-center justify-center">
            <FaUtensils className="mr-2 text-orange-500" />
            &copy; {new Date().getFullYear()} Food Villa. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-3 text-sm">
            <button 
              onClick={() => navigate('/privacy')}
              className="hover:text-orange-600 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-orange-400">|</span>
            <button 
              onClick={() => navigate('/terms')}
              className="hover:text-orange-600 transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-orange-400">|</span>
            <button 
              onClick={() => navigate('/contact')}
              className="hover:text-orange-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;