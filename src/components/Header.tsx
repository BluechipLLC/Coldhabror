'use client';

import React, { useState } from 'react';
import { CartIcon } from './CartIcon';
import { CartDrawer } from './CartDrawer';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="w-full">
        {/* Top announcement bar */}
        <div className="bg-[rgb(26,58,58)] text-white py-2">
          <div className="max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)] flex items-center justify-center">
            <div className="flex items-center gap-3">
              <img 
                src="/Logo/Cold Harbo Logo-01.png" 
                alt="Cold Harbor Sailboat" 
                className="w-5 h-5 object-contain"
              />
              <span className="text-sm font-medium">
                First Edition Cold Harbor available for preorder
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="bg-[color:var(--paper-color)] border-b border-[rgba(0,0,0,0.08)]/50">
          <div className="max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)]">
            <div className="flex justify-between items-center h-[72px]">
              {/* Logo and Brand */}
              <div className="flex items-center gap-4">
                <img 
                  src="/Logo/Cold Harbo Logo-01.png" 
                  alt="Cold Harbor Logo" 
                  className="w-12 h-12 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-green" style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)'
                  }}>
                    Cold Harbor
                  </span>
                  <span className="text-tan italic" style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontWeight: 400,
                    fontSize: 'clamp(0.875rem, 1.2vw, 1rem)'
                  }}>
                    Coffee Company
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex gap-[clamp(1rem,3vw,2rem)] items-center">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About' },
                  { href: '/products', label: 'Shop All' },
                  { href: '/partnerships', label: 'Partnerships' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-green relative"
                    style={{
                      fontFamily: 'var(--font-eb-garamond), serif',
                      fontWeight: 500,
                      fontSize: 'clamp(1rem, 1.4vw, 1.125rem)'
                    }}
                  >
                    <span className="inline-block transition-transform duration-150 ease-out will-change-transform hover:-translate-y-[1px] active:translate-y-[0px]">
                      {item.label}
                    </span>
                  </a>
                ))}
              </nav>

              {/* Cart Icon */}
              <div className="flex items-center">
                <CartIcon onClick={() => setIsCartOpen(true)} />
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
