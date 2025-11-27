import { ResumeSection } from "@/types/cv";
import { TemplateLayout } from "@/types/cv/template";

/** Unique ID helper for sections (fallbacks to a stable-ish id if crypto is unavailable) */
const createSectionId = (type: string, hint?: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${type}-${(crypto as any).randomUUID()}`;
  }
  // Fallback: timestamp + random + optional hint
  return `${type}-${hint ?? ""}-${Date.now()}-${Math.floor(
    Math.random() * 1e6
  )}`;
};

/**
 * Creates a ResumeSection object with proper typing and unique id
 */
export const createResumeSection = <T extends ResumeSection["type"]>(
  type: T,
  heading: string,
  data: any,
  condition: boolean = true
): ResumeSection | null => {
  if (!condition) return null;

  return {
    id: createSectionId(type as string, heading),
    type,
    heading,
    visible: true,
    data,
  } as ResumeSection;
};

/**
 * Maps resume props to ResumeSection array (baseline/non-template)
 */
export const mapResumePropsToSections = (props: {
  personalInfo: any;
  professionalSummary?: any;
  experiences: any[];
  educations: any[];
  skills: any[];
  languages?: any[];
  certifications?: any[];
  awards?: any[];
  projects?: any[];
  interests?: any[];
  courses?: any[];
  organizations?: any[];
  publications?: any[];
  references?: any[];
  declarations?: any[];
  customSections?: any[];
}): ResumeSection[] => {
  const {
    personalInfo,
    professionalSummary,
    experiences,
    educations,
    skills,
    languages = [],
    certifications = [],
    awards = [],
    projects = [],
    interests = [],
    courses = [],
    organizations = [],
    publications = [],
    references = [],
    declarations = [],
    customSections = [],
  } = props;

  const sections = [
    createResumeSection(
      "personal-info" as any,
      "Personal Information",
      personalInfo,
      true
    ),

    createResumeSection("education" as any, "Education", educations, true),
    createResumeSection(
      "work-experience" as any,
      "Work Experience",
      experiences,
      true
    ),
    createResumeSection("skills" as any, "Skills", skills, true),

    createResumeSection(
      "professional-summary" as any,
      "Professional Summary",
      professionalSummary,
      !!professionalSummary && Object.values(professionalSummary).some(Boolean)
    ),

    createResumeSection(
      "languages" as any,
      "Languages",
      languages,
      languages.length > 0
    ),
    createResumeSection(
      "certifications" as any,
      "Certifications",
      certifications,
      certifications.length > 0
    ),
    createResumeSection("awards" as any, "Awards", awards, awards.length > 0),
    createResumeSection(
      "projects" as any,
      "Projects",
      projects,
      projects.length > 0
    ),

    createResumeSection(
      "interests" as any,
      "Interests",
      interests,
      interests.length > 0
    ),
    createResumeSection(
      "courses" as any,
      "Courses",
      courses,
      courses.length > 0
    ),
    createResumeSection(
      "organizations" as any,
      "Organizations",
      organizations,
      organizations.length > 0
    ),
    createResumeSection(
      "publications" as any,
      "Publications",
      publications,
      publications.length > 0
    ),
    createResumeSection(
      "references" as any,
      "References",
      references,
      references.length > 0
    ),
    createResumeSection(
      "declarations" as any,
      "Declarations",
      declarations,
      declarations.length > 0
    ),

    // Custom sections (always allowed here)
    ...customSections.map((customSection, index) =>
      createResumeSection(
        "custom" as any,
        customSection.title || `Custom ${index + 1}`,
        customSection,
        !!(customSection?.title && String(customSection.title).trim())
      )
    ),
  ].filter(Boolean) as ResumeSection[];

  return sections;
};

/**
 * Maps resume props to ResumeSection array with fully dynamic template-aware configuration
 * - Always includes 'personal-info' as the header (template columns should NOT control header visibility).
 * - Orders sections by template.columns order, then section order within a column.
 * - Respects template custom headings if provided.
 */
export const mapResumePropsToSectionsWithTemplate = async (
  props: {
    personalInfo: any;
    professionalSummary?: any;
    experiences: any[];
    educations: any[];
    skills: any[];
    languages?: any[];
    certifications?: any[];
    awards?: any[];
    projects?: any[];
    interests?: any[];
    courses?: any[];
    organizations?: any[];
    publications?: any[];
    references?: any[];
    declarations?: any[];
    customSections?: any[];
  },
  template?: TemplateLayout | null
): Promise<ResumeSection[]> => {
  const {
    personalInfo,
    professionalSummary,
    experiences,
    educations,
    skills,
    languages = [],
    certifications = [],
    awards = [],
    projects = [],
    interests = [],
    courses = [],
    organizations = [],
    publications = [],
    references = [],
    declarations = [],
    customSections = [],
  } = props;

  // If no template is provided, fall back to the original mapper
  if (!template) {
    return mapResumePropsToSections(props);
  }

  // Dynamically import templateManager to get section configurations
  let templateManager: any;
  try {
    const module = await import("@/lib/cv/templates/templateManager");
    templateManager = module.templateManager;
  } catch (error) {
    console.error("Failed to import templateManager:", error);
    // Fall back to the original mapper if template manager fails
    return mapResumePropsToSections(props);
  }

  // Always include personal-info first (header area is controlled by renderers)
  const sections: ResumeSection[] = [];
  const personalInfoSection = createResumeSection(
    "personal-info" as any,
    template?.sectionHeadings?.["personal-info"] || "Personal Information",
    personalInfo,
    true
  );
  if (personalInfoSection) sections.push(personalInfoSection);

  // Build an ordered list of enabled section types from template columns.
  // We preserve the order of columns (by 'order') and the order of sections within each column.
  // We dedupe while preserving first occurrence.
  const orderedTypes: string[] = [];
  const seen = new Set<string>();
  const orderedColumns = [...(template.columns || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  for (const col of orderedColumns) {
    for (const st of col.sections || []) {
      if (st && !seen.has(st)) {
        seen.add(st);
        orderedTypes.push(st);
      }
    }
  }

  // All section configs for condition/display names
  const allSectionConfigs: any[] = templateManager.getSectionConfigs?.() || [];

  // This “propsData” map lets getSectionData resolve the right prop for a given type.
  const propsData = {
    personalInfo,
    professionalSummary,
    experiences,
    educations,
    skills,
    languages,
    certifications,
    awards,
    projects,
    interests,
    courses,
    organizations,
    publications,
    references,
    declarations,
    customSections,
  };

  // Process each enabled section in the template-defined order
  for (const sectionType of orderedTypes) {
    if (sectionType === "custom") {
      // Only include custom sections if template explicitly allows it
      customSections.forEach((customSection: any, index: number) => {
        const s = createResumeSection(
          "custom" as any,
          customSection.title || `Custom ${index + 1}`,
          customSection,
          !!(customSection?.title && String(customSection.title).trim())
        );
        if (s) sections.push(s);
      });
      continue;
    }

    // Find config for display name / optional condition
    const sectionConfig = allSectionConfigs.find(
      (c) => c?.type === sectionType
    );

    // Determine data for the section
    const data = getSectionData(sectionType, propsData);
    const condition = getSectionCondition(sectionType, data, sectionConfig);

    // Heading priority: template custom heading → section config displayName → Title Cased type
    const customHeading =
      template.sectionHeadings?.[
        sectionType as keyof typeof template.sectionHeadings
      ];
    const defaultHeading =
      sectionConfig?.displayName || toTitleCase(sectionType.replace(/-/g, " "));

    const s = createResumeSection(
      sectionType as any,
      customHeading || defaultHeading,
      data,
      condition
    );
    if (s) sections.push(s);
  }

  return sections;
};

/**
 * Dynamically get section data based on section type and props structure
 * This function uses dynamic property mapping to avoid hardcoding
 */
function getSectionData(sectionType: string, propsData: any): any {
  if (!sectionType) return null;

  // Special mappings
  const special: Record<string, keyof typeof propsData> = {
    "personal-info": "personalInfo",
    "professional-summary": "professionalSummary",
    "work-experience": "experiences",
    education: "educations",
    custom: "customSections",
  };

  if (sectionType in special) {
    return propsData[special[sectionType]];
  }

  // Convert kebab-case to camelCase (e.g., "languages" -> "languages")
  const camelKey = sectionType.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
  if (camelKey in propsData) return propsData[camelKey];

  return null;
}

/**
 * Determine section visibility condition based on config + data
 * If the SectionConfig exposes a `condition(data)` function, prefer that.
 */
function getSectionCondition(
  sectionType: string,
  data: any,
  sectionConfig: any
): boolean {
  if (
    sectionConfig?.condition &&
    typeof sectionConfig.condition === "function"
  ) {
    try {
      return !!sectionConfig.condition(data);
    } catch (e) {
      console.warn(`sectionConfig.condition threw for "${sectionType}"`, e);
    }
  }

  if (Array.isArray(data)) return data.length > 0;

  if (typeof data === "object" && data !== null) {
    return Object.values(data).some(
      (v) => v !== null && v !== undefined && String(v).trim() !== ""
    );
  }

  return data !== null && data !== undefined && String(data).trim() !== "";
}

/** Simple Title Case helper */
function toTitleCase(s: string) {
  return s.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}
