import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

/**
 * Upload image to Firebase Storage
 * @param file - The file to upload
 * @param path - The path in storage (e.g., 'profile-images')
 * @returns Promise<string> - The download URL
 */
export const uploadImageToFirebase = async (
  file: File,
  path: string = "profile-images"
): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading to Firebase:", error);
    throw new Error("Failed to upload image to Firebase");
  }
};

/**
 * Delete image from Firebase Storage
 * @param url - The download URL of the image
 */
export const deleteImageFromFirebase = async (url: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const path = decodeURIComponent(
      urlObj.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (path) {
      const storageRef = ref(storage, path);
      // Note: You might need to import deleteObject from firebase/storage
      // import { deleteObject } from 'firebase/storage';
      // await deleteObject(storageRef);
    }
  } catch (error) {
    console.error("Error deleting from Firebase:", error);
    throw new Error("Failed to delete image from Firebase");
  }
};
