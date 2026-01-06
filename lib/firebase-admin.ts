import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDbInstance: Firestore | null = null;
let adminAuthInstance: Auth | null = null;

function initializeAdminApp(): App | null {
  // Skip initialization if already done
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Check for required environment variables
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Skip initialization if no credentials are available (build time)
  if (!serviceAccountKey && (!projectId || !clientEmail || !privateKey)) {
    console.warn("Firebase Admin SDK credentials not found, skipping initialization");
    return null;
  }

  try {
    if (serviceAccountKey) {
      // Use full service account JSON
      return initializeApp({
        credential: cert(JSON.parse(serviceAccountKey)),
      });
    } else {
      // Use individual environment variables
      return initializeApp({
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: privateKey!.replace(/\\n/g, "\n"),
        }),
      });
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    return null;
  }
}

export function getAdminApp(): App {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  if (!adminApp) {
    throw new Error("Firebase Admin SDK not initialized");
  }
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    const app = getAdminApp();
    adminDbInstance = getFirestore(app);
  }
  return adminDbInstance;
}

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    const app = getAdminApp();
    adminAuthInstance = getAuth(app);
  }
  return adminAuthInstance;
}

// Lazy exports for backwards compatibility
export const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    return getAdminDb()[prop as keyof Firestore];
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    return getAdminAuth()[prop as keyof Auth];
  },
});

export default { getAdminApp, getAdminDb, getAdminAuth };
