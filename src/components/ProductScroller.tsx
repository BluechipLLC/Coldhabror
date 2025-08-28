"use client";

import React, { useState, useEffect } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";

interface ProductScrollerProps {
  scrollSpeed?: number; // seconds for one loop
  itemGap?: number;
  hoverScaleFactor?: number;
  buyButtonText?: string;
  fallbackProducts?: ShopifyProduct[];
}

export default function ProductScroller({
  scrollSpeed = 30,
  itemGap = 40,
  hoverScaleFactor = 1.05,
  buyButtonText = "Shop Now",
  fallbackProducts = [],
}: ProductScrollerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from Shopify first
        const fetchedProducts = await fetchProducts();
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
          setUsingFallback(false);
          console.log('Loaded products from Shopify:', fetchedProducts.length);
        } else {
          throw new Error('No products returned from Shopify');
        }
      } catch (err) {
        console.log('Shopify fetch failed, using fallback products:', err);
        setError('Shopify not configured - using sample products');
        setUsingFallback(true);
        
        // Use fallback products if Shopify fails
        if (fallbackProducts && fallbackProducts.length > 0) {
          setProducts(fallbackProducts);
          console.log('Using fallback products:', fallbackProducts.length);
        } else {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [fallbackProducts]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    try {
      // Get the first available variant
      const firstVariant = product.variants.edges[0]?.node;
      if (firstVariant && firstVariant.availableForSale) {
        await addItem(firstVariant.id, 1);
        console.log('Added to cart:', product.title);
      } else {
        console.log('Product not available for sale:', product.title);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-[#1A3A3A]/70" style={{
          fontFamily: 'var(--font-eb-garamond), serif',
          fontSize: '1.25rem',
          fontWeight: 500
        }}>
          Loading coffee blends...
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-red-600" style={{
          fontFamily: 'var(--font-eb-garamond), serif',
          fontSize: '1.125rem',
          fontWeight: 500
        }}>
          No coffee products available. Please check your configuration.
        </div>
      </div>
    );
  }

  // Duplicate products multiple times for seamless infinite loop
  const duplicatedProducts = [...products, ...products, ...products, ...products, ...products];

  // Calculate total width for animation
  const totalSetWidth = products.reduce((acc, product) => acc + 320 + itemGap, 0);

  return (
    <div className="w-full overflow-hidden relative bg-transparent">
      {/* Fallback notice - Following Padding Rules */}
      {usingFallback && (
        <div className="max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)] mb-8">
          <div className="text-center p-4 bg-[#1A3A3A]/5 border border-[#1A3A3A]/10 rounded-xl">
            <p className="text-[#1A3A3A]/80" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              💡 <strong>Demo Mode:</strong> Showing sample coffee products. 
              <a href="/SHOPIFY_SETUP.md" className="underline ml-1 hover:text-[#1A3A3A] transition-colors">Configure Shopify</a> for real products.
            </p>
          </div>
        </div>
      )}
      
      {/* Product Scroller - Edge to Edge */}
      <div
        className="flex gap-8"
        style={{
          animation: `scroll ${scrollSpeed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {duplicatedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-500 ease-out shadow-lg hover:shadow-2xl"
            style={{
              transform: hoveredIndex === index ? `scale(${hoverScaleFactor})` : 'scale(1)',
              width: 'clamp(280px, 25vw, 400px)',
              minWidth: '280px',
              maxWidth: '400px'
            }}
          >
            {/* Product Image Container - Responsive height */}
            <div className="relative w-full bg-[#1A3A3A]/5" style={{
              height: 'clamp(280px, 35vh, 400px)'
            }}>
              <img
                src={product.images.edges[0]?.node.url || '/placeholder-coffee.jpg'}
                alt={product.images.edges[0]?.node.altText || product.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Subtle overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            {/* Product Info Card - Responsive padding */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl border-t-2 border-[#1A3A3A]/20 shadow-lg" style={{
              padding: 'clamp(0.5rem, 2vw, 1.5rem)'
            }}>
              <h3 className="text-[#1A3A3A] font-semibold mb-2 leading-tight" style={{
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 600,
                fontSize: 'clamp(0.875rem, 2.2vw, 1.25rem)'
              }}>
                {product.title}
              </h3>
              <div className="mb-3">
                {product.compareAtPriceRange && parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#1A3A3A]/70 font-semibold" style={{
                      fontFamily: 'var(--font-eb-garamond), serif',
                      fontWeight: 600,
                      fontSize: 'clamp(0.75rem, 1.8vw, 1.125rem)'
                    }}>
                      ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </span>
                    <span className="text-[#d92f38] line-through opacity-80" style={{
                      fontFamily: 'var(--font-eb-garamond), serif',
                      fontWeight: 500,
                      fontSize: 'clamp(0.65rem, 1.6vw, 1rem)'
                    }}>
                      ${parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="text-[#1A3A3A]/70" style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontWeight: 500,
                    fontSize: 'clamp(0.75rem, 1.8vw, 1.125rem)'
                  }}>
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                )}
              </div>
              
              {/* Action Buttons - Responsive sizing */}
              <div className="flex gap-2 sm:gap-3">
                <a
                  href={`/products/${product.handle}`}
                  className="flex-1 text-center bg-[#1A3A3A] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#1A3A3A]/90 hover:scale-105 active:scale-95"
                  style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontWeight: 600,
                    padding: 'clamp(0.5rem, 1.8vw, 0.75rem) clamp(0.625rem, 2vw, 1rem)',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)'
                  }}
                >
                  {buyButtonText}
                </a>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 text-center bg-white text-[#1A3A3A] border-2 border-[#1A3A3A] rounded-xl font-semibold transition-all duration-300 hover:bg-[#1A3A3A] hover:text-white active:scale-95"
                  style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontWeight: 600,
                    padding: 'clamp(0.5rem, 1.8vw, 0.75rem) clamp(0.625rem, 2vw, 1rem)',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${totalSetWidth}px);
          }
        }
      `}</style>
    </div>
  );
}
