// Initialize all section components dynamically
import { registerSection } from "./sectionRegistry";

// Import all section components
import PersonalInfoSection from "@/components/cv/builder/sections/PersonalInfoSection";
import ProfessionalSummarySection from "@/components/cv/builder/sections/SummarySection";
import ExperienceSection from "@/components/cv/builder/sections/ExperienceSection";
import EducationSection from "@/components/cv/builder/sections/EducationSection";
import SkillsSection from "@/components/cv/builder/sections/SkillsSection";
import LanguagesSection from "@/components/cv/builder/sections/LanguagesSection";
import CertificationsSection from "@/components/cv/builder/sections/CertificationsSection";
import AwardsSection from "@/components/cv/builder/sections/AwardsSection";
import ProjectsSection from "@/components/cv/builder/sections/ProjectsSection";
import InterestsSection from "@/components/cv/builder/sections/InterestsSection";
import CustomSectionsSection from "@/components/cv/builder/sections/CustomSectionsSection";
// Icons as strings instead of components

/**
 * Initialize all section components in the registry
 */
export function initializeSections() {
  // Register all section components dynamically
  registerSection("personal-info", {
    component: PersonalInfoSection,
    displayName: "Personal Information",
    description: "Basic personal details and contact information",
    icon: "👤",
    category: "personal",
  });

  registerSection("professional-summary", {
    component: ProfessionalSummarySection,
    displayName: "Professional Summary",
    description: "Professional summary or objective statement",
    icon: "📄",
    category: "personal",
  });

  registerSection("work-experience", {
    component: ExperienceSection,
    displayName: "Work Experience",
    description: "Professional work experience and employment history",
    icon: "💼",
    category: "professional",
  });

  registerSection("education", {
    component: EducationSection,
    displayName: "Education",
    description: "Educational background and qualifications",
    icon: "🎓",
    category: "professional",
  });

  registerSection("skills", {
    component: SkillsSection,
    displayName: "Skills",
    description: "Technical and soft skills",
    icon: "⚡",
    category: "professional",
  });

  registerSection("languages", {
    component: LanguagesSection,
    displayName: "Languages",
    description: "Language proficiencies",
    icon: "🌐",
    category: "additional",
  });

  registerSection("certifications", {
    component: CertificationsSection,
    displayName: "Certifications",
    description: "Professional certifications and licenses",
    icon: "🏆",
    category: "additional",
  });

  registerSection("awards", {
    component: AwardsSection,
    displayName: "Awards",
    description: "Awards and recognitions",
    icon: "🏆",
    category: "additional",
  });

  registerSection("projects", {
    component: ProjectsSection,
    displayName: "Projects",
    description: "Notable projects and achievements",
    icon: "🚀",
    category: "additional",
  });

  registerSection("interests", {
    component: InterestsSection,
    displayName: "Interests",
    description: "Personal interests and hobbies",
    icon: "🎯",
    category: "additional",
  });

  registerSection("custom", {
    component: CustomSectionsSection,
    displayName: "Custom Sections",
    description: "Custom sections for additional content",
    icon: "➕",
    category: "custom",
  });
}

/**
 * Auto-initialize sections when this module is imported
 */
initializeSections();
