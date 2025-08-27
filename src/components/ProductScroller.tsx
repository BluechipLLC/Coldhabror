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
        <div className="text-gray-600">Loading coffee blends...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-red-600">No coffee products available. Please check your configuration.</div>
      </div>
    );
  }

  // Duplicate products multiple times for seamless infinite loop
  const duplicatedProducts = [...products, ...products, ...products, ...products, ...products];

  // Calculate total width for animation - make it fill screen width
  const totalSetWidth = products.reduce((acc, product) => acc + 320 + itemGap, 0);

  return (
    <div className="w-full overflow-hidden relative bg-transparent">
      {/* Fallback notice */}
      {usingFallback && (
        <div className="text-center mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Demo Mode:</strong> Showing sample coffee products. 
            <a href="/SHOPIFY_SETUP.md" className="underline ml-1">Configure Shopify</a> for real products.
          </p>
        </div>
      )}
      
      <div
        className="flex gap-10"
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
            className="relative w-80 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-transform duration-300 ease-out"
            style={{
              transform: hoveredIndex === index ? `scale(${hoverScaleFactor})` : 'scale(1)',
            }}
          >
            {/* Product Image */}
            <img
              src={product.images.edges[0]?.node.url || '/placeholder-coffee.jpg'}
              alt={product.images.edges[0]?.node.altText || product.title}
              className="w-full h-auto block"
              loading="lazy"
            />

            {/* Product Info Overlay - Much lighter gradient */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-lg">{product.title}</h3>
              <p className="text-white/90 text-sm mb-3 drop-shadow-lg">
                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
            </div>

            {/* Shop Now Button - Using site's analog-cta style */}
            {hoveredIndex === index && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
                <a
                  href={`/products/${product.handle}`}
                  className="analog-cta"
                >
                  {buyButtonText}
                </a>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="analog-cta text-sm py-2 px-4"
                >
                  Add to Cart
                </button>
              </div>
            )}
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
