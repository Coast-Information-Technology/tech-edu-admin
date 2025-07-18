import { useState } from "react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfile } from "@/contexts/ProfileContext";

export const useProfileOnboarding = (
  token: string,
  userId: string,
  stepFieldMapping: Record<number, string[]>
) => {
  const { getOnboardingProgress, completeStep } = useOnboardingStatus(token);
  const { updateProfile } = useProfile();

  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const refreshProgress = async () => {
    const res = await getOnboardingProgress(userId);
    const data = res?.data?.data || res?.data;
    setOnboardingProgress(data);

    const skipped = new Set<number>();
    const completed = new Set<number>();
    data.steps.forEach((step: any, i: number) => {
      if (step.skipped && !step.completed) skipped.add(i);
      else if (step.completed) completed.add(i);
    });

    setSkippedSteps(skipped);
    setCompletedSteps(completed);
  };

  const getSkippedSteps = () => {
    if (!onboardingProgress?.steps) return [];
    return onboardingProgress.steps
      .map((step: any, index: number) => ({ ...step, index }))
      .filter((step: any) => step.skipped && !step.completed)
      .map((step: any) => ({ ...step, stepNumber: step.index + 1 }));
  };

  const isFieldEditable = (fieldName: string): boolean => {
    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return skippedSteps.has(stepIndex);
      }
    }
    return false;
  };

  const isFieldCompleted = (fieldName: string): boolean => {
    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return completedSteps.has(stepIndex);
      }
    }
    return false;
  };

  const completeStepsWithData = async (draft: any) => {
    const skippedStepsFromProgress = getSkippedSteps();
    const stepsToComplete = new Map<number, any>();

    for (const skippedStep of skippedStepsFromProgress) {
      const stepNumber = skippedStep.stepNumber;
      const fields = stepFieldMapping[stepNumber];
      const stepData: any = {};
      let hasData = false;

      fields.forEach((field) => {
        const value = draft[field];
        if (
          value &&
          ((typeof value === "string" && value.trim()) ||
            (Array.isArray(value) && value.length > 0) ||
            (typeof value === "object" && value !== null))
        ) {
          stepData[field] = value;
          hasData = true;
        }
      });

      if (hasData) {
        stepsToComplete.set(stepNumber, stepData);
      }
    }

    for (const [stepNumber, stepData] of stepsToComplete) {
      await completeStep(userId, stepNumber, stepData);
      updateProfile(stepData);
    }

    await refreshProgress();
  };

  return {
    onboardingProgress,
    skippedSteps,
    completedSteps,
    refreshProgress,
    getSkippedSteps,
    isFieldEditable,
    isFieldCompleted,
    completeStepsWithData,
  };
};
