import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order, OrderStatus, WithId } from "@/lib/types";

const ORDERS_COLLECTION = "orders";

// Convert Firestore document to Order type
function convertOrder(
  id: string,
  data: Record<string, unknown>
): WithId<Order> {
  return {
    id,
    userId: data.userId as string | undefined,
    email: data.email as string,
    items: data.items as Order["items"],
    subtotal: data.subtotal as number,
    shipping: data.shipping as number,
    tax: data.tax as number,
    total: data.total as number,
    status: data.status as OrderStatus,
    shippingAddress: data.shippingAddress as Order["shippingAddress"],
    stripePaymentIntentId: data.stripePaymentIntentId as string | undefined,
    stripeCheckoutSessionId: data.stripeCheckoutSessionId as string | undefined,
    trackingNumber: data.trackingNumber as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

// Get all orders (admin)
export async function getAllOrders(): Promise<WithId<Order>[]> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertOrder(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Get orders by status (admin)
export async function getOrdersByStatus(
  status: OrderStatus
): Promise<WithId<Order>[]> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(
    ordersRef,
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertOrder(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Get recent orders (admin)
export async function getRecentOrders(
  limitCount = 10
): Promise<WithId<Order>[]> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertOrder(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Get order by ID
export async function getOrderById(id: string): Promise<WithId<Order> | null> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return convertOrder(
    docSnap.id,
    docSnap.data() as Record<string, unknown>
  );
}

// Get orders by email
export async function getOrdersByEmail(email: string): Promise<WithId<Order>[]> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(
    ordersRef,
    where("email", "==", email),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertOrder(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Create a new order
export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const now = Timestamp.now();
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

// Update order status
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  const updates: Record<string, unknown> = {
    status,
    updatedAt: Timestamp.now(),
  };

  if (trackingNumber) {
    updates.trackingNumber = trackingNumber;
  }

  await updateDoc(docRef, updates);
}

// Update order
export async function updateOrder(
  id: string,
  updates: Partial<Omit<Order, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// Get order by Stripe checkout session ID
export async function getOrderByStripeSession(
  sessionId: string
): Promise<WithId<Order> | null> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(
    ordersRef,
    where("stripeCheckoutSessionId", "==", sessionId),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return convertOrder(doc.id, doc.data() as Record<string, unknown>);
}

