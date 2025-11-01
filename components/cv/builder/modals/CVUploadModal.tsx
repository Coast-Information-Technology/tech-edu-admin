"use client";

import { useState, useCallback, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { uploadCV, UploadResult } from "@/lib/firebase/uploadService";

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (result: UploadResult & { file: File }) => void;
}

interface UploadStatus {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
  progress: number;
}

export default function CVUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: CVUploadModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: "idle",
    message: "",
    progress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    []
  );

  const handleFileUpload = async (file: File) => {
    try {
      setUploadStatus({
        status: "uploading",
        message: "Uploading your CV...",
        progress: 0,
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadStatus((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      const result = await uploadCV(file);

      clearInterval(progressInterval);

      setUploadStatus({
        status: "success",
        message: "CV uploaded successfully!",
        progress: 100,
      });

      // Wait a moment to show success message
      setTimeout(() => {
        onUploadSuccess({ ...result, file });
        onClose();
      }, 1500);
    } catch (error) {
      setUploadStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed",
        progress: 0,
      });
    }
  };

  const resetUpload = () => {
    setUploadStatus({
      status: "idle",
      message: "",
      progress: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetUpload();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Your CV
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[10px] transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          {uploadStatus.status === "idle" && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-[12px] p-8 text-center transition-all duration-300
                ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }
              `}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Drop your CV here or click to browse
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                  </p>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] font-medium transition-colors"
                >
                  Choose File
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Upload Status */}
          {(uploadStatus.status === "uploading" ||
            uploadStatus.status === "success" ||
            uploadStatus.status === "error") && (
            <div className="space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center">
                {uploadStatus.status === "uploading" && (
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                )}
                {uploadStatus.status === "success" && (
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                )}
                {uploadStatus.status === "error" && (
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                )}
              </div>

              {/* Status Message */}
              <div className="text-center">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    uploadStatus.status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : uploadStatus.status === "error"
                      ? "text-red-600 dark:text-red-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {uploadStatus.message}
                </h3>

                {/* Progress Bar */}
                {uploadStatus.status === "uploading" && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadStatus.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Error Actions */}
              {uploadStatus.status === "error" && (
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-[10px] transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-[10px]">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • Your CV will be securely uploaded and stored temporarily
                  </li>
                  <li>
                    • Our AI will analyze and extract information from your CV
                  </li>
                  <li>
                    • You'll be able to select a template and edit the extracted
                    data
                  </li>
                  <li>
                    • Uploaded files are automatically deleted after 7 days
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
