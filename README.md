# Cold Harbor Website

A modern ecommerce website built with Next.js, TypeScript, and Shopify's Storefront API. Features a fully functional shopping cart, product catalog, and seamless checkout experience.

## Features

- 🛒 **Working Shopping Cart** - Add, remove, and update quantities
- 🏪 **Shopify Integration** - Full product catalog from your Shopify store
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- ⚡ **Fast Performance** - Built with Next.js 15 and Turbopack
- 🔒 **Secure Checkout** - Direct integration with Shopify's checkout system

## Prerequisites

- Node.js 18+ 
- A Shopify store with Storefront API access
- Shopify Storefront API access token

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/BluechipLLC/Coldhabror.git
cd Coldhabror
npm install
```

### 2. Configure Shopify

1. **Get your Shopify store domain** (e.g., `your-store.myshopify.com`)

2. **Create a Storefront API access token:**
   - Go to your Shopify admin
   - Navigate to Settings > Apps and sales channels
   - Click "Develop apps" > "Create an app"
   - Configure Storefront API permissions
   - Copy the access token

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your website.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── products/          # Products catalog page
│   └── [...slug]/         # Dynamic routes for static content
├── components/            # React components
│   ├── CartDrawer.tsx     # Shopping cart sidebar
│   ├── CartIcon.tsx       # Cart icon with item count
│   ├── Header.tsx         # Site header with navigation
│   └── ProductCard.tsx    # Individual product display
├── contexts/              # React contexts
│   └── CartContext.tsx    # Shopping cart state management
├── lib/                   # Utility libraries
│   └── shopify.ts         # Shopify API client and functions
└── public/                # Static assets
    └── site/              # Imported static HTML content
```

## Shopify Integration

The website uses Shopify's Storefront API to:
- Fetch products and variants
- Manage shopping cart state
- Handle checkout process
- Display real-time inventory

### Key Functions

- `fetchProducts()` - Get all products from your store
- `addToCart()` - Add items to shopping cart
- `updateCartItemQuantity()` - Modify item quantities
- `removeFromCart()` - Remove items from cart
- `createCart()` - Initialize new shopping cart

## Customization

### Adding New Pages
Create new files in `src/app/` following Next.js 13+ app router conventions.

### Styling
The project uses Tailwind CSS. Customize colors, spacing, and components in `tailwind.config.js`.

### Shopify Products
Products are automatically fetched from your Shopify store. To customize the display, modify `ProductCard.tsx`.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Your Shopify store domain | Yes |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token | Yes |

## Support

For issues or questions:
1. Check the Shopify documentation
2. Review Next.js troubleshooting guides
3. Open an issue in this repository

## License

This project is proprietary to Bluechip LLC.
