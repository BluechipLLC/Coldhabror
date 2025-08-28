"use client";

import React from 'react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart, checkout, getCartSubtotal, getCartTotal, getItemTotal } = useCart();

  // Prevent body scroll when cart is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    checkout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Elegant top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A3A3A] via-[#1A3A3A]/80 to-[#1A3A3A]/60"></div>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1A3A3A]/10">
            <h2 className="text-2xl font-semibold text-[#1A3A3A]" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#1A3A3A]/60 hover:text-[#1A3A3A] hover:bg-[#1A3A3A]/5 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1A3A3A]/20 border-t-[#1A3A3A] mx-auto"></div>
                <p className="text-[#1A3A3A]/60 mt-4 font-medium opacity-85">Loading cart...</p>
              </div>
            ) : state.cart && state.cart.lines.edges.length > 0 ? (
              <div className="space-y-4">
                {state.cart.lines.edges.map(({ node }) => (
                  <div key={node.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#1A3A3A]/10 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Product Image */}
                    {node.variant.image && (
                      <img
                        src={node.variant.image.url}
                        alt={node.variant.image.altText || node.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A3A3A] text-base leading-tight mb-1" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                        {node.title}
                      </h3>
                      <p className="text-sm text-[#1A3A3A]/60 mb-2">{node.variant.title}</p>
                      <p className="text-sm font-medium text-[#1A3A3A] mb-3">
                        ${parseFloat(node.variant.price.amount).toFixed(2)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#1A3A3A]/20 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(node.id, Math.max(0, node.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center text-[#1A3A3A] hover:bg-[#1A3A3A]/5 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-medium text-[#1A3A3A] text-sm">{node.quantity}</span>
                          <button
                            onClick={() => updateQuantity(node.id, node.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A3A3A] hover:bg-[#1A3A3A]/5 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(node.id)}
                          className="text-[#1A3A3A]/50 hover:text-[#1A3A3A] hover:bg-[#1A3A3A]/5 p-2 rounded-lg transition-all duration-150"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-semibold text-[#1A3A3A]" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                        ${getItemTotal(node.id).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 text-[#1A3A3A]/30">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-[#1A3A3A] mb-3" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                  Your Cart is Empty
                </h3>
                <p className="text-[#1A3A3A]/60 text-base">Add some coffee to get started</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {state.cart && state.cart.lines.edges.length > 0 && (
            <div className="border-t border-[#1A3A3A]/10 p-6 space-y-4 bg-white">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-base">
                  <span className="text-[#1A3A3A]/70">Subtotal</span>
                  <span className="text-[#1A3A3A] font-medium">${getCartSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#1A3A3A]/10">
                  <span className="text-lg font-semibold text-[#1A3A3A]" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                    Total
                  </span>
                  <span className="text-xl font-bold text-[#1A3A3A]" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#1A3A3A] text-white py-4 px-6 rounded-xl hover:bg-[#1A3A3A]/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-[#1A3A3A]/60 py-3 px-6 rounded-xl border border-[#1A3A3A]/20 hover:bg-[#1A3A3A]/5 hover:border-[#1A3A3A]/40 transition-all duration-200 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
