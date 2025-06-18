// src/pages/Cart.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useState, useEffect } from 'react';
import LoginModal from '../components/LoginModal';
import { FaTrash, FaTag } from 'react-icons/fa';

const Cart = () => {
  const { 
    items, 
    totals = {
      subtotal: 0,
      tax: 0,
      deliveryFee: 200,
      discount: 0,
      orderTotal: 0
    }, 
    appliedPromo, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();
  
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('foodItems') || '[]');
    setFoodItems(items);
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return `${settings.currency} 0`;
    return `${settings.currency} ${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const handleProceedToCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode) return;
    applyPromoCode(promoCode);
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoCode('');
  };

  useEffect(() => {
    if (!appliedPromo) {
      setPromoCode('');
    }
  }, [appliedPromo]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some delicious items to get started!</p>
          <Link
            to="/menu"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 transition-colors font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
          {items.map((item) => {
            const itemDetails = foodItems.find(foodItem => foodItem.id === item.id) || {};
            const isDiscounted = appliedPromo && (
              appliedPromo.targetType === 'all' ||
              (appliedPromo.targetType === 'categories' && 
               appliedPromo.targetCategories.includes(itemDetails.category)) ||
              (appliedPromo.targetType === 'items' && 
               appliedPromo.targetItems.includes(item.id))
            );

            return (
              <div 
                key={item.id} 
                className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
              >
                <div className="flex items-center space-x-4 flex-grow">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80';
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                    <p className="text-gray-600 text-sm hidden sm:block dark:text-gray-400">{item.description}</p>
                    <p className="text-orange-500 font-medium mt-1 sm:hidden">
                      {formatCurrency(item.price)}
                    </p>
                    {isDiscounted && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        Discount Applied
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end sm:space-x-6">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-100">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 sm:w-24 text-right">
                    {formatCurrency(item.price * item.quantity)}
                    {isDiscounted && appliedPromo.discountType === 'percentage' && (
                      <span className="block text-sm text-green-600">
                        -{appliedPromo.discountValue}%
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors sm:ml-4"
                    aria-label={`Remove ${item.name}`}
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Promo code section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!appliedPromo}
                  placeholder="Enter promo code"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              {appliedPromo ? (
                <button
                  onClick={handleRemovePromo}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyPromo}
                  className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply
                </button>
              )}
            </div>
            {appliedPromo && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                Applied: {appliedPromo.title} ({appliedPromo.discountType === 'percentage' 
                  ? `${appliedPromo.discountValue}% off` 
                  : `${settings.currency} ${appliedPromo.discountValue} off`})
                {appliedPromo.targetType !== 'all' && (
                  <span className="block text-xs text-gray-500 mt-1">
                    {appliedPromo.targetType === 'categories' 
                      ? `Applies to selected categories` 
                      : `Applies to selected items only`}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Order summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Delivery Fee:</span>
                <span className="font-medium">{formatCurrency(totals.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax (8%):</span>
                <span className="font-medium">{formatCurrency(totals.tax)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Total:</span>
                <span className="text-xl font-bold text-orange-500">
                  {formatCurrency(totals.orderTotal)}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors text-center block text-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Cart;