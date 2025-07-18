// hooks/useOnboardingStart.ts
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiFetch";

const ONBOARDING_STEPS: Record<string, number> = {
  student: 7,
  recruiter: 7,
  institution: 7,
  individualTechProfessional: 7,
};

export function useOnboardingStart(
  userId: string | null,
  userType?: string,
  token?: string
) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !userType || started) return;
    const totalSteps = ONBOARDING_STEPS[userType];
    if (!totalSteps) {
      setError("Unknown onboarding role/steps");
      return;
    }
    apiRequest(
      "/api/onboarding/start",
      "POST",
      {
        userId,
        userType,
        totalSteps,
      },
      token
    ) // Pass the token as the 4th parameter
      .then(() => setStarted(true))
      .catch((err) => {
        setError(err?.message || "Failed to start onboarding");
      });
  }, [userId, userType, started, token]);

  return { started, error };
}
