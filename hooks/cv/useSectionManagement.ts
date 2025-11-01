import { useCallback, useMemo } from "react";
import {
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
import { SectionManager } from "@/types/cv/cv-builder";

interface UseSectionManagementProps {
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  awards: AwardType[];
  projects: Project[];
  interests: Interest[];
  customSections: CustomSection[];

  setExperiences: (experiences: Experience[]) => void;
  setEducations: (educations: Education[]) => void;
  setSkills: (skills: Skill[]) => void;
  setLanguages: (languages: Language[]) => void;
  setCertifications: (certifications: Certification[]) => void;
  setAwards: (awards: AwardType[]) => void;
  setProjects: (projects: Project[]) => void;
  setInterests: (interests: Interest[]) => void;
  setCustomSections: (customSections: CustomSection[]) => void;
}

export function useSectionManagement({
  experiences,
  educations,
  skills,
  languages,
  certifications,
  awards,
  projects,
  interests,
  customSections,
  setExperiences,
  setEducations,
  setSkills,
  setLanguages,
  setCertifications,
  setAwards,
  setProjects,
  setInterests,
  setCustomSections,
}: UseSectionManagementProps): SectionManager {
  // Generic CRUD operations factory
  const createCRUDOperations = useCallback(
    <T extends { id: string }>(
      items: T[],
      setItems: (items: T[]) => void,
      createNewItem: () => T
    ) => ({
      add: () => {
        const newItem = createNewItem();
        setItems([...items, newItem]);
      },
      remove: (id: string) => {
        setItems(items.filter((item) => item.id !== id));
      },
      update: (id: string, field: keyof T, value: any) => {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          )
        );
      },
    }),
    []
  );

  // Experience operations
  const experienceOps = useMemo(
    () =>
      createCRUDOperations(
        experiences,
        setExperiences,
        () =>
          ({
            id: Date.now().toString(),
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          } as Experience)
      ),
    [experiences, setExperiences]
  );

  // Education operations
  const educationOps = useMemo(
    () =>
      createCRUDOperations(
        educations,
        setEducations,
        () =>
          ({
            id: Date.now().toString(),
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            current: false,
          } as Education)
      ),
    [educations, setEducations]
  );

  // Skills operations
  const skillOps = useMemo(
    () =>
      createCRUDOperations(
        skills,
        setSkills,
        () =>
          ({
            id: Date.now().toString(),
            name: "",
            level: "Intermediate",
          } as Skill)
      ),
    [skills, setSkills]
  );

  // Languages operations
  const languageOps = useMemo(
    () =>
      createCRUDOperations(
        languages,
        setLanguages,
        () =>
          ({
            id: Date.now().toString(),
            name: "",
            level: "Basic",
          } as Language)
      ),
    [languages, setLanguages]
  );

  // Certifications operations
  const certificationOps = useMemo(
    () =>
      createCRUDOperations(
        certifications,
        setCertifications,
        () =>
          ({
            id: Date.now().toString(),
            name: "",
            issuer: "",
            date: "",
            credentialId: "",
            credentialUrl: "",
          } as Certification)
      ),
    [certifications, setCertifications]
  );

  // Awards operations
  const awardOps = useMemo(
    () =>
      createCRUDOperations(
        awards,
        setAwards,
        () =>
          ({
            id: Date.now().toString(),
            title: "",
            issuer: "",
            date: "",
            description: "",
          } as AwardType)
      ),
    [awards, setAwards]
  );

  // Projects operations
  const projectOps = useMemo(
    () =>
      createCRUDOperations(
        projects,
        setProjects,
        () =>
          ({
            id: Date.now().toString(),
            name: "",
            description: "",
            technologies: [],
            url: "",
            githubUrl: "",
          } as Project)
      ),
    [projects, setProjects]
  );

  // Interests operations
  const interestOps = useMemo(
    () =>
      createCRUDOperations(
        interests,
        setInterests,
        () =>
          ({
            id: Date.now().toString(),
            name: "",
            description: "",
          } as Interest)
      ),
    [interests, setInterests]
  );

  // Custom sections operations
  const customSectionOps = useMemo(
    () =>
      createCRUDOperations(
        customSections,
        setCustomSections,
        () =>
          ({
            id: Date.now().toString(),
            title: "",
            content: "",
          } as CustomSection)
      ),
    [customSections, setCustomSections]
  );

  return {
    // Experience
    addExperience: experienceOps.add,
    removeExperience: experienceOps.remove,
    updateExperience: experienceOps.update,

    // Education
    addEducation: educationOps.add,
    removeEducation: educationOps.remove,
    updateEducation: educationOps.update,

    // Skills
    addSkill: skillOps.add,
    removeSkill: skillOps.remove,
    updateSkill: skillOps.update,

    // Languages
    addLanguage: languageOps.add,
    removeLanguage: languageOps.remove,
    updateLanguage: languageOps.update,

    // Certifications
    addCertification: certificationOps.add,
    removeCertification: certificationOps.remove,
    updateCertification: certificationOps.update,

    // Awards
    addAward: awardOps.add,
    removeAward: awardOps.remove,
    updateAward: awardOps.update,

    // Projects
    addProject: projectOps.add,
    removeProject: projectOps.remove,
    updateProject: projectOps.update,

    // Interests
    addInterest: interestOps.add,
    removeInterest: interestOps.remove,
    updateInterest: interestOps.update,

    // Custom Sections
    addCustomSection: customSectionOps.add,
    removeCustomSection: customSectionOps.remove,
    updateCustomSection: customSectionOps.update,
  };
}
