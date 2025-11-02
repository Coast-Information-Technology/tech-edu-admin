"use client";

import React from "react";
import { ResumeSection } from "@/types/cv/index";
import { TemplateLayout } from "@/types/cv/template";
import DynamicTemplateRenderer from "./DynamicTemplateRenderer";
import DynamicPdfRenderer from "./DynamicPdfRenderer";

// All templates now use the dynamic system

interface TemplateRendererProps {
  data: ResumeSection[];
  templateId: string;
  mode: "preview" | "pdf";
  className?: string;
  templateConfig?: TemplateLayout; // Live template configuration
  leftColumnSections?: string[];
}

/**
 * Universal Template Renderer - All templates use the dynamic system
 */
export default function TemplateRenderer({
  data,
  templateId,
  mode,
  className = "",
  templateConfig,
  leftColumnSections,
}: TemplateRendererProps) {
  // All templates now use the dynamic system
  if (mode === "preview") {
    return (
      <DynamicTemplateRenderer
        data={data}
        templateId={templateId}
        templateConfig={templateConfig}
        leftColumnSections={leftColumnSections}
      />
    );
  } else {
    return (
      <DynamicPdfRenderer
        data={data}
        templateId={templateId}
        templateConfig={templateConfig}
        leftColumnSections={leftColumnSections}
      />
    );
  }
}

/**
 * Determines if a template uses the new dynamic system
 */
function isTemplateDynamic(templateId: string): boolean {
  // All templates now use the dynamic system
  return true;
}

/**
 * Hook to get template information and determine renderer
 */
export function useTemplateRenderer(templateId: string) {
  const isDynamic = isTemplateDynamic(templateId);

  return {
    isDynamic,
    renderer: "dynamic",
    supportsCustomization: true,
    supportsConfiguration: true,
  };
}

/**
 * Enhanced Template Renderer with Configuration Support
 */
export function ConfigurableTemplateRenderer({
  data,
  templateId,
  mode,
  className = "",
  templateConfig,
  showConfigButton = false,
  onConfigClick,
}: TemplateRendererProps & {
  showConfigButton?: boolean;
  onConfigClick?: () => void;
}) {
  const { isDynamic, supportsCustomization } = useTemplateRenderer(templateId);

  return (
    <div className="relative">
      {/* Configuration Button (only for dynamic templates) */}
      {isDynamic && showConfigButton && onConfigClick && (
        <button
          onClick={onConfigClick}
          className="absolute top-2 right-2 z-10 bg-blue-600 text-white px-3 py-1 rounded-[10px] text-sm hover:bg-blue-700 transition-colors"
        >
          Configure Template
        </button>
      )}

      {/* Template Renderer */}
      <TemplateRenderer
        data={data}
        templateId={templateId}
        mode={mode}
        className={className}
        templateConfig={templateConfig}
      />
    </div>
  );
}
