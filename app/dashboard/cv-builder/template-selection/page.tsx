"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout for conservative industries",
    preview: "/templates/classic-preview.jpg",
    popular: true,
  },
  {
    id: "two-column",
    name: "Two Column",
    description:
      "Classic two-column layout perfect for experienced professionals",
    preview: "/templates/two-column-preview.jpg",
    popular: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with modern typography",
    preview: "/templates/modern-preview.jpg",
    popular: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design focusing on content and readability",
    preview: "/templates/minimal-preview.jpg",
    popular: false,
  },
];

export default function TemplateSelection() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to the CV builder with selected template, starting a fresh CV
    router.push(`/dashboard/cv-builder/${selectedTemplate}?new=1`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard/cv-builder"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to CV Builder
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Template
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a professional template that best represents your style and
            industry. You can always change it later.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedTemplate === template.id
                  ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Popular
                </div>
              )}

              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="p-6">
                {/* Template Preview */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-[10px] h-48 mb-4 flex items-center justify-center">
                  <Image
                    src={template.preview}
                    alt={template.name}
                    width={300}
                    height={200}
                  />
                </div>

                {/* Template Info */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-[10px] transition-colors text-lg"
          >
            Continue with{" "}
            {templates.find((t) => t.id === selectedTemplate)?.name}
          </button>
        </div>
      </div>
    </div>
  );
}
