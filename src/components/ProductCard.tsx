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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-900">
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
              className="border border-gray-300 rounded px-2 py-1 text-sm"
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
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            selectedVariant?.availableForSale
              ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {loading ? 'Adding...' : selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};
