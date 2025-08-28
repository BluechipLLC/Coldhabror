"use client";

import React from "react";
import ProductScroller from "./ProductScroller";

// Fallback coffee products in case Shopify isn't configured yet
const fallbackProducts = [
  {
    id: "1",
    title: "First Light Breakfast Blend",
    handle: "first-light-breakfast-blend",
    images: {
      edges: [{
        node: {
          url: "/ch_pictures/first_light/CH_FL.webp",
          altText: "First Light Breakfast Blend"
        }
      }]
    },
    priceRange: {
      minVariantPrice: {
        amount: "18.99",
        currencyCode: "USD"
      }
    },
    compareAtPriceRange: {
      minVariantPrice: {
        amount: "22.99",
        currencyCode: "USD"
      }
    },
    variants: {
      edges: [{
        node: {
          id: "variant-1",
          availableForSale: true
        }
      }]
    }
  },
  {
    id: "2",
    title: "Fog Horn French Roast",
    handle: "fog-horn-french-roast",
    images: {
      edges: [{
        node: {
          url: "/ch_pictures/fog_horn/CH_FH.webp",
          altText: "Fog Horn French Roast"
        }
      }]
    },
    priceRange: {
      minVariantPrice: {
        amount: "19.99",
        currencyCode: "USD"
      }
    },
    compareAtPriceRange: {
      minVariantPrice: {
        amount: "24.99",
        currencyCode: "USD"
      }
    },
    variants: {
      edges: [{
        node: {
          id: "variant-2",
          availableForSale: true
        }
      }]
    }
  },
  {
    id: "3",
    title: "Nightwatch Espresso Blend",
    handle: "nightwatch-espresso-blend",
    images: {
      edges: [{
        node: {
          url: "/ch_pictures/night_watch/CH_NW.webp",
          altText: "Nightwatch Espresso Blend"
        }
      }]
    },
    priceRange: {
      minVariantPrice: {
        amount: "20.99",
        currencyCode: "USD"
      }
    },
    compareAtPriceRange: {
      minVariantPrice: {
        amount: "25.99",
        currencyCode: "USD"
      }
    },
    variants: {
      edges: [{
        node: {
          id: "variant-3",
          availableForSale: true
        }
      }]
    }
  }
];

export default function ProductScrollerDemo() {
  return (
    <section className="w-full">
      {/* Green Banner Section */}
      <div className="w-full bg-[#1A3A3A] py-12 relative overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('/Logo/image.png')] bg-repeat opacity-5 mix-blend-mode-overlay"></div>
        
        <div className="relative z-10 w-full px-[clamp(1rem,4vw,3rem)]">
          {/* Header Section */}
          <div className="text-left">
            <h2 className="text-white leading-tight" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: '1.1'
            }}>
              Our Coffee Collection
            </h2>
          </div>
        </div>
      </div>
      
      {/* Tan Carousel Section */}
      <div className="w-full bg-[#F3F0E9] py-20 relative overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('/Logo/image.png')] bg-repeat opacity-10 mix-blend-mode-multiply"></div>
        
        {/* Product Scroller - Edge to Edge */}
        <div className="relative w-full">
          <ProductScroller
            scrollSpeed={45}
            itemGap={32}
            hoverScaleFactor={1.05}
            buyButtonText="Shop Now"
            fallbackProducts={fallbackProducts}
          />
        </div>
        
        {/* Call to Action - Following Padding Rules */}
        <div className="max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)] mt-16">
          <div className="text-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#1A3A3A] text-white rounded-xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl shadow-lg cursor-pointer select-none border-2 border-[#1A3A3A] hover:border-[#1A3A3A]"
              style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 600
              }}
              aria-label="View All Products"
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95) translateY(4px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
              }}
            >
              View All Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
