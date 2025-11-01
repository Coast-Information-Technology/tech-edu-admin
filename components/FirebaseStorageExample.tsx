"use client";

import React, { useState, useRef } from "react";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { STORAGE_FOLDERS } from "@/lib/firebase-storage-client";
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Image,
  FolderOpen,
  TestTube,
} from "lucide-react";

interface FileItem {
  url: string;
  name: string;
  size: number;
  path: string;
}

export const FirebaseStorageExample: React.FC = () => {
  const {
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
    getFileInfo,
    testCORS,
    loading,
    error,
    progress,
  } = useFirebaseStorage();

  const [selectedFolder, setSelectedFolder] =
    useState<keyof typeof STORAGE_FOLDERS>("ASSETS");
  const [subfolder, setSubfolder] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [corsStatus, setCorsStatus] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(
        file,
        STORAGE_FOLDERS[selectedFolder],
        subfolder || undefined,
        (progress) => {
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        }
      );

      console.log("Upload successful:", result);
      await loadFiles(); // Refresh file list
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Load files from selected folder
  const loadFiles = async () => {
    try {
      const fileList = await listFiles(
        STORAGE_FOLDERS[selectedFolder],
        subfolder || undefined
      );
      setFiles(fileList);
    } catch (err) {
      console.error("Failed to load files:", err);
    }
  };

  // Handle file download
  const handleDownload = async (file: FileItem) => {
    try {
      await downloadFile(file.url, file.name);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Handle file deletion
  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    try {
      await deleteFile(file.url);
      await loadFiles(); // Refresh file list
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Get file information
  const handleGetFileInfo = async (file: FileItem) => {
    try {
      const info = await getFileInfo(file.url);
      setFileInfo(info);
      setSelectedFile(file);
    } catch (err) {
      console.error("Failed to get file info:", err);
    }
  };

  // Test CORS configuration
  const handleTestCORS = async () => {
    try {
      const isConfigured = await testCORS();
      setCorsStatus(isConfigured);
    } catch (err) {
      console.error("CORS test failed:", err);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-[10px] shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Firebase Storage Manager
        </h1>

        {/* CORS Test */}
        <div className="mb-6 p-4 bg-blue-50 rounded-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                CORS Configuration
              </span>
            </div>
            <button
              onClick={handleTestCORS}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test CORS"}
            </button>
          </div>
          {corsStatus !== null && (
            <div
              className={`mt-2 text-sm ${
                corsStatus ? "text-green-600" : "text-red-600"
              }`}
            >
              {corsStatus
                ? "✅ CORS is properly configured"
                : "❌ CORS is not configured"}
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-[10px]">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload File
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) =>
                  setSelectedFolder(
                    e.target.value as keyof typeof STORAGE_FOLDERS
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ASSETS">Assets (Images only)</option>
                <option value="ATTACHMENTS">Attachments (All files)</option>
                <option value="MATERIALS">Materials (All files)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subfolder (optional)
              </label>
              <input
                type="text"
                value={subfolder}
                onChange={(e) => setSubfolder(e.target.value)}
                placeholder="e.g., product-icons"
                className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {loading ? "Uploading..." : "Select File"}
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
            accept={
              selectedFolder === "ASSETS"
                ? "image/*"
                : selectedFolder === "ATTACHMENTS"
                ? "*"
                : "*"
            }
          />

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* File Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Files</h2>
              <button
                onClick={loadFiles}
                disabled={loading}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-[10px] hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
              >
                <FolderOpen className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No files found in {selectedFolder.toLowerCase()}
                  {subfolder && `/${subfolder}`}
                </p>
              ) : (
                files.map((file, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-[10px] hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <Image className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleGetFileInfo(file)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Get Info"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* File Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              File Information
            </h2>

            {selectedFile && fileInfo ? (
              <div className="p-4 bg-gray-50 rounded-[10px]">
                <h3 className="font-medium text-gray-900 mb-2">
                  {selectedFile.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">
                      {formatFileSize(fileInfo.size)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{fileInfo.contentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">
                      {new Date(fileInfo.updated).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={selectedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                Select a file to view information
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
