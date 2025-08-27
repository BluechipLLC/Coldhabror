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
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Coffee Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully crafted blends, from the gentle morning light to the bold night watch.
          </p>
        </div>
        
        <ProductScroller
          scrollSpeed={35}
          itemGap={40}
          hoverScaleFactor={1.08}
          buyButtonText="Shop Now"
          fallbackProducts={fallbackProducts}
        />
      </div>
    </div>
  );
}
