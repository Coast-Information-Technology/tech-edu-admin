"use client";

import React, { useState } from "react";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { STORAGE_FOLDERS } from "@/lib/firebase-storage-client";

// Example: Material Upload for Product Forms
export const MaterialUploadExample: React.FC = () => {
  const { uploadFile, deleteFile, loading, error, progress } =
    useFirebaseStorage();
  const [materialUrl, setMaterialUrl] = useState<string>("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // If there's an existing material, delete it first
      if (materialUrl) {
        try {
          await deleteFile(materialUrl);
        } catch (deleteErr) {
          console.warn("Failed to delete old material:", deleteErr);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new material
      const result = await uploadFile(
        file,
        STORAGE_FOLDERS.MATERIALS,
        "course-materials",
        (progress) => {
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        }
      );

      setMaterialUrl(result.url);
      console.log("Material uploaded successfully:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!materialUrl) return;

    try {
      await deleteFile(materialUrl);
      setMaterialUrl("");
      console.log("Material deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Training Materials *
      </label>

      {/* Current Material Display */}
      {materialUrl && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 text-sm font-medium">
                Current Material
              </span>
            </div>
            <button
              type="button"
              onClick={handleDeleteMaterial}
              disabled={loading}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-[10px] transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
          <a
            href={materialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Preview current material
          </a>
          <p className="text-green-600 text-xs mt-1">
            Tech professionals will be able to download this material after
            purchase
          </p>
        </div>
      )}

      {/* File Upload Input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,.xlsx,.csv"
        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        onChange={handleFileUpload}
        required
      />

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <div className="mt-2">
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
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-[10px]">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-3 h-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-blue-800 text-sm font-medium mb-1">
              For Tech Professionals
            </p>
            <p className="text-blue-700 text-sm">
              Upload training materials, course content, resources, or documents
              that tech professionals can view and download after purchasing
              this program.
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP, RAR, XLSX,
              CSV
            </p>
            {materialUrl && (
              <p className="text-blue-600 text-xs mt-2 font-medium">
                💡 Uploading a new file will replace the current material
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example: Image Upload for Product Icons
export const ImageUploadExample: React.FC = () => {
  const { uploadFile, deleteFile, loading, error, progress } =
    useFirebaseStorage();
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // If there's an existing image, delete it first
      if (imageUrl) {
        try {
          await deleteFile(imageUrl);
        } catch (deleteErr) {
          console.warn("Failed to delete old image:", deleteErr);
        }
      }

      // Upload new image
      const result = await uploadFile(
        file,
        STORAGE_FOLDERS.ASSETS,
        "product-icons",
        (progress) => {
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        }
      );

      setImageUrl(result.url);
      console.log("Image uploaded successfully:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Product Icon *
      </label>

      {/* Current Image Display */}
      {imageUrl && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
          <div className="flex items-center gap-4">
            <img
              src={imageUrl}
              alt="Product icon"
              className="w-16 h-16 object-cover rounded-[10px]"
            />
            <div className="flex-1">
              <p className="text-green-700 text-sm font-medium mb-1">
                Current Icon
              </p>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Preview image
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                deleteFile(imageUrl).then(() => setImageUrl(""));
              }}
              disabled={loading}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-[10px] transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* File Upload Input */}
      <input
        type="file"
        accept="image/*"
        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        onChange={handleImageUpload}
        required
      />

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <div className="mt-2">
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
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-[10px]">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

// Example: Direct API usage without hooks
export const DirectAPIExample: React.FC = () => {
  const [result, setResult] = useState<string>("");

  const handleDirectUpload = async () => {
    try {
      // Import the functions directly
      const { uploadFile, testCORS } = await import(
        "@/lib/firebase-storage-client"
      );

      // Test CORS first
      const corsOk = await testCORS();
      setResult(
        `CORS Status: ${corsOk ? "✅ Configured" : "❌ Not Configured"}`
      );

      // Create a test file
      const testFile = new File(["Hello World"], "test.txt", {
        type: "text/plain",
      });

      // Upload the file
      const uploadResult = await uploadFile(
        testFile,
        STORAGE_FOLDERS.ATTACHMENTS,
        "test-uploads"
      );

      setResult(
        (prev) =>
          prev + `\nUpload Result: ${JSON.stringify(uploadResult, null, 2)}`
      );
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Direct API Usage</h3>
      <button
        onClick={handleDirectUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700"
      >
        Test Direct Upload
      </button>
      {result && (
        <pre className="p-4 bg-gray-100 rounded-[10px] text-sm overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
};
