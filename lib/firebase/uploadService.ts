// Firebase Storage service for CV uploads with TTL
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  updateMetadata,
} from "firebase/storage";
import { storage } from "./config";

export interface UploadResult {
  url: string;
  path: string;
  name: string;
}

export interface UploadedCV {
  id: string;
  url: string;
  name: string;
  uploadedAt: Date;
  expiresAt: Date;
}

// TTL for uploaded CVs (7 days)
const CV_TTL_DAYS = 7;
const CV_TTL_MS = CV_TTL_DAYS * 24 * 60 * 60 * 1000;

/**
 * Upload a CV file to Firebase Storage with TTL metadata
 */
export async function uploadCV(
  file: File,
  userId?: string
): Promise<UploadResult> {
  try {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files."
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 10MB.");
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `cv_${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExtension}`;

    // Create storage reference with TTL path
    const storagePath = `uploaded-cvs/${userId || "anonymous"}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Set metadata with expiration date
    const expiresAt = new Date(Date.now() + CV_TTL_MS);
    await updateMetadata(storageRef, {
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        originalName: file.name,
        userId: userId || "anonymous",
        ttl: CV_TTL_DAYS.toString(),
      },
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: storagePath,
      name: fileName,
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

/**
 * Get uploaded CV information
 */
export async function getCVInfo(
  storagePath: string
): Promise<UploadedCV | null> {
  try {
    const storageRef = ref(storage, storagePath);
    const metadata = await getMetadata(storageRef);

    if (!metadata.customMetadata) {
      return null;
    }

    const { uploadedAt, expiresAt, originalName, userId } =
      metadata.customMetadata;

    return {
      id: storagePath,
      url: await getDownloadURL(storageRef),
      name: originalName || "Unknown",
      uploadedAt: new Date(uploadedAt),
      expiresAt: new Date(expiresAt),
    };
  } catch (error) {
    console.error("Failed to get CV info:", error);
    return null;
  }
}

/**
 * Delete uploaded CV
 */
export async function deleteCV(storagePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Failed to delete CV:", error);
    throw error;
  }
}

/**
 * Check if CV has expired
 */
export function isCVExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Clean up expired CVs (to be called periodically)
 */
export async function cleanupExpiredCVs(): Promise<void> {
  // This would typically be implemented as a Cloud Function
  // For now, we'll just provide the interface
  console.log("Cleanup expired CVs - implement as Cloud Function");
}
