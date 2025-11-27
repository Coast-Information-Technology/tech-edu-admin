"use client";

/**
 * DynamicPdfRenderer
 *
 * A clean, simplified component that routes to dedicated PDF template renderers.
 * This provides a consistent interface while delegating actual rendering
 * to specialized components for better maintainability and performance.
 */

import React from "react";
import { Document, Text } from "@react-pdf/renderer";
import { TemplateLayout } from "@/types/cv/template";
import { registerPDFFonts } from "@/utils/cv/fontUtils";
import { ClassicTemplatePdfRenderer } from "@/components/cv/renderers/ClassicTemplatePdfRenderer";
import { MinimalTemplatePdfRenderer } from "@/components/cv/renderers/MinimalTemplatePdfRenderer";
import { ModernTemplatePdfRenderer } from "@/components/cv/renderers/ModernTemplatePdfRenderer";
import { TwoColumnTemplatePdfRenderer } from "@/components/cv/renderers/TwoColumnTemplatePdfRenderer";
import { ResumeSection } from "@/types/cv/index";
import { templateManager } from "@/lib/cv/templates/templateManager";

interface DynamicPdfRendererProps {
  data: ResumeSection[];
  templateId: string;
  templateConfig?: TemplateLayout; // Live template configuration
  leftColumnSections?: string[];
}

export default function DynamicPdfRenderer({
  data,
  templateId,
  templateConfig,
  leftColumnSections,
}: DynamicPdfRendererProps) {
  // Register fonts before rendering
  registerPDFFonts();

  // Use live template configuration if available, otherwise fall back to template manager
  const template = templateConfig || templateManager.getTemplate(templateId);

  if (!template) {
    return (
      <Document>
        <Text>Template not found: {templateId}</Text>
      </Document>
    );
  }

  // Use dedicated template renderers for consistent styling and functionality
  switch (templateId) {
    case "classic":
      return <ClassicTemplatePdfRenderer data={data} template={template} />;

    case "minimal":
      return <MinimalTemplatePdfRenderer data={data} template={template} />;

    case "modern":
      return (
        <ModernTemplatePdfRenderer
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

    case "two-column":
      return <TwoColumnTemplatePdfRenderer data={data} template={template} />;

    default:
      return (
        <Document>
          <Text>Unsupported template: {templateId}</Text>
        </Document>
      );
  }
}
