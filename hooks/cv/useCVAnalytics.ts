import { useState, useCallback, useMemo } from "react";
import { CVBuilderState } from "@/types/cv/cv-builder";

interface AnalyticsSuggestion {
  id: string;
  type: "error" | "warning" | "suggestion" | "optimization";
  category: "content" | "formatting" | "ats" | "keywords" | "length";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action?: () => void;
  autoFix?: boolean;
}

interface CVAnalytics {
  score: number;
  suggestions: AnalyticsSuggestion[];
  strengths: string[];
  weaknesses: string[];
  atsScore: number;
  keywordDensity: Record<string, number>;
  sectionCompleteness: Record<string, number>;
  overallLength: number;
  wordCount: number;
}

interface UseCVAnalyticsProps {
  state: CVBuilderState;
  onSuggestionApply?: (suggestion: AnalyticsSuggestion) => void;
}

export function useCVAnalytics({
  state,
  onSuggestionApply,
}: UseCVAnalyticsProps): CVAnalytics {
  const [suggestions, setSuggestions] = useState<AnalyticsSuggestion[]>([]);

  // Analyze CV content
  const analyzeCV = useCallback(() => {
    const newSuggestions: AnalyticsSuggestion[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Personal Info Analysis
    if (!state.personalInfo.firstName || !state.personalInfo.lastName) {
      newSuggestions.push({
        id: "missing-name",
        type: "error",
        category: "content",
        title: "Missing Name",
        description:
          "Your first and last name are required for a professional resume.",
        impact: "high",
      });
    } else {
      strengths.push("Complete personal information");
    }

    if (!state.personalInfo.email) {
      newSuggestions.push({
        id: "missing-email",
        type: "error",
        category: "content",
        title: "Missing Email",
        description: "A professional email address is essential for contact.",
        impact: "high",
      });
    }

    if (!state.personalInfo.phone) {
      newSuggestions.push({
        id: "missing-phone",
        type: "warning",
        category: "content",
        title: "Missing Phone Number",
        description:
          "Adding a phone number increases your chances of being contacted.",
        impact: "medium",
      });
    }

    // Experience Analysis
    if (state.experiences.length === 0) {
      newSuggestions.push({
        id: "no-experience",
        type: "warning",
        category: "content",
        title: "No Work Experience",
        description:
          "Consider adding internships, volunteer work, or projects if you don't have formal work experience.",
        impact: "high",
      });
    } else {
      strengths.push(
        `${state.experiences.length} work experience${
          state.experiences.length > 1 ? "s" : ""
        } listed`
      );
    }

    // Education Analysis
    if (state.educations.length === 0) {
      newSuggestions.push({
        id: "no-education",
        type: "warning",
        category: "content",
        title: "No Education Listed",
        description:
          "Include your educational background, even if it's in progress.",
        impact: "medium",
      });
    } else {
      strengths.push("Education section completed");
    }

    // Skills Analysis
    if (state.skills.length === 0) {
      newSuggestions.push({
        id: "no-skills",
        type: "warning",
        category: "content",
        title: "No Skills Listed",
        description:
          "Skills are crucial for ATS systems and recruiters to understand your capabilities.",
        impact: "high",
      });
    } else {
      strengths.push(`${state.skills.length} skills listed`);
    }

    // Professional Summary Analysis
    if (
      !state.professionalSummary.summary ||
      state.professionalSummary.summary.length < 50
    ) {
      newSuggestions.push({
        id: "weak-summary",
        type: "suggestion",
        category: "content",
        title: "Weak Professional Summary",
        description:
          "A strong professional summary should be 2-3 sentences highlighting your key strengths and career goals.",
        impact: "medium",
      });
    } else {
      strengths.push("Strong professional summary");
    }

    // Length Analysis
    const totalWords = calculateWordCount(state);
    if (totalWords < 200) {
      newSuggestions.push({
        id: "too-short",
        type: "warning",
        category: "length",
        title: "Resume Too Short",
        description:
          "Your resume seems too brief. Consider adding more details about your experiences and achievements.",
        impact: "medium",
      });
    } else if (totalWords > 800) {
      newSuggestions.push({
        id: "too-long",
        type: "suggestion",
        category: "length",
        title: "Resume Too Long",
        description:
          "Keep your resume concise. Recruiters typically spend 6 seconds scanning resumes.",
        impact: "low",
      });
    } else {
      strengths.push("Appropriate resume length");
    }

    // ATS Optimization
    const atsSuggestions = analyzeATS(state);
    newSuggestions.push(...atsSuggestions);

    // Keyword Analysis
    const keywordDensity = analyzeKeywords(state);

    // Section Completeness
    const sectionCompleteness = analyzeSectionCompleteness(state);

    // Calculate overall score
    const score = calculateOverallScore(
      state,
      newSuggestions,
      strengths,
      weaknesses
    );

    setSuggestions(newSuggestions);

    return {
      score,
      suggestions: newSuggestions,
      strengths,
      weaknesses,
      atsScore: calculateATSScore(state),
      keywordDensity,
      sectionCompleteness,
      overallLength: totalWords,
      wordCount: totalWords,
    };
  }, [state]);

  // Calculate word count
  const calculateWordCount = (state: CVBuilderState): number => {
    let wordCount = 0;

    // Personal info
    wordCount += (state.personalInfo.summary || "").split(" ").length;

    // Professional summary
    wordCount += (state.professionalSummary.summary || "").split(" ").length;

    // Experiences
    state.experiences.forEach((exp) => {
      wordCount += (exp.description || "").split(" ").length;
      wordCount += (exp.position || "").split(" ").length;
      wordCount += (exp.company || "").split(" ").length;
    });

    // Educations
    state.educations.forEach((edu) => {
      wordCount += (edu.degree || "").split(" ").length;
      wordCount += (edu.institution || "").split(" ").length;
      wordCount += (edu.field || "").split(" ").length;
    });

    // Skills
    state.skills.forEach((skill) => {
      wordCount += (skill.name || "").split(" ").length;
    });

    return wordCount;
  };

  // Analyze ATS compatibility
  const analyzeATS = (state: CVBuilderState): AnalyticsSuggestion[] => {
    const suggestions: AnalyticsSuggestion[] = [];

    // Check for common ATS issues
    if (state.personalInfo.email && !state.personalInfo.email.includes("@")) {
      suggestions.push({
        id: "invalid-email",
        type: "error",
        category: "ats",
        title: "Invalid Email Format",
        description:
          "Email address format is invalid and may not be recognized by ATS systems.",
        impact: "high",
      });
    }

    // Check for special characters that might cause ATS issues
    const specialChars = /[^\w\s@.-]/g;
    if (
      state.personalInfo.phone &&
      specialChars.test(state.personalInfo.phone)
    ) {
      suggestions.push({
        id: "phone-format",
        type: "warning",
        category: "ats",
        title: "Phone Number Format",
        description:
          "Use standard phone number format (e.g., +1-555-123-4567) for better ATS compatibility.",
        impact: "medium",
      });
    }

    return suggestions;
  };

  // Analyze keywords
  const analyzeKeywords = (state: CVBuilderState): Record<string, number> => {
    const keywordDensity: Record<string, number> = {};
    const commonKeywords = [
      "leadership",
      "management",
      "team",
      "project",
      "development",
      "analysis",
      "strategy",
      "communication",
      "problem-solving",
      "innovation",
      "collaboration",
      "results",
      "achievement",
    ];

    const allText = [
      state.personalInfo.summary,
      state.professionalSummary.summary,
      ...state.experiences.map((exp) => exp.description),
      ...state.educations.map((edu) => `${edu.degree} ${edu.field}`),
      ...state.skills.map((skill) => skill.name),
    ]
      .join(" ")
      .toLowerCase();

    commonKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "gi");
      const matches = allText.match(regex);
      keywordDensity[keyword] = matches ? matches.length : 0;
    });

    return keywordDensity;
  };

  // Analyze section completeness
  const analyzeSectionCompleteness = (
    state: CVBuilderState
  ): Record<string, number> => {
    const completeness: Record<string, number> = {};

    // Personal info completeness
    const personalFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "location",
    ];
    const filledPersonalFields = personalFields.filter(
      (field) => state.personalInfo[field as keyof typeof state.personalInfo]
    ).length;
    completeness.personal =
      (filledPersonalFields / personalFields.length) * 100;

    // Experience completeness
    const experienceFields = [
      "company",
      "position",
      "startDate",
      "description",
    ];
    const avgExperienceCompleteness =
      state.experiences.length > 0
        ? state.experiences.reduce((acc, exp) => {
            const filledFields = experienceFields.filter(
              (field) => exp[field as keyof typeof exp]
            ).length;
            return acc + (filledFields / experienceFields.length) * 100;
          }, 0) / state.experiences.length
        : 0;
    completeness.experience = avgExperienceCompleteness;

    // Education completeness
    const educationFields = ["institution", "degree", "startDate"];
    const avgEducationCompleteness =
      state.educations.length > 0
        ? state.educations.reduce((acc, edu) => {
            const filledFields = educationFields.filter(
              (field) => edu[field as keyof typeof edu]
            ).length;
            return acc + (filledFields / educationFields.length) * 100;
          }, 0) / state.educations.length
        : 0;
    completeness.education = avgEducationCompleteness;

    // Skills completeness
    const skillsFields = ["name", "level"];
    const avgSkillsCompleteness =
      state.skills.length > 0
        ? state.skills.reduce((acc, skill) => {
            const filledFields = skillsFields.filter(
              (field) => skill[field as keyof typeof skill]
            ).length;
            return acc + (filledFields / skillsFields.length) * 100;
          }, 0) / state.skills.length
        : 0;
    completeness.skills = avgSkillsCompleteness;

    return completeness;
  };

  // Calculate ATS score
  const calculateATSScore = (state: CVBuilderState): number => {
    let score = 0;
    let maxScore = 0;

    // Basic requirements
    maxScore += 20;
    if (state.personalInfo.firstName && state.personalInfo.lastName)
      score += 10;
    if (state.personalInfo.email) score += 10;

    // Contact information
    maxScore += 15;
    if (state.personalInfo.phone) score += 15;

    // Professional summary
    maxScore += 15;
    if (
      state.professionalSummary.summary &&
      state.professionalSummary.summary.length > 50
    )
      score += 15;

    // Work experience
    maxScore += 25;
    if (state.experiences.length > 0) score += 25;

    // Education
    maxScore += 15;
    if (state.educations.length > 0) score += 15;

    // Skills
    maxScore += 10;
    if (state.skills.length > 0) score += 10;

    return Math.round((score / maxScore) * 100);
  };

  // Calculate overall score
  const calculateOverallScore = (
    state: CVBuilderState,
    suggestions: AnalyticsSuggestion[],
    strengths: string[],
    weaknesses: string[]
  ): number => {
    let score = 100;

    // Deduct points for errors and warnings
    suggestions.forEach((suggestion) => {
      switch (suggestion.type) {
        case "error":
          score -=
            suggestion.impact === "high"
              ? 20
              : suggestion.impact === "medium"
              ? 15
              : 10;
          break;
        case "warning":
          score -=
            suggestion.impact === "high"
              ? 15
              : suggestion.impact === "medium"
              ? 10
              : 5;
          break;
        case "suggestion":
          score -=
            suggestion.impact === "high"
              ? 10
              : suggestion.impact === "medium"
              ? 5
              : 2;
          break;
      }
    });

    // Bonus points for strengths
    score += Math.min(strengths.length * 2, 10);

    return Math.max(0, Math.min(100, score));
  };

  // Memoize analytics to avoid recalculation on every render
  const analytics = useMemo(() => analyzeCV(), [analyzeCV]);

  return analytics;
}
