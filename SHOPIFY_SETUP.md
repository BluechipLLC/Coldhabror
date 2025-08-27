# Shopify Setup for Product Scroller

## 🔧 **Environment Configuration**

Create a `.env.local` file in your project root with the following variables:

```bash
# Your Shopify store domain (e.g., cold-harbor-coffee.myshopify.com)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Your Shopify Storefront API access token
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

## 📋 **Getting Your Shopify Credentials**

### 1. **Store Domain**
- Go to your Shopify admin
- Look at the URL: `https://your-store-name.myshopify.com`
- Your domain is: `your-store-name.myshopify.com`

### 2. **Storefront API Access Token**
1. Go to **Settings** > **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Give your app a name (e.g., "Cold Harbor Website")
5. Click **Configure Storefront API**
6. Select the scopes you need:
   - `read_products` - to fetch product information
   - `read_product_listings` - to fetch published products
7. Click **Save**
8. Copy the **Storefront access token**

## ✅ **What the Product Scroller Now Does**

- **Fetches real products** from your Shopify store
- **Displays actual product images** from Shopify
- **Shows real prices** from your product variants
- **Links to actual product pages** using Shopify handles
- **Automatically updates** when you add/remove products in Shopify

## 🚀 **Testing**

1. Set up your `.env.local` file with real credentials
2. Restart your development server
3. The scroller will automatically fetch and display your Shopify products
4. Check the browser console for any error messages

## 🔍 **Troubleshooting**

- **"Failed to load products"** - Check your Shopify credentials
- **Empty scroller** - Verify your store has published products
- **API errors** - Check your Storefront API permissions
- **Images not loading** - Ensure products have images in Shopify

## 📱 **Product Requirements**

For best results, ensure your Shopify products have:
- ✅ **Product title** (will display as the blend name)
- ✅ **Product images** (will display in the scroller)
- ✅ **Product variants** with pricing
- ✅ **Product handle** (for URL generation)
