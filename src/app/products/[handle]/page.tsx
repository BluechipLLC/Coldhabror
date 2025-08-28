"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '../../../contexts/CartContext';
import { ShopifyProduct } from '../../../lib/shopify';

// Extend Window interface to include our custom function
declare global {
  interface Window {
    openCartDrawer?: () => void;
  }
}

export default function DynamicProductPage() {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { addItem, state } = useCart();

  // Get the product handle from the URL
  const productHandle = params.handle as string;

  useEffect(() => {
    // Fetch product data from Shopify using the handle from the URL
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching product with handle:', productHandle);
        
        // Import shopifyClient
        const { shopifyClient } = await import('../../../lib/shopify');
        
        // Fetch real product from Shopify store
        const product = await shopifyClient.product.fetchByHandle(productHandle);
        console.log('Fetched product:', product);
        
        // Transform the Shopify response to match our interface
        const transformedProduct: ShopifyProduct = {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          images: {
            edges: product.images?.map((img: { src: string; altText?: string }) => ({
              node: {
                url: img.src,
                altText: img.altText || product.title
              }
            })) || []
          },
          priceRange: {
            minVariantPrice: {
              amount: String(product.variants?.[0]?.price?.amount || '0.00'),
              currencyCode: product.variants?.[0]?.price?.currencyCode || 'USD'
            }
          },
          variants: {
            edges: product.variants?.map((variant: { 
              id: string; 
              title: string; 
              price?: { amount: string | number; currencyCode: string }; 
              available?: boolean 
            }) => ({
              node: {
                id: variant.id,
                title: variant.title,
                price: {
                  amount: String(variant.price?.amount || '0.00'),
                  currencyCode: variant.price?.currencyCode || 'USD'
                },
                availableForSale: variant.available || false
              }
            })) || []
          }
        };
        
        setProduct(transformedProduct);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        
        // Check if it's a configuration error
        if (error instanceof Error && error.message.includes('your-store.myshopify.com')) {
          setError('Shopify store not configured. Please check your environment variables.');
        } else {
          setError(`Failed to load product "${productHandle}" from Shopify. Please try again later.`);
        }
        setIsLoading(false);
      }
    };

    if (productHandle) {
      fetchProduct();
    }
  }, [productHandle]);

  const handleAddToCart = async () => {
    if (!product || !product.variants.edges[0]) return;
    
    setIsAddingToCart(true);
    try {
      const variantId = product.variants.edges[0].node.id;
      await addItem(variantId, quantity);
      
      // Wait a moment for cart state to update, then open cart drawer
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.openCartDrawer) {
          window.openCartDrawer();
        }
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--paper-color)] flex items-center justify-center">
        <div className="text-[#1A3A3A] text-2xl" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
          Loading product details...
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
            onClick={() => router.back()}
            className="bg-[#1A3A3A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1A3A3A]/90 transition-all duration-300"
            style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[color:var(--paper-color)] flex items-center justify-center">
        <div className="text-[#1A3A3A] text-2xl" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--paper-color)]">
      {/* Header Navigation */}
      <div className="bg-[#1A3A3A] text-white py-6 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('/Scrimshaw/artwork-01.webp')] bg-cover bg-center opacity-10"></div>
        
        <div className="w-full px-[clamp(1rem,4vw,3rem)] relative z-10">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center text-white hover:text-white/80 transition-colors text-lg font-medium"
            style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collection
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="py-20">
        <div className="w-full px-[clamp(1rem,4vw,3rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Product Image */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <img 
                  src={product.images.edges[0]?.node.url} 
                  alt={product.images.edges[0]?.node.altText || product.title}
                  className="w-full h-auto rounded-2xl object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-[#1A3A3A] text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight" style={{
                  fontFamily: 'var(--font-eb-garamond), serif',
                  fontWeight: 700
                }}>
                  {product.title}
                </h1>
                
                <div className="mb-6">
                  {product.compareAtPriceRange && parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                    <div className="flex items-center gap-4">
                      <span className="text-4xl text-[#1A3A3A] font-bold">
                        ${product.priceRange.minVariantPrice.amount}
                      </span>
                      <span className="text-2xl text-[#d92f38] line-through">
                        ${product.compareAtPriceRange.minVariantPrice.amount}
                      </span>
                    </div>
                  ) : (
                    <div className="text-4xl text-[#1A3A3A] font-bold">
                      ${product.priceRange.minVariantPrice.amount}
                    </div>
                  )}
                </div>
                
                <p className="text-[#1A3A3A]/80 text-xl leading-relaxed" style={{
                  fontFamily: 'var(--font-eb-garamond), serif',
                  fontWeight: 400
                }}>
                  {product.description}
                </p>
              </div>

              {/* Product Features */}
              <div className="bg-[#F5F5F0] rounded-2xl p-8">
                <h3 className="text-[#1A3A3A] text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                  What Makes This Blend Special
                </h3>
                <ul className="text-[#1A3A3A]/80 space-y-4 text-lg">
                  <li className="flex items-start">
                    <span className="text-[#1A3A3A] mr-3 text-xl">•</span>
                    <span>Premium quality coffee beans, carefully selected and roasted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1A3A3A] mr-3 text-xl">•</span>
                    <span>Fresh roasted and ground for maximum flavor</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1A3A3A] mr-3 text-xl">•</span>
                    <span>Perfect for any time of day - morning, noon, or night</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1A3A3A] mr-3 text-xl">•</span>
                    <span>12 oz bag - enough for multiple cups of excellence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1A3A3A] mr-3 text-xl">•</span>
                    <span>Sustainably sourced beans from ethical growers</span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="bg-white rounded-2xl p-8 border border-[#1A3A3A]/10">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-[#1A3A3A] text-xl font-semibold" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                    Quantity:
                  </label>
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border-2 border-[#1A3A3A]/20 rounded-xl px-6 py-3 text-[#1A3A3A] bg-[#F5F5F0] focus:outline-none focus:border-[#1A3A3A] transition-colors duration-300 text-lg"
                    style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || state.loading}
                  className="w-full bg-[#1A3A3A] text-white py-5 px-8 rounded-xl text-2xl font-semibold transition-all duration-300 hover:bg-[#1A3A3A]/90 hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-eb-garamond), serif'
                  }}
                >
                  {isAddingToCart ? 'Adding to Cart...' : `Add to Cart - $${product.priceRange.minVariantPrice.amount}`}
                </button>
              </div>

              {/* Cart Status */}
              {state.cart && (
                <div className="bg-[#F5F5F0] rounded-2xl p-6 text-center">
                  <h4 className="text-[#1A3A3A] font-semibold mb-3" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                    Your Cart
                  </h4>
                  <div className="text-[#1A3A3A]/80 space-y-1">
                    <p>Items: {state.cart.totalQuantity}</p>
                    <p className="text-lg font-semibold">Total: ${state.cart.totalAmount.amount}</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white rounded-2xl p-8 border border-[#1A3A3A]/10">
                <h4 className="text-[#1A3A3A] text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
                  Shipping & Returns
                </h4>
                <div className="text-[#1A3A3A]/80 space-y-3 text-lg">
                  <p>• Free shipping on orders over $50</p>
                  <p>• Ships within 1-2 business days</p>
                  <p>• 30-day satisfaction guarantee</p>
                  <p>• Secure checkout and fast delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products CTA */}
      <div className="bg-[#F5F5F0] py-20">
        <div className="w-full px-[clamp(1rem,4vw,3rem)]">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A3A3A] mb-6 tracking-tight" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 700
            }}>
              Explore Our Full Collection
            </h2>
            <p className="text-[#1A3A3A]/80 text-xl leading-relaxed mb-10" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 400
            }}>
              Each blend has its own story. Discover the perfect coffee for your morning ritual.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-10 py-5 bg-[#1A3A3A] text-white rounded-xl font-semibold text-xl transition-all duration-300 hover:bg-[#1A3A3A]/90 hover:scale-105"
              style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
            >
              View All Blends
              <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
