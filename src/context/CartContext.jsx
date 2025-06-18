// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  const { deliveryFee } = action.meta || { deliveryFee: state.totals.deliveryFee };

  const calculateDiscount = (items, promo) => {
    if (!promo) return 0;

    // Get all food items from localStorage for category checking
    let allFoodItems = [];
    try {
      allFoodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
    } catch (error) {
      console.error("Error loading food items:", error);
    }

    const applicableItems = items.filter(cartItem => {
      // Find the full item details including category
      const itemDetails = allFoodItems.find(foodItem => foodItem.id === cartItem.id);
      if (!itemDetails) return false;

      if (promo.targetType === 'all') return true;
      if (promo.targetType === 'categories') {
        return promo.targetCategories.includes(itemDetails.category);
      }
      if (promo.targetType === 'items') {
        return promo.targetItems.includes(cartItem.id);
      }
      return false;
    });

    const subtotalForPromo = applicableItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    if (promo.discountType === 'percentage') {
      return subtotalForPromo * (promo.discountValue / 100);
    } else {
      return Math.min(subtotalForPromo, promo.discountValue);
    }
  };

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const discount = calculateDiscount(updatedItems, state.appliedPromo);
      
      return { 
        ...state, 
        items: updatedItems,
        totals: {
          subtotal,
          tax,
          deliveryFee,
          discount,
          orderTotal: subtotal + tax + deliveryFee - discount
        }
      };
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const discount = calculateDiscount(updatedItems, state.appliedPromo);
      
      return {
        ...state,
        items: updatedItems,
        totals: {
          subtotal,
          tax,
          deliveryFee,
          discount,
          orderTotal: subtotal + tax + deliveryFee - discount
        }
      };
    }
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const discount = calculateDiscount(updatedItems, state.appliedPromo);
      
      return {
        ...state,
        items: updatedItems,
        totals: {
          subtotal,
          tax,
          deliveryFee,
          discount,
          orderTotal: subtotal + tax + deliveryFee - discount
        }
      };
    }
    case 'CLEAR_CART':
      return { 
        items: [], 
        appliedPromo: null,
        totals: {
          subtotal: 0,
          tax: 0,
          deliveryFee: deliveryFee,
          discount: 0,
          orderTotal: deliveryFee
        }
      };
    case 'APPLY_PROMO': {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const discount = calculateDiscount(state.items, action.payload);
      
      return {
        ...state,
        appliedPromo: action.payload,
        totals: {
          subtotal,
          tax,
          deliveryFee,
          discount,
          orderTotal: subtotal + tax + deliveryFee - discount
        }
      };
    }
    case 'REMOVE_PROMO': {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      
      return {
        ...state,
        appliedPromo: null,
        totals: {
          subtotal,
          tax,
          deliveryFee,
          discount: 0,
          orderTotal: subtotal + tax + deliveryFee
        }
      };
    }
    case 'SET_STATE':
      const subtotal = action.payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const discount = action.payload.appliedPromo ? 
        calculateDiscount(action.payload.items, action.payload.appliedPromo) 
        : 0;
      action.payload.totals = {
          subtotal,
          tax,
          deliveryFee,
          discount,
          orderTotal: subtotal + tax + deliveryFee - discount
      };
      return action.payload;
    default:
      return state;
  }
};

const getInitialState = (userId, deliveryFee = 100) => {
  try {
    const allCarts = JSON.parse(localStorage.getItem('userCarts') || '{}');
    const userCart = allCarts[userId];
    if (userCart) {
        const subtotal = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const discount = userCart.appliedPromo ? 
          calculateDiscount(userCart.items, userCart.appliedPromo)
          : 0;
        userCart.totals = {
            subtotal,
            tax,
            deliveryFee,
            discount,
            orderTotal: subtotal + tax + deliveryFee - discount
        };
        return userCart;
    }
    return { 
      items: [], 
      appliedPromo: null,
      totals: {
        subtotal: 0,
        tax: 0,
        deliveryFee: deliveryFee,
        discount: 0,
        orderTotal: deliveryFee
      }
    };
  } catch (error) {
    console.error("Could not parse carts from localStorage", error);
    return { items: [], appliedPromo: null, totals: { subtotal: 0, tax: 0, deliveryFee, discount: 0, orderTotal: deliveryFee }};
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [state, dispatch] = useReducer(cartReducer, getInitialState(user?.id, settings.deliveryFee));

  const dispatchWithMeta = useCallback((action) => {
    dispatch({ ...action, meta: { deliveryFee: settings.deliveryFee } });
  }, [settings.deliveryFee]);
  
  const showToast = (message, type = 'success') => { 
    toast[type](message, { 
      position: "top-right", 
      autoClose: 2000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      theme: "colored", 
      style: { background: '#f97316', color: '#fff' }, 
      progressStyle: { background: '#ffedd5' } 
    }); 
  };

  const addItem = useCallback((item) => { 
    dispatchWithMeta({ type: 'ADD_ITEM', payload: item }); 
    showToast(`${item.name} added to cart!`); 
  }, [dispatchWithMeta]);

  const removeItem = useCallback((id) => { 
    const itemToRemove = state.items.find(item => item.id === id); 
    if (itemToRemove) { 
      dispatchWithMeta({ type: 'REMOVE_ITEM', payload: { id } }); 
      showToast(`${itemToRemove.name} removed from cart`, 'error'); 
    } 
  }, [state.items, dispatchWithMeta]);

  const updateQuantity = useCallback((id, quantity) => { 
    if (quantity < 1) { 
      removeItem(id); 
      return; 
    } 
    dispatchWithMeta({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }); 
  }, [removeItem, dispatchWithMeta]);

  const clearCart = useCallback(() => { 
    if (state.items.length > 0) { 
      dispatchWithMeta({ type: 'CLEAR_CART' }); 
      showToast('Cart has been cleared', 'error'); 
    } 
  }, [state.items, dispatchWithMeta]);

  const applyPromoCode = useCallback((promoCode) => { 
    try { 
      const promotions = JSON.parse(localStorage.getItem('promotions') || '[]'); 
      const now = new Date(); 
      const validPromo = promotions.find(promo => { 
        if (!promo.isActive || !promo.code) return false; 
        if (promoCode.toLowerCase() !== promo.code.toLowerCase()) return false; 
        const startDate = new Date(promo.startDate); 
        const endDate = new Date(promo.endDate); 
        return now >= startDate && now <= endDate; 
      }); 

      if (validPromo) { 
        dispatchWithMeta({ type: 'APPLY_PROMO', payload: validPromo }); 
        showToast('Promo code applied successfully!'); 
        return true; 
      } else { 
        showToast('Invalid or expired promo code', 'error'); 
        return false; 
      } 
    } catch (error) { 
      console.error('Error applying promo code:', error); 
      showToast('Failed to apply promo code', 'error'); 
      return false; 
    } 
  }, [dispatchWithMeta]);

  const removePromoCode = useCallback(() => { 
    dispatchWithMeta({ type: 'REMOVE_PROMO' }); 
    showToast('Promo code removed', 'info'); 
  }, [dispatchWithMeta]);
  
  useEffect(() => {
    if (user?.id) {
      const userCart = getInitialState(user.id, settings.deliveryFee);
      dispatchWithMeta({ type: 'SET_STATE', payload: userCart });
    } else {
      dispatchWithMeta({ type: 'CLEAR_CART' });
    }
  }, [user?.id, settings.deliveryFee, dispatchWithMeta]);

  useEffect(() => {
    if (user?.id) {
      const allCarts = JSON.parse(localStorage.getItem('userCarts') || '{}');
      allCarts[user.id] = state;
      localStorage.setItem('userCarts', JSON.stringify(allCarts));
    }
  }, [state, user?.id]);

  const contextValue = useMemo(() => ({ 
    items: state.items, 
    totals: state.totals, 
    appliedPromo: state.appliedPromo, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    applyPromoCode, 
    removePromoCode, 
  }), [state.items, state.totals, state.appliedPromo, addItem, removeItem, updateQuantity, clearCart, applyPromoCode, removePromoCode]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};