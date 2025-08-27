# Setup Guide - Remove Mock Data

## Current Issue
The product pages are currently showing mock/placeholder data because the Shopify API isn't configured. This guide will help you set up real Shopify integration.

## Step 1: Create Environment File
Create a `.env.local` file in your project root:

```bash
cp env.example .env.local
```

## Step 2: Get Shopify Credentials

### Get Your Store Domain
1. Go to your Shopify admin panel
2. Look at the URL: `https://your-store-name.myshopify.com`
3. Copy the domain part: `your-store-name.myshopify.com`

### Get Storefront API Token
1. In Shopify admin, go to **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Give it a name (e.g., "Cold Harbor Website")
5. Click **Configure Storefront API**
6. Select the scopes you need:
   - `unauthenticated_read_product_listings` (to read products)
   - `unauthenticated_read_product_inventory` (to check inventory)
   - `unauthenticated_read_checkouts` (for cart functionality)
7. Click **Save**
8. Copy the **Storefront access token**

## Step 3: Update Environment Variables
Edit `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-actual-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-actual-access-token
```

## Step 4: Add Products to Shopify
1. In Shopify admin, go to **Products**
2. Click **Add product**
3. Create your coffee products:
   - **First Light Breakfast Blend**
   - **Fog Horn French Roast**
   - **Nightwatch Espresso Blend**
4. Add descriptions, images, and pricing
5. Make sure the product handles match your routes:
   - `first-light` for First Light
   - `fog-horn` for Fog Horn
   - `nightwatch` for Nightwatch

## Step 5: Test the Integration
1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Visit `/products` - you should now see real products from Shopify
3. Click on individual products - they should show real data

## Troubleshooting

### "Shopify store not configured" Error
- Check that `.env.local` exists and has correct values
- Make sure you copied the full domain (including `.myshopify.com`)
- Verify the access token is correct

### "Failed to load products" Error
- Check your Shopify store has products published
- Verify the Storefront API scopes are correct
- Check browser console for detailed error messages

### Products Still Not Loading
- Ensure products are published (not drafts) in Shopify
- Check that products have images and descriptions
- Verify the product handles match your URL structure

## What Was Removed
The following mock data has been removed:
- Hardcoded product descriptions
- Fake pricing information
- Mock product images
- Fallback mock products

Now your site will only show real data from your Shopify store, or clear error messages if something isn't configured properly.
