'use client';

import React, { useState } from 'react';
import { CartDrawer } from './CartDrawer';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      <header className="w-full">
        {/* Top announcement bar */}
        <div className="bg-[rgb(26,58,58)] text-white py-2 sm:py-3 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-[url('/Logo/image.png')] bg-repeat opacity-10 mix-blend-mode-multiply"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/Logo/Cold Harbo Logo-01.png" 
                alt="Cold Harbor Sailboat" 
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain drop-shadow-sm"
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
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center h-16 sm:h-20 lg:h-24">
              {/* Logo and Brand - Left Justified */}
              <div className="flex items-center flex-1">
                <img 
                  src="/Logo/Cold Harbo Logo-01.png" 
                  alt="Cold Harbor Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain drop-shadow-lg"
                />
              </div>

              {/* Navigation and Cart - Right Justified */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Navigation - Mobile Menu Button */}
                <button className="md:hidden p-2 text-[#1A3A3A] hover:text-[#1A3A3A]/80 transition-colors">
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
                        fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)'
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
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                    </svg>
                    {/* Cart Items Indicator */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A3A3A] text-white text-xs rounded-full flex items-center justify-center font-bold opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                      0
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
