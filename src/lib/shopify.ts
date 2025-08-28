import Client from 'shopify-buy';

// Shopify API types
interface ShopifyCheckout {
  id: string;
  webUrl: string;
  totalPrice?: {
    amount: number;
    currencyCode: string;
  };
  lineItems?: Array<{
    id: string;
    title: string;
    quantity: number;
    variant?: {
      id: string;
      title: string;
      price?: {
        amount: number;
        currencyCode: string;
      };
      image?: {
        src: string;
        altText?: string;
      };
    };
  }>;
}

// Initialize Shopify client
export const shopifyClient = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
  apiVersion: '2024-01',
});

// Product types
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

// Cart types
export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  lines: {
    edges: Array<{
      node: CartItem;
    }>;
  };
}

// Helper function to transform Shopify Checkout to our Cart interface
const transformCheckoutToCart = (checkout: ShopifyCheckout): Cart => {
  return {
    id: checkout.id,
    checkoutUrl: checkout.webUrl,
    totalQuantity: checkout.lineItems?.reduce((total: number, item) => total + (item.quantity || 0), 0) || 0,
    totalAmount: {
      amount: checkout.totalPrice?.amount?.toString() || '0.00',
      currencyCode: checkout.totalPrice?.currencyCode || 'USD'
    },
    lines: {
      edges: checkout.lineItems?.map((item) => ({
        node: {
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          variant: {
            id: item.variant?.id || '',
            title: item.variant?.title || '',
            price: {
              amount: item.variant?.price?.amount?.toString() || '0.00',
              currencyCode: item.variant?.price?.currencyCode || 'USD'
            },
            image: item.variant?.image ? {
              url: item.variant.image.src,
              altText: item.variant.image.altText || item.title
            } : undefined
          }
        }
      })) || []
    }
  };
};

// Cart functions
export const createCart = async (): Promise<Cart> => {
  const checkout = await shopifyClient.checkout.create();
  return transformCheckoutToCart(checkout);
};

export const addToCart = async (cartId: string, variantId: string, quantity: number = 1): Promise<Cart> => {
  const checkout = await shopifyClient.checkout.addLineItems(cartId, [
    {
      variantId,
      quantity,
    },
  ]);
  return transformCheckoutToCart(checkout);
};

export const removeFromCart = async (cartId: string, lineItemId: string): Promise<Cart> => {
  const checkout = await shopifyClient.checkout.removeLineItems(cartId, [lineItemId]);
  return transformCheckoutToCart(checkout);
};

export const updateCartItemQuantity = async (cartId: string, lineItemId: string, quantity: number): Promise<Cart> => {
  const checkout = await shopifyClient.checkout.updateLineItems(cartId, [
    {
      id: lineItemId,
      quantity,
    },
  ]);
  return transformCheckoutToCart(checkout);
};

export const fetchCart = async (cartId: string): Promise<Cart> => {
  const checkout = await shopifyClient.checkout.fetch(cartId);
  return transformCheckoutToCart(checkout);
};

// Product functions
export const fetchProducts = async (): Promise<ShopifyProduct[]> => {
  try {
    // Fetch products using the correct Shopify API method
    // Note: compareAtPrice data needs to be explicitly requested in the query
    const products = await shopifyClient.product.fetchQuery({
      first: 50, // Fetch up to 50 products
      sortKey: 'TITLE',
    });
    
    // Transform the Shopify response to match our interface
    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: {
        edges: product.images?.map((img) => ({
          node: {
            url: img.src,
            altText: img.altText || product.title
          }
        })) || []
      },
      priceRange: {
        minVariantPrice: {
          amount: product.variants[0]?.price?.amount || '0.00',
          currencyCode: product.variants[0]?.price?.currencyCode || 'USD'
        }
      },
      compareAtPriceRange: product.variants[0]?.compareAtPrice ? {
        minVariantPrice: {
          amount: product.variants[0]?.compareAtPrice?.amount || '0.00',
          currencyCode: product.variants[0]?.compareAtPrice?.currencyCode || 'USD'
        }
      } : undefined,
      variants: {
        edges: product.variants?.map((variant) => ({
          node: {
            id: variant.id,
            title: variant.title,
            price: {
              amount: variant.price?.amount || '0.00',
              currencyCode: variant.price?.currencyCode || 'USD'
            },
            compareAtPrice: variant.compareAtPrice ? {
              amount: variant.compareAtPrice?.amount || '0.00',
              currencyCode: variant.compareAtPrice?.currencyCode || 'USD'
            } : undefined,
            availableForSale: variant.available || false
          }
        })) || []
      }
    }));
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    throw error;
  }
};

export const fetchProduct = async (handle: string): Promise<ShopifyProduct> => {
  try {
    // Note: compareAtPrice data needs to be explicitly requested in the query
    const product: any = await shopifyClient.product.fetchByHandle(handle);
    
    // Transform the Shopify response to match our interface
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: {
        edges: product.images?.map((img) => ({
          node: {
            url: img.src,
            altText: img.altText || product.title
          }
        })) || []
      },
      priceRange: {
        minVariantPrice: {
          amount: product.variants[0]?.price?.amount || '0.00',
          currencyCode: product.variants[0]?.price?.currencyCode || 'USD'
        }
      },
      compareAtPriceRange: product.variants[0]?.compareAtPrice ? {
        minVariantPrice: {
          amount: product.variants[0]?.compareAtPrice?.amount || '0.00',
          currencyCode: product.variants[0]?.compareAtPrice?.currencyCode || 'USD'
        }
      } : undefined,
      variants: {
        edges: product.variants?.map((variant) => ({
          node: {
            id: variant.id,
            title: variant.title,
            price: {
              amount: variant.price?.amount || '0.00',
              currencyCode: variant.price?.currencyCode || 'USD'
            },
            compareAtPrice: variant.compareAtPrice ? {
              amount: variant.compareAtPrice?.amount || '0.00',
              currencyCode: variant.compareAtPrice?.currencyCode || 'USD'
            } : undefined,
            availableForSale: variant.available || false
          }
        })) || []
      }
    };
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
    throw error;
  }
};
