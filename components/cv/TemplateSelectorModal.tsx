"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Eye, X } from "lucide-react";
import Image from "next/image";

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: string) => void;
}

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout for conservative industries",
    preview: "/templates/classic-preview.jpg",
    popular: true,
    features: ["traditional", "professional", "serif", "structured-header"],
  },
  {
    id: "two-column",
    name: "Two Column",
    description:
      "Classic two-column layout perfect for experienced professionals",
    preview: "/templates/two-column-preview.jpg",
    popular: false,
    features: ["traditional", "professional", "serif", "structured-header"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with modern typography",
    preview: "/templates/modern-preview.jpg",
    popular: false,
    features: ["traditional", "professional", "serif", "structured-header"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design focusing on content and readability",
    preview: "/templates/minimal-preview.jpg",
    popular: false,
    features: ["traditional", "professional", "serif", "structured-header"],
  },
];

export default function TemplateSelectorModal({
  isOpen,
  onClose,
  onTemplateSelect,
}: TemplateSelectorModalProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Use the callback instead of navigating
    onTemplateSelect(templateId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Choose Your Template
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Template Selection */}
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white dark:bg-gray-800 rounded-[12px] shadow-lg border-2 transition-all cursor-pointer ${
                    selectedTemplate === template.id
                      ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                  onClick={() => handleTemplateClick(template.id)}
                >
                  <div className="p-4">
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-[10px] mb-3 flex items-center justify-center">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-[10px] h-48 mb-4 flex items-center justify-center">
                        <Image
                          src={template.preview}
                          alt={template.name}
                          width={300}
                          height={200}
                        />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
                      {template.description}
                    </p>

                    <div className="space-y-1">
                      {template.features.map(
                        (feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
