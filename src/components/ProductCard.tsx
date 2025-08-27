'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShopifyProduct } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0]?.node);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setLoading(true);
    try {
      await addItem(selectedVariant.id);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const firstImage = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group">
      {firstImage && (
        <div className="aspect-w-1 aspect-h-1 w-full">
          <img
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#1A3A3A] mb-2 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
          {product.title}
        </h3>
        
        <p className="text-[#1A3A3A]/85 text-sm mb-3 line-clamp-2 group-hover:text-[#1A3A3A] transition-colors duration-300">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-[#1A3A3A] opacity-85 group-hover:opacity-100 transition-opacity duration-300">
            ${price.toFixed(2)}
          </span>
          
          {product.variants.edges.length > 1 && (
            <select
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = product.variants.edges.find(
                  edge => edge.node.id === e.target.value
                )?.node;
                if (variant) {
                  setSelectedVariant(variant);
                }
              }}
              className="border border-[#1A3A3A]/30 rounded px-2 py-1 text-sm text-[#1A3A3A] opacity-85 hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A3A3A]/40"
            >
              {product.variants.edges.map(({ node }) => (
                <option key={node.id} value={node.id}>
                  {node.title}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={loading || !selectedVariant?.availableForSale}
          className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-300 opacity-85 hover:opacity-100 ${
            selectedVariant?.availableForSale
              ? 'bg-[#1A3A3A] text-white hover:bg-[#1A3A3A]/90 disabled:bg-gray-400 disabled:opacity-60'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
        >
          {loading ? 'Adding...' : selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};
