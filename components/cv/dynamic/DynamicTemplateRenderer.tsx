"use client";

/**
 * DynamicTemplateRenderer
 *
 * Renders HTML preview using Tailwind CSS for fast preview,
 * while PDF renderers are used only for actual PDF export.
 */

import React from "react";
import { TemplateLayout } from "@/types/cv/template";
import { ClassicTemplateHtmlRenderer } from "@/components/cv/renderers/ClassicTemplateHtmlRenderer";
import { MinimalTemplateHtmlRenderer } from "@/components/cv/renderers/MinimalTemplateHtmlRenderer";
import { ModernTemplateHtmlRenderer } from "@/components/cv/renderers/ModernTemplateHtmlRenderer";
import { TwoColumnTemplateHtmlRenderer } from "@/components/cv/renderers/TwoColumnTemplateHtmlRenderer";
import { ClassicTemplatePlaceholder } from "@/components/cv/renderers/ClassicTemplatePlaceholder";
import { MinimalTemplatePlaceholder } from "@/components/cv/renderers/MinimalTemplatePlaceholder";
import { ModernTemplatePlaceholder } from "@/components/cv/renderers/ModernTemplatePlaceholder";
import { TwoColumnTemplatePlaceholder } from "@/components/cv/renderers/TwoColumnTemplatePlaceholder";
import { ResumeSection } from "@/types/cv/index";
import { templateManager } from "@/lib/cv/templates/templateManager";

interface DynamicTemplateRendererProps {
  data: ResumeSection[];
  templateId: string;
  templateConfig?: TemplateLayout; // Live template configuration
  leftColumnSections?: string[];
}

export default function DynamicTemplateRenderer({
  data,
  templateId,
  templateConfig,
  leftColumnSections,
}: DynamicTemplateRendererProps) {
  // Use live template configuration if available, otherwise fall back to template manager
  const template = templateConfig || templateManager.getTemplate(templateId);

  if (!template) {
    return (
      <div className="bg-gray-100 flex justify-center items-center h-96">
        <p className="text-gray-500">Template not found: {templateId}</p>
      </div>
    );
  }

  // If no data, show placeholder
  if (!data || data.length === 0) {
    switch (templateId) {
      case "modern":
        return <ModernTemplatePlaceholder template={template} />;

      case "classic":
        return <ClassicTemplatePlaceholder template={template} />;

      case "minimal":
        return <MinimalTemplatePlaceholder template={template} />;

      case "two-column":
        return <TwoColumnTemplatePlaceholder template={template} />;

      default:
        return (
          <div className="bg-gray-100 flex justify-center items-center h-96">
            <p className="text-gray-500">No data available for preview</p>
          </div>
        );
    }
  }

  // Render HTML preview using Tailwind CSS
  switch (templateId) {
    case "modern":
      return (
        <ModernTemplateHtmlRenderer
          data={data}
          template={template}
          leftColumnSections={
            leftColumnSections || [
              "skills",
              "languages",
              "certifications",
              "awards",
            ]
          }
        />
      );

    case "classic":
      return <ClassicTemplateHtmlRenderer data={data} template={template} />;

    case "minimal":
      return <MinimalTemplateHtmlRenderer data={data} template={template} />;

    case "two-column":
      return <TwoColumnTemplateHtmlRenderer data={data} template={template} />;

    default:
      return (
        <div className="bg-gray-100 flex justify-center items-center h-96">
          <p className="text-gray-500">Unsupported template: {templateId}</p>
        </div>
      );
  }
}
