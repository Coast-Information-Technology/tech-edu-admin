import { useState, useEffect, useMemo, useCallback } from "react";
import { CVBuilderState, AutoSaveConfig } from "@/types/cv/cv-builder";
import {
  PersonalInfo,
  ProfessionalSummary,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Award as AwardType,
  Project,
  Interest,
  CustomSection,
  Template,
  Section,
  ResumeSection,
} from "@/types/cv";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Languages,
  FileCheck,
  Trophy,
  BookOpen,
  Heart,
  BookOpenCheck,
  Users,
  UserCheck,
  FileSignature,
  Settings2,
} from "lucide-react";
import { useSectionManagement } from "./useSectionManagement";
import { useAutoSave } from "./useAutoSave";
import { useValidation, CVValidationSchemas } from "./useValidation";
import { useHistory } from "./useHistory";
// import {
//   useKeyboardShortcuts,
//   CVBuilderShortcuts,
// } from "./useKeyboardShortcuts";
import { useCVSimplified } from "./useCVSimplified";
// import { useAIFeatures } from "./useAIFeatures";
import { mapResumePropsToSectionsWithTemplate } from "@/utils/cv/resumeSectionMapper";
import { cvService } from "@/services/cv/cvServiceOptimized";

interface UseCVBuilderProps {
  initialState?: Partial<CVBuilderState>;
  autoSaveConfig?: Partial<AutoSaveConfig>;
  onStateChange?: (state: CVBuilderState) => void;
}

export function useCVBuilder({
  initialState,
  autoSaveConfig,
  onStateChange,
}: UseCVBuilderProps = {}) {
  // Initial state
  const defaultState: CVBuilderState = {
    showTemplateSelector: true,
    showLoadCVModal: false,
    showCVUpload: false,
    selectedMode: null,
    activeSection: "personal-info",
    showPreview: false,
    showSectionModal: false,
    showAddSectionModal: false,
    showPreviewModal: false,
    showJobMatchModal: false,
    showAnalytics: false,
    showVersions: false,
    showSharing: false,
    showJobBoards: false,
    selectedTemplate: "classic",
    isExporting: false,
    builderMode: "content",
    templateConfig: null,
    resumeData: [
      {
        id: "personal-info",
        type: "personal-info",
        data: {
          firstName: "John",
          lastName: "Doe",
          targetedJobTitle: "Software Engineer",
          email: "john.doe@email.com",
          phone: "+1 (555) 123-4567",
          location: "New York, NY",
          linkedin: "linkedin.com/in/johndoe",
          website: "johndoe.dev",
          github: "github.com/johndoe",
          twitter: "",
          summary: "",
          image: "",
          imageSize: "medium",
        },
        heading: "Personal Information",
        visible: true,
      },
      {
        id: "professional-summary",
        type: "professional-summary",
        data: {
          id: "summary-1",
          summary:
            "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
        },
        heading: "Professional Summary",
        visible: true,
      },
      {
        id: "work-experience",
        type: "work-experience",
        data: [
          {
            id: "exp-1",
            company: "Tech Company Inc.",
            position: "Senior Software Engineer",
            location: "San Francisco, CA",
            startDate: "2020-01",
            endDate: "2023-12",
            description:
              "Led development of microservices architecture and improved system performance by 40%.",
            current: false,
          },
        ],
        heading: "Work Experience",
        visible: true,
      },
      {
        id: "education",
        type: "education",
        data: [
          {
            id: "edu-1",
            institution: "University of Technology",
            degree: "Bachelor of Computer Science",
            field: "Computer Science",
            location: "Boston, MA",
            startDate: "2016-09",
            endDate: "2020-05",
            gpa: "3.8",
            current: false,
          },
        ],
        heading: "Education",
        visible: true,
      },
      {
        id: "skills",
        type: "skills",
        data: [
          { id: "skill-1", name: "JavaScript", level: "Expert" },
          { id: "skill-2", name: "React", level: "Advanced" },
          { id: "skill-3", name: "Node.js", level: "Advanced" },
          { id: "skill-4", name: "Python", level: "Intermediate" },
        ],
        heading: "Skills",
        visible: true,
      },
    ],
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      targetedJobTitle: "Software Engineer",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
      github: "github.com/johndoe",
      twitter: "",
      summary: "",
      image: "",
      imageSize: "medium",
    },
    professionalSummary: {
      id: "summary-1",
      summary:
        "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
    },
    experiences: [
      {
        id: "exp-1",
        company: "Tech Company Inc.",
        position: "Senior Software Engineer",
        location: "San Francisco, CA",
        startDate: "2020-01",
        endDate: "2023-12",
        description:
          "Led development of microservices architecture and improved system performance by 40%.",
        current: false,
      },
    ],
    educations: [
      {
        id: "edu-1",
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        field: "Computer Science",
        location: "Boston, MA",
        startDate: "2016-09",
        endDate: "2020-05",
        gpa: "3.8",
        current: false,
      },
    ],
    skills: [
      { id: "skill-1", name: "JavaScript", level: "Expert" },
      { id: "skill-2", name: "React", level: "Advanced" },
      { id: "skill-3", name: "Node.js", level: "Advanced" },
      { id: "skill-4", name: "Python", level: "Intermediate" },
    ],
    languages: [],
    certifications: [],
    awards: [],
    projects: [],
    interests: [],
    courses: [],
    organizations: [],
    publications: [],
    references: [],
    declarations: [],
    customSections: [],
    enabledSections: [
      "personal-info",
      "work-experience",
      "education",
      "skills",
      "professional-summary",
    ],
    ...initialState,
  };

  // State management
  const [state, setState] = useState<CVBuilderState>(defaultState);

  // Update state and notify parent
  const updateState = useCallback(
    (updates: Partial<CVBuilderState>) => {
      setState((prevState) => {
        const newState = { ...prevState, ...updates };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Section management hook
  const sectionManager = useSectionManagement({
    experiences: state.experiences,
    educations: state.educations,
    skills: state.skills,
    languages: state.languages,
    certifications: state.certifications,
    awards: state.awards,
    projects: state.projects,
    interests: state.interests,
    customSections: state.customSections,
    setExperiences: (experiences) => updateState({ experiences }),
    setEducations: (educations) => updateState({ educations }),
    setSkills: (skills) => updateState({ skills }),
    setLanguages: (languages) => updateState({ languages }),
    setCertifications: (certifications) => updateState({ certifications }),
    setAwards: (awards) => updateState({ awards }),
    setProjects: (projects) => updateState({ projects }),
    setInterests: (interests) => updateState({ interests }),
    setCustomSections: (customSections) => updateState({ customSections }),
  });

  // Validation hook
  const validation = useValidation({
    schema: CVValidationSchemas.personalInfo,
    initialData: state.personalInfo,
  });

  // History management
  const history = useHistory({ initialState: state });

  // Auto-save configuration with real API integration
  const autoSaveConfigFinal: AutoSaveConfig = {
    enabled: false, // Disabled - no more auto-save
    interval: 30000, // 30 seconds
    debounceDelay: 2000, // 2 seconds
    onSave: async (state) => {
      try {
        // Save to localStorage for persistence
        localStorage.setItem("cv-builder-state", JSON.stringify(state));

        // Also save to API as draft - use a simpler approach for auto-save
        const request = {
          title: `${state.personalInfo.firstName} ${state.personalInfo.lastName} - CV Draft`,
          sections: state.resumeData.map((section: any) => ({
            type: section.type,
            heading: section.heading,
            visible: section.visible,
            data: section.data,
          })),
          consent: {
            aiProcessing: false,
            aiTraining: false,
          },
        };

        // Auto-save CV and draft - only if we have a cvId
        if (cvApi.cvId) {
          console.log(
            "🤖 Auto-save triggered for cvId:",
            cvApi.cvId,
            "draftId:",
            cvApi.draftId
          );
          // Update the main CV
          await cvApi.updateCV(state.personalInfo, state.resumeData);
          // Also save as draft to track working changes
          await cvApi.saveDraft(state.personalInfo, state.resumeData);
        } else {
          console.log("⏭️ Auto-save skipped - no cvId");
        }
        console.log("Auto-save successful:", state);
      } catch (error) {
        console.error("Auto-save failed:", error);
        // Don't throw error to prevent breaking the UI
      }
    },
    ...autoSaveConfig,
  };

  // Auto-save hook
  const autoSave = useAutoSave({
    data: state,
    saveFunction: autoSaveConfigFinal.onSave,
    delay: autoSaveConfigFinal.debounceDelay,
    enabled: autoSaveConfigFinal.enabled,
  });

  // CV API hook - use simplified version that includes draftId
  const cvApi = useCVSimplified();

  // AI features hook
  // const aiFeatures = useAIFeatures();

  // Keyboard shortcuts (commented out - file deleted)
  // const shortcuts = useMemo(
  //   () => [
  //     CVBuilderShortcuts.save(() => cvApi.saveCV()),
  //     CVBuilderShortcuts.saveDraft(() => cvApi.saveDraft()),
  //     CVBuilderShortcuts.export(() => handleExportPDF()),
  //     CVBuilderShortcuts.preview(() =>
  //       updateState({ showPreview: !state.showPreview })
  //     ),
  //     CVBuilderShortcuts.undo(() => {
  //       const previousState = history.undo();
  //       if (previousState) {
  //         setState(previousState);
  //       }
  //     }),
  //     CVBuilderShortcuts.redo(() => {
  //       const nextState = history.redo();
  //       if (nextState) {
  //         setState(nextState);
  //       }
  //     }),
  //     CVBuilderShortcuts.toggleMode(() => {
  //       updateState({
  //         builderMode:
  //           state.builderMode === "content" ? "customize" : "content",
  //       });
  //     }),
  //   ],
  //   [cvApi, state.showPreview, state.builderMode, history, updateState]
  // );

  // useKeyboardShortcuts({ shortcuts });

  // Memoized resume data
  const resumeData = useMemo(async () => {
    return await mapResumePropsToSectionsWithTemplate(
      {
        personalInfo: state.personalInfo,
        professionalSummary: state.professionalSummary,
        experiences: state.experiences,
        educations: state.educations,
        skills: state.skills,
        languages: state.languages,
        certifications: state.certifications,
        awards: state.awards,
        projects: state.projects,
        interests: state.interests,
        courses: state.courses,
        organizations: state.organizations,
        publications: state.publications,
        references: state.references,
        declarations: state.declarations,
        customSections: state.customSections,
      },
      state.templateConfig
    );
  }, [
    state.personalInfo,
    state.professionalSummary,
    state.experiences,
    state.educations,
    state.skills,
    state.languages,
    state.certifications,
    state.awards,
    state.projects,
    state.interests,
    state.courses,
    state.organizations,
    state.publications,
    state.references,
    state.declarations,
    state.customSections,
    state.templateConfig,
  ]);

  // Update resume data when dependencies change
  useEffect(() => {
    resumeData.then((data) => {
      updateState({ resumeData: data });
    });
  }, [resumeData, updateState]);

  // Push state to history when it changes
  useEffect(() => {
    history.push(state, "State Update");
  }, [state, history.push]); // Only depend on the push function, not the entire history object

  // Sections configuration
  const sections: Section[] = useMemo(
    () => [
      { id: "personal", label: "Personal Info", icon: User },
      { id: "experience", label: "Experience", icon: Briefcase },
      { id: "education", label: "Education", icon: GraduationCap },
      { id: "skills", label: "Skills", icon: Award },
      {
        id: "professional-summary",
        label: "Professional Summary",
        icon: FileText,
      },
      { id: "languages", label: "Languages", icon: Languages },
      { id: "certifications", label: "Certifications", icon: FileCheck },
      { id: "awards", label: "Awards", icon: Trophy },
      { id: "projects", label: "Projects", icon: BookOpen },
      { id: "interests", label: "Interests", icon: Heart },
      { id: "courses", label: "Courses", icon: BookOpenCheck },
      { id: "organizations", label: "Organizations", icon: Users },
      { id: "publications", label: "Publications", icon: FileText },
      { id: "references", label: "References", icon: UserCheck },
      { id: "declarations", label: "Declarations", icon: FileSignature },
      { id: "custom", label: "Custom Sections", icon: Settings2 },
    ],
    []
  );

  // Event handlers
  const handleModeSelect = useCallback(
    (mode: "scratch" | "upload") => {
      updateState({ selectedMode: mode });
      if (mode === "upload") {
        updateState({ showCVUpload: true });
      } else {
        updateState({ showTemplateSelector: true });
      }
    },
    [updateState]
  );

  const handleTemplateSelect = useCallback(
    (template: string) => {
      updateState({
        selectedTemplate: template as Template,
        showTemplateSelector: false,
      });
    },
    [updateState]
  );

  const handleExportPDF = useCallback(async () => {
    if (!state.personalInfo.firstName || !state.personalInfo.lastName) {
      alert("Please fill in your first and last name before exporting.");
      return;
    }

    updateState({ isExporting: true });
    try {
      // Export logic here
      console.log("Exporting PDF...");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      updateState({ isExporting: false });
    }
  }, [state.personalInfo, updateState]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("Please select an image file");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("Image size should be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          updateState({
            personalInfo: { ...state.personalInfo, image: result },
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [state.personalInfo, updateState]
  );

  const removeImage = useCallback(() => {
    updateState({
      personalInfo: { ...state.personalInfo, image: "" },
    });
  }, [state.personalInfo, updateState]);

  // Section management functions
  const toggleSection = useCallback(
    (sectionId: string) => {
      const newEnabledSections = state.enabledSections.includes(sectionId)
        ? state.enabledSections.filter((id) => id !== sectionId)
        : [...state.enabledSections, sectionId];

      updateState({ enabledSections: newEnabledSections });

      if (
        state.activeSection === sectionId &&
        !newEnabledSections.includes(sectionId)
      ) {
        const remainingSections = newEnabledSections;
        if (remainingSections.length > 0) {
          updateState({ activeSection: remainingSections[0] });
        }
      }
    },
    [state.enabledSections, state.activeSection, updateState]
  );

  const navigateToSection = useCallback(
    (direction: "next" | "prev") => {
      const enabledSectionsList = sections.filter((section) =>
        state.enabledSections.includes(section.id)
      );
      const currentIndex = enabledSectionsList.findIndex(
        (section) => section.id === state.activeSection
      );
      let newIndex;

      if (direction === "next") {
        newIndex =
          currentIndex < enabledSectionsList.length - 1 ? currentIndex + 1 : 0;
      } else {
        newIndex =
          currentIndex > 0 ? currentIndex - 1 : enabledSectionsList.length - 1;
      }

      updateState({ activeSection: enabledSectionsList[newIndex].id });
    },
    [sections, state.enabledSections, state.activeSection, updateState]
  );

  return {
    // State
    state,
    updateState,

    // Section management
    sectionManager,

    // Validation
    validation,

    // History
    history,

    // Auto-save
    autoSave,

    // CV API
    cvApi,

    // AI features
    // aiFeatures,

    // Sections
    sections,

    // Event handlers
    handleModeSelect,
    handleTemplateSelect,
    handleExportPDF,
    handleImageUpload,
    removeImage,
    toggleSection,
    navigateToSection,
  };
}
