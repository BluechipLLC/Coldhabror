'use client';

import React, { useState } from 'react';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/contexts/CartContext';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();

  // Expose cart drawer open function globally
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.openCartDrawer = () => setIsCartOpen(true);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.openCartDrawer = undefined;
      }
    };
  }, []);

  return (
    <>
      <header className="w-full sticky top-0 z-50">
        {/* Top announcement bar */}
        <div className="bg-[rgb(26,58,58)] text-white py-1.5 sm:py-2 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
          
          <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/Logo/Cold Harbo Logo-01.png" 
                alt="Cold Harbor Sailboat" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              <span className="text-xs sm:text-sm font-medium text-center">
                First Edition Cold Harbor available for preorder
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="bg-[#F3F0E9] relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
          {/* Tan texture overlay */}
          <div className="absolute inset-0 bg-[url('/Logo/image.png')] bg-repeat opacity-20 mix-blend-mode-multiply"></div>
          
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 xl:h-22">
              {/* Logo and Brand - Left Justified */}
              <div className="flex items-center">
                <img 
                  src="/Logo/Cold Harbo Logo-01.png" 
                  alt="Cold Harbor Logo" 
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 object-contain"
                />
              </div>

              {/* Navigation and Cart - Right Justified */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Navigation - Mobile Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-[#1A3A3A] hover:text-[#1A3A3A]/80 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex gap-6 lg:gap-8 xl:gap-10 items-center">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/about', label: 'About' },
                    { href: '/products', label: 'Shop All' },
                    { href: '/partnerships', label: 'Partnerships' },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-[#1A3A3A] relative group"
                      style={{
                        fontFamily: 'var(--font-eb-garamond), serif',
                        fontWeight: 500,
                        fontSize: 'clamp(0.875rem, 1.4vw, 1.375rem)'
                      }}
                    >
                      <span className="inline-block transition-all duration-300 ease-out will-change-transform group-hover:-translate-y-1 group-hover:drop-shadow-lg">
                        {item.label}
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1A3A3A] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ))}
                </nav>

                {/* Cart Icon */}
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-[#1A3A3A] hover:text-[#1A3A3A]/80 transition-all duration-300 hover:scale-110 group"
                    aria-label="Shopping cart"
                  >
                    <img 
                      src="/favicons/cart.webp" 
                      alt="Shopping Cart" 
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                    />
                    {/* Cart Items Indicator - Always visible when items exist, hover-only when empty */}
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none translate-y-1 sm:translate-y-2 transition-all duration-300 ${
                      getCartItemCount() > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="text-[#F3F0E9] font-bold" style={{
                        fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)',
                        lineHeight: '1'
                      }}>
                        {getCartItemCount() || 0}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu - Dynamic Island Style */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'h-auto' : 'h-0'
        }`}>
          {/* Dropdown Menu Container */}
          <div className={`bg-[#F3F0E9] border-t-2 border-[#1A3A3A]/20 shadow-2xl transform transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}>
            {/* Navigation Links */}
            <nav className="px-6 py-4 space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/products', label: 'Shop All' },
                { href: '/partnerships', label: 'Partnerships' },
              ].map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#1A3A3A] py-3 px-4 rounded-xl hover:bg-[#1A3A3A]/10 transition-all duration-200 text-base font-medium"
                  style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontWeight: 500
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
