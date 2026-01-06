import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InterestCheck } from "@/lib/types";

// Submit a new interest check response
export async function submitInterestCheck(
  data: Omit<InterestCheck, "id" | "createdAt">
): Promise<string> {
  const interestCheckRef = collection(db, "interest-checks");
  console.log("data", {
    ...data,
    createdAt: Timestamp.now(),
  });
  const docRef = await addDoc(interestCheckRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}
