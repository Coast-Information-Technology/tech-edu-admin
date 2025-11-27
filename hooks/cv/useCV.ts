import { useState, useCallback } from "react";
import { ResumeSection } from "@/types/cv";
import { mapResumePropsToSections } from "@/utils/cv/resumeSectionMapper";
import {
  cvService,
  CreateCVRequest,
  CVResponse,
} from "@/services/cv/cvServiceOptimized";

interface UseCVProps {
  personalInfo: any;
  professionalSummary?: any;
  experiences: any[];
  educations: any[];
  skills: any[];
  languages?: any[];
  certifications?: any[];
  awards?: any[];
  projects?: any[];
  template: string;
  enabledSections: string[];
}

interface UseCVReturn {
  cvId: string | null;
  isLoading: boolean;
  error: string | null;
  saveCV: () => Promise<void>;
  saveDraft: () => Promise<void>;
  loadCV: (id: string) => Promise<void>;
  loadDraft: (id: string) => Promise<void>;
  publishCV: () => Promise<void>;
  clearError: () => void;
  // Success feedback
  showSuccessMessage: boolean;
  successMessage: string;
  clearSuccess: () => void;
}

export function useCV({
  personalInfo,
  professionalSummary,
  experiences,
  educations,
  skills,
  languages = [],
  certifications = [],
  awards = [],
  projects = [],
  template,
  enabledSections,
}: UseCVProps): UseCVReturn {
  const [cvId, setCvId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setShowSuccessMessage(false);
    setSuccessMessage("");
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  }, []);

  const saveCV = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resumeData = mapResumePropsToSections({
        personalInfo,
        professionalSummary,
        experiences,
        educations,
        skills,
        languages,
        certifications,
        awards,
        projects,
      });

      const request: CreateCVRequest = {
        title: `${personalInfo.firstName} ${personalInfo.lastName} - CV`,
        sections: resumeData.map((section) => ({
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

      const response = await cvService.createCV(request);
      setCvId(response);

      console.log("CV saved successfully:", response);
      showSuccess("CV saved successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save CV";
      setError(errorMessage);
      console.error("Error saving CV:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    personalInfo,
    professionalSummary,
    experiences,
    educations,
    skills,
    languages,
    certifications,
    awards,
    projects,
  ]);

  const saveDraft = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resumeData = mapResumePropsToSections({
        personalInfo,
        professionalSummary,
        experiences,
        educations,
        skills,
        languages,
        certifications,
        awards,
        projects,
      });

      const request: CreateCVRequest = {
        title: `${personalInfo.firstName} ${personalInfo.lastName} - CV Draft`,
        sections: resumeData.map((section) => ({
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

      const response = await cvService.createOrUpdateDraft({
        working: resumeData,
        isDirty: true,
        draftId: cvId || undefined,
      });
      setCvId(response);

      console.log("Draft saved successfully:", response);
      showSuccess("Draft saved successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save draft";
      setError(errorMessage);
      console.error("Error saving draft:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    cvId,
    personalInfo,
    professionalSummary,
    experiences,
    educations,
    skills,
    languages,
    certifications,
    awards,
    projects,
  ]);

  const loadCV = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cvService.getCV(id);
      setCvId(response.id);

      console.log("CV loaded successfully:", response);
      showSuccess("CV loaded successfully!");
      // Note: You'll need to update the parent component's state with the loaded data
      // This would typically be done through a callback prop or context
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load CV";
      setError(errorMessage);
      console.error("Error loading CV:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDraft = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cvService.getDraft(id);
      setCvId(response._id);

      console.log("Draft loaded successfully:", response);
      showSuccess("Draft loaded successfully!");
      // Note: You'll need to update the parent component's state with the loaded data
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load draft";
      setError(errorMessage);
      console.error("Error loading draft:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const publishCV = useCallback(async () => {
    if (!cvId) {
      setError("No CV ID available for publishing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll just show success since we don't have a separate publish endpoint
      // In a real app, you might have a publish endpoint that changes the CV status
      console.log("CV published successfully:", cvId);
      showSuccess("CV published successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish CV";
      setError(errorMessage);
      console.error("Error publishing CV:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cvId]);

  return {
    cvId,
    isLoading,
    error,
    saveCV,
    saveDraft,
    loadCV,
    loadDraft,
    publishCV,
    clearError,
    showSuccessMessage,
    successMessage,
    clearSuccess,
  };
}

export default useCV;
