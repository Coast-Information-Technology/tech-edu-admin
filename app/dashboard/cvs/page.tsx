"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Download, Calendar, Tag } from "lucide-react";
import { getTokenFromCookies } from "@/lib/cookies";
import DynamicTemplateRenderer from "@/components/cv/dynamic/DynamicTemplateRenderer";
import { templateManager } from "@/lib/cv/templates/templateManager";
import { pdf } from "@react-pdf/renderer";
import DynamicPdfRenderer from "@/components/cv/dynamic/DynamicPdfRenderer";

interface CV {
  _id: string;
  userId: string;
  title: string;
  template: string; // Changed from templateId to template
  theme: {
    primary: string;
    secondary: string;
    font: string;
    spacing: number;
  };
  privacy: {
    visibility: string;
    shareSlug: string | null;
    allowDownload: boolean;
  };
  consent: {
    aiProcessing: boolean;
    aiTraining: boolean;
  };
  tags: string[];
  isDeleted: boolean;
  deletedAt: string | null;
  version: number;
  previousVersions: any[];
  previewImage?: string; // Base64 or URL of the preview image
  sections?: any[]; // CV sections data for rendering
  createdAt: string;
  updatedAt: string;
}

interface CVsResponse {
  success: boolean;
  message: string;
  data: CV[];
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export default function CVsPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // First, get the list of CVs
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch CVs: ${response.status}`);
      }

      const data: CVsResponse = await response.json();
      console.log("📋 CVs API Response:", data);
      console.log("📋 CVs Data:", data.data);

      // Fetch detailed data for each CV to get sections
      const cvsWithSections = await Promise.all(
        data.data.map(async (cv) => {
          try {
            const cvResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cv._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (cvResponse.ok) {
              const cvData = await cvResponse.json();
              console.log(`📄 CV ${cv._id} detailed data:`, cvData);
              return {
                ...cv,
                sections: cvData.data.sections || [],
                theme: cvData.data.theme || cv.theme,
              };
            } else {
              console.warn(`Failed to fetch details for CV ${cv._id}`);
              return cv;
            }
          } catch (err) {
            console.error(`Error fetching CV ${cv._id} details:`, err);
            return cv;
          }
        })
      );

      console.log("📋 CVs with sections:", cvsWithSections);
      setCvs(cvsWithSections);
    } catch (err) {
      console.error("Error fetching CVs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch CVs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push("/dashboard/cv-builder");
  };

  const handleEditCV = (cvId: string) => {
    router.push(`/dashboard/cvs/${cvId}`);
  };

  const handleViewCV = (cv: CV) => {
    // Navigate to the dynamic template builder with the CV data and correct template
    router.push(
      `/dashboard/cv-builder/${cv.template}?cvId=${cv._id}&mode=view`
    );
  };

  const handleDeleteCV = async (cvId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this CV? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cvId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete CV: ${response.status}`);
      }

      // Refresh the CVs list
      fetchCVs();
    } catch (err) {
      console.error("Error deleting CV:", err);
      setError(err instanceof Error ? err.message : "Failed to delete CV");
    }
  };

  const handleViewDraftCV = async () => {
    try {
      // Check if there's a saved draftId in localStorage
      const savedDraftId = localStorage.getItem("cvDraftId");

      if (!savedDraftId) {
        alert("No draft CV found. Create a new CV first.");
        return;
      }

      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Get the specific draft by ID
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/drafts/${savedDraftId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Draft not found, clear the saved draftId
          localStorage.removeItem("cvDraftId");
          alert("Draft CV not found. Create a new CV first.");
          return;
        }
        throw new Error(`Failed to fetch draft: ${response.status}`);
      }

      const draftData = await response.json();
      const draft = draftData.data;

      // Navigate to the draft CV builder
      router.push(
        `/dashboard/cv-builder/${draft.cvId || "classic"}?draftId=${draft._id}`
      );
    } catch (err) {
      console.error("Error fetching draft CV:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch draft CV");
    }
  };

  const handleDownloadPDF = async (cv: CV) => {
    if (!cv.sections || cv.sections.length === 0) {
      alert("No CV data available for PDF generation");
      return;
    }

    setDownloadingPdf(cv._id);
    try {
      // Register fonts before PDF generation
      const { registerPDFFonts } = await import("@/utils/cv/fontUtils");
      registerPDFFonts();

      const template = templateManager.getTemplate(cv.template || "classic");
      if (!template) {
        throw new Error("Template not found");
      }

      const blob = await pdf(
        <DynamicPdfRenderer
          data={cv.sections}
          templateId={cv.template || "classic"}
          templateConfig={template}
          leftColumnSections={
            template.columns.find((col) => col.id === "left")?.sections || []
          }
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.title || "resume"}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("PDF downloaded successfully");
    } catch (error: any) {
      console.error("PDF download failed:", error);
      alert(`PDF download failed: ${error.message || error}`);
    } finally {
      setDownloadingPdf(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CVs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-medium">Error loading CVs</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchCVs}
          className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
          <p className="text-gray-600 mt-1">
            Manage and edit your professional CVs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleViewDraftCV}
            className="px-4 py-2 border border-black text-black rounded-[10px] hover:shadow-md transition-colors"
          >
            View Draft CV
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 hover:shadow-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New CV</span>
          </button>
        </div>
      </div>

      {/* CVs Grid */}
      {cvs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first professional CV to get started.
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors"
          >
            Create Your First CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div
              key={cv._id}
              className="bg-white rounded-[12px] shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* CV Preview */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {(() => {
                  console.log("🔍 CV Preview Debug:", {
                    cvId: cv._id,
                    cvTitle: cv.title,
                    hasSections: !!cv.sections,
                    sectionsLength: cv.sections?.length || 0,
                    sections: cv.sections,
                  });
                  return null;
                })()}
                {cv.sections && cv.sections.length > 0 ? (
                  <div className="w-full h-full overflow-hidden">
                    <div className="transform scale-[0.3] origin-top-left w-[333%] h-[333%] overflow-hidden">
                      <DynamicTemplateRenderer
                        data={cv.sections}
                        templateId={cv.template || "classic"}
                        templateConfig={
                          templateManager.getTemplate(
                            cv.template || "classic"
                          ) || undefined
                        }
                        leftColumnSections={
                          templateManager
                            .getTemplate(cv.template || "classic")
                            ?.columns.find((col) => col.id === "left")
                            ?.sections || []
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Preview</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {cv.template || "classic"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CV Content */}
              <div className="p-6">
                {/* CV Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {cv.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>v{cv.version}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4" />
                        <span>{cv.tags.length} tags</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: cv.theme?.primary || "#3B82F6",
                      }}
                    ></div>
                  </div>
                </div>

                {/* CV Details */}
                {/* <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(cv.createdAt)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Updated:</span>{" "}
                    {formatDate(cv.updatedAt)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Privacy:</span>{" "}
                    {cv.privacy.visibility}
                  </div>
                </div> */}

                {/* Tags */}
                {/* {cv.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {cv.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {cv.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{cv.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )} */}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewCV(cv)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-[10px] hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(cv)}
                    disabled={downloadingPdf === cv._id}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-[10px] hover:bg-purple-200 transition-colors disabled:opacity-50"
                    title="Download PDF"
                  >
                    {downloadingPdf === cv._id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-purple-700 border-t-transparent rounded-full" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
