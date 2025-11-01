/**
 * Template Constants
 *
 * Standardized spacing, sizing, and styling constants for all template renderers.
 * These are shared by both HTML and PDF renderers.
 */

// Spacing Constants (in pixels)
export const SPACING = {
  // Margins
  xs: 4, // 1 unit
  sm: 8, // 2 units
  md: 12, // 3 units
  lg: 16, // 4 units
  xl: 20, // 5 units
  xxl: 24, // 6 units
  xxxl: 32, // 8 units

  // Padding
  paddingXs: 4,
  paddingSm: 8,
  paddingMd: 12,
  paddingLg: 16,
  paddingXl: 20,
  paddingXxl: 24,
  paddingXxxl: 32,
} as const;

// Font Sizes (in pixels)
export const FONT_SIZES = {
  // PDF Font Sizes (smaller for A4; only used if you choose to)
  pdf: {
    page: 10,
    name: 24,
    title: 16,
    heading: 12,
    body: 10,
    small: 8,
    contact: 9,
    skill: 7,
  },

  // HTML Font Sizes (larger for web / preview)
  html: {
    name: 48, // ~Tailwind text-5xl
    title: 24, // ~Tailwind text-2xl
    heading: 18, // ~Tailwind text-lg
    body: 14, // ~Tailwind text-sm
    small: 12, // ~Tailwind text-xs
    contact: 12, // ~Tailwind text-xs
    skill: 12, // ~Tailwind text-xs
  },
} as const;

/**
 * Defaults for template.styles.typography (all px except lineHeight).
 * The renderers can read from template.styles.typography first,
 * then fall back to these values for a single source of truth.
 */
export const TYPOGRAPHY_DEFAULTS = {
  fontFamily: "inter", // key that your mapFontFamily() understands
  lineHeight: 1.4,
  nameSize: FONT_SIZES.html.name,
  titleSize: FONT_SIZES.html.title,
  headingSize: FONT_SIZES.html.heading,
  bodySize: FONT_SIZES.html.body,
  smallSize: FONT_SIZES.html.small,
  contactSize: FONT_SIZES.html.contact,
} as const;

// Font Constants
export const FONTS = {
  // Available font families for HTML renderers
  html: {
    roboto: "Roboto, Helvetica, Arial, sans-serif",
    openSans: "Open Sans, Helvetica, Arial, sans-serif",
    lato: "Lato, Helvetica, Arial, sans-serif",
    sourceSansPro: "Source Sans Pro, Helvetica, Arial, sans-serif",
    montserrat: "Montserrat, Helvetica, Arial, sans-serif",
    inter: "Inter, Helvetica, Arial, sans-serif",
    default: "Roboto, Helvetica, Arial, sans-serif",
  },

  // Available font families for PDF renderers (map to core fonts for reliability)
  pdf: {
    roboto: "Helvetica",
    openSans: "Helvetica",
    lato: "Helvetica",
    sourceSansPro: "Helvetica",
    montserrat: "Helvetica",
    inter: "Helvetica",
    default: "Helvetica",
  },

  // Fallback fonts
  fallback: "Helvetica, Arial, sans-serif",
} as const;

// Color Constants
export const COLORS = {
  primary: "#1e3a8a",
  secondary: "#64748b",
  text: "#000000",
  textLight: "#666666",
  background: "#ffffff",
  backgroundLight: "#f8fafc",
  border: "#e5e7eb",
  accent: "#3b82f6",
  // Default header background used by templates if not provided
  headerBackground: "#60a5fa",
} as const;

// Layout Constants
export const LAYOUT = {
  a4Width: "210mm",
  a4Height: "297mm",
  maxWidth: "210mm",
  /**
   * This scale is applied in the HTML preview (transform: scale(...)).
   * The PDF renderer should also read this to visually match the scaled HTML.
   */
  scale: 0.8,
  borderRadius: 4,
  borderWidth: 1,

  // Optional defaults for two-column templates (percentages)
  leftColumnWidth: 40,
  rightColumnWidth: 60,
} as const;

/**
 * Unit conversion constant for PDF renderer
 * 1px ≈ 0.75pt — use to convert template px sizes to PDF points.
 */
export const PX_TO_PT = 0.75 as const;

// Section Order
export const SECTION_ORDER = [
  "professional-summary",
  "education",
  "work-experience",
  "skills",
  "certifications",
  "languages",
  "awards",
  "projects",
  "interests",
] as readonly string[];

// Skill/Language Level Mapping
export const SKILL_LEVELS = {
  Beginner: 1,
  Amateur: 2,
  Intermediate: 3,
  Advanced: 4,
  Expert: 5,
} as const;

export const LANGUAGE_LEVELS = {
  Basic: 1,
  Amateur: 2,
  Conversational: 3,
  Professional: 4,
  Native: 5,
} as const;
