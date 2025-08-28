'use client';

import React from 'react';

export const SellingPoints: React.FC = () => {
  const sellingPoints = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      title: "No Added Flavoring",
      description: "No hazelnut, no caramel, this coffee was created to be taken in its purest form: black. Nothing added, nothing hidden."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      title: "Roasted to Cut Through",
      description: "Sharp, balanced, and built to wake you up not lull you back to sleep. Every batch is roasted to hold its own against fog, cold, and early hours."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: "Born on the Coast",
      description: "Salt in the air. Pine trees. Old docks that never stop creaking. We come from a place where mornings are cold and the coffee has to hit hard."
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-[#F3F0E9] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[url('/Logo/image.png')] bg-repeat opacity-10 mix-blend-mode-multiply"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)]">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-[#1A3A3A] mb-4 leading-tight" style={{
            fontFamily: 'var(--font-eb-garamond), serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: '1.1'
          }}>
            Why Choose Cold Harbor
          </h2>
          <p className="text-[#1A3A3A]/80 max-w-2xl mx-auto" style={{
            fontFamily: 'var(--font-eb-garamond), serif',
            fontWeight: 500,
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: '1.4'
          }}>
            Our coffee is crafted with purpose, designed for those who demand excellence in every cup.
          </p>
        </div>

        {/* Selling Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {sellingPoints.map((point, index) => (
            <div 
              key={index}
              className="flex flex-col items-center group"
            >
              {/* Icon Container - Fixed height and position */}
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-8 bg-white/60 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                <div className="text-[#1A3A3A] group-hover:text-[#1A3A3A]/80 transition-colors duration-300">
                  {point.icon}
                </div>
              </div>

              {/* Title - Fixed height container with precise spacing */}
              <div className="h-20 sm:h-24 mb-6 flex items-center justify-center px-2">
                <h3 className="text-[#1A3A3A] leading-tight text-center" style={{
                  fontFamily: 'var(--font-eb-garamond), serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  lineHeight: '1.2'
                }}>
                  {point.title}
                </h3>
              </div>

              {/* Description - Fixed height container with precise spacing */}
              <div className="h-40 sm:h-44 flex items-center justify-center px-4">
                <p className="text-[#1A3A3A]/80 leading-relaxed text-center max-w-xs" style={{
                  fontFamily: 'var(--font-eb-garamond), serif',
                  fontWeight: 400,
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                  lineHeight: '1.6'
                }}>
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
