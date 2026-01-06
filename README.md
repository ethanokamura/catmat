# CATMAT - Premium Desk Mats

A modern, minimalistic e-commerce website for selling premium desk mats. Built with Next.js 16, Firebase, Stripe, and ShadCN UI.

## Features

- **Minimalist Design**: Clean, modern UI with ADA compliance
- **E-commerce**: Full shopping cart and checkout flow
- **Payments**: Stripe integration for secure payments
- **Admin Dashboard**: Manage products and orders
- **Firebase Backend**: Firestore database with authentication

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Stripe Checkout
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Firebase project
- Stripe account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/catmat.git
cd catmat
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Firebase and Stripe credentials.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
catmat/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   │   ├── login/         # Admin login
│   │   ├── orders/        # Order management
│   │   └── products/      # Product management
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout
│   │   └── webhook/       # Stripe webhooks
│   ├── checkout/          # Checkout pages
│   ├── products/          # Product pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── cart/             # Cart components
│   ├── products/         # Product components
│   ├── shared/           # Shared components
│   └── ui/               # ShadCN UI components
├── lib/                   # Utilities and services
│   ├── context/          # React contexts
│   ├── services/         # Firebase services
│   ├── store/            # Zustand stores
│   ├── firebase.ts       # Firebase client
│   ├── firebase-admin.ts # Firebase Admin SDK
│   ├── stripe.ts         # Stripe config
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── assets/               # Static assets
```

## Environment Variables

See `env.example` for required environment variables:

- `NEXT_PUBLIC_FIREBASE_*` - Firebase client SDK config
- `FIREBASE_*` - Firebase Admin SDK credentials
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Enable Storage (for product images)
5. Copy your web app config to environment variables
6. Create a service account and download credentials
7. Set up Firestore security rules (see `FIREBASE_SCHEMA.md`)
8. Set up Storage security rules (see `FIREBASE_SCHEMA.md`)

### Creating an Admin User

1. Create a user in Firebase Authentication
2. Add a document to the `admins` collection:
   - Document ID: The user's Firebase UID
   - Fields: `email`, `role` ("admin" or "super_admin"), `createdAt`

## Stripe Setup

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Set up a webhook endpoint pointing to `/api/webhook`
3. Add the webhook signing secret to your environment variables

## Accessibility

This site is built with ADA compliance in mind:

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- Reduced motion support
- High contrast mode support

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

Deploy to Vercel for the best Next.js experience:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to:
1. Add all environment variables
2. Set up Stripe webhook for your production URL
3. Update Firebase security rules

## License

MIT License
