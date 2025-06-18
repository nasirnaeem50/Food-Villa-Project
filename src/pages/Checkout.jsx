// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaCity, FaCheckCircle, FaShoppingBag, FaCreditCard, FaCalendarAlt, FaLock, FaTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
    <input {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
  </div>
);

const PaymentOption = ({ id, value, label, iconSrc, checked, onChange }) => (
  <label htmlFor={id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500' : 'border-gray-200 hover:border-gray-400'}`}>
    <input type="radio" id={id} name="paymentMethod" value={value} checked={checked} onChange={onChange} className="hidden" />
    <img src={iconSrc} alt={`${label} logo`} className="w-10 h-10 object-contain mr-4" />
    <span className="font-semibold text-gray-800">{label}</span>
    {checked && <FaCheckCircle className="ml-auto text-orange-500 text-xl" />}
  </label>
);

const OrderItem = ({ item, currency, appliedPromo }) => {
  // Get all food items to check categories
  const [foodItems, setFoodItems] = useState([]);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('foodItems') || '[]');
    setFoodItems(items);
  }, []);

  const itemDetails = foodItems.find(foodItem => foodItem.id === item.id) || {};
  
  const isDiscounted = appliedPromo && (
    appliedPromo.targetType === 'all' ||
    (appliedPromo.targetType === 'categories' && 
     appliedPromo.targetCategories.includes(itemDetails.category)) ||
    (appliedPromo.targetType === 'items' && 
     appliedPromo.targetItems.includes(item.id))
  );

  return (
    <div className="flex items-center py-3 border-b">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaShoppingBag />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
        {isDiscounted && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
            Discount Applied
          </span>
        )}
      </div>
      <div className="text-right">
        <p className="font-medium">
          {currency} {(item.price * item.quantity).toLocaleString()}
          {isDiscounted && appliedPromo.discountType === 'percentage' && (
            <span className="block text-sm text-green-600">
              -{appliedPromo.discountValue}%
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { 
    items, 
    totals, 
    appliedPromo, 
    clearCart,
    applyPromoCode,
    removePromoCode
  } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: 'Peshawar', paymentMethod: 'cash'
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '', expiryDate: '', cvv: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
    if (appliedPromo) {
      setPromoCode(appliedPromo.code);
    }
  }, [user, appliedPromo]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = () => {
    if (promoCode.trim() === '') {
      toast.error('Please enter a promo code');
      return;
    }
    applyPromoCode(promoCode);
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    removePromoCode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error('Please fill in all credit card details.');
        setLoading(false);
        return;
      }
    }
    
    try {
      let existingOrders = [];
      try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            existingOrders = JSON.parse(storedOrders);
        }
      } catch (err) {
        console.error("Failed to parse orders from localStorage:", err);
        existingOrders = [];
      }

      let finalUserId = user?.id;
      if (!finalUserId && formData.email) {
        try {
          const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const foundUser = allUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
          if (foundUser) {
            finalUserId = foundUser.id;
          }
        } catch (err) {
            console.error("Could not look up user by email:", err);
        }
      }
      
      const newOrder = {
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: finalUserId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || null,
          appliedPromo: appliedPromo?.id || null
        })),
        deliveryInfo: formData,
        paymentMethod: formData.paymentMethod,
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.orderTotal,
        status: 'Processing',
        appliedPromo: appliedPromo ? {
          id: appliedPromo.id,
          title: appliedPromo.title,
          code: appliedPromo.code,
          discountType: appliedPromo.discountType,
          discountValue: appliedPromo.discountValue,
          targetType: appliedPromo.targetType,
          targetItems: appliedPromo.targetItems || [],
          targetCategories: appliedPromo.targetCategories || []
        } : null
      };
      
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      clearCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully!');

    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `${settings.currency} ${Number(amount).toLocaleString()}`;

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FaShoppingBag className="text-6xl text-gray-300 mb-4"/>
        <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
        <button onClick={() => navigate('/menu')} className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Browse Menu</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="mx-auto w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
            <FaCheckCircle className="text-6xl text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mt-6">Order Placed Successfully!</h2>
          <p className="text-gray-600 mt-2">Your order is being processed and you'll receive a confirmation soon.</p>
          <button onClick={() => navigate('/profile')} className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">View My Orders</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-10">Secure Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Delivery & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">1. Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={<FaUser/>} type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" />
                <InputField icon={<FaEnvelope/>} type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email Address" />
                <InputField icon={<FaPhone/>} type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />
                <InputField icon={<FaCity/>} type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="City" />
                <div className="md:col-span-2"><InputField icon={<FaHome/>} type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Street Address" /></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">2. Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption id="cash" value="cash" label="Cash on Delivery" iconSrc="/images/cash.png" checked={formData.paymentMethod === 'cash'} onChange={handleInputChange} />
                <PaymentOption id="easypaisa" value="easypaisa" label="Easypaisa" iconSrc="/images/easypaisa.png" checked={formData.paymentMethod === 'easypaisa'} onChange={handleInputChange} />
                <PaymentOption id="jazzcash" value="jazzcash" label="JazzCash" iconSrc="/images/jazzcash.png" checked={formData.paymentMethod === 'jazzcash'} onChange={handleInputChange} />
                <PaymentOption id="card" value="card" label="Credit/Debit Card" iconSrc="/images/card.png" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} />
              </div>

              <AnimatePresence>
                {formData.paymentMethod === 'card' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: '2rem' }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <h3 className="text-lg font-semibold mb-4 border-t pt-6">Enter Card Details</h3>
                    <div className="space-y-4">
                      <InputField 
                        icon={<FaCreditCard />} type="text" name="cardNumber" required={formData.paymentMethod === 'card'}
                        value={cardDetails.cardNumber} onChange={handleCardInputChange} placeholder="Card Number"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField icon={<FaCalendarAlt />} type="text" name="expiryDate" required={formData.paymentMethod === 'card'}
                          value={cardDetails.expiryDate} onChange={handleCardInputChange} placeholder="MM/YY"
                        />
                        <InputField icon={<FaLock />} type="text" name="cvv" required={formData.paymentMethod === 'card'}
                          value={cardDetails.cvv} onChange={handleCardInputChange} placeholder="CVV"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Promo Code Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <div className="flex">
                  <InputField
                    icon={<FaTag />}
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedPromo}
                    placeholder="Enter promo code"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="bg-red-500 text-white px-4 py-2 rounded-r-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedPromo && (
                  <p className="mt-2 text-sm text-green-600">
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
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-3">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <OrderItem 
                  key={item.id} 
                  item={item} 
                  currency={settings.currency}
                  appliedPromo={appliedPromo}
                />
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatCurrency(totals.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-500">{formatCurrency(totals.orderTotal)}</span>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : `Place Order (${formatCurrency(totals.orderTotal)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;