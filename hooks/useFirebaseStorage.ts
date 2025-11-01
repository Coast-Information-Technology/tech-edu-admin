import { useState, useCallback } from "react";
import {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  getFileInfo,
  testCORS,
  UploadResult,
  UploadProgressCallback,
  StorageFolder,
} from "@/lib/firebase-storage-client";

interface UseFirebaseStorageReturn {
  // Upload functions
  uploadFile: (
    file: File,
    folder: StorageFolder,
    subfolder?: string,
    onProgress?: UploadProgressCallback
  ) => Promise<UploadResult>;

  // Download functions
  downloadFile: (url: string, filename?: string) => Promise<void>;

  // Delete functions
  deleteFile: (url: string) => Promise<void>;

  // List functions
  listFiles: (
    folder: StorageFolder,
    subfolder?: string
  ) => Promise<UploadResult[]>;

  // Utility functions
  getFileInfo: (url: string) => Promise<{
    name: string;
    size: number;
    contentType: string;
    updated: string;
  }>;

  testCORS: () => Promise<boolean>;

  // State
  loading: boolean;
  error: string | null;
  progress: number;
}

export const useFirebaseStorage = (): UseFirebaseStorageReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = useCallback(
    async (
      file: File,
      folder: StorageFolder,
      subfolder?: string,
      onProgress?: UploadProgressCallback
    ): Promise<UploadResult> => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await uploadFile(file, folder, subfolder, (progress) => {
          setProgress(progress);
          onProgress?.(progress);
        });

        setProgress(100);
        return result;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDownload = useCallback(
    async (url: string, filename?: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await downloadFile(url, filename);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDelete = useCallback(async (url: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await deleteFile(url);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleListFiles = useCallback(
    async (
      folder: StorageFolder,
      subfolder?: string
    ): Promise<UploadResult[]> => {
      setLoading(true);
      setError(null);

      try {
        const files = await listFiles(folder, subfolder);
        return files;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleGetFileInfo = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const info = await getFileInfo(url);
      return info;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTestCORS = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const isConfigured = await testCORS();
      return isConfigured;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadFile: handleUpload,
    downloadFile: handleDownload,
    deleteFile: handleDelete,
    listFiles: handleListFiles,
    getFileInfo: handleGetFileInfo,
    testCORS: handleTestCORS,
    loading,
    error,
    progress,
  };
};
