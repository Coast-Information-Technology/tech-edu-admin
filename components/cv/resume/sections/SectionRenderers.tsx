// components/resume/sections/SectionRenderers.tsx
import React from "react";
import { ResumeSection } from "@/types/cv";

import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";
import AwardsSection from "./AwardsSection";
import ProjectsSection from "./ProjectsSection";
import InterestsSection from "./InterestsSection";
import CoursesSection from "./CoursesSection";
import OrganizationsSection from "./OrganizationsSection";
import PublicationsSection from "./PublicationsSection";
import ReferencesSection from "./ReferencesSection";
import DeclarationsSection from "./DeclarationsSection";
import CustomSectionRenderer from "./CustomSection";
import SummarySection from "./SummarySection";
import PersonalInfoSection from "./PersonalInfoSection";

export const sectionRenderers: Record<
  ResumeSection["type"],
  (section: ResumeSection) => React.ReactNode
> = {
  "personal-info": (section: ResumeSection) =>
    section.type === "personal-info" ? (
      <PersonalInfoSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  "professional-summary": (section: ResumeSection) =>
    section.type === "professional-summary" ? (
      <SummarySection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
        showHeading={section.showHeading}
      />
    ) : null,

  "work-experience": (section: ResumeSection) =>
    section.type === "work-experience" ? (
      <ExperienceSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
        showHeading={section.showHeading}
      />
    ) : null,

  education: (section: ResumeSection) =>
    section.type === "education" ? (
      <EducationSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  skills: (section: ResumeSection) =>
    section.type === "skills" ? (
      <SkillsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  languages: (section: ResumeSection) =>
    section.type === "languages" ? (
      <LanguagesSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  certifications: (section: ResumeSection) =>
    section.type === "certifications" ? (
      <CertificationsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  awards: (section: ResumeSection) =>
    section.type === "awards" ? (
      <AwardsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  projects: (section: ResumeSection) =>
    section.type === "projects" ? (
      <ProjectsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  interests: (section: ResumeSection) =>
    section.type === "interests" ? (
      <InterestsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  courses: (section: ResumeSection) =>
    section.type === "courses" ? (
      <CoursesSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  organizations: (section: ResumeSection) =>
    section.type === "organizations" ? (
      <OrganizationsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  publications: (section: ResumeSection) =>
    section.type === "publications" ? (
      <PublicationsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  references: (section: ResumeSection) =>
    section.type === "references" ? (
      <ReferencesSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  declarations: (section: ResumeSection) =>
    section.type === "declarations" ? (
      <DeclarationsSection
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,

  custom: (section: ResumeSection) =>
    section.type === "custom" ? (
      <CustomSectionRenderer
        heading={section.heading}
        data={section.data}
        templateStyles={section.templateStyles}
      />
    ) : null,
};
