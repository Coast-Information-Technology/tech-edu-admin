import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { safeConsole } from "@/lib/console";

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (prevent duplicate apps)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Storage
export const storage = getStorage(app);

// Storage folder constants
export const STORAGE_FOLDERS = {
  ASSETS: "assets",
  ATTACHMENTS: "attachments",
  MATERIALS: "materials",
} as const;

export type StorageFolder =
  (typeof STORAGE_FOLDERS)[keyof typeof STORAGE_FOLDERS];

/**
 * Generate unique filename with timestamp
 */
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return `${timestamp}-${randomId}-${nameWithoutExt}.${extension}`;
};

/**
 * Upload file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder in storage (assets, attachments, or materials)
 * @param subfolder - Optional subfolder within the main folder
 * @returns Promise<string> - The download URL
 */
export const uploadFileToFirebase = async (
  file: File,
  folder: StorageFolder,
  subfolder?: string
): Promise<string> => {
  try {
    const fileName = generateFileName(file.name);
    const fullPath = subfolder
      ? `${folder}/${subfolder}/${fileName}`
      : `${folder}/${fileName}`;
    const storageRef = ref(storage, fullPath);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    safeConsole.log(`File uploaded successfully: ${fullPath}`);
    return downloadURL;
  } catch (error) {
    safeConsole.error("Error uploading to Firebase:", error);
    throw new Error(`Failed to upload file to Firebase: ${error}`);
  }
};

/**
 * Upload image to assets folder
 * @param file - The image file to upload
 * @param subfolder - Optional subfolder (e.g., 'profile-images', 'course-images')
 * @returns Promise<string> - The download URL
 */
export const uploadAssetImage = async (
  file: File,
  subfolder?: string
): Promise<string> => {
  return uploadFileToFirebase(file, STORAGE_FOLDERS.ASSETS, subfolder);
};

/**
 * Upload attachment file
 * @param file - The attachment file to upload
 * @param subfolder - Optional subfolder (e.g., 'user-uploads', 'booking-attachments')
 * @returns Promise<string> - The download URL
 */
export const uploadAttachment = async (
  file: File,
  subfolder?: string
): Promise<string> => {
  return uploadFileToFirebase(file, STORAGE_FOLDERS.ATTACHMENTS, subfolder);
};

/**
 * Upload training/certification material
 * @param file - The material file to upload
 * @param subfolder - Optional subfolder (e.g., 'course-materials', 'certification-docs')
 * @returns Promise<string> - The download URL
 */
export const uploadMaterial = async (
  file: File,
  subfolder?: string
): Promise<string> => {
  return uploadFileToFirebase(file, STORAGE_FOLDERS.MATERIALS, subfolder);
};

/**
 * Delete file from Firebase Storage
 * @param url - The download URL of the file
 * @returns Promise<void>
 */
export const deleteFileFromFirebase = async (url: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const path = decodeURIComponent(
      urlObj.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (path) {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      safeConsole.log(`File deleted successfully: ${path}`);
    }
  } catch (error) {
    safeConsole.error("Error deleting from Firebase:", error);
    throw new Error(`Failed to delete file from Firebase: ${error}`);
  }
};

/**
 * List files in a storage folder
 * @param folder - The folder to list
 * @param subfolder - Optional subfolder
 * @returns Promise<Array<{name: string, url: string, size: number, updated: string}>>
 */
export const listFilesInFolder = async (
  folder: StorageFolder,
  subfolder?: string
): Promise<
  Array<{ name: string; url: string; size: number; updated: string }>
> => {
  try {
    const fullPath = subfolder ? `${folder}/${subfolder}` : folder;
    const folderRef = ref(storage, fullPath);
    const result = await listAll(folderRef);

    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return {
          name: itemRef.name,
          url,
          size: metadata.size,
          updated: metadata.updated,
        };
      })
    );

    return files;
  } catch (error) {
    safeConsole.error("Error listing files:", error);
    throw new Error(`Failed to list files: ${error}`);
  }
};

/**
 * Get file metadata
 * @param url - The download URL of the file
 * @returns Promise<{name: string, size: number, updated: string}>
 */
export const getFileMetadata = async (
  url: string
): Promise<{ name: string; size: number; updated: string }> => {
  try {
    const urlObj = new URL(url);
    const path = decodeURIComponent(
      urlObj.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);

    return {
      name: metadata.name,
      size: metadata.size,
      updated: metadata.updated,
    };
  } catch (error) {
    safeConsole.error("Error getting file metadata:", error);
    throw new Error(`Failed to get file metadata: ${error}`);
  }
};

// Enhanced upload with progress tracking
export const uploadFileWithProgress = async (
  file: File,
  folder: StorageFolder,
  subfolder?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const fileName = generateFileName(file.name);
    const fullPath = subfolder
      ? `${folder}/${subfolder}/${fileName}`
      : `${folder}/${fileName}`;
    const storageRef = ref(storage, fullPath);

    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          safeConsole.error("Upload failed:", error);
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            safeConsole.log(`File uploaded successfully: ${fullPath}`);
            resolve(downloadURL);
          } catch (error) {
            safeConsole.error("Failed to get download URL:", error);
            reject(new Error(`Failed to get download URL: ${error}`));
          }
        }
      );
    });
  } catch (error) {
    safeConsole.error("Error uploading to Firebase:", error);
    throw new Error(`Failed to upload file to Firebase: ${error}`);
  }
};

// File type validation
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
];

const validateFileType = (file: File, folder: StorageFolder): boolean => {
  switch (folder) {
    case STORAGE_FOLDERS.ASSETS:
      return IMAGE_TYPES.includes(file.type);
    case STORAGE_FOLDERS.ATTACHMENTS:
    case STORAGE_FOLDERS.MATERIALS:
      return [...IMAGE_TYPES, ...DOCUMENT_TYPES].includes(file.type);
    default:
      return false;
  }
};

// Enhanced upload with validation
export const uploadFileWithValidation = async (
  file: File,
  folder: StorageFolder,
  subfolder?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Validate file type
  if (!validateFileType(file, folder)) {
    throw new Error(`Invalid file type for ${folder} folder`);
  }

  // Check file size (5MB for images, 20MB for documents)
  const maxSize =
    folder === STORAGE_FOLDERS.ASSETS ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
  }

  return uploadFileWithProgress(file, folder, subfolder, onProgress);
};

// Legacy functions for backward compatibility
export const uploadImageToFirebase = uploadAssetImage;
export const deleteImageFromFirebase = deleteFileFromFirebase;
