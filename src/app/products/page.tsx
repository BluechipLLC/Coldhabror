'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';

export default function ProductsPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        try {
          // Try to fetch real products from Shopify store
          setDebugInfo('Attempting to fetch from Shopify...');
          console.log('Shopify client config:', {
            domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
            hasToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
          });
          
          const fetchedProducts = await fetchProducts();
          console.log('Fetched products from Shopify:', fetchedProducts);
          console.log('Product handles:', fetchedProducts.map(p => ({ title: p.title, handle: p.handle })));
          setDebugInfo(`Successfully fetched ${fetchedProducts.length} products from Shopify`);
          setProducts(fetchedProducts);
        } catch (shopifyError) {
          console.error('Shopify API error details:', shopifyError);
          setDebugInfo(`Shopify API failed: ${shopifyError}`);
          
          // Show error instead of mock data
          setError('Failed to load products from Shopify. Please check your configuration.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        
        // Check if it's a configuration error
        if (err instanceof Error && err.message.includes('your-store.myshopify.com')) {
          setError('Shopify store not configured. Please check your environment variables.');
        } else {
          setError('Failed to load products from Shopify. Please try again later.');
        }
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--paper-color)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-green text-2xl mb-4">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--paper-color)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <div className="text-tan text-lg mb-4">
            {error.includes('not configured') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                <h3 className="text-yellow-800 font-semibold mb-2">Configuration Required:</h3>
                <p className="text-yellow-700 text-sm mb-2">To display real products, you need to:</p>
                <ol className="text-yellow-700 text-sm list-decimal list-inside space-y-1">
                  <li>Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
                  <li>Add your Shopify store domain</li>
                  <li>Add your Shopify Storefront API access token</li>
                </ol>
                <p className="text-yellow-700 text-sm mt-2">See <code className="bg-yellow-100 px-1 rounded">env.example</code> for details.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green text-white px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--paper-color)]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-green text-5xl lg:text-6xl font-bold mb-6" style={{
            fontFamily: 'var(--font-eb-garamond), serif'
          }}>
            Our Coffee Blends
          </h1>
          <p className="text-tan text-xl max-w-3xl mx-auto leading-relaxed" style={{
            fontFamily: 'var(--font-eb-garamond), serif'
          }}>
            Discover our premium selection of coffee blends and roasts, carefully crafted for the perfect cup.
          </p>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-green font-semibold mb-2">Debug Info:</h3>
            <p className="text-tan">{debugInfo}</p>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={product.images.edges[0]?.node.url} 
                    alt={product.images.edges[0]?.node.altText || product.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-green text-2xl font-bold mb-3" style={{
                    fontFamily: 'var(--font-eb-garamond), serif'
                  }}>
                    {product.title}
                  </h3>
                  <p className="text-tan mb-4 leading-relaxed" style={{
                    fontFamily: 'var(--font-eb-garamond), serif'
                  }}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green text-2xl font-semibold">
                      ${product.priceRange.minVariantPrice.amount}
                    </span>
                    <span className="text-tan text-sm">12 oz Bag</span>
                  </div>
                  <Link
                    href={`/products/${product.handle}`}
                    className="w-full bg-green text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-green-700 transition-colors block analog-cta"
                    style={{
                      fontFamily: 'var(--font-eb-garamond), serif'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-tan text-xl">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
