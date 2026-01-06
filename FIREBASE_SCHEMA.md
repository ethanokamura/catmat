# Firebase Firestore Schema

This document outlines the Firestore database schema for the CATMAT e-commerce application.

## Collections

### `products`

Stores product information.

| Field | Type | Description |
|-------|------|-------------|
| `slug` | `string` | URL-friendly identifier (unique) |
| `name` | `string` | Product display name |
| `description` | `string` | Product description |
| `price` | `number` | Price in cents (e.g., 3900 = $39.00) |
| `images` | `array<string>` | Array of image URLs |
| `dimensions` | `object` | Product dimensions |
| `dimensions.width` | `number` | Width in inches |
| `dimensions.height` | `number` | Height in inches |
| `dimensions.thickness` | `number` | Thickness value |
| `dimensions.unit` | `string` | Unit for thickness ("in", "cm", "mm") |
| `stock` | `number` | Available inventory count |
| `featured` | `boolean` | Show on homepage |
| `active` | `boolean` | Product visibility on store |
| `stripeProductId` | `string?` | Optional Stripe product ID |
| `stripePriceId` | `string?` | Optional Stripe price ID |
| `createdAt` | `timestamp` | Creation timestamp |
| `updatedAt` | `timestamp` | Last update timestamp |

### `orders`

Stores customer orders.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | `string?` | Optional user ID (if authenticated) |
| `email` | `string` | Customer email address |
| `items` | `array<object>` | Array of order items |
| `items[].productId` | `string` | Product document ID |
| `items[].productName` | `string` | Product name at time of purchase |
| `items[].quantity` | `number` | Quantity ordered |
| `items[].priceAtPurchase` | `number` | Price in cents at time of purchase |
| `subtotal` | `number` | Subtotal in cents |
| `shipping` | `number` | Shipping cost in cents |
| `tax` | `number` | Tax amount in cents |
| `total` | `number` | Total amount in cents |
| `status` | `string` | Order status (see below) |
| `shippingAddress` | `object` | Shipping address |
| `shippingAddress.name` | `string` | Recipient name |
| `shippingAddress.line1` | `string` | Address line 1 |
| `shippingAddress.line2` | `string?` | Address line 2 |
| `shippingAddress.city` | `string` | City |
| `shippingAddress.state` | `string` | State/Province |
| `shippingAddress.postalCode` | `string` | Postal/ZIP code |
| `shippingAddress.country` | `string` | Country code |
| `stripePaymentIntentId` | `string?` | Stripe Payment Intent ID |
| `stripeCheckoutSessionId` | `string?` | Stripe Checkout Session ID |
| `trackingNumber` | `string?` | Shipping tracking number |
| `notes` | `string?` | Admin notes |
| `createdAt` | `timestamp` | Order creation timestamp |
| `updatedAt` | `timestamp` | Last update timestamp |

#### Order Status Values

- `pending` - Order received, payment confirmed
- `processing` - Order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled
- `refunded` - Order refunded

### `admins`

Stores admin user information.

| Field | Type | Description |
|-------|------|-------------|
| `email` | `string` | Admin email address |
| `displayName` | `string?` | Display name |
| `role` | `string` | Admin role ("admin" or "super_admin") |
| `createdAt` | `timestamp` | Account creation timestamp |

**Note:** The document ID should be the Firebase Auth UID of the admin user.

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Orders - authenticated read own orders, admin read all
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        resource.data.email == request.auth.token.email ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
      allow create: if true; // Webhook creates orders
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admins - only readable by authenticated admins
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow write: if false; // Managed via Firebase Console or Admin SDK
    }
  }
}
```

## Indexes

Create the following composite indexes in Firebase Console:

### Products Collection
- `active` (Ascending) + `createdAt` (Descending)
- `active` (Ascending) + `featured` (Ascending)

### Orders Collection
- `status` (Ascending) + `createdAt` (Descending)
- `email` (Ascending) + `createdAt` (Descending)

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - public read, admin write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid));
    }
    
    // Default deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Structure

```
products/
└── {product-slug}/
    ├── 1704067200000-abc123.jpg
    ├── 1704067201000-def456.jpg
    └── ...
```

- Images are organized by product slug
- Filenames include timestamp and random string for uniqueness
- Supported formats: JPEG, PNG, WebP, GIF
- Maximum file size: 5MB

## Setup Instructions

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Set up security rules (copy from above)
5. Create composite indexes (as needed)
6. Create your first admin user:
   - Create a user in Firebase Authentication
   - Add a document to the `admins` collection with the user's UID as the document ID
   - Set the `email`, `role` ("admin" or "super_admin"), and `createdAt` fields

## Sample Data

### Sample Product

```json
{
  "slug": "og-catmat",
  "name": "OG CatMat",
  "description": "The original CatMat desk pad. Premium cloth surface with a natural rubber base for exceptional mouse tracking and comfort.",
  "price": 3900,
  "images": [
    "https://example.com/catmat1.jpg",
    "https://example.com/catmat2.jpg"
  ],
  "dimensions": {
    "width": 22,
    "height": 12,
    "thickness": 4,
    "unit": "mm"
  },
  "stock": 100,
  "featured": true,
  "active": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Sample Admin Document

Document ID: `[Firebase Auth UID]`

```json
{
  "email": "admin@catmat.co",
  "displayName": "Admin User",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

