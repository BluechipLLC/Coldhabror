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
          <div className="text-[#1A3A3A] text-2xl mb-4" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
            Loading our coffee collection...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--paper-color)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <div className="text-[#1A3A3A]/80 text-lg mb-4">
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
            className="bg-[#1A3A3A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1A3A3A]/90 transition-all duration-300"
            style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--paper-color)]">
      {/* Hero Section */}
      <div className="bg-[#1A3A3A] text-white py-20 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('/Scrimshaw/artwork-03.webp')] bg-cover bg-center opacity-10"></div>
        
        <div className="w-full px-[clamp(1rem,4vw,3rem)] relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 700
            }}>
              Our Coffee Collection
            </h1>
            <p className="text-xl lg:text-2xl leading-relaxed opacity-90" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 400
            }}>
              Three distinct blends, each crafted with the same coastal precision. 
              No added flavors, no shortcuts—just coffee that cuts through the morning fog.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-20">
        <div className="w-full px-[clamp(1rem,4vw,3rem)]">
          {/* Debug Info */}
          {debugInfo && (
            <div className="mb-12 p-6 bg-[#F5F5F0] rounded-2xl border border-[#1A3A3A]/10">
              <h3 className="text-[#1A3A3A] font-semibold mb-2" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                Debug Info:
              </h3>
              <p className="text-[#1A3A3A]/80">{debugInfo}</p>
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#7b8ca6]/20">
                    <div className="relative overflow-hidden bg-white">
                      <img 
                        src={product.images.edges[0]?.node.url} 
                        alt={product.images.edges[0]?.node.altText || product.title}
                        className="w-full h-auto object-contain bg-white"
                      />
                      <div className="absolute top-3 left-3 bg-[#7b8ca6] text-white text-xs font-semibold tracking-wide px-3 py-1 rounded-full shadow-sm">
                        Coastal Roast
                      </div>
                    </div>
                    
                    <div className="p-6 lg:p-7">
                      <h3 className="text-[#1A3A3A] text-xl lg:text-2xl font-bold mb-2 tracking-tight" style={{
                        fontFamily: 'var(--font-eb-garamond), serif',
                        fontWeight: 700
                      }}>
                        {product.title}
                      </h3>
                      
                      <p className="text-[#7b8ca6] mb-5 leading-relaxed body-copy text-sm sm:text-base">
                        {product.description?.slice(0, 140) || 'Bold, balanced, and built for cold mornings.'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                          {product.compareAtPriceRange && parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#1A3A3A] text-2xl lg:text-3xl font-bold">
                                ${product.priceRange.minVariantPrice.amount}
                              </span>
                              <span className="text-[#d92f38] text-lg lg:text-xl line-through">
                                ${product.compareAtPriceRange.minVariantPrice.amount}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#1A3A3A] text-2xl lg:text-3xl font-bold">
                              ${product.priceRange.minVariantPrice.amount}
                            </span>
                          )}
                        </div>
                        <span className="text-[#7b8ca6] text-sm lg:text-base font-medium">12 oz Bag</span>
                      </div>
                      
                      <Link
                        href={`/products/${product.handle}`}
                        className="w-full bg-[#1A3A3A] text-white py-4 px-8 rounded-xl text-center font-semibold text-lg transition-all duration-300 hover:bg-[#1A3A3A]/90 hover:scale-[1.02] active:scale-98 block"
                        style={{
                          fontFamily: 'var(--font-eb-garamond), serif'
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl p-16 max-w-2xl mx-auto">
                <h3 className="text-[#1A3A3A] text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                  No Products Found
                </h3>
                <p className="text-[#1A3A3A]/80 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                  We're currently preparing our coffee collection. Check back soon for our premium blends.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#F5F5F0] py-20">
        <div className="w-full px-[clamp(1rem,4vw,3rem)]">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A3A3A] mb-6 tracking-tight" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 700
            }}>
              Ready to Experience Coastal Coffee?
            </h2>
            <p className="text-[#7b8ca6] text-xl leading-relaxed mb-10 body-copy">
              Each blend tells a story of the coast. Choose your morning companion.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-10 py-5 bg-[#1A3A3A] text-white rounded-xl font-semibold text-xl transition-all duration-300 hover:bg-[#1A3A3A]/90 hover:scale-105"
              style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
            >
              Back to Harbor
              <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
