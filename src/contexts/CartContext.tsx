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
  getCartSubtotal: () => number;
  getCartTotal: () => number;
  getItemTotal: (lineItemId: string) => number;
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
        console.log('Initializing cart...');
        const savedCartId = localStorage.getItem('shopify_cart_id');
        
        if (savedCartId) {
          console.log('Found saved cart ID:', savedCartId);
          dispatch({ type: 'SET_LOADING', payload: true });
          const cart = await fetchCart(savedCartId);
          console.log('Fetched existing cart:', cart);
          dispatch({ type: 'SET_CART', payload: cart });
        } else {
          console.log('No saved cart, creating new one...');
          const newCart = await createCart();
          console.log('Created new cart:', newCart);
          localStorage.setItem('shopify_cart_id', newCart.id);
          dispatch({ type: 'SET_CART', payload: newCart });
        }
      } catch (error) {
        console.error('Cart initialization error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize cart' });
        
        // Clear invalid cart ID and try to create a new one
        localStorage.removeItem('shopify_cart_id');
        try {
          console.log('Attempting to create new cart after error...');
          const newCart = await createCart();
          localStorage.setItem('shopify_cart_id', newCart.id);
          dispatch({ type: 'SET_CART', payload: newCart });
        } catch (retryError) {
          console.error('Failed to create cart on retry:', retryError);
        }
      }
    };

    initializeCart();
  }, []);

  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!state.cart) {
      console.error('No cart available for adding item');
      return;
    }
    
    try {
      console.log('Adding item to cart:', { variantId, quantity, cartId: state.cart.id });
      console.log('Cart before adding item:', state.cart);
      console.log('Current cart lines:', state.cart.lines.edges);
      console.log('Current totalQuantity:', state.cart.totalQuantity);
      
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await addToCart(state.cart.id, variantId, quantity);
      
      console.log('Cart updated after adding item:', updatedCart);
      console.log('Updated cart lines:', updatedCart.lines.edges);
      console.log('Updated totalQuantity:', updatedCart.totalQuantity);
      
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      // Log the new state after dispatch
      setTimeout(() => {
        console.log('Cart state after dispatch:', state.cart);
        console.log('New cart item count:', getCartItemCount());
      }, 100);
      
    } catch (error) {
      console.error('Error adding item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (!state.cart) {
      console.error('No cart available for removing item');
      return;
    }
    
    try {
      console.log('Removing item from cart:', { lineItemId, cartId: state.cart.id });
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await removeFromCart(state.cart.id, lineItemId);
      console.log('Cart updated after removing item:', updatedCart);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Error removing item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (!state.cart) {
      console.error('No cart available for updating quantity');
      return;
    }
    
    try {
      console.log('Updating item quantity:', { lineItemId, quantity, cartId: state.cart.id });
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await updateCartItemQuantity(state.cart.id, lineItemId, quantity);
      console.log('Cart updated after quantity change:', updatedCart);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Error updating quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item quantity' });
    }
  };

  const clearCart = () => {
    console.log('Clearing cart...');
    localStorage.removeItem('shopify_cart_id');
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = () => {
    if (!state.cart) return 0;
    
    // Calculate total quantity from all line items
    const totalCount = state.cart.lines.edges.reduce((total, { node }) => {
      return total + node.quantity;
    }, 0);
    
    console.log('Calculated cart item count from line items:', totalCount);
    console.log('Shopify totalQuantity:', state.cart.totalQuantity);
    
    // Use the calculated count as fallback if Shopify totalQuantity is not accurate
    return totalCount || state.cart.totalQuantity || 0;
  };

  // Calculate cart subtotal (sum of all line items)
  const getCartSubtotal = () => {
    if (!state.cart) return 0;
    
    const subtotal = state.cart.lines.edges.reduce((total, { node }) => {
      const itemPrice = parseFloat(node.variant.price.amount);
      const itemTotal = itemPrice * node.quantity;
      return total + itemTotal;
    }, 0);
    
    console.log('Calculated cart subtotal:', subtotal);
    return subtotal;
  };

  // Get cart total (from Shopify, includes taxes/shipping if applicable)
  const getCartTotal = () => {
    const total = state.cart ? parseFloat(state.cart.totalAmount.amount) : 0;
    console.log('Getting cart total from Shopify:', total);
    return total;
  };

  // Calculate total for a specific line item
  const getItemTotal = (lineItemId: string) => {
    if (!state.cart) return 0;
    
    const lineItem = state.cart.lines.edges.find(({ node }) => node.id === lineItemId);
    if (!lineItem) return 0;
    
    const itemPrice = parseFloat(lineItem.node.variant.price.amount);
    const itemTotal = itemPrice * lineItem.node.quantity;
    
    console.log('Calculated item total:', { lineItemId, itemTotal });
    return itemTotal;
  };

  const checkout = () => {
    if (state.cart?.checkoutUrl) {
      console.log('Redirecting to checkout:', state.cart.checkoutUrl);
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
    getCartSubtotal,
    getCartTotal,
    getItemTotal,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
