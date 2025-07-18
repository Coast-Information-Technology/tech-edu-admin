"use client";

import Image from "next/image";
import { useState } from "react";
import { CVData } from "@/types/cv-layout";

const layoutOptions = [
  {
    id: "cv_1",
    title: "Classic Professional",
    category: "Professional",
    description: "ATS-friendly format with clean, traditional layout",
    preview: "/templates/cv_1.webp",
    features: ["ATS Optimized", "Clean Design", "Professional"],
  },
  {
    id: "cv_2",
    title: "Modern Minimalist",
    category: "Modern",
    description: "Contemporary design with smart sectioning",
    preview: "/templates/cv_2.webp",
    features: ["Modern Layout", "Smart Sections", "Minimalist"],
  },
  {
    id: "cv_3",
    title: "Creative Portfolio",
    category: "Creative",
    description: "Perfect for design and creative industries",
    preview: "/templates/cv_3.webp",
    features: ["Creative Design", "Portfolio Style", "Visual Impact"],
  },
  {
    id: "cv_4",
    title: "Executive Summary",
    category: "Executive",
    description: "Leadership-focused with strategic positioning",
    preview: "/templates/cv_4.webp",
    features: ["Executive Style", "Leadership Focus", "Strategic"],
  },
  {
    id: "cv_5",
    title: "Technical Specialist",
    category: "Technical",
    description: "Ideal for IT, engineering, and technical roles",
    preview: "/templates/cv_5.webp",
    features: ["Technical Focus", "Skills Highlighted", "Project-Based"],
  },
  {
    id: "cv_6",
    title: "Academic Research",
    category: "Academic",
    description: "Research-focused with publications emphasis",
    preview: "/templates/cv_6.webp",
    features: ["Academic Style", "Research Focus", "Publications"],
  },
  {
    id: "cv_7",
    title: "Graduate Entry",
    category: "Graduate",
    description: "Perfect for recent graduates and entry-level positions",
    preview: "/templates/cv_7.webp",
    features: ["Graduate Focus", "Education Highlighted", "Entry-Level"],
  },
  {
    id: "cv_8",
    title: "International Standard",
    category: "International",
    description: "Adaptable across global markets and industries",
    preview: "/templates/cv_8.webp",
    features: ["Global Standard", "Industry Adaptable", "Professional"],
  },
  {
    id: "cv_9",
    title: "Compact One-Page",
    category: "Compact",
    description: "Condensed format for concise presentation",
    preview: "/templates/cv_9.webp",
    features: ["One-Page Format", "Concise", "Compact"],
  },
  {
    id: "cv_10",
    title: "Executive Leadership",
    category: "Executive",
    description: "Senior-level format with strategic achievements",
    preview: "/templates/cv_10.webp",
    features: ["Leadership Focus", "Strategic Achievements", "Executive"],
  },
];

// Font, color, and spacing options (from CVStep5)
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

export default function CVStep2({
  data,
  setData,
  onContinue,
  onBack,
}: {
  data: CVData;
  setData: (data: CVData) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [customColors, setCustomColors] = useState({
    primary: data.colors?.primary || "#1e40af",
    secondary: data.colors?.secondary || "#3b82f6",
    accent: data.colors?.accent || "#60a5fa",
  });

  const categories = [
    "all",
    ...Array.from(new Set(layoutOptions.map((layout) => layout.category))),
  ];

  const filteredLayouts = layoutOptions.filter((layout) => {
    const matchesCategory =
      selectedCategory === "all" || layout.category === selectedCategory;
    const matchesSearch =
      layout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layout.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle color scheme selection
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

  // Handle custom color picker
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
        <p className="text-xs md:text-sm text-gray-600">Step 2 of 7</p>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Layout & Design
        </h2>
        <p className="text-xs md:text-sm text-gray-600 mt-2">
          Choose your template, font, color scheme, and spacing. You can always
          change these later.
        </p>
      </div>

      {/* Template Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CV Template
        </label>
        {/* Search and Filter */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="sm:hidden px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm md:text-base"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <div className="hidden sm:flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 md:px-4 py-2 md:py-3 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setData({ ...data, layout: layout.id })}
              className={`group relative text-left border rounded-xl shadow-sm p-3 md:p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                (data.layout || "cv_1") === layout.id
                  ? "border-blue-600 ring-1 ring-blue-300 bg-blue-50"
                  : "hover:border-gray-400 hover:shadow-md"
              }`}
              aria-pressed={(data.layout || "cv_1") === layout.id}
              aria-label={`Select ${layout.title}`}
            >
              <div className="w-full h-32 md:h-48 relative mb-3 md:mb-4 bg-gray-100 rounded-[10px] overflow-hidden shadow-sm">
                <Image
                  src={layout.preview}
                  alt={`${layout.title} preview`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {(data.layout || "cv_1") === layout.id && (
                  <div className="absolute top-1 md:top-2 right-1 md:right-2 bg-blue-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                    {layout.title}
                  </h3>
                  <span className="text-xs px-1 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-600 rounded-full">
                    {layout.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {layout.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {layout.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-1 md:px-2 py-0.5 md:py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {layout.features.length > 2 && (
                    <span className="text-xs px-1 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{layout.features.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        {data.layout && (
          <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-[10px]">
            <h3 className="font-semibold text-blue-900 mb-1 md:mb-2 text-sm md:text-base">
              Selected Template:{" "}
              {layoutOptions.find((l) => l.id === data.layout)?.title}
            </h3>
            <p className="text-xs md:text-sm text-blue-800">
              {layoutOptions.find((l) => l.id === data.layout)?.description}
            </p>
          </div>
        )}
      </div>

      {/* Font, Color, and Spacing Controls */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
        {/* Color Scheme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          {/* Custom Color Picker */}
          {data.colors?.isCustom && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Primary
                </label>
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) =>
                    handleCustomColorChange("primary", e.target.value)
                  }
                  className="w-full h-8 rounded-md border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Secondary
                </label>
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) =>
                    handleCustomColorChange("secondary", e.target.value)
                  }
                  className="w-full h-8 rounded-md border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Accent
                </label>
                <input
                  type="color"
                  value={customColors.accent}
                  onChange={(e) =>
                    handleCustomColorChange("accent", e.target.value)
                  }
                  className="w-full h-8 rounded-md border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
        {/* Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

      {/* Navigation Buttons */}
      <div className="mt-6 md:mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs md:text-sm text-gray-600 underline hover:text-gray-800"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!data.layout}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-3 rounded-md shadow transition"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}
