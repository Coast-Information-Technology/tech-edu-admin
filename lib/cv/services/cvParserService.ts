// CV Parser Service - Analyzes uploaded CV and extracts structured data
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Award,
  Project,
  Interest,
  ProfessionalSummary,
} from "@/types/cv";

export interface ParsedCVData {
  personalInfo: PersonalInfo;
  professionalSummary?: ProfessionalSummary;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  awards: Award[];
  projects: Project[];
  interests: Interest[];
  confidence: number; // 0-1 confidence score
  rawText: string;
}

export interface ParseOptions {
  language?: string;
  extractSkills?: boolean;
  extractDates?: boolean;
  normalizeFormats?: boolean;
}

/**
 * Parse uploaded CV text and extract structured data
 * This is a simplified parser - in production, you'd use more sophisticated NLP
 */
export async function parseCV(
  text: string,
  options: ParseOptions = {}
): Promise<ParsedCVData> {
  try {
    // Clean and normalize text
    const cleanText = cleanTextInput(text);

    // Initialize default data structure
    const parsedData: ParsedCVData = {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        twitter: "",
        instagram: "",
        website: "",
        targetedJobTitle: "",
        image: "",
      },
      professionalSummary: {
        id: "professional-summary",
        summary: "",
      },
      experiences: [],
      educations: [],
      skills: [],
      languages: [],
      certifications: [],
      awards: [],
      projects: [],
      interests: [],
      confidence: 0,
      rawText: cleanText,
    };

    // Extract personal information
    parsedData.personalInfo = extractPersonalInfo(cleanText);

    // Extract professional summary/objective
    parsedData.professionalSummary = extractProfessionalSummary(cleanText);

    // Extract work experience
    parsedData.experiences = extractExperiences(cleanText);

    // Extract education
    parsedData.educations = extractEducation(cleanText);

    // Extract skills
    parsedData.skills = extractSkills(cleanText);

    // Extract languages
    parsedData.languages = extractLanguages(cleanText);

    // Extract certifications
    parsedData.certifications = extractCertifications(cleanText);

    // Extract awards
    parsedData.awards = extractAwards(cleanText);

    // Extract projects
    parsedData.projects = extractProjects(cleanText);

    // Extract interests
    parsedData.interests = extractInterests(cleanText);

    // Calculate confidence score
    parsedData.confidence = calculateConfidence(parsedData);

    return parsedData;
  } catch (error) {
    console.error("CV parsing failed:", error);
    throw new Error("Failed to parse CV content");
  }
}

/**
 * Clean and normalize input text
 */
function cleanTextInput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract personal information from CV text
 */
function extractPersonalInfo(text: string): PersonalInfo {
  const personalInfo: PersonalInfo = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    twitter: "",
    instagram: "",
    website: "",
    targetedJobTitle: "",
    image: "",
  };

  // Extract email
  const emailMatch = text.match(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
  );
  if (emailMatch) {
    personalInfo.email = emailMatch[1];
  }

  // Extract phone
  const phoneMatch = text.match(/(\+?[\d\s\-\(\)]{10,})/);
  if (phoneMatch) {
    personalInfo.phone = phoneMatch[1].trim();
  }

  // Extract LinkedIn
  const linkedinMatch = text.match(
    /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)([a-zA-Z0-9\-]+)/i
  );
  if (linkedinMatch) {
    personalInfo.linkedin = linkedinMatch[1];
  }

  // Extract GitHub
  const githubMatch = text.match(/(?:github\.com\/)([a-zA-Z0-9\-]+)/i);
  if (githubMatch) {
    personalInfo.github = githubMatch[1];
  }

  // Extract website
  const websiteMatch = text.match(/(https?:\/\/[^\s]+)/);
  if (websiteMatch) {
    personalInfo.website = websiteMatch[1];
  }

  // Extract name (first line or after "Name:")
  const nameMatch = text.match(/(?:Name:\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  if (nameMatch) {
    const fullName = nameMatch[1].trim();
    const nameParts = fullName.split(" ");
    personalInfo.firstName = nameParts[0] || "";
    personalInfo.lastName = nameParts.slice(1).join(" ") || "";
  }

  // Extract location (look for city, state/country patterns)
  const locationMatch = text.match(
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,}(?:\s+[A-Z]{2,})?)/
  );
  if (locationMatch) {
    personalInfo.location = locationMatch[1];
  }

  return personalInfo;
}

/**
 * Extract professional summary/objective
 */
function extractProfessionalSummary(text: string): ProfessionalSummary {
  const summaryMatch = text.match(
    /(?:summary|objective|profile|about)[:\s]*([^.]*(?:\.[^.]*)*)/i
  );
  if (summaryMatch) {
    return {
      id: "professional-summary",
      summary: summaryMatch[1].trim(),
    };
  }
  return { id: "professional-summary", summary: "" };
}

/**
 * Extract work experience
 */
function extractExperiences(text: string): Experience[] {
  const experiences: Experience[] = [];

  // Look for experience sections
  const experienceRegex =
    /(?:experience|work history|employment|professional experience)[:\s]*(.*?)(?=(?:education|skills|projects|$))/i;
  const experienceMatch = text.match(experienceRegex);

  if (experienceMatch) {
    const experienceText = experienceMatch[1];

    // Split by common job separators
    const jobEntries = experienceText.split(
      /(?=\d{4}|\w+\s+\d{4}|present|current)/i
    );

    jobEntries.forEach((entry, index) => {
      if (entry.trim().length < 20) return; // Skip very short entries

      const experience: Experience = {
        id: `exp-${index}`,
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      };

      // Extract position and company
      const positionCompanyMatch = entry.match(/([^,]+),\s*([^,\n]+)/);
      if (positionCompanyMatch) {
        experience.position = positionCompanyMatch[1].trim();
        experience.company = positionCompanyMatch[2].trim();
      }

      // Extract dates
      const dateMatch = entry.match(
        /(\d{4})\s*[-–]\s*(\d{4}|present|current)/i
      );
      if (dateMatch) {
        experience.startDate = dateMatch[1];
        experience.endDate =
          dateMatch[2].toLowerCase() === "present" ||
          dateMatch[2].toLowerCase() === "current"
            ? ""
            : dateMatch[2];
        experience.current =
          dateMatch[2].toLowerCase() === "present" ||
          dateMatch[2].toLowerCase() === "current";
      }

      // Extract description (remaining text)
      const descriptionMatch = entry.match(
        /(?:\d{4}[-–]\d{4}|\d{4}[-–]present)[\s\S]*$/i
      );
      if (descriptionMatch) {
        experience.description = descriptionMatch[0]
          .replace(/^\d{4}[-–]\d{4}[\s\S]*?/i, "")
          .trim();
      }

      if (experience.position && experience.company) {
        experiences.push(experience);
      }
    });
  }

  return experiences;
}

/**
 * Extract education information
 */
function extractEducation(text: string): Education[] {
  const educations: Education[] = [];

  const educationRegex =
    /(?:education|academic background|qualifications)[:\s]*(.*?)(?=(?:experience|skills|projects|$))/i;
  const educationMatch = text.match(educationRegex);

  if (educationMatch) {
    const educationText = educationMatch[1];
    const educationEntries = educationText.split(/(?=\d{4}|\w+\s+\d{4})/i);

    educationEntries.forEach((entry, index) => {
      if (entry.trim().length < 15) return;

      const education: Education = {
        id: `edu-${index}`,
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        gpa: "",
      };

      // Extract degree and institution
      const degreeInstitutionMatch = entry.match(/([^,]+),\s*([^,\n]+)/);
      if (degreeInstitutionMatch) {
        education.degree = degreeInstitutionMatch[1].trim();
        education.institution = degreeInstitutionMatch[2].trim();
      }

      // Extract dates
      const dateMatch = entry.match(/(\d{4})\s*[-–]\s*(\d{4})/);
      if (dateMatch) {
        education.startDate = dateMatch[1];
        education.endDate = dateMatch[2];
      }

      if (education.degree && education.institution) {
        educations.push(education);
      }
    });
  }

  return educations;
}

/**
 * Extract skills
 */
function extractSkills(text: string): Skill[] {
  const skills: Skill[] = [];

  const skillsRegex =
    /(?:skills|technical skills|competencies|technologies)[:\s]*(.*?)(?=(?:experience|education|projects|$))/i;
  const skillsMatch = text.match(skillsRegex);

  if (skillsMatch) {
    const skillsText = skillsMatch[1];

    // Split by common separators
    const skillItems = skillsText.split(/[,;\n•\-]/);

    skillItems.forEach((item, index) => {
      const skillName = item.trim();
      if (skillName.length > 2 && skillName.length < 50) {
        skills.push({
          id: `skill-${index}`,
          name: skillName,
          level: "Intermediate", // Default level
        });
      }
    });
  }

  return skills.slice(0, 20); // Limit to 20 skills
}

/**
 * Extract languages
 */
function extractLanguages(text: string): Language[] {
  const languages: Language[] = [];

  const languagesRegex =
    /(?:languages|language skills)[:\s]*(.*?)(?=(?:experience|education|skills|$))/i;
  const languagesMatch = text.match(languagesRegex);

  if (languagesMatch) {
    const languagesText = languagesMatch[1];
    const languageItems = languagesText.split(/[,;\n•\-]/);

    languageItems.forEach((item, index) => {
      const languageMatch = item.match(/([A-Za-z]+)(?:\s*[-–]\s*([A-Za-z]+))?/);
      if (languageMatch) {
        languages.push({
          id: `lang-${index}`,
          name: languageMatch[1].trim(),
          level:
            (languageMatch[2]?.trim() as
              | "Basic"
              | "Conversational"
              | "Professional"
              | "Native") || "Conversational",
        });
      }
    });
  }

  return languages;
}

/**
 * Extract certifications
 */
function extractCertifications(text: string): Certification[] {
  const certifications: Certification[] = [];

  const certRegex =
    /(?:certifications|certificates|credentials)[:\s]*(.*?)(?=(?:experience|education|skills|$))/i;
  const certMatch = text.match(certRegex);

  if (certMatch) {
    const certText = certMatch[1];
    const certItems = certText.split(/[,;\n•\-]/);

    certItems.forEach((item, index) => {
      const certName = item.trim();
      if (certName.length > 5 && certName.length < 100) {
        certifications.push({
          id: `cert-${index}`,
          name: certName,
          issuer: "", // Would need more sophisticated parsing
          date: "",
        });
      }
    });
  }

  return certifications;
}

/**
 * Extract awards
 */
function extractAwards(text: string): Award[] {
  const awards: Award[] = [];

  const awardsRegex =
    /(?:awards|achievements|honors|recognition)[:\s]*(.*?)(?=(?:experience|education|skills|$))/i;
  const awardsMatch = text.match(awardsRegex);

  if (awardsMatch) {
    const awardsText = awardsMatch[1];
    const awardItems = awardsText.split(/[,;\n•\-]/);

    awardItems.forEach((item, index) => {
      const awardName = item.trim();
      if (awardName.length > 5 && awardName.length < 100) {
        awards.push({
          id: `award-${index}`,
          title: awardName,
          issuer: "",
          date: "",
          description: "",
        });
      }
    });
  }

  return awards;
}

/**
 * Extract projects
 */
function extractProjects(text: string): Project[] {
  const projects: Project[] = [];

  const projectsRegex =
    /(?:projects|portfolio|key projects)[:\s]*(.*?)(?=(?:experience|education|skills|$))/i;
  const projectsMatch = text.match(projectsRegex);

  if (projectsMatch) {
    const projectsText = projectsMatch[1];

    // Split by project indicators
    const projectItems = projectsText.split(/(?=\w+.*\d{4})/);

    projectItems.forEach((item, index) => {
      if (item.trim().length < 20) return;

      const project: Project = {
        id: `proj-${index}`,
        name: "",
        description: item.trim(),
        url: "",
        technologies: [],
      };

      // Extract project name (first line or before date)
      const nameMatch = item.match(/^([^,\n]+)/);
      if (nameMatch) {
        project.name = nameMatch[1].trim();
      }

      projects.push(project);
    });
  }

  return projects;
}

/**
 * Extract interests
 */
function extractInterests(text: string): Interest[] {
  const interests: Interest[] = [];

  const interestsRegex =
    /(?:interests|hobbies|activities)[:\s]*(.*?)(?=(?:experience|education|skills|$))/i;
  const interestsMatch = text.match(interestsRegex);

  if (interestsMatch) {
    const interestsText = interestsMatch[1];
    const interestItems = interestsText.split(/[,;\n•\-]/);

    interestItems.forEach((item, index) => {
      const interestName = item.trim();
      if (interestName.length > 2 && interestName.length < 50) {
        interests.push({
          id: `interest-${index}`,
          name: interestName,
        });
      }
    });
  }

  return interests;
}

/**
 * Calculate confidence score based on extracted data
 */
function calculateConfidence(data: ParsedCVData): number {
  let score = 0;
  let maxScore = 0;

  // Personal info (30 points)
  maxScore += 30;
  if (data.personalInfo.firstName) score += 5;
  if (data.personalInfo.lastName) score += 5;
  if (data.personalInfo.email) score += 10;
  if (data.personalInfo.phone) score += 5;
  if (data.personalInfo.location) score += 5;

  // Professional summary (10 points)
  maxScore += 10;
  if (data.professionalSummary?.summary) score += 10;

  // Experience (30 points)
  maxScore += 30;
  score += Math.min(data.experiences.length * 5, 30);

  // Education (15 points)
  maxScore += 15;
  score += Math.min(data.educations.length * 7, 15);

  // Skills (15 points)
  maxScore += 15;
  score += Math.min(data.skills.length * 1, 15);

  return Math.round((score / maxScore) * 100) / 100;
}
