/**
 * Consolidated Font Utilities for CV Builder
 *
 * Combines font registration, mapping, and styling into a single utility
 * Aligns with SimpleTemplateConfig font options for consistency
 */

import { Font } from "@react-pdf/renderer";

// Font registration status
let fontsRegistered = false;

// React PDF supported fonts (built-in, no registration needed)
export const PDF_SUPPORTED_FONTS = {
  HELVETICA: "Helvetica",
  TIMES_ROMAN: "Times-Roman",
  COURIER: "Courier",
  HELVETICA_BOLD: "Helvetica-Bold",
  TIMES_BOLD: "Times-Bold",
  COURIER_BOLD: "Courier-Bold",
  HELVETICA_OBLIQUE: "Helvetica-Oblique",
  TIMES_ITALIC: "Times-Italic",
  COURIER_OBLIQUE: "Courier-Oblique",
  HELVETICA_BOLD_OBLIQUE: "Helvetica-BoldOblique",
  TIMES_BOLD_ITALIC: "Times-BoldItalic",
  COURIER_BOLD_OBLIQUE: "Courier-BoldOblique",
} as const;

// Font options for SimpleTemplateConfig (matches getConsistentFontOptions)
export const FONT_OPTIONS = [
  {
    value: "Helvetica, sans-serif",
    label: "Helvetica",
    description: "Clean, modern sans-serif font",
    category: "sans-serif",
    pdfCompatible: true,
  },
  {
    value: "Times-Roman, serif",
    label: "Times Roman",
    description: "Classic, professional serif font",
    category: "serif",
    pdfCompatible: true,
  },
  {
    value: "Courier, monospace",
    label: "Courier",
    description: "Fixed-width font for technical content",
    category: "monospace",
    pdfCompatible: true,
  },
] as const;

// Unified font mapping - maps web fonts to PDF fonts
export const FONT_MAPPING: { [key: string]: string } = {
  // Primary fonts (used in templates)
  "Helvetica, sans-serif": "Helvetica",
  "Times-Roman, serif": "Times-Roman",
  "Courier, monospace": "Courier",

  // Fallback mappings for legacy fonts
  "Inter, sans-serif": "Helvetica",
  "Arial, sans-serif": "Helvetica",
  "Georgia, serif": "Times-Roman",
  "Times New Roman, serif": "Times-Roman",
  "Courier New, monospace": "Courier",

  // Generic font families
  "sans-serif": "Helvetica",
  serif: "Times-Roman",
  monospace: "Courier",

  // System fonts
  "system-ui, sans-serif": "Helvetica",
  "-apple-system, BlinkMacSystemFont, sans-serif": "Helvetica",
  "Consolas, monospace": "Courier",
  "Monaco, monospace": "Courier",
  "Palatino, serif": "Times-Roman",

  // PDF native fonts (pass through)
  Helvetica: "Helvetica",
  "Times-Roman": "Times-Roman",
  Courier: "Courier",
} as const;

/**
 * Register fonts with React PDF
 * Uses built-in fonts for reliability
 */
export function registerPDFFonts(): void {
  if (fontsRegistered) {
    return;
  }

  // React PDF has built-in fonts that don't need registration:
  // - Helvetica (default)
  // - Times-Roman
  // - Courier
  // - Helvetica-Bold
  // - Times-Bold
  // - Courier-Bold
  // - And their oblique/italic variants

  console.log("✅ Using built-in React PDF fonts for reliable PDF generation");
  fontsRegistered = true;
}

/**
 * Map web font family to PDF-compatible font
 * Ensures WYSIWYG consistency between preview and PDF
 */
export function mapFontFamily(fontFamily: string): string {
  // Clean up the font family string
  const cleanFontFamily = fontFamily.trim();

  // Direct mapping using unified mapping
  if (FONT_MAPPING[cleanFontFamily]) {
    return FONT_MAPPING[cleanFontFamily];
  }

  // Fallback: check if it contains known font families
  const lowerFontFamily = cleanFontFamily.toLowerCase();

  if (
    lowerFontFamily.includes("helvetica") ||
    lowerFontFamily.includes("arial")
  ) {
    return PDF_SUPPORTED_FONTS.HELVETICA;
  }

  if (
    lowerFontFamily.includes("times") ||
    lowerFontFamily.includes("georgia")
  ) {
    return PDF_SUPPORTED_FONTS.TIMES_ROMAN;
  }

  if (lowerFontFamily.includes("courier") || lowerFontFamily.includes("mono")) {
    return PDF_SUPPORTED_FONTS.COURIER;
  }

  // Default fallback
  return PDF_SUPPORTED_FONTS.HELVETICA;
}

/**
 * Get PDF font with weight and style variants
 * Handles bold, italic, and oblique combinations
 */
export function getPDFFontWithStyle(
  baseFont: string,
  weight: number | "normal" | "bold" = "normal",
  style: "normal" | "italic" = "normal"
): string {
  const normalizedWeight =
    typeof weight === "number" ? (weight >= 600 ? "bold" : "normal") : weight;
  const mappedFont = mapFontFamily(baseFont);

  if (mappedFont.includes("Helvetica")) {
    if (normalizedWeight === "bold" && style === "italic")
      return PDF_SUPPORTED_FONTS.HELVETICA_BOLD_OBLIQUE;
    if (normalizedWeight === "bold") return PDF_SUPPORTED_FONTS.HELVETICA_BOLD;
    if (style === "italic") return PDF_SUPPORTED_FONTS.HELVETICA_OBLIQUE;
    return PDF_SUPPORTED_FONTS.HELVETICA;
  }

  if (mappedFont.includes("Times")) {
    if (normalizedWeight === "bold" && style === "italic")
      return PDF_SUPPORTED_FONTS.TIMES_BOLD_ITALIC;
    if (normalizedWeight === "bold") return PDF_SUPPORTED_FONTS.TIMES_BOLD;
    if (style === "italic") return PDF_SUPPORTED_FONTS.TIMES_ITALIC;
    return PDF_SUPPORTED_FONTS.TIMES_ROMAN;
  }

  if (mappedFont.includes("Courier")) {
    if (normalizedWeight === "bold" && style === "italic")
      return PDF_SUPPORTED_FONTS.COURIER_BOLD_OBLIQUE;
    if (normalizedWeight === "bold") return PDF_SUPPORTED_FONTS.COURIER_BOLD;
    if (style === "italic") return PDF_SUPPORTED_FONTS.COURIER_OBLIQUE;
    return PDF_SUPPORTED_FONTS.COURIER;
  }

  return mappedFont; // fallback
}

/**
 * Get safe PDF font (alias for mapFontFamily for backward compatibility)
 */
export function getSafePDFFont(fontFamily: string): string {
  registerPDFFonts();
  return mapFontFamily(fontFamily);
}

/**
 * Get font options for template configuration
 * Matches SimpleTemplateConfig requirements
 */
export function getFontOptions() {
  return FONT_OPTIONS;
}

/**
 * Get consistent font options (alias for getFontOptions for backward compatibility)
 */
export function getConsistentFontOptions() {
  return getFontOptions();
}

/**
 * Check if fonts are registered
 */
export function areFontsRegistered(): boolean {
  return fontsRegistered;
}

/**
 * Validate if a font family is PDF compatible
 * All fonts in our system are now PDF-compatible
 */
export function isPDFCompatible(fontFamily: string): boolean {
  return true;
}

/**
 * Get PDF font for a given web font (returns only PDF font name)
 * Used by PDF renderer to ensure consistency with preview
 */
export function getPDFFont(fontFamily: string): string {
  return mapFontFamily(fontFamily);
}

/**
 * Unified font mapping for both preview and PDF
 * Ensures perfect WYSIWYG consistency
 */
export function getUnifiedFont(fontFamily: string): string {
  return mapFontFamily(fontFamily);
}
