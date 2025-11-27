"use client";

import React, { memo, useMemo } from "react";
import TemplateRenderer from "@/components/cv/dynamic/TemplateRenderer";
import { ResumeSection } from "@/types/cv/index";
import { MemoizedComponentProps } from "@/types/cv/cv-builder";

interface MemoizedTemplateRendererProps extends MemoizedComponentProps {
  mode: "preview" | "pdf";
  className?: string;
  leftColumnSections?: string[];
}

const MemoizedTemplateRenderer = memo<MemoizedTemplateRendererProps>(
  ({
    data,
    templateId,
    templateConfig,
    mode,
    className,
    leftColumnSections,
    dependencies = [],
  }) => {
    // Memoize the template renderer based on dependencies
    const memoizedRenderer = useMemo(() => {
      return (
        <TemplateRenderer
          data={data}
          templateId={templateId}
          mode={mode}
          className={className}
          templateConfig={templateConfig}
          leftColumnSections={leftColumnSections}
        />
      );
    }, [data, templateId, templateConfig, mode, className, ...dependencies]);

    return memoizedRenderer;
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
      prevProps.templateId === nextProps.templateId &&
      prevProps.mode === nextProps.mode &&
      prevProps.className === nextProps.className &&
      JSON.stringify(prevProps.templateConfig) ===
        JSON.stringify(nextProps.templateConfig) &&
      JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
      JSON.stringify(prevProps.dependencies) ===
        JSON.stringify(nextProps.dependencies)
    );
  }
);

MemoizedTemplateRenderer.displayName = "MemoizedTemplateRenderer";

export default MemoizedTemplateRenderer;
