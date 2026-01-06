// Product types
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in cents
  images: string[];
  dimensions: {
    width: number;
    height: number;
    thickness: number;
    unit: "in" | "cm" | "mm";
  };
  stock: number;
  featured: boolean;
  active: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number; // in cents
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  email: string;
  items: OrderItem[];
  subtotal: number; // in cents
  shipping: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Admin user types
export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "super_admin";
  createdAt: Date;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Stripe types
export interface CheckoutSession {
  sessionId: string;
  url: string;
}

// Contact Message types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

// Interest Check types
export interface InterestCheck {
  id: string;
  mats: string[]; // OG CatMat, PeekMat, FaceMat
  interestLevel: number; // 1-5
  pricePoints: string[]; // $35-45, $45-55, $55-65
  otherSizes: string | null;
  email: string | null;
  suggestions: string | null;
  createdAt: Date;
}

// Firebase document converters helper type
export type WithId<T> = T & { id: string };
