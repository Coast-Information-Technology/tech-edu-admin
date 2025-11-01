"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Sparkles, Download, Eye } from "lucide-react";
import Link from "next/link";
import CVBuilderMain from "@/components/cv/builder/CVBuilderMain";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CVBuilderState } from "@/types/cv/cv-builder";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { STORAGE_FOLDERS } from "@/lib/firebase-storage-client";

export default function ResumeBuilder() {
  const [dragActive, setDragActive] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
    size: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();
  const { uploadFile, loading, error, progress } = useFirebaseStorage();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadAndLog = async (file: File) => {
    setUploadStatus("uploading");
    setUploadError(null);

    try {
      const result = await uploadFile(
        file,
        STORAGE_FOLDERS.ATTACHMENTS,
        "cv-uploads"
      );

      console.log("✅ Uploaded file URL:", result.url);
      console.log("ℹ️ Uploaded path:", result.path);

      // Store upload success data
      setUploadedFile({
        name: file.name,
        url: result.url,
        size: file.size,
      });
      setUploadStatus("success");

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setUploadStatus("idle");
      }, 5000);
    } catch (e) {
      console.error("❌ Upload failed:", e);
      setUploadError(
        e instanceof Error ? e.message : "Upload failed. Please try again."
      );
      setUploadStatus("error");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      uploadAndLog(file);
    }
  };

  const handleStartFromScratch = () => {
    // Route to template selection page
    router.push(`/dashboard/cv-builder/template-selection`);
  };

  // If user has chosen to start building, show the CVBuilderMain
  if (showBuilder) {
    return (
      <ErrorBoundary>
        <CVBuilderMain
          autoSaveConfig={{
            enabled: false, // Disabled - no more auto-save
            interval: 20000, // 20 seconds
            debounceDelay: 500, // 0.5 seconds
            onSave: async (state: CVBuilderState) => {
              try {
                console.log("Auto-saving state:", state);
                // TODO: Implement secure auto-save to CV and draft endpoints
                console.log("Auto-save successful");
              } catch (error) {
                console.error("Auto-save failed:", error);
                throw error;
              }
            },
          }}
          onStateChange={(state: CVBuilderState) => {
            // Handle state changes if needed
            console.log("State changed:", state);
          }}
          onSave={async (state: CVBuilderState) => {
            try {
              // TODO: Implement secure manual save to CV and draft endpoints
              console.log("Manual save successful:", state);
            } catch (error) {
              console.error("Manual save failed:", error);
              throw error;
            }
          }}
          onLoad={async (id: string) => {
            try {
              console.log("onLoad called with id:", id);
              // TODO: Load from secure CV endpoint
              console.log("No saved state found, using defaults");
              return {};
            } catch (error) {
              console.error("Load failed:", error);
              return {};
            }
          }}
          onExport={async (state: CVBuilderState) => {
            try {
              console.log("Exporting CV:", state);
              // TODO: Implement PDF/DOCX export
              console.log("Export successful");
            } catch (error) {
              console.error("Export failed:", error);
              throw error;
            }
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Professional CV
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Build a stunning resume that gets you noticed by employers. Choose
            from our professional templates and create your CV in minutes.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-[10px] p-12 text-center mb-8 transition-colors ${
              uploadStatus === "uploading"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : uploadStatus === "success"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : uploadStatus === "error"
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadStatus === "uploading" ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Uploading CV...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please wait while we upload your file
                </p>
                {progress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </>
            ) : uploadStatus === "success" && uploadedFile ? (
              <>
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                  CV Uploaded Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <strong>{uploadedFile.name}</strong> (
                  {formatFileSize(uploadedFile.size)})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Your CV has been uploaded and is ready for processing
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setUploadStatus("idle")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-[10px] hover:bg-gray-700 transition-colors"
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Process the uploaded CV and navigate to template selection
                      console.log("Process CV with URL:", uploadedFile.url);
                      router.push(`/dashboard/cv-builder/template-selection`);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700 transition-colors"
                  >
                    Continue to Template Selection
                  </button>
                </div>
              </>
            ) : uploadStatus === "error" ? (
              <>
                <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                  Upload Failed
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {uploadError || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={() => setUploadStatus("idle")}
                  className="px-6 py-2 bg-red-600 text-white rounded-[10px] hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </>
            ) : (
              <>
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Your Existing CV
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Drag and drop your CV file here, or click to browse
                </p>
                <button
                  onClick={() => document.getElementById("cv-upload")?.click()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
              </>
            )}

            <input
              id="cv-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  uploadAndLog(file);
                }
              }}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start from Scratch */}
            <div className="bg-white dark:bg-gray-800 rounded-[10px] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Start from Scratch
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create a new CV using our professional templates
                </p>
                <button
                  onClick={handleStartFromScratch}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors"
                >
                  Choose Template
                </button>
              </div>
            </div>

            {/* AI-Powered Builder */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-[10px] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Powered Builder
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Let AI help you create the perfect CV
                </p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-[10px] hover:bg-purple-700 transition-colors"
                >
                  Start with AI
                </button>
              </div>
            </div> */}
          </div>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Live Preview
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                See your CV as you build it with real-time preview
              </p>
            </div>
            <div className="text-center">
              <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Formats
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Export your CV in PDF, DOCX, and HTML formats
              </p>
            </div>
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                AI Suggestions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get AI-powered suggestions to improve your CV
              </p>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
