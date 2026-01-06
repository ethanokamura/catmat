import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContactMessage } from "@/lib/types";

const CONTACT_COLLECTION = "contact-messages";

// Submit a new contact message
export async function submitContactMessage(
  data: Omit<ContactMessage, "id" | "createdAt">
): Promise<string> {
  const contactRef = collection(db, CONTACT_COLLECTION);
  const docRef = await addDoc(contactRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

