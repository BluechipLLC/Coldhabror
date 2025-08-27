'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  onClick: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-[#1A3A3A] hover:text-[#1A3A3A]/80 transition-all duration-150 transform active:scale-95 active:translate-y-1 hover:scale-105 hover:-translate-y-1 opacity-85 hover:opacity-100 cursor-pointer select-none"
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95) translateY(2px)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
      }}
      aria-label="Shopping cart"
    >
      {/* Nautical anchor decoration */}
      <div className="absolute -top-1 -left-1 opacity-85">
        <svg className="w-3 h-3 text-[#1A3A3A]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7L1 9V11H3V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V11H23V9H21M19 19H5V11H19V19Z"/>
        </svg>
      </div>
      
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#1A3A3A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold opacity-85">
          {itemCount}
        </span>
      )}
    </button>
  );
};
