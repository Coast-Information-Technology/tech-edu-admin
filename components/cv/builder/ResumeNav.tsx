"use client";

import { IoFileTrayStacked } from "react-icons/io5";
import {
  List,
  Palette,
  FileText,
  Save,
  Upload,
  Send,
  Download,
  Target,
  File,
} from "lucide-react";
import MobileActionMenu from "./MobileActionMenu";

interface ResumeNavProps {
  // Template and mode
  onChangeTemplate: () => void;
  builderMode: "content" | "customize";
  onToggleBuilderMode: () => void;

  // CV Management
  onCreateCV?: () => void;
  onUpdateCV?: () => void;
  onSaveDraft?: () => void;
  onPublishDraft?: () => void;
  onLoadCV?: () => void;
  onPublishCV?: () => void;

  // Export
  onExportPDF: () => void;
  onExportHTML2PDF?: () => void;

  // Job Match
  onShowJobMatch?: () => void;

  // Preview
  onPreview?: () => void; // NEW

  // State
  isSaving?: boolean;
  isLoading?: boolean;
  isExporting?: boolean;
  isCreating?: boolean;
  loading?: boolean;
  cvId?: string;
  error?: string | null;
}

export default function ResumeNav({
  onChangeTemplate,
  builderMode,
  onToggleBuilderMode,
  onCreateCV,
  onUpdateCV,
  onSaveDraft,
  onPublishDraft,
  onLoadCV,
  onPublishCV,
  onShowJobMatch,
  onExportPDF,
  onExportHTML2PDF,
  onPreview, // NEW
  isSaving = false,
  isLoading = false,
  isExporting = false,
  isCreating = false,
  loading = false,
  cvId,
  error,
}: ResumeNavProps) {
  return (
    <nav className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          {/* Template Button */}
          <button
            onClick={onChangeTemplate}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-[10px] transition-all duration-200 group"
          >
            <IoFileTrayStacked className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Change Template</span>
          </button>

          {/* Builder Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-[10px] p-1">
            <button
              onClick={onToggleBuilderMode}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 group ${
                builderMode === "content"
                  ? "bg-white dark:bg-gray-600 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <List className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline text-sm">Content</span>
            </button>
            <button
              onClick={onToggleBuilderMode}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 group ${
                builderMode === "customize"
                  ? "bg-white dark:bg-gray-600 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              <Palette className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline text-sm">Customize</span>
            </button>
          </div>

          {/* API buttons */}
          <div className="hidden lg:flex items-center space-x-1 pl-2 border-l border-gray-200 dark:border-gray-700">
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                disabled={isSaving || isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-[10px] transition-all duration-200 group"
              >
                <Save className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">
                  {isSaving ? "Saving..." : "Draft"}
                </span>
              </button>
            )}

            {onLoadCV && (
              <button
                onClick={onLoadCV}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 disabled:bg-indigo-50 dark:disabled:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300 rounded-[10px] transition-all duration-200 group"
              >
                <Upload className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">
                  {isLoading ? "Loading..." : "Load"}
                </span>
              </button>
            )}

            {onPublishCV && (
              <button
                onClick={onPublishCV}
                disabled={isSaving || isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 disabled:bg-green-50 dark:disabled:bg-green-900/10 text-green-700 dark:text-green-300 rounded-[10px] transition-all duration-200 group"
              >
                <Send className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">
                  {isSaving ? "Publishing..." : "Publish"}
                </span>
              </button>
            )}

            {/* NEW: Preview */}
            {onPreview && (
              <button
                onClick={onPreview}
                className="flex items-center space-x-2 px-3 py-2 bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-[10px] transition-all duration-200 group"
              >
                <File className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">Preview</span>
              </button>
            )}
          </div>

          {/* Job Match */}
          {onShowJobMatch && (
            <button
              onClick={onShowJobMatch}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-[10px] transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              <Target className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Job Match</span>
            </button>
          )}

          {/* Export PDF */}
          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-[10px] transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <Download className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
          </button>

          {/* Optional HTML2PDF */}
          {onExportHTML2PDF && (
            <button
              onClick={onExportHTML2PDF}
              disabled={isExporting}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white rounded-[10px] transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              <Download className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>{isExporting ? "Exporting..." : "HTML2PDF"}</span>
            </button>
          )}

          {/* Mobile menu (unchanged; add preview here later if desired) */}
          <MobileActionMenu
            onSaveDraft={onSaveDraft}
            onLoadCV={onLoadCV}
            onPublishCV={onPublishCV}
            onExportPDF={onExportPDF}
            isSaving={isSaving}
            isLoading={isLoading}
            isExporting={isExporting}
          />
        </div>
      </div>
    </nav>
  );
}
