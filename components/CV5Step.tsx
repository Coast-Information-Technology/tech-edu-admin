"use client";

import { useState } from "react";
import { Palette, Type, Eye, Download, Edit3 } from "lucide-react";
import CVPreview from "./CVPreview";

const fontOptions = [
  { id: "inter", name: "Inter", category: "Modern", preview: "Inter" },
  { id: "roboto", name: "Roboto", category: "Clean", preview: "Roboto" },
  {
    id: "open-sans",
    name: "Open Sans",
    category: "Professional",
    preview: "Open Sans",
  },
  { id: "lato", name: "Lato", category: "Friendly", preview: "Lato" },
  { id: "poppins", name: "Poppins", category: "Modern", preview: "Poppins" },
  {
    id: "montserrat",
    name: "Montserrat",
    category: "Elegant",
    preview: "Montserrat",
  },
  { id: "raleway", name: "Raleway", category: "Clean", preview: "Raleway" },
  {
    id: "source-sans-pro",
    name: "Source Sans Pro",
    category: "Professional",
    preview: "Source Sans Pro",
  },
];

const colorSchemes = [
  {
    id: "professional-blue",
    name: "Professional Blue",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#60a5fa",
    preview: "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500",
  },
  {
    id: "modern-gray",
    name: "Modern Gray",
    primary: "#374151",
    secondary: "#6b7280",
    accent: "#9ca3af",
    preview: "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500",
  },
  {
    id: "elegant-navy",
    name: "Elegant Navy",
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    accent: "#93c5fd",
    preview: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700",
  },
  {
    id: "creative-purple",
    name: "Creative Purple",
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#c084fc",
    preview: "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400",
  },
  {
    id: "corporate-green",
    name: "Corporate Green",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#34d399",
    preview: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400",
  },
  {
    id: "warm-orange",
    name: "Warm Orange",
    primary: "#ea580c",
    secondary: "#f97316",
    accent: "#fb923c",
    preview: "bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400",
  },
  {
    id: "minimal-black",
    name: "Minimal Black",
    primary: "#111827",
    secondary: "#374151",
    accent: "#6b7280",
    preview: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
  },
  {
    id: "custom",
    name: "Custom Colors",
    primary: "#000000",
    secondary: "#666666",
    accent: "#999999",
    preview: "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200",
  },
];

const spacingOptions = [
  {
    id: "compact",
    name: "Compact",
    description: "Tight spacing for maximum content",
    value: 0.8,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Balanced spacing for readability",
    value: 1.0,
  },
  {
    id: "comfortable",
    name: "Comfortable",
    description: "Generous spacing for easy reading",
    value: 1.2,
  },
  {
    id: "spacious",
    name: "Spacious",
    description: "Maximum spacing for premium feel",
    value: 1.4,
  },
];

export default function CVStep5({
  data,
  setData,
  onContinue,
  onBack,
}: {
  data: any;
  setData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState("preview");
  const [customColors, setCustomColors] = useState({
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#60a5fa",
  });

  const handleContinue = () => {
    onContinue();
  };

  const handleColorChange = (colorScheme: any) => {
    if (colorScheme.id === "custom") {
      setData({
        ...data,
        colors: {
          ...customColors,
          isCustom: true,
        },
      });
    } else {
      setData({
        ...data,
        colors: {
          primary: colorScheme.primary,
          secondary: colorScheme.secondary,
          accent: colorScheme.accent,
          isCustom: false,
        },
      });
    }
  };

  const handleCustomColorChange = (type: string, value: string) => {
    const newColors = { ...customColors, [type]: value };
    setCustomColors(newColors);
    setData({
      ...data,
      colors: {
        ...newColors,
        isCustom: true,
      },
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-10">
        <p className="text-xs md:text-sm text-gray-600">Step 5 of 5</p>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Review & Customize Your CV
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Review your CV and customize the appearance before generating the
          final version.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-[10px]">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Eye size={14} className="md:w-4 md:h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab("fonts")}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              activeTab === "fonts"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Type size={14} className="md:w-4 md:h-4" />
            <span>Fonts</span>
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              activeTab === "colors"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Palette size={14} className="md:w-4 md:h-4" />
            <span>Colors</span>
          </button>
        </div>
      </div>

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-[10px] shadow-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                CV Preview
              </h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="flex items-center justify-center space-x-1 md:space-x-2 px-3 py-2 text-xs md:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <Edit3 size={12} className="md:w-3.5 md:h-3.5" />
                  <span>Edit Content</span>
                </button>
                <button className="flex items-center justify-center space-x-1 md:space-x-2 px-3 py-2 text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  <Download size={12} className="md:w-3.5 md:h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* CV Preview Component */}
            <div className="border rounded-[10px] overflow-hidden">
              <CVPreview data={data} />
            </div>
          </div>

          {/* Quick Customization */}
          <div className="bg-gray-50 rounded-[10px] p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Quick Customization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Font Family
                </label>
                <select
                  value={data.font || "inter"}
                  onChange={(e) => setData({ ...data, font: e.target.value })}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {fontOptions.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Color Scheme
                </label>
                <select
                  value={data.colors?.primary || "#1e40af"}
                  onChange={(e) => {
                    const scheme = colorSchemes.find(
                      (c) => c.primary === e.target.value
                    );
                    if (scheme) handleColorChange(scheme);
                  }}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {colorSchemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.primary}>
                      {scheme.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Spacing
                </label>
                <select
                  value={data.spacing || "standard"}
                  onChange={(e) => {
                    const spacing = spacingOptions.find(
                      (s) => s.id === e.target.value
                    );
                    if (spacing) {
                      setData({
                        ...data,
                        spacing: spacing.id,
                        spacingValue: spacing.value,
                      });
                    }
                  }}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {spacingOptions.map((spacing) => (
                    <option key={spacing.id} value={spacing.id}>
                      {spacing.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fonts Tab */}
      {activeTab === "fonts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => setData({ ...data, font: font.id })}
                className={`p-4 border rounded-[10px] text-left transition-all ${
                  (data.font || "inter") === font.id
                    ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className="text-lg font-medium mb-2"
                  style={{
                    fontFamily:
                      font.id === "inter"
                        ? "Inter, sans-serif"
                        : font.id === "roboto"
                        ? "Roboto, sans-serif"
                        : font.id === "open-sans"
                        ? "Open Sans, sans-serif"
                        : font.id === "lato"
                        ? "Lato, sans-serif"
                        : font.id === "poppins"
                        ? "Poppins, sans-serif"
                        : font.id === "montserrat"
                        ? "Montserrat, sans-serif"
                        : font.id === "raleway"
                        ? "Raleway, sans-serif"
                        : "Source Sans Pro, sans-serif",
                  }}
                >
                  {font.preview}
                </div>
                <p className="text-sm text-gray-600">{font.name}</p>
                <span className="text-xs text-gray-500">{font.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => handleColorChange(scheme)}
                className={`p-4 border rounded-[10px] text-left transition-all ${
                  (data.colors?.primary || "#1e40af") === scheme.primary
                    ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-full h-12 rounded-md mb-3 ${scheme.preview}`}
                ></div>
                <p className="text-sm font-medium text-gray-900">
                  {scheme.name}
                </p>
                <div className="flex space-x-1 mt-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: scheme.primary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: scheme.secondary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: scheme.accent }}
                  ></div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          {data.colors?.isCustom && (
            <div className="mt-8 p-6 bg-gray-50 rounded-[10px]">
              <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) =>
                      handleCustomColorChange("primary", e.target.value)
                    }
                    className="w-full h-10 rounded-md border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) =>
                      handleCustomColorChange("secondary", e.target.value)
                    }
                    className="w-full h-10 rounded-md border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={customColors.accent}
                    onChange={(e) =>
                      handleCustomColorChange("accent", e.target.value)
                    }
                    className="w-full h-10 rounded-md border border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-md shadow transition"
        >
          Generate CV →
        </button>
      </div>
    </section>
  );
}
