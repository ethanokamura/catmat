import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadProgress {
  progress: number;
  state: "running" | "paused" | "success" | "canceled" | "error";
}

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({
          progress,
          state: snapshot.state as UploadProgress["state"],
        });
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}

/**
 * Upload a product image to Firebase Storage
 */
export async function uploadProductImage(
  file: File,
  productSlug: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Generate a unique filename
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
  const path = `products/${productSlug}/${filename}`;

  return uploadFile(file, path, onProgress);
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Delete a file by URL from Firebase Storage
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    // Extract path from Firebase Storage URL
    const path = extractPathFromUrl(url);
    if (path) {
      await deleteFile(path);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might not exist or be from external URL
  }
}

/**
 * Extract storage path from Firebase Storage URL
 */
function extractPathFromUrl(url: string): string | null {
  try {
    const matches = url.match(/\/o\/(.+?)\?/);
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1]);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  return { valid: true };
}

