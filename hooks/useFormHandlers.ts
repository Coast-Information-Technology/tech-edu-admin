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
  CustomSection,
} from "@/types/cv";

export function useFormHandlers() {
  // Experience handlers
  const handleAddExperience = (
    experiences: Experience[],
    setExperiences: (exp: Experience[]) => void
  ) => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const handleRemoveExperience = (
    id: string,
    experiences: Experience[],
    setExperiences: (exp: Experience[]) => void
  ) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleUpdateExperience = (
    id: string,
    field: string,
    value: any,
    experiences: Experience[],
    setExperiences: (exp: Experience[]) => void
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Education handlers
  const handleAddEducation = (
    educations: Education[],
    setEducations: (edu: Education[]) => void
  ) => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    setEducations([...educations, newEdu]);
  };

  const handleRemoveEducation = (
    id: string,
    educations: Education[],
    setEducations: (edu: Education[]) => void
  ) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const handleUpdateEducation = (
    id: string,
    field: string,
    value: any,
    educations: Education[],
    setEducations: (edu: Education[]) => void
  ) => {
    setEducations(
      educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  // Skill handlers
  const handleAddSkill = (
    skills: Skill[],
    setSkills: (skills: Skill[]) => void
  ) => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: "",
      level: "Beginner",
    };
    setSkills([...skills, newSkill]);
  };

  const handleRemoveSkill = (
    id: string,
    skills: Skill[],
    setSkills: (skills: Skill[]) => void
  ) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleUpdateSkill = (
    id: string,
    field: string,
    value: any,
    skills: Skill[],
    setSkills: (skills: Skill[]) => void
  ) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  // Language handlers
  const handleAddLanguage = (
    languages: Language[],
    setLanguages: (langs: Language[]) => void
  ) => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: "",
      level: "Basic",
    };
    setLanguages([...languages, newLang]);
  };

  const handleRemoveLanguage = (
    id: string,
    languages: Language[],
    setLanguages: (langs: Language[]) => void
  ) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const handleUpdateLanguage = (
    id: string,
    field: string,
    value: any,
    languages: Language[],
    setLanguages: (langs: Language[]) => void
  ) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  // Certification handlers
  const handleAddCertification = (
    certifications: Certification[],
    setCertifications: (certs: Certification[]) => void
  ) => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      credentialId: "",
    };
    setCertifications([...certifications, newCert]);
  };

  const handleRemoveCertification = (
    id: string,
    certifications: Certification[],
    setCertifications: (certs: Certification[]) => void
  ) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const handleUpdateCertification = (
    id: string,
    field: string,
    value: any,
    certifications: Certification[],
    setCertifications: (certs: Certification[]) => void
  ) => {
    setCertifications(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  // Award handlers
  const handleAddAward = (
    awards: AwardType[],
    setAwards: (awards: AwardType[]) => void
  ) => {
    const newAward: AwardType = {
      id: `award-${Date.now()}`,
      title: "",
      issuer: "",
      date: "",
      description: "",
    };
    setAwards([...awards, newAward]);
  };

  const handleRemoveAward = (
    id: string,
    awards: AwardType[],
    setAwards: (awards: AwardType[]) => void
  ) => {
    setAwards(awards.filter((award) => award.id !== id));
  };

  const handleUpdateAward = (
    id: string,
    field: string,
    value: any,
    awards: AwardType[],
    setAwards: (awards: AwardType[]) => void
  ) => {
    setAwards(
      awards.map((award) =>
        award.id === id ? { ...award, [field]: value } : award
      )
    );
  };

  // Project handlers
  const handleAddProject = (
    projects: Project[],
    setProjects: (projects: Project[]) => void
  ) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: "",
      description: "",
      technologies: [],
      url: "",
    };
    setProjects([...projects, newProject]);
  };

  const handleRemoveProject = (
    id: string,
    projects: Project[],
    setProjects: (projects: Project[]) => void
  ) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleUpdateProject = (
    id: string,
    field: string,
    value: any,
    projects: Project[],
    setProjects: (projects: Project[]) => void
  ) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  // Interest handlers
  const handleAddInterest = (
    interests: Interest[],
    setInterests: (interests: Interest[]) => void
  ) => {
    const newInterest: Interest = {
      id: `interest-${Date.now()}`,
      name: "",
    };
    setInterests([...interests, newInterest]);
  };

  const handleRemoveInterest = (
    id: string,
    interests: Interest[],
    setInterests: (interests: Interest[]) => void
  ) => {
    setInterests(interests.filter((interest) => interest.id !== id));
  };

  const handleUpdateInterest = (
    id: string,
    field: string,
    value: any,
    interests: Interest[],
    setInterests: (interests: Interest[]) => void
  ) => {
    setInterests(
      interests.map((interest) =>
        interest.id === id ? { ...interest, [field]: value } : interest
      )
    );
  };

  // Custom section handlers
  const handleAddCustomSection = (
    customSections: CustomSection[],
    setCustomSections: (sections: CustomSection[]) => void
  ) => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title: "",
      content: "",
    };
    setCustomSections([...customSections, newSection]);
  };

  const handleRemoveCustomSection = (
    id: string,
    customSections: CustomSection[],
    setCustomSections: (sections: CustomSection[]) => void
  ) => {
    setCustomSections(customSections.filter((section) => section.id !== id));
  };

  const handleUpdateCustomSection = (
    id: string,
    field: string,
    value: any,
    customSections: CustomSection[],
    setCustomSections: (sections: CustomSection[]) => void
  ) => {
    setCustomSections(
      customSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  // Image handlers
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    personalInfo: PersonalInfo,
    setPersonalInfo: (info: PersonalInfo) => void
  ) => {
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
        setPersonalInfo({ ...personalInfo, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (
    personalInfo: PersonalInfo,
    setPersonalInfo: (info: PersonalInfo) => void
  ) => {
    setPersonalInfo({ ...personalInfo, image: "" });
  };

  return {
    // Experience
    handleAddExperience,
    handleRemoveExperience,
    handleUpdateExperience,

    // Education
    handleAddEducation,
    handleRemoveEducation,
    handleUpdateEducation,

    // Skills
    handleAddSkill,
    handleRemoveSkill,
    handleUpdateSkill,

    // Languages
    handleAddLanguage,
    handleRemoveLanguage,
    handleUpdateLanguage,

    // Certifications
    handleAddCertification,
    handleRemoveCertification,
    handleUpdateCertification,

    // Awards
    handleAddAward,
    handleRemoveAward,
    handleUpdateAward,

    // Projects
    handleAddProject,
    handleRemoveProject,
    handleUpdateProject,

    // Interests
    handleAddInterest,
    handleRemoveInterest,
    handleUpdateInterest,

    // Custom Sections
    handleAddCustomSection,
    handleRemoveCustomSection,
    handleUpdateCustomSection,

    // Image
    handleImageUpload,
    handleRemoveImage,
  };
}
