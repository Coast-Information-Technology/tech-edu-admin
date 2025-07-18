import { useCallback } from "react";
import { apiRequest } from "@/lib/apiFetch";

const ONBOARDING_STEPS: Record<string, number> = {
  student: 7,
  recruiter: 7,
  institution: 7,
  individualTechProfessional: 7,
};

export function useOnboardingStatus(token?: string) {
  // Start onboarding
  const startOnboarding = useCallback(
    async (userId: string, userType: string) => {
      return apiRequest(
        "/api/onboarding/start",
        "POST",
        { userId, userType },
        token
      );
    },
    [token]
  );

  // Get onboarding progress
  const getOnboardingProgress = useCallback(
    async (userId: string) => {
      return apiRequest(
        `/api/onboarding/${userId}/progress`,
        "GET",
        undefined,
        token
      );
    },
    [token]
  );

  // Set onboarding status (e.g., completed)
  const setOnboardingStatus = useCallback(
    async (userId: string, status: string) => {
      return apiRequest(
        `/api/onboarding/${userId}/status`,
        "PATCH",
        { status },
        token
      );
    },
    [token]
  );

  // Skip current step
  const skipStep = useCallback(
    async (userId: string, stepNumber: number, reason?: string) => {
      const payload: { stepNumber: number; reason?: string } = {
        stepNumber,
      };

      if (reason) {
        payload.reason = reason;
      }

      return apiRequest(
        `/api/onboarding/${userId}/skip-step`,
        "PATCH",
        payload,
        token
      );
    },
    [token]
  );

  // Mark current step as complete
  const completeStep = useCallback(
    async (userId: string, stepNumber: number, stepData: any) => {
      const payload: { stepNumber: number; stepData: any } = {
        stepNumber,
        stepData,
      };

      return apiRequest(
        `/api/onboarding/${userId}/complete-step`,
        "PATCH",
        payload,
        token
      );
    },
    [token]
  );

  return {
    startOnboarding,
    getOnboardingProgress,
    setOnboardingStatus,
    skipStep,
    completeStep,
  };
}
