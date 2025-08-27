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
        <div className="text-green text-2xl">Loading product...</div>
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
            onClick={() => router.back()}
            className="bg-green text-white px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
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
        <div className="text-green text-2xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--paper-color)]">
      {/* Header */}
      <div className="bg-green text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="text-white hover:opacity-80 transition-opacity"
          >
            ← Back to Products
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.images.edges[0]?.node.url} 
              alt={product.images.edges[0]?.node.altText || product.title}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-green text-4xl lg:text-5xl font-bold" style={{
              fontFamily: 'var(--font-eb-garamond), serif'
            }}>
              {product.title}
            </h1>
            
            <div className="text-3xl text-green font-semibold">
              ${product.priceRange.minVariantPrice.amount}
            </div>
            
            <p className="text-tan text-lg leading-relaxed" style={{
              fontFamily: 'var(--font-eb-garamond), serif'
            }}>
              {product.description}
            </p>

            {/* Product Features */}
            <div className="space-y-3">
              <h3 className="text-green text-xl font-semibold">Features:</h3>
              <ul className="text-tan space-y-2">
                <li>• Premium quality coffee blend</li>
                <li>• Fresh roasted and ground</li>
                <li>• Perfect for any time of day</li>
                <li>• 12 oz bag</li>
                <li>• Sustainably sourced beans</li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-green font-semibold">Quantity:</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-green rounded px-3 py-2 text-green bg-white"
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
              className="w-full bg-green text-white py-4 px-8 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed analog-cta"
              style={{
                fontFamily: 'var(--font-eb-garamond), serif'
              }}
            >
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart - $' + product.priceRange.minVariantPrice.amount}
            </button>

            {/* Cart Status */}
            {state.cart && (
              <div className="text-sm text-tan">
                <p>Items in cart: {state.cart.totalQuantity}</p>
                <p>Total: ${state.cart.totalAmount.amount}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="text-sm text-tan space-y-2">
              <p>• Free shipping on orders over $50</p>
              <p>• Ships within 1-2 business days</p>
              <p>• 30-day satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
