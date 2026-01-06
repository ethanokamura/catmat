import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, WithId } from "@/lib/types";

const PRODUCTS_COLLECTION = "products";

// Convert Firestore document to Product type
function convertProduct(
  id: string,
  data: Record<string, unknown>
): WithId<Product> {
  return {
    id,
    slug: data.slug as string,
    name: data.name as string,
    description: data.description as string,
    price: data.price as number,
    images: data.images as string[],
    dimensions: data.dimensions as Product["dimensions"],
    stock: data.stock as number,
    featured: data.featured as boolean,
    active: data.active as boolean,
    stripeProductId: data.stripeProductId as string | undefined,
    stripePriceId: data.stripePriceId as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

// Get all active products
export async function getProducts(): Promise<WithId<Product>[]> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(
    productsRef,
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertProduct(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Get all products (including inactive) for admin
export async function getAllProducts(): Promise<WithId<Product>[]> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertProduct(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Get featured products
export async function getFeaturedProducts(
  limitCount = 4
): Promise<WithId<Product>[]> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(
    productsRef,
    where("active", "==", true),
    where("featured", "==", true),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    convertProduct(doc.id, doc.data() as Record<string, unknown>)
  );
}

// Get product by slug
export async function getProductBySlug(
  slug: string
): Promise<WithId<Product> | null> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return convertProduct(doc.id, doc.data() as Record<string, unknown>);
}

// Get product by ID
export async function getProductById(
  id: string
): Promise<WithId<Product> | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return convertProduct(
    docSnap.id,
    docSnap.data() as Record<string, unknown>
  );
}

// Create a new product
export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const now = Timestamp.now();
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

// Update a product
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

