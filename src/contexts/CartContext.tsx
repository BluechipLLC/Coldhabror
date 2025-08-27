'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, createCart, addToCart, removeFromCart, updateCartItemQuantity, fetchCart } from '@/lib/shopify';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...state, cart: null, error: null };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartItemCount: () => number;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: false,
    error: null,
  });

  // Initialize cart from localStorage or create new one
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const savedCartId = localStorage.getItem('shopify_cart_id');
        if (savedCartId) {
          dispatch({ type: 'SET_LOADING', payload: true });
          const cart = await fetchCart(savedCartId);
          dispatch({ type: 'SET_CART', payload: cart });
        } else {
          const newCart = await createCart();
          localStorage.setItem('shopify_cart_id', newCart.id);
          dispatch({ type: 'SET_CART', payload: newCart });
        }
      } catch (error) {
        console.error('Cart initialization error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize cart' });
      }
    };

    initializeCart();
  }, []);

  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!state.cart) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await addToCart(state.cart.id, variantId, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Error adding item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (!state.cart) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await removeFromCart(state.cart.id, lineItemId);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (!state.cart) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await updateCartItemQuantity(state.cart.id, lineItemId, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item quantity' });
    }
  };

  const clearCart = () => {
    localStorage.removeItem('shopify_cart_id');
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = () => {
    return state.cart?.totalQuantity || 0;
  };

  const checkout = () => {
    if (state.cart?.checkoutUrl) {
      // Redirect to Shopify checkout
      window.location.href = state.cart.checkoutUrl;
    } else {
      console.error('No checkout URL available');
    }
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartItemCount,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
