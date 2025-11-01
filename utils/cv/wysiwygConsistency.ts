/**
 * WYSIWYG Consistency Utilities
 *
 * Ensures perfect consistency between preview and PDF rendering
 * All styling, spacing, and layout should be identical
 */

import { TemplateLayout } from "@/types/cv/template";
import { mapFontFamily } from "./fontUtils";

/**
 * Creates consistent template styles for both preview and PDF
 * This ensures perfect WYSIWYG consistency
 */
export function createConsistentTemplateStyles(template: TemplateLayout) {
  return {
    // Layout properties
    width: template.styles.layout.pageWidth,
    height: template.styles.layout.pageHeight,
    borderRadius: `${template.styles.layout.borderRadius}px`,
    boxShadow: template.styles.layout.shadow,

    // Color properties (light mode only)
    backgroundColor: template.styles.colors.background,
    color: template.styles.colors.text,

    // Typography properties (unified font mapping)
    fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    fontSize: `${template.styles.typography.bodySize}px`,
    lineHeight: template.styles.typography.lineHeight,

    // Spacing properties
    padding: `${template.styles.spacing.padding}px`,
    margin: `${template.styles.spacing.margin}px`,

    // Print consistency
    pageBreakInside: "avoid" as any,
    breakInside: "avoid" as any,
  };
}

/**
 * Creates consistent section styles for both preview and PDF
 */
export function createConsistentSectionStyles(template: TemplateLayout) {
  return {
    marginBottom: `${template.styles.spacing.sectionGap}px`,
    pageBreakInside: "avoid" as any,
    breakInside: "avoid" as any,
  };
}

/**
 * Creates consistent column styles for both preview and PDF
 */
export function createConsistentColumnStyles(
  column: any,
  template: TemplateLayout
) {
  return {
    width: `${column.width}%`,
    minWidth: 0, // Allow flex shrinking
    flex: `0 0 ${column.width}%`, // Flex basis for better control
    padding: `${column.styles.padding}px`,
    backgroundColor: column.styles.backgroundColor,
    color: column.styles.textColor || template.styles.colors.text,
    borderRadius: column.styles.borderRadius
      ? `${column.styles.borderRadius}px`
      : "0px",
  };
}

/**
 * Creates consistent heading styles for both preview and PDF
 */
export function createConsistentHeadingStyles(
  template: TemplateLayout,
  isLeftColumn = false
) {
  const baseStyles = {
    fontSize: `${template.styles.typography.headingSize}px`,
    fontWeight: "bold" as const,
    marginBottom: `${template.styles.spacing.margin}px`,
    textTransform: "uppercase" as const,
    fontFamily: mapFontFamily(template.styles.typography.fontFamily),
  };

  if (isLeftColumn) {
    return {
      ...baseStyles,
      color: template.styles.colors.background,
    };
  }

  return {
    ...baseStyles,
    color: template.styles.colors.primary,
  };
}

/**
 * Creates consistent text styles for both preview and PDF
 */
export function createConsistentTextStyles(
  template: TemplateLayout,
  isLeftColumn = false
) {
  return {
    fontSize: `${template.styles.typography.bodySize}px`,
    lineHeight: template.styles.typography.lineHeight,
    fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    color: isLeftColumn
      ? template.styles.colors.background
      : template.styles.colors.text,
  };
}

/**
 * Validates WYSIWYG consistency between preview and PDF
 * This can be used for testing and debugging
 */
export function validateWYSIWYGConsistency(
  previewStyles: any,
  pdfStyles: any
): boolean {
  const criticalProperties = [
    "width",
    "height",
    "fontSize",
    "lineHeight",
    "fontFamily",
    "backgroundColor",
    "color",
    "padding",
    "margin",
  ];

  for (const prop of criticalProperties) {
    if (previewStyles[prop] !== pdfStyles[prop]) {
      console.warn(`WYSIWYG inconsistency detected in property: ${prop}`);
      console.warn(`Preview: ${previewStyles[prop]}`);
      console.warn(`PDF: ${pdfStyles[prop]}`);
      return false;
    }
  }

  return true;
}

/**
 * Gets consistent font options for template configuration
 * Only PDF-compatible fonts to ensure WYSIWYG consistency
 * @deprecated Use getConsistentFontOptions from fontUtils instead
 */
export function getConsistentFontOptions() {
  // Re-export from fontUtils to maintain backward compatibility
  const { getConsistentFontOptions: getFontOptions } = require("./fontUtils");
  return getFontOptions();
}

/**
 * Ensures all template colors are light-mode compatible
 * Removes any dark mode specific colors
 */
export function ensureLightModeColors(
  template: TemplateLayout
): TemplateLayout {
  return {
    ...template,
    styles: {
      ...template.styles,
      colors: {
        ...template.styles.colors,
        // Force light mode colors
        background: template.styles.colors.background || "#ffffff",
        text: template.styles.colors.text || "#000000",
        primary: template.styles.colors.primary || "#2563eb",
        secondary: template.styles.colors.secondary || "#6b7280",
        // Remove any dark mode specific colors
        ...(template.styles.colors as any),
      },
    },
  };
}
