"use client";

import { useState } from "react";
import { Menu, X, Save, Upload, Send, Download, Target } from "lucide-react";

interface MobileActionMenuProps {
  onSaveDraft?: () => void;
  onLoadCV?: () => void;
  onPublishCV?: () => void;
  onExportPDF: () => void;
  onShowJobMatch?: () => void;
  isSaving?: boolean;
  isLoading?: boolean;
  isExporting: boolean;
}

export default function MobileActionMenu({
  onSaveDraft,
  onLoadCV,
  onPublishCV,
  onExportPDF,
  onShowJobMatch,
  isSaving = false,
  isLoading = false,
  isExporting = false,
}: MobileActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    // CV Management actions - Only Save Draft and Publish CV
    ...(onSaveDraft
      ? [
          {
            id: "save-draft",
            label: "Save Draft",
            icon: Save,
            onClick: onSaveDraft,
            disabled: isSaving || isLoading,
            color: "text-gray-600 dark:text-gray-300",
            bgColor: "hover:bg-gray-100 dark:hover:bg-gray-700",
          },
        ]
      : []),
    // ...(onLoadCV
    //   ? [
    //       {
    //         id: "load-cv",
    //         label: "Load CV",
    //         icon: Upload,
    //         onClick: onLoadCV,
    //         disabled: isLoading,
    //         color: "text-indigo-600 dark:text-indigo-400",
    //         bgColor: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
    //       },
    //     ]
    //   : []),
    ...(onPublishCV
      ? [
          {
            id: "publish-cv",
            label: "Publish",
            icon: Send,
            onClick: onPublishCV,
            disabled: isSaving || isLoading,
            color: "text-green-600 dark:text-green-400",
            bgColor: "hover:bg-green-100 dark:hover:bg-green-900/30",
          },
        ]
      : []),
    ...(onShowJobMatch
      ? [
          {
            id: "job-match",
            label: "Job Match",
            icon: Target,
            onClick: onShowJobMatch,
            disabled: false,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
          },
        ]
      : []),
    {
      id: "export-pdf",
      label: "Export PDF",
      icon: Download,
      onClick: onExportPDF,
      disabled: isExporting,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
  ].filter((action) => action.onClick);

  return (
    <div className="lg:hidden relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-[10px] transition-colors duration-200"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[900]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-[12px] shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2">
            {actions.map((action) => {
              const Icon = action.icon;
              const loading =
                (action.id.includes("save") || action.id.includes("publish")) &&
                isSaving;
              const loadingText = loading ? "Saving..." : action.label;

              return (
                <button
                  key={action.id}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  disabled={action.disabled}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${action.color} ${action.bgColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{loadingText}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
