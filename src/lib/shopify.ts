import Client from 'shopify-buy';

// Initialize Shopify client
export const shopifyClient = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
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
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
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

// Cart functions
export const createCart = async (): Promise<Cart> => {
  const cart = await shopifyClient.checkout.create();
  return cart;
};

export const addToCart = async (cartId: string, variantId: string, quantity: number = 1): Promise<Cart> => {
  const cart = await shopifyClient.checkout.addLineItems(cartId, [
    {
      variantId,
      quantity,
    },
  ]);
  return cart;
};

export const removeFromCart = async (cartId: string, lineItemId: string): Promise<Cart> => {
  const cart = await shopifyClient.checkout.removeLineItems(cartId, [lineItemId]);
  return cart;
};

export const updateCartItemQuantity = async (cartId: string, lineItemId: string, quantity: number): Promise<Cart> => {
  const cart = await shopifyClient.checkout.updateLineItems(cartId, [
    {
      id: lineItemId,
      quantity,
    },
  ]);
  return cart;
};

export const fetchCart = async (cartId: string): Promise<Cart> => {
  const cart = await shopifyClient.checkout.fetch(cartId);
  return cart;
};

// Product functions
export const fetchProducts = async (): Promise<ShopifyProduct[]> => {
  const products = await shopifyClient.product.fetchAll();
  return products;
};

export const fetchProduct = async (handle: string): Promise<ShopifyProduct> => {
  const product = await shopifyClient.product.fetchByHandle(handle);
  return product;
};
