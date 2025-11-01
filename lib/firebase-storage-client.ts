import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { safeConsole } from "@/lib/console";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

// Storage folder constants
export const STORAGE_FOLDERS = {
  ASSETS: "assets",
  ATTACHMENTS: "attachments",
  MATERIALS: "materials",
} as const;

export type StorageFolder =
  (typeof STORAGE_FOLDERS)[keyof typeof STORAGE_FOLDERS];

// File type validation
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "text/plain", // .txt
  "application/zip", // .zip
  "application/x-rar-compressed", // .rar
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "text/csv", // .csv
];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ATTACHMENT_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_MATERIAL_SIZE = 50 * 1024 * 1024; // 50MB

// Helper function to validate file type
const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const fileMimeType = file.type.toLowerCase();
  return (
    allowedTypes.includes(fileMimeType) ||
    (!!fileExtension && allowedTypes.includes(`.${fileExtension}`))
  );
};

// Helper function to generate unique filename
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return `${timestamp}-${randomId}-${nameWithoutExt}.${extension}`;
};

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Upload result type
export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
}

// Generic upload function with CORS handling
export const uploadFile = async (
  file: File,
  folder: StorageFolder,
  subfolder?: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Determine allowed types and max size based on folder
    let allowedTypes: string[];
    let maxSize: number;

    switch (folder) {
      case STORAGE_FOLDERS.ASSETS:
        allowedTypes = IMAGE_TYPES;
        maxSize = MAX_IMAGE_SIZE;
        break;
      case STORAGE_FOLDERS.ATTACHMENTS:
        allowedTypes = [...IMAGE_TYPES, ...DOCUMENT_TYPES];
        maxSize = MAX_ATTACHMENT_SIZE;
        break;
      case STORAGE_FOLDERS.MATERIALS:
        allowedTypes = [...IMAGE_TYPES, ...DOCUMENT_TYPES];
        maxSize = MAX_MATERIAL_SIZE;
        break;
      default:
        throw new Error(`Unknown folder: ${folder}`);
    }

    // Validate file type
    if (!isValidFileType(file, allowedTypes)) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Generate unique filename
    const fileName = generateFileName(file.name);
    const fullPath = subfolder
      ? `${folder}/${subfolder}/${fileName}`
      : `${folder}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, fullPath);

    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          safeConsole.log(`Upload progress: ${progress.toFixed(2)}%`);
          onProgress?.(progress);
        },
        (error) => {
          safeConsole.error("Upload failed:", error);
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const metadata = await getMetadata(uploadTask.snapshot.ref);

            const result: UploadResult = {
              url: downloadURL,
              path: fullPath,
              name: fileName,
              size: metadata.size,
            };

            safeConsole.log("Upload successful:", result);
            resolve(result);
          } catch (error: any) {
            safeConsole.error("Failed to get download URL:", error);
            reject(new Error(`Failed to get download URL: ${error.message}`));
          }
        }
      );
    });
  } catch (error: any) {
    safeConsole.error("Upload error:", error);
    throw error;
  }
};

// Download file function
export const downloadFile = async (
  url: string,
  filename?: string
): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(downloadUrl);
    safeConsole.log("File downloaded successfully");
  } catch (error: any) {
    safeConsole.error("Download failed:", error);
    throw new Error(`Download failed: ${error.message}`);
  }
};

// Delete file function
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const path = decodeURIComponent(
      urlObj.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (!path) {
      throw new Error("Invalid file URL");
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    safeConsole.log("File deleted successfully:", path);
  } catch (error: any) {
    safeConsole.error("Delete failed:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

// List files in folder
export const listFiles = async (
  folder: StorageFolder,
  subfolder?: string
): Promise<UploadResult[]> => {
  try {
    const fullPath = subfolder ? `${folder}/${subfolder}` : folder;
    const folderRef = ref(storage, fullPath);
    const result = await listAll(folderRef);

    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return {
          url,
          path: itemRef.fullPath,
          name: itemRef.name,
          size: metadata.size,
        };
      })
    );

    return files;
  } catch (error: any) {
    safeConsole.error("List files failed:", error);
    throw new Error(`List files failed: ${error.message}`);
  }
};

// Get file metadata
export const getFileInfo = async (
  url: string
): Promise<{
  name: string;
  size: number;
  contentType: string;
  updated: string;
}> => {
  try {
    const urlObj = new URL(url);
    const path = decodeURIComponent(
      urlObj.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (!path) {
      throw new Error("Invalid file URL");
    }

    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);

    return {
      name: metadata.name,
      size: metadata.size,
      contentType: metadata.contentType || "application/octet-stream",
      updated: metadata.updated,
    };
  } catch (error: any) {
    safeConsole.error("Get file info failed:", error);
    throw new Error(`Get file info failed: ${error.message}`);
  }
};

// Convenience functions for specific folders
export const uploadAssetImage = (
  file: File,
  subfolder?: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  return uploadFile(file, STORAGE_FOLDERS.ASSETS, subfolder, onProgress);
};

export const uploadAttachment = (
  file: File,
  subfolder?: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  return uploadFile(file, STORAGE_FOLDERS.ATTACHMENTS, subfolder, onProgress);
};

export const uploadMaterial = (
  file: File,
  subfolder?: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  return uploadFile(file, STORAGE_FOLDERS.MATERIALS, subfolder, onProgress);
};

// CORS test function
export const testCORS = async (): Promise<boolean> => {
  try {
    const testUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o`;

    const response = await fetch(testUrl, {
      method: "OPTIONS",
      headers: {
        Origin: window.location.origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, Authorization",
      },
    });

    const isCORSConfigured = response.status === 200;

    if (isCORSConfigured) {
      safeConsole.log("✅ CORS is properly configured");
    } else {
      safeConsole.warn("❌ CORS is not configured. Status:", response.status);
    }

    return isCORSConfigured;
  } catch (error: any) {
    safeConsole.error("CORS test failed:", error);
    return false;
  }
};

// Export storage instance for direct use if needed
export { storage };
