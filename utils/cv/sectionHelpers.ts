/**
 * Shared Section Logic for Classic Template
 *
 * Provides consistent data formatting for both HTML preview and PDF rendering
 */

import { ResumeSection } from "@/types/cv";

// utils/cv/sectionHelpers.ts
function scoreToLevel(score: number): string {
  if (score >= 85) return "Expert";
  if (score >= 65) return "Advanced";
  if (score >= 45) return "Intermediate";
  return "Beginner";
}

export function formatSectionContent(section: ResumeSection) {
  switch (section.type) {
    case "work-experience":
      return Array.isArray(section.data)
        ? section.data.map((exp: any) => ({
            title: exp.position || exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate || "Present",
            location: exp.location,
            description: exp.description, // Pass through the raw description
            bullets: exp.highlights || [], // Only use explicit highlights, not description
          }))
        : [];

    case "education":
      return Array.isArray(section.data)
        ? section.data.map((edu: any) => ({
            degree: edu.degree,
            school: edu.institution,
            field: edu.field,
            startDate: edu.startDate,
            endDate: edu.endDate || "Present",
            location: edu.location,
            gpa: edu.gpa,
          }))
        : [];

    case "skills": {
      const raw = Array.isArray(section.data)
        ? section.data
        : Array.isArray((section as any)?.data?.skills)
        ? (section as any).data.skills
        : [];

      return raw
        .map((skill: any) => ({
          name:
            typeof skill?.name === "string"
              ? skill.name
              : String(skill?.name ?? ""),
          level: skill?.level,
          category: skill?.category,
        }))
        .filter((s: any) => s.name && s.name.trim().length > 0); // ✅ drop empties
    }

    case "languages":
      return Array.isArray(section.data)
        ? section.data.map((lang: any) => ({
            name: lang.name,
            level: lang.level,
          }))
        : [];

    case "projects":
      return Array.isArray(section.data)
        ? section.data.map((project: any) => ({
            name: project.name,
            description: project.description,
            url: project.url,
            technologies: project.technologies || [],
            startDate: project.startDate,
            endDate: project.endDate || "Present",
          }))
        : [];

    case "certifications":
      return Array.isArray(section.data)
        ? section.data.map((cert: any) => ({
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            credentialId: cert.credentialId,
          }))
        : [];

    case "awards":
      return Array.isArray(section.data)
        ? section.data.map((award: any) => ({
            title: award.title,
            issuer: award.issuer,
            date: award.date,
            description: award.description,
          }))
        : [];

    case "interests":
      return Array.isArray(section.data)
        ? section.data.map((interest: any) => ({
            name: interest.name,
            description: interest.description,
          }))
        : [];

    case "professional-summary":
      return [
        {
          summary: section.data.summary,
        },
      ];

    case "personal-info":
      return [
        {
          firstName: section.data.firstName,
          lastName: section.data.lastName,
          email: section.data.email,
          phone: section.data.phone,
          location: section.data.location,
          targetedJobTitle: section.data.targetedJobTitle,
          image: section.data.image,
          linkedin: section.data.linkedin,
          github: section.data.github,
          twitter: section.data.twitter,
          instagram: section.data.instagram,
          website: section.data.website,
        },
      ];

    default:
      return section.data;
  }
}

/**
 * Get section display name
 * Prioritizes custom heading from section data, falls back to default mapping
 */
export function getSectionDisplayName(
  sectionType: string,
  section?: ResumeSection
): string {
  // If section has a custom heading, use it
  if (section?.heading) {
    return section.heading;
  }

  // Fallback to default display names
  const displayNames: { [key: string]: string } = {
    "work-experience": "Work Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    certifications: "Certifications",
    awards: "Awards",
    interests: "Interests",
    "professional-summary": "Professional Summary",
    "personal-info": "Personal Information",
  };

  return displayNames[sectionType] || sectionType;
}
