/**
 * PDF Scaling Utilities
 *
 * Ensures PDF output matches web preview size by scaling down from A4
 * to match typical web preview dimensions (800px width)
 */

// A4 dimensions in points (React PDF default)
export const A4_WIDTH = 595; // points
export const A4_HEIGHT = 842; // points

// Target web preview width (CSS pixels)
export const WEB_PREVIEW_WIDTH = 800; // pixels

// Scale factor to match web preview
export const PDF_SCALE_FACTOR = WEB_PREVIEW_WIDTH / A4_WIDTH; // ~1.34

/**
 * Scale a CSS pixel value to PDF points to match web preview
 * @param cssPixels - CSS pixel value from web preview
 * @returns Scaled value in PDF points
 */
export function scaleToPDF(cssPixels: number): number {
  return cssPixels * PDF_SCALE_FACTOR;
}

/**
 * Scale a PDF point value to CSS pixels for web preview
 * @param pdfPoints - PDF point value
 * @returns Scaled value in CSS pixels
 */
export function scaleToWeb(pdfPoints: number): number {
  return pdfPoints / PDF_SCALE_FACTOR;
}

/**
 * Get scaled page dimensions for PDF
 * @returns Object with scaled width and height
 */
export function getScaledPageDimensions() {
  return {
    width: A4_WIDTH,
    height: A4_HEIGHT,
    scale: PDF_SCALE_FACTOR,
  };
}

/**
 * Create consistent font sizes between web and PDF
 * @param webFontSize - Font size in CSS pixels
 * @returns Font size in PDF points
 */
export function getConsistentFontSize(webFontSize: number): number {
  return scaleToPDF(webFontSize);
}

/**
 * Create consistent padding/margins between web and PDF
 * @param webPadding - Padding in CSS pixels
 * @returns Padding in PDF points
 */
export function getConsistentPadding(webPadding: number): number {
  return scaleToPDF(webPadding);
}
