import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { templateManager } from "@/lib/cv/templates/templateManager";
import { TemplatePersistence } from "@/utils/cv/templatePersistence";
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Award as AwardType,
  Project,
  Interest,
  Course,
  Organization,
  Publication as PublicationType,
  Reference,
  Declaration,
  CustomSection,
  ProfessionalSummary,
  ResumeSection,
} from "@/types/cv";
import { TemplateLayout } from "@/types/cv/template";

// Helper function to get persisted data from secure draft
const getPersistedData = <T>(key: string, defaultValue: T): T => {
  // Note: This will be replaced with secure draft API calls
  // For now, return default values to avoid localStorage usage
  return defaultValue;
};

// Helper function to save data to secure draft
const saveData = (key: string, data: any) => {
  // Note: This will be replaced with secure draft API calls
  // Data will be saved via useSecureDraft hook
  console.log(`Data would be saved to secure draft for key: ${key}`);
};

export function useTemplateBuilder(templateId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Template state
  const [templateConfig, setTemplateConfig] = useState<
    TemplateLayout | undefined
  >(() => templateManager.getTemplate(templateId) || undefined);
  const [builderMode, setBuilderMode] = useState<"content" | "customize">(
    "content"
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Form data state with persistence
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cv-builder-personal-info");
      return saved
        ? JSON.parse(saved)
        : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",
            website: "",
            image: undefined,
            targetedJobTitle: "",
            industry: "",
          };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      image: undefined,
      targetedJobTitle: "",
      industry: "",
    };
  });

  const [professionalSummary, setProfessionalSummary] =
    useState<ProfessionalSummary>(() =>
      getPersistedData("cv-builder-professional-summary", {
        id: "professional-summary",
        summary: "",
      })
    );

  const [experiences, setExperiences] = useState<Experience[]>(() =>
    getPersistedData("cv-builder-experiences", [])
  );
  const [educations, setEducations] = useState<Education[]>(() =>
    getPersistedData("cv-builder-educations", [])
  );
  const [skills, setSkills] = useState<Skill[]>(() =>
    getPersistedData("cv-builder-skills", [])
  );
  const [languages, setLanguages] = useState<Language[]>(() =>
    getPersistedData("cv-builder-languages", [])
  );
  const [certifications, setCertifications] = useState<Certification[]>(() =>
    getPersistedData("cv-builder-certifications", [])
  );
  const [awards, setAwards] = useState<AwardType[]>(() =>
    getPersistedData("cv-builder-awards", [])
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    getPersistedData("cv-builder-projects", [])
  );
  const [interests, setInterests] = useState<Interest[]>(() =>
    getPersistedData("cv-builder-interests", [])
  );
  const [courses, setCourses] = useState<Course[]>(() =>
    getPersistedData("cv-builder-courses", [])
  );
  const [organizations, setOrganizations] = useState<Organization[]>(() =>
    getPersistedData("cv-builder-organizations", [])
  );
  const [publications, setPublications] = useState<PublicationType[]>(() =>
    getPersistedData("cv-builder-publications", [])
  );
  const [references, setReferences] = useState<Reference[]>(() =>
    getPersistedData("cv-builder-references", [])
  );
  const [declarations, setDeclarations] = useState<Declaration[]>(() =>
    getPersistedData("cv-builder-declarations", [])
  );
  const [customSections, setCustomSections] = useState<CustomSection[]>(() =>
    getPersistedData("cv-builder-custom-sections", [])
  );

  // Resume data state
  const [resumeData, setResumeData] = useState<ResumeSection[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [leftColumnSections, setLeftColumnSections] = useState<string[]>([]);
  const [customSectionHeadings, setCustomSectionHeadings] = useState<
    Record<string, string>
  >(() => getPersistedData("cv-builder-custom-section-headings", {}));

  // Persist form data to localStorage when it changes
  useEffect(() => {
    saveData("cv-builder-personal-info", personalInfo);
  }, [personalInfo]);

  useEffect(() => {
    saveData("cv-builder-professional-summary", professionalSummary);
  }, [professionalSummary]);

  useEffect(() => {
    saveData("cv-builder-experiences", experiences);
  }, [experiences]);

  useEffect(() => {
    saveData("cv-builder-educations", educations);
  }, [educations]);

  useEffect(() => {
    saveData("cv-builder-skills", skills);
  }, [skills]);

  useEffect(() => {
    saveData("cv-builder-languages", languages);
  }, [languages]);

  useEffect(() => {
    saveData("cv-builder-certifications", certifications);
  }, [certifications]);

  useEffect(() => {
    saveData("cv-builder-awards", awards);
  }, [awards]);

  useEffect(() => {
    saveData("cv-builder-projects", projects);
  }, [projects]);

  useEffect(() => {
    saveData("cv-builder-interests", interests);
  }, [interests]);

  useEffect(() => {
    saveData("cv-builder-courses", courses);
  }, [courses]);

  useEffect(() => {
    saveData("cv-builder-organizations", organizations);
  }, [organizations]);

  useEffect(() => {
    saveData("cv-builder-publications", publications);
  }, [publications]);

  useEffect(() => {
    saveData("cv-builder-references", references);
  }, [references]);

  useEffect(() => {
    saveData("cv-builder-declarations", declarations);
  }, [declarations]);

  useEffect(() => {
    saveData("cv-builder-custom-sections", customSections);
  }, [customSections]);

  useEffect(() => {
    saveData("cv-builder-custom-section-headings", customSectionHeadings);
  }, [customSectionHeadings]);

  // Create unified resume sections that are independent of template
  useEffect(() => {
    const createUnifiedResumeData = () => {
      const sections: ResumeSection[] = [];

      // Personal Information (always present)
      sections.push({
        id: "personal-info",
        type: "personal-info",
        heading:
          customSectionHeadings["personal-info"] || "Personal Information",
        visible: true,
        data: personalInfo,
      });

      // Professional Summary (always present)
      sections.push({
        id: "professional-summary",
        type: "professional-summary",
        heading:
          customSectionHeadings["professional-summary"] ||
          "Professional Summary",
        visible: true,
        data: professionalSummary,
      });

      // Work Experience (always present)
      sections.push({
        id: "work-experience",
        type: "work-experience",
        heading: customSectionHeadings["work-experience"] || "Work Experience",
        visible: true,
        data: experiences,
      });

      // Education (always present)
      sections.push({
        id: "education",
        type: "education",
        heading: customSectionHeadings["education"] || "Education",
        visible: true,
        data: educations,
      });

      // Skills (always present)
      sections.push({
        id: "skills",
        type: "skills",
        heading: customSectionHeadings["skills"] || "Skills",
        visible: true,
        data: skills,
      });

      // Optional sections - only show if they have data
      if (languages.length > 0) {
        sections.push({
          id: "languages",
          type: "languages",
          heading: customSectionHeadings["languages"] || "Languages",
          visible: true,
          data: languages,
        });
      }

      if (certifications.length > 0) {
        sections.push({
          id: "certifications",
          type: "certifications",
          heading: customSectionHeadings["certifications"] || "Certifications",
          visible: true,
          data: certifications,
        });
      }

      if (awards.length > 0) {
        sections.push({
          id: "awards",
          type: "awards",
          heading: customSectionHeadings["awards"] || "Awards",
          visible: true,
          data: awards,
        });
      }

      if (projects.length > 0) {
        sections.push({
          id: "projects",
          type: "projects",
          heading: customSectionHeadings["projects"] || "Projects",
          visible: true,
          data: projects,
        });
      }

      if (interests.length > 0) {
        sections.push({
          id: "interests",
          type: "interests",
          heading: customSectionHeadings["interests"] || "Interests",
          visible: true,
          data: interests,
        });
      }

      if (courses.length > 0) {
        sections.push({
          id: "courses",
          type: "courses",
          heading: customSectionHeadings["courses"] || "Courses",
          visible: true,
          data: courses,
        });
      }

      if (organizations.length > 0) {
        sections.push({
          id: "organizations",
          type: "organizations",
          heading: customSectionHeadings["organizations"] || "Organizations",
          visible: true,
          data: organizations,
        });
      }

      if (publications.length > 0) {
        sections.push({
          id: "publications",
          type: "publications",
          heading: customSectionHeadings["publications"] || "Publications",
          visible: true,
          data: publications,
        });
      }

      if (references.length > 0) {
        sections.push({
          id: "references",
          type: "references",
          heading: customSectionHeadings["references"] || "References",
          visible: true,
          data: references,
        });
      }

      if (declarations.length > 0) {
        sections.push({
          id: "declarations",
          type: "declarations",
          heading: customSectionHeadings["declarations"] || "Declarations",
          visible: true,
          data: declarations,
        });
      }

      // Custom Sections
      customSections.forEach((customSection, index) => {
        if (customSection.title || customSection.content) {
          sections.push({
            id: `custom-${index}`,
            type: "custom",
            heading: customSection.title || `Custom Section ${index + 1}`,
            visible: true,
            data: customSection,
          });
        }
      });

      return sections;
    };

    const newResumeData = createUnifiedResumeData();
    setResumeData(newResumeData);
  }, [
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
    customSectionHeadings,
  ]);

  // Use the unified resume data for section arrangement
  const allSections = useMemo(() => {
    // If we have a custom section order, apply it
    if (sectionOrder.length > 0) {
      const orderedSections = sectionOrder
        .map((type) => resumeData.find((section) => section.type === type))
        .filter(Boolean) as ResumeSection[];

      // Add any sections not in the order list at the end
      const remainingSections = resumeData.filter(
        (section) => !sectionOrder.includes(section.type)
      );

      return [...orderedSections, ...remainingSections];
    }

    return resumeData;
  }, [resumeData, sectionOrder]);

  // Initialize left column sections when all sections are available
  useEffect(() => {
    if (allSections.length > 0 && leftColumnSections.length === 0) {
      const availableSections = allSections
        .filter((section) => section.type !== "personal-info")
        .map((section) => section.type);

      // Default left column sections that exist in the data
      const defaultLeftSections = availableSections.filter((type) =>
        ["skills", "languages", "certifications", "awards"].includes(type)
      );

      setLeftColumnSections(defaultLeftSections);
    }
  }, [allSections, leftColumnSections.length]);

  // Load saved template configuration
  useEffect(() => {
    const savedConfig = TemplatePersistence.loadTemplateConfig(templateId);
    if (savedConfig) {
      setTemplateConfig(savedConfig);
    }
  }, [templateId]);

  // Template configuration handlers
  const handleTemplateConfigSave = (template: any) => {
    setTemplateConfig(template);
    TemplatePersistence.saveTemplateConfig(templateId, template);
  };

  const handleTemplateChange = () => {
    setShowTemplateSelector(true);
  };

  const handleTemplateSelect = (newTemplateId: string) => {
    // Simply update the template configuration - resume data stays the same
    const newTemplate = templateManager.getTemplate(newTemplateId);
    if (newTemplate) {
      setTemplateConfig(newTemplate);

      // Preserve existing query parameters when changing templates
      const cvId = searchParams.get("cvId");
      const mode = searchParams.get("mode");
      const draftId = searchParams.get("draftId");

      const queryParams = new URLSearchParams();
      if (cvId) queryParams.set("cvId", cvId);
      if (mode) queryParams.set("mode", mode);
      if (draftId) queryParams.set("draftId", draftId);

      const queryString = queryParams.toString();
      const newUrl = `/dashboard/cv-builder/${newTemplateId}${
        queryString ? `?${queryString}` : ""
      }`;

      // Update the URL to reflect the new template while preserving query params
      router.push(newUrl);
    }
    setShowTemplateSelector(false);
  };

  // Section arrangement handlers
  const handleSectionReorder = (reorderedSections: ResumeSection[]) => {
    // Update the section order based on the reordered sections
    const newOrder = reorderedSections.map((section) => section.type);
    setSectionOrder(newOrder);
  };

  const handleLeftColumnChange = (sections: string[]) => {
    setLeftColumnSections(sections);
  };

  return {
    // Template state
    templateConfig,
    setTemplateConfig,
    builderMode,
    setBuilderMode,
    showTemplateSelector,
    setShowTemplateSelector,

    // Form data
    personalInfo,
    setPersonalInfo,
    professionalSummary,
    setProfessionalSummary,
    experiences,
    setExperiences,
    educations,
    setEducations,
    skills,
    setSkills,
    languages,
    setLanguages,
    certifications,
    setCertifications,
    awards,
    setAwards,
    projects,
    setProjects,
    interests,
    setInterests,
    courses,
    setCourses,
    organizations,
    setOrganizations,
    publications,
    setPublications,
    references,
    setReferences,
    declarations,
    setDeclarations,
    customSections,
    setCustomSections,

    // Resume data
    resumeData,
    allSections,
    sectionOrder,
    leftColumnSections,
    customSectionHeadings,
    setCustomSectionHeadings,

    // Handlers
    handleTemplateConfigSave,
    handleTemplateChange,
    handleTemplateSelect,
    handleSectionReorder,
    handleLeftColumnChange,
  };
}
