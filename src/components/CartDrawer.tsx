'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart, checkout } = useCart();

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
        className={`fixed right-0 top-0 h-full w-80 sm:w-96 bg-[#F3F0E9] shadow-2xl z-50 transform transition-transform duration-500 ease-out border-l-4 border-[#1A3A3A] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Shelf-like top edge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#1A3A3A] to-transparent"></div>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-[#1A3A3A]/20 bg-[#1A3A3A]/5">
            <h2 className="text-xl font-semibold text-[#1A3A3A]" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#1A3A3A] hover:text-[#1A3A3A]/80 hover:bg-[#1A3A3A]/10 rounded-full transition-all duration-200"
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
                <p className="text-[#1A3A3A]/60 mt-4 font-medium">Loading cart...</p>
              </div>
            ) : state.cart && state.cart.lines.edges.length > 0 ? (
              <div className="space-y-4">
                {state.cart.lines.edges.map(({ node }) => (
                  <div key={node.id} className="flex items-center space-x-4 p-4 border-2 border-[#1A3A3A]/10 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                    {node.variant.image && (
                      <img
                        src={node.variant.image.url}
                        alt={node.variant.image.altText || node.title}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1A3A3A]">{node.title}</h3>
                      <p className="text-sm text-[#1A3A3A]/70">{node.variant.title}</p>
                      <p className="text-sm font-semibold text-[#1A3A3A]">
                        ${parseFloat(node.variant.price.amount).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(node.id, Math.max(0, node.quantity - 1))}
                        className="w-8 h-8 rounded-full border-2 border-[#1A3A3A]/30 flex items-center justify-center hover:bg-[#1A3A3A]/10 hover:border-[#1A3A3A]/50 transition-all duration-200 text-[#1A3A3A]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-[#1A3A3A]">{node.quantity}</span>
                      <button
                        onClick={() => updateQuantity(node.id, node.quantity + 1)}
                        className="w-8 h-8 rounded-full border-2 border-[#1A3A3A]/30 flex items-center justify-center hover:bg-[#1A3A3A]/10 hover:border-[#1A3A3A]/50 transition-all duration-200 text-[#1A3A3A]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(node.id)}
                      className="p-2 text-[#1A3A3A]/60 hover:text-[#1A3A3A] hover:bg-[#1A3A3A]/10 rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-[#1A3A3A]/40">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                  </svg>
                </div>
                <p className="text-[#1A3A3A]/60 text-xl font-medium" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                  Your Deck is Empty
                </p>
                <p className="text-[#1A3A3A]/40 text-base mt-2">Stow some cargo before we set sail</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {state.cart && state.cart.lines.edges.length > 0 && (
            <div className="border-t-2 border-[#1A3A3A]/20 p-6 space-y-4 bg-[#1A3A3A]/5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1A3A3A] text-lg">Cargo Value:</span>
                <span className="font-semibold text-[#1A3A3A] text-xl">
                  ${parseFloat(state.cart.totalAmount.amount).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1A3A3A] text-white py-4 px-6 rounded-xl hover:bg-[#1A3A3A]/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full text-[#1A3A3A]/70 py-3 px-6 rounded-xl border-2 border-[#1A3A3A]/30 hover:bg-[#1A3A3A]/10 hover:border-[#1A3A3A]/50 transition-all duration-200 font-medium"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
