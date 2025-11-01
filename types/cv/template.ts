// Template configuration types for dynamic rendering
import { ReactElement } from "react";
import { ResumeSection } from "./index";

/**
 * All supported resume section types.
 * Include "personal-info" (usually rendered in header/left contact),
 * but exclude it from column placement with ColumnSectionType below.
 */
export type SectionType =
  | "personal-info"
  | "professional-summary"
  | "education"
  | "work-experience"
  | "skills"
  | "certifications"
  | "languages"
  | "awards"
  | "projects"
  | "interests";

/** Sections that can appear inside the left/right columns (no personal-info). */
export type ColumnSectionType = Exclude<SectionType, "personal-info">;

export interface TemplateLayout {
  id: string;
  name: string;
  description: string;
  columns: TemplateColumn[];
  styles: TemplateStyles;
  metadata: TemplateMetadata;
  /** Optional custom display names per section type */
  sectionHeadings?: Partial<Record<SectionType, string>>;
}

export interface TemplateColumn {
  id: "left" | "right" | string;
  /** Percentage (0–100) */
  width: number;
  /** Which sections go into this column */
  sections: ColumnSectionType[];
  styles: ColumnStyles;
  order: number;
}

/** Enhanced TemplateStyles with consistent, customizable knobs. */
export interface TemplateStyles {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    /** Optional header background; renderers should fall back to theme default */
    headerBackground?: string;
    /** Optional per-section heading background (HTML only unless simulated in PDF) */
    sectionHeadingBackground?: string;
  };

  /**
   * Typography is in PX except lineHeight (unitless).
   * PDF renderers should convert px → pt, and can factor in any HTML preview scale.
   */
  typography: {
    fontFamily: string;

    /** Base sizes (px) you already use */
    headingSize: number;
    bodySize: number;
    lineHeight: number;

    /** Optional extra sizes (px) to keep HTML/PDF perfectly in sync */
    nameSize?: number; // big name in header
    titleSize?: number; // targeted job title
    smallSize?: number; // small text, meta
    contactSize?: number; // contact row size
    skillSize?: number; // small labels / skill dots (if needed)

    headingStyle?: "normal" | "bold" | "italic";
    headingCase?: "capitalize" | "uppercase" | "lowercase";
    sectionHeadingStyle?: "normal" | "bold" | "italic";
    sectionHeadingCase?: "capitalize" | "uppercase" | "lowercase";
  };

  spacing: {
    padding: number;
    margin: number;
    sectionGap: number;
    horizontalMargin?: number;
    verticalMargin?: number;
    entrySpacing?: number;
    headerPadding?: number;
  };

  layout: {
    pageWidth: string; // e.g., "210mm"
    pageHeight: string; // e.g., "297mm"
    borderRadius: number;
    shadow: string;
    headerBorder?: string;

    /** Vertical page padding (px) applied to all pages */
    pagePaddingV?: number;

    /**
     * If true, the first page's header ignores top padding
     * (touches the top edge). Other pages still use pagePaddingV.
     */
    firstPageHeaderFlush?: boolean;
  };

  /** Optional additional styling for section headings in HTML */
  sectionHeadings?: {
    backgroundColor?: string;
    padding?: string;
    marginBottom?: string;
    borderRadius?: string;
    fontWeight?: string;
    textTransform?: string;
    fontSize?: string;
    letterSpacing?: string;
  };

  /** Extra personalization knobs (kept as-is) */
  personalDetails?: {
    nameSize?: "xs" | "s" | "m" | "l" | "xl";
    nameBold?: boolean;
    titleSize?: "s" | "m" | "l";
    titlePosition?: "same-line" | "below";
    showPhoto?: boolean;
    grayscale?: boolean;
  };

  colorMode?: "basic" | "advanced";
}

export interface ColumnStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
  borderRadius?: number;
  borderBottom?: string;
}

export interface TemplateMetadata {
  category: "professional" | "creative" | "minimal" | "modern" | "classic";
  industry: string[];
  features: string[];
  isDefault?: boolean;
  isPopular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionConfig {
  type: SectionType;
  displayName: string;
  icon: string;
  category: "personal" | "professional" | "education" | "skills" | "additional";
  required: boolean;
  order: number;
  defaultVisibility: boolean;
  styling: SectionStyling;
}

export interface SectionStyling {
  showHeader: boolean;
  headerStyle: "uppercase" | "title-case" | "lowercase";
  showDividers: boolean;
  compact: boolean;
  icon: boolean;
}

export interface TemplateRenderer {
  render: (data: ResumeSection[], layout: TemplateLayout) => ReactElement;
  renderPDF: (data: ResumeSection[], layout: TemplateLayout) => ReactElement;
}

export interface TemplateManager {
  getTemplate: (id: string) => TemplateLayout | null;
  getTemplates: () => TemplateLayout[];
  createTemplate: (template: Omit<TemplateLayout, "id">) => TemplateLayout;
  updateTemplate: (
    id: string,
    updates: Partial<TemplateLayout>
  ) => TemplateLayout;
  deleteTemplate: (id: string) => boolean;
}
