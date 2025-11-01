"use client";

import React, { memo, useMemo } from "react";
import DynamicSectionContent from "./DynamicSectionContent";
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
} from "@/types/cv";

interface MemoizedDynamicSectionContentProps {
  activeSection: string;
  templateConfig: any;
  onUpdateTemplateConfig: (updates: any) => void;
  onRemoveSection: (sectionType: string) => void;
  onAddSection: () => void;
  onShowAIConsent?: () => void;
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  awards: AwardType[];
  projects: Project[];
  interests: Interest[];
  customSections: CustomSection[];
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  onUpdateProfessionalSummary: (updates: Partial<ProfessionalSummary>) => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
  onUpdateExperience: (id: string, field: string, value: any) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onUpdateEducation: (id: string, field: string, value: any) => void;
  onAddSkill: () => void;
  onRemoveSkill: (id: string) => void;
  onUpdateSkill: (id: string, field: string, value: any) => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (id: string) => void;
  onUpdateLanguage: (id: string, field: string, value: any) => void;
  onAddCertification: () => void;
  onRemoveCertification: (id: string) => void;
  onUpdateCertification: (id: string, field: string, value: any) => void;
  onAddAward: () => void;
  onRemoveAward: (id: string) => void;
  onUpdateAward: (id: string, field: string, value: any) => void;
  onAddProject: () => void;
  onRemoveProject: (id: string) => void;
  onUpdateProject: (id: string, field: string, value: any) => void;
  onAddInterest: () => void;
  onRemoveInterest: (id: string) => void;
  onUpdateInterest: (id: string, field: string, value: any) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onAddCustomSection: () => void;
  onRemoveCustomSection: (id: string) => void;
  onUpdateCustomSection: (id: string, updates: any) => void;
  dependencies?: any[];
}

const MemoizedDynamicSectionContent = memo<MemoizedDynamicSectionContentProps>(
  (props) => {
    // Memoize the section content based on dependencies
    const memoizedContent = useMemo(() => {
      return <DynamicSectionContent {...props} />;
    }, [
      props.activeSection,
      props.personalInfo,
      props.professionalSummary,
      props.experiences,
      props.educations,
      props.skills,
      props.languages,
      props.certifications,
      props.awards,
      props.projects,
      props.interests,
      props.customSections,
      props.templateConfig,
      ...(props.dependencies || []),
    ]);

    return memoizedContent;
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
      prevProps.activeSection === nextProps.activeSection &&
      JSON.stringify(prevProps.personalInfo) ===
        JSON.stringify(nextProps.personalInfo) &&
      JSON.stringify(prevProps.professionalSummary) ===
        JSON.stringify(nextProps.professionalSummary) &&
      JSON.stringify(prevProps.experiences) ===
        JSON.stringify(nextProps.experiences) &&
      JSON.stringify(prevProps.educations) ===
        JSON.stringify(nextProps.educations) &&
      JSON.stringify(prevProps.skills) === JSON.stringify(nextProps.skills) &&
      JSON.stringify(prevProps.languages) ===
        JSON.stringify(nextProps.languages) &&
      JSON.stringify(prevProps.certifications) ===
        JSON.stringify(nextProps.certifications) &&
      JSON.stringify(prevProps.awards) === JSON.stringify(nextProps.awards) &&
      JSON.stringify(prevProps.projects) ===
        JSON.stringify(nextProps.projects) &&
      JSON.stringify(prevProps.interests) ===
        JSON.stringify(nextProps.interests) &&
      JSON.stringify(prevProps.customSections) ===
        JSON.stringify(nextProps.customSections) &&
      JSON.stringify(prevProps.templateConfig) ===
        JSON.stringify(nextProps.templateConfig) &&
      JSON.stringify(prevProps.dependencies) ===
        JSON.stringify(nextProps.dependencies)
    );
  }
);

MemoizedDynamicSectionContent.displayName = "MemoizedDynamicSectionContent";

export default MemoizedDynamicSectionContent;
