import { CVBuilderState } from "@/types/cv/cv-builder";
import { useState, useCallback, useMemo } from "react";

interface JobBoard {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  isActive: boolean;
  supportedFields: string[];
  requirements: {
    minSkills: number;
    requiredSections: string[];
    maxLength: number;
  };
}

interface ATS {
  id: string;
  name: string;
  description: string;
  compatibility: number; // 0-100
  requirements: {
    format: "pdf" | "docx" | "txt";
    maxFileSize: number;
    keywords: string[];
    sections: string[];
  };
  tips: string[];
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  jobBoard: string;
  appliedAt: Date;
  status: "applied" | "reviewed" | "interview" | "rejected" | "accepted";
  cvVersion: string;
  notes?: string;
}

interface UseJobBoardIntegrationProps {
  cvState: CVBuilderState;
  onApplicationSubmitted?: (application: JobApplication) => void;
  onATSCompatibilityChecked?: (ats: ATS, score: number) => void;
}

interface UseJobBoardIntegrationReturn {
  jobBoards: JobBoard[];
  atsSystems: ATS[];
  applications: JobApplication[];
  submitToJobBoard: (
    jobBoardId: string,
    jobId: string,
    jobTitle: string,
    company: string
  ) => Promise<JobApplication>;
  checkATSCompatibility: (atsId: string) => number;
  getOptimizationSuggestions: (atsId: string) => string[];
  getJobBoardRequirements: (jobBoardId: string) => any;
  validateCVForJobBoard: (jobBoardId: string) => {
    isValid: boolean;
    errors: string[];
  };
  getRecommendedJobBoards: () => JobBoard[];
  getApplicationHistory: () => JobApplication[];
}

export function useJobBoardIntegration({
  cvState,
  onApplicationSubmitted,
  onATSCompatibilityChecked,
}: UseJobBoardIntegrationProps): UseJobBoardIntegrationReturn {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Predefined job boards
  const jobBoards: JobBoard[] = useMemo(
    () => [
      {
        id: "linkedin",
        name: "LinkedIn",
        url: "https://linkedin.com",
        isActive: true,
        supportedFields: [
          "personalInfo",
          "experience",
          "education",
          "skills",
          "summary",
        ],
        requirements: {
          minSkills: 3,
          requiredSections: ["personalInfo", "experience"],
          maxLength: 1000,
        },
      },
      {
        id: "indeed",
        name: "Indeed",
        url: "https://indeed.com",
        isActive: true,
        supportedFields: ["personalInfo", "experience", "education", "skills"],
        requirements: {
          minSkills: 2,
          requiredSections: ["personalInfo", "experience"],
          maxLength: 800,
        },
      },
      {
        id: "glassdoor",
        name: "Glassdoor",
        url: "https://glassdoor.com",
        isActive: true,
        supportedFields: [
          "personalInfo",
          "experience",
          "education",
          "skills",
          "summary",
        ],
        requirements: {
          minSkills: 3,
          requiredSections: ["personalInfo", "experience"],
          maxLength: 1200,
        },
      },
      {
        id: "ziprecruiter",
        name: "ZipRecruiter",
        url: "https://ziprecruiter.com",
        isActive: true,
        supportedFields: ["personalInfo", "experience", "education", "skills"],
        requirements: {
          minSkills: 2,
          requiredSections: ["personalInfo", "experience"],
          maxLength: 900,
        },
      },
    ],
    []
  );

  // Predefined ATS systems
  const atsSystems: ATS[] = useMemo(
    () => [
      {
        id: "workday",
        name: "Workday",
        description: "Enterprise HR and financial management software",
        compatibility: 85,
        requirements: {
          format: "pdf",
          maxFileSize: 5 * 1024 * 1024, // 5MB
          keywords: ["experience", "skills", "education", "achievements"],
          sections: ["personalInfo", "experience", "education", "skills"],
        },
        tips: [
          "Use standard section headings",
          "Include quantifiable achievements",
          "Use relevant keywords from job description",
          "Keep formatting simple and clean",
        ],
      },
      {
        id: "taleo",
        name: "Oracle Taleo",
        description: "Cloud-based talent management suite",
        compatibility: 80,
        requirements: {
          format: "pdf",
          maxFileSize: 10 * 1024 * 1024, // 10MB
          keywords: ["leadership", "management", "project", "results"],
          sections: [
            "personalInfo",
            "experience",
            "education",
            "skills",
            "summary",
          ],
        },
        tips: [
          "Use action verbs in experience descriptions",
          "Include specific metrics and achievements",
          "Avoid complex formatting or graphics",
          "Use standard fonts like Arial or Times New Roman",
        ],
      },
      {
        id: "bamboohr",
        name: "BambooHR",
        description: "Human resources information system",
        compatibility: 90,
        requirements: {
          format: "pdf",
          maxFileSize: 5 * 1024 * 1024, // 5MB
          keywords: [
            "team",
            "collaboration",
            "communication",
            "problem-solving",
          ],
          sections: ["personalInfo", "experience", "education", "skills"],
        },
        tips: [
          "Keep sections clearly labeled",
          "Use bullet points for easy scanning",
          "Include contact information prominently",
          "Use consistent formatting throughout",
        ],
      },
      {
        id: "greenhouse",
        name: "Greenhouse",
        description: "Applicant tracking and recruiting software",
        compatibility: 88,
        requirements: {
          format: "pdf",
          maxFileSize: 8 * 1024 * 1024, // 8MB
          keywords: ["innovation", "growth", "impact", "leadership"],
          sections: [
            "personalInfo",
            "experience",
            "education",
            "skills",
            "summary",
          ],
        },
        tips: [
          "Highlight relevant experience prominently",
          "Use keywords from the job posting",
          "Include a strong professional summary",
          "Show career progression clearly",
        ],
      },
    ],
    []
  );

  // Submit CV to job board
  const submitToJobBoard = useCallback(
    async (
      jobBoardId: string,
      jobId: string,
      jobTitle: string,
      company: string
    ): Promise<JobApplication> => {
      const jobBoard = jobBoards.find((jb) => jb.id === jobBoardId);
      if (!jobBoard) {
        throw new Error("Job board not found");
      }

      // Validate CV for job board
      const validation = validateCVForJobBoard(jobBoardId);
      if (!validation.isValid) {
        throw new Error(
          `CV validation failed: ${validation.errors.join(", ")}`
        );
      }

      // Create application record
      const application: JobApplication = {
        id: `app-${Date.now()}`,
        jobId,
        jobTitle,
        company,
        jobBoard: jobBoard.name,
        appliedAt: new Date(),
        status: "applied",
        cvVersion: "current", // This would be the current CV version ID
      };

      setApplications((prev) => [...prev, application]);
      onApplicationSubmitted?.(application);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return application;
    },
    [jobBoards, onApplicationSubmitted]
  );

  // Check ATS compatibility
  const checkATSCompatibility = useCallback(
    (atsId: string): number => {
      const ats = atsSystems.find((a) => a.id === atsId);
      if (!ats) return 0;

      let score = ats.compatibility;

      // Check required sections
      const requiredSections = ats.requirements.sections;
      const cvSections = Object.keys(cvState).filter(
        (key) =>
          cvState[key as keyof CVBuilderState] &&
          typeof cvState[key as keyof CVBuilderState] === "object" &&
          cvState[key as keyof CVBuilderState] !== null
      );

      const missingSections = requiredSections.filter(
        (section) => !cvSections.includes(section)
      );
      if (missingSections.length > 0) {
        score -= missingSections.length * 10;
      }

      // Check keyword density
      const allText = [
        cvState.personalInfo?.summary || "",
        cvState.professionalSummary?.summary || "",
        ...(cvState.experiences?.map((exp) => exp.description || "") || []),
        ...(cvState.skills?.map((skill) => skill.name || "") || []),
      ]
        .join(" ")
        .toLowerCase();

      const keywordMatches = ats.requirements.keywords.filter((keyword) =>
        allText.includes(keyword.toLowerCase())
      );

      const keywordScore =
        (keywordMatches.length / ats.requirements.keywords.length) * 20;
      score += keywordScore;

      const finalScore = Math.max(0, Math.min(100, Math.round(score)));
      onATSCompatibilityChecked?.(ats, finalScore);

      return finalScore;
    },
    [atsSystems, cvState, onATSCompatibilityChecked]
  );

  // Get optimization suggestions
  const getOptimizationSuggestions = useCallback(
    (atsId: string): string[] => {
      const ats = atsSystems.find((a) => a.id === atsId);
      if (!ats) return [];

      const suggestions: string[] = [];
      const compatibility = checkATSCompatibility(atsId);

      if (compatibility < 70) {
        suggestions.push(
          "Consider adding more relevant keywords from the job description"
        );
      }

      if (compatibility < 80) {
        suggestions.push(
          "Ensure all required sections are filled out completely"
        );
      }

      if (compatibility < 90) {
        suggestions.push(
          "Add quantifiable achievements to your experience descriptions"
        );
      }

      // Add ATS-specific tips
      suggestions.push(...ats.tips);

      return suggestions;
    },
    [atsSystems, checkATSCompatibility]
  );

  // Get job board requirements
  const getJobBoardRequirements = useCallback(
    (jobBoardId: string) => {
      const jobBoard = jobBoards.find((jb) => jb.id === jobBoardId);
      return jobBoard?.requirements || null;
    },
    [jobBoards]
  );

  // Validate CV for job board
  const validateCVForJobBoard = useCallback(
    (jobBoardId: string): { isValid: boolean; errors: string[] } => {
      const jobBoard = jobBoards.find((jb) => jb.id === jobBoardId);
      if (!jobBoard) {
        return { isValid: false, errors: ["Job board not found"] };
      }

      const errors: string[] = [];
      const requirements = jobBoard.requirements;

      // Check required sections
      if (requirements.requiredSections.includes("personalInfo")) {
        if (
          !cvState.personalInfo?.firstName ||
          !cvState.personalInfo?.lastName
        ) {
          errors.push("First name and last name are required");
        }
        if (!cvState.personalInfo?.email) {
          errors.push("Email address is required");
        }
      }

      if (requirements.requiredSections.includes("experience")) {
        if (!cvState.experiences || cvState.experiences.length === 0) {
          errors.push("At least one work experience is required");
        }
      }

      // Check minimum skills
      if (cvState.skills && cvState.skills.length < requirements.minSkills) {
        errors.push(`At least ${requirements.minSkills} skills are required`);
      }

      // Check length
      const wordCount = calculateWordCount(cvState);
      if (wordCount > requirements.maxLength) {
        errors.push(
          `Resume is too long. Maximum ${requirements.maxLength} words allowed`
        );
      }

      return { isValid: errors.length === 0, errors };
    },
    [jobBoards, cvState]
  );

  // Calculate word count
  const calculateWordCount = (state: CVBuilderState): number => {
    let wordCount = 0;

    if (state.personalInfo?.summary) {
      wordCount += state.personalInfo.summary.split(" ").length;
    }

    if (state.professionalSummary?.summary) {
      wordCount += state.professionalSummary.summary.split(" ").length;
    }

    if (state.experiences) {
      state.experiences.forEach((exp) => {
        if (exp.description) {
          wordCount += exp.description.split(" ").length;
        }
      });
    }

    return wordCount;
  };

  // Get recommended job boards
  const getRecommendedJobBoards = useCallback((): JobBoard[] => {
    return jobBoards
      .filter((jb) => jb.isActive)
      .sort((a, b) => {
        const aCompatibility = validateCVForJobBoard(a.id).isValid ? 1 : 0;
        const bCompatibility = validateCVForJobBoard(b.id).isValid ? 1 : 0;
        return bCompatibility - aCompatibility;
      });
  }, [jobBoards, validateCVForJobBoard]);

  // Get application history
  const getApplicationHistory = useCallback((): JobApplication[] => {
    return applications.sort(
      (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()
    );
  }, [applications]);

  return {
    jobBoards,
    atsSystems,
    applications,
    submitToJobBoard,
    checkATSCompatibility,
    getOptimizationSuggestions,
    getJobBoardRequirements,
    validateCVForJobBoard,
    getRecommendedJobBoards,
    getApplicationHistory,
  };
}
