// hooks/cv/useCVSimplified.ts

import { useState, useCallback, useEffect } from "react";
import {
  cvService,
  CreateCVRequest,
  AiSummary,
  SkillsAssessment,
  ExperienceAIResult,
} from "@/services/cv/cvServiceOptimized";

export function useCVSimplified() {
  const [cvId, setCvId] = useState<string | undefined>(undefined);
  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize cvId and draftId from localStorage on component mount
  useEffect(() => {
    // Respect new=1 flag to start clean
    const search = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(search);
    const isNew = params.get("new") === "1";

    if (isNew) {
      console.log("🆕 Starting new CV/Draft session - clearing persisted ids");
      try {
        localStorage.removeItem("cvId");
        localStorage.removeItem("cvDraftId");
      } catch {}
      setCvId(undefined);
      setDraftId(undefined);
      return; // do not hydrate from storage
    }

    const savedCvId = localStorage.getItem("cvId");
    const savedDraftId = localStorage.getItem("cvDraftId");

    if (savedCvId) {
      console.log("📂 Loaded cvId from localStorage:", savedCvId);
      setCvId(savedCvId);
    }

    if (savedDraftId) {
      console.log("📂 Loaded draftId from localStorage:", savedDraftId);
      setDraftId(savedDraftId);
    }
  }, []);

  // Create CV
  const createCV = useCallback(
    async (
      personalInfo: any,
      sections: any[],
      consent?: any,
      template?: string
    ): Promise<string | null> => {
      console.log("🆕 createCV called with:", {
        hasPersonalInfo: !!personalInfo,
        hasSections: sections.length,
        hasConsent: !!consent,
        template: template,
      });

      setIsCreating(true);
      try {
        const cvData = cvService.createCVData(
          personalInfo,
          sections,
          consent,
          template
        );
        console.log("📤 Creating CV with data:", cvData);
        const newCvId = await cvService.createCV(cvData);
        setCvId(newCvId);
        // Save cvId to localStorage for persistence across page reloads
        localStorage.setItem("cvId", newCvId);
        setLastSaved(new Date());
        console.log("✅ CV created successfully:", newCvId);
        return newCvId;
      } catch (error) {
        console.error("❌ Failed to create CV:", error);
        alert("Failed to create CV. Please try again.");
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  // Update CV
  const updateCV = useCallback(
    async (
      personalInfo: any,
      sections: any[],
      consent?: any
    ): Promise<void> => {
      if (!cvId) {
        console.log("⏭️ updateCV skipped - no cvId");
        return;
      }

      console.log("🔄 updateCV called with:", {
        cvId,
        hasPersonalInfo: !!personalInfo,
        hasSections: sections.length,
        hasConsent: !!consent,
      });

      setIsUpdating(true);
      try {
        const cvData = cvService.createCVData(personalInfo, sections, consent);
        console.log("📤 Updating CV with data:", cvData);
        await cvService.updateCV(cvId, cvData);
        setLastSaved(new Date());
        console.log("✅ CV updated successfully:", cvId);
      } catch (error) {
        console.error("❌ Failed to update CV:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [cvId]
  );

  // Save Draft with working data - prevents multiple drafts
  const saveDraft = useCallback(
    async (
      personalInfo: any,
      sections: any[],
      providedCvId?: string,
      template?: string
    ): Promise<string> => {
      const currentCvId = providedCvId || cvId;

      try {
        console.log("🔄 saveDraft called with:", {
          cvId: currentCvId,
          draftId,
          hasSections: sections.length,
          providedCvId: !!providedCvId,
          template,
        });

        // Ensure we have a cvId before saving draft
        if (!currentCvId) {
          console.warn("⚠️ No cvId available for draft save");
          throw new Error("CV must be created before saving draft");
        }

        const draftData = {
          cvId: currentCvId,
          working: sections,
          isDirty: true,
          template,
          draftId, // Include existing draftId to update instead of create
        };

        console.log("📤 Sending draft data:", draftData);
        console.log("🔧 Will use PATCH endpoint:", !!draftId);

        // cvService.createOrUpdateDraft returns the draft id
        const newDraftId = await cvService.createOrUpdateDraft(draftData);
        console.log("📥 Received draft ID:", newDraftId);

        // Keep state/storage in sync every time
        if (newDraftId !== draftId) {
          console.log("💾 Setting draftId:", newDraftId);
          setDraftId(newDraftId);
        }

        // Persist for refresh/restore
        try {
          sessionStorage.setItem(`cvDraftId:${currentCvId}`, newDraftId);
        } catch {}
        try {
          localStorage.setItem("cvDraftId", newDraftId);
        } catch {}

        setLastSaved(new Date());
        console.log("✅ Draft saved/updated successfully:", newDraftId);

        // 🔁 return the id so callers can use it
        return newDraftId;
      } catch (error) {
        console.error("❌ Failed to save draft:", error);
        throw error; // Re-throw to handle in calling component
      }
    },
    [cvId, draftId]
  );

  // Publish CV from draft
  const publishCV = useCallback(
    async (draftId: string): Promise<string | null> => {
      try {
        const publishedCvId = await cvService.publishCV(draftId);
        setLastSaved(new Date());
        console.log("CV published successfully:", publishedCvId);
        return publishedCvId;
      } catch (error) {
        console.error("Failed to publish CV:", error);
        return null;
      }
    },
    []
  );

  // Load CV
  const loadCV = useCallback(async (id: string): Promise<any> => {
    try {
      const cvData = await cvService.getCV(id);
      setCvId(id);
      return cvData;
    } catch (error) {
      console.error("Failed to load CV:", error);
      return null;
    }
  }, []);

  // Generate AI Summary (normalized)
  const generateSummary = useCallback(
    async (
      tone: string = "professional and concise"
    ): Promise<AiSummary | null> => {
      if (!cvId) {
        console.warn("⚠️ No cvId available for AI summary generation");
        return null;
      }
      try {
        // returns: { content: string, bullets: string[] }
        const result = await cvService.generateSummary(cvId, tone);
        return result;
      } catch (error) {
        console.error("Failed to generate summary:", error);
        return null;
      }
    },
    [cvId]
  );

  // Generate AI Experience
  const generateExperience = useCallback(
    async (context: {
      targetRole: string;
      industry: string;
      // startDate: string;
      // endDate: string;
      // position: string;
    }): Promise<ExperienceAIResult | null> => {
      if (!cvId) {
        console.warn("⚠️ No cvId available for AI experience generation");
        return null;
      }
      try {
        const res = await cvService.generateExperience(cvId, context);
        return res; // { description, achievements } (and legacy fields if present)
      } catch (error) {
        console.error("Failed to generate experience:", error);
        return null;
      }
    },
    [cvId]
  );

  // Generate AI Skills
  // Generate AI Skills (UI keeps emphasize[]; service currently ignores or handles it)
  const generateSkills = useCallback(
    async (
      level: "all" | "top-5" = "all",
      prompt?: string,
      context?: { targetRole: string; emphasize: string[] }
    ): Promise<SkillsAssessment | null> => {
      if (!cvId) {
        console.warn("⚠️ No cvId available for AI skills generation");
        return null;
      }
      try {
        // If your service doesn't take emphasize, just pass through; it's optional.
        const res = await cvService.generateSkills(
          cvId,
          level,
          prompt,
          // If your service expects { targetRole, industry }, you could map here.
          // For now, pass as-is; the service normalizer will handle the response.
          context as any
        );
        return res; // { skills: [{name, score, evidence?}...], top: [...] }
      } catch (error) {
        console.error("Failed to generate skills:", error);
        return null;
      }
    },
    [cvId]
  );

  // Generate AI Projects
  const generateProjects = useCallback(
    async (
      prompt?: string,
      context?: { targetRole: string; emphasize: string[] }
    ): Promise<any> => {
      if (!cvId) {
        console.warn("⚠️ No cvId available for AI projects generation");
        return null;
      }
      try {
        return await cvService.generateProjects(cvId, prompt, context);
      } catch (error) {
        console.error("Failed to generate projects:", error);
        return null;
      }
    },
    [cvId]
  );

  // Get Match Score
  const getMatchScore = useCallback(
    async (jobDescription: string): Promise<any> => {
      if (!cvId) {
        console.warn("⚠️ No cvId available for match score");
        return null;
      }
      try {
        return await cvService.getMatchScore(cvId, jobDescription);
      } catch (error) {
        console.error("Failed to get match score:", error);
        return null;
      }
    },
    [cvId]
  );

  // Publish draft to live CV
  const publishDraft = useCallback(
    async (
      personalInfo: any,
      sections: any[],
      providedDraftId?: string
    ): Promise<void> => {
      const currentDraftId = providedDraftId || draftId;

      if (!currentDraftId) {
        console.warn("⚠️ No draftId available for publishing");
        throw new Error("No draft available to publish");
      }

      console.log("🚀 Publishing draft:", currentDraftId);
      const publishedCvId = await publishCV(currentDraftId);

      if (publishedCvId) {
        console.log("✅ Draft published successfully to CV:", publishedCvId);
        // Optionally update the current CV data with published content
        await updateCV(personalInfo, sections);
      } else {
        throw new Error("Failed to publish draft");
      }
    },
    [draftId, publishCV, updateCV]
  );

  return {
    cvId,
    draftId,
    setCvId,
    isCreating,
    isUpdating,
    lastSaved,
    createCV,
    updateCV,
    saveDraft,
    loadCV,
    generateSummary,
    generateExperience,
    generateSkills,
    generateProjects,
    getMatchScore,
    publishDraft,
    publishCV,
    // Legacy method names for compatibility
    handleCreateCV: createCV,
    handleUpdateCV: updateCV,
    handleSaveDraft: saveDraft,
    handleLoadCV: loadCV,
    handlePublishDraft: publishDraft,
    cvLoading: isCreating || isUpdating,
    cvError: null,
  };
}
