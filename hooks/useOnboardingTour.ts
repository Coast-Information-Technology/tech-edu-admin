import { useState, useEffect, useCallback, useRef } from "react";

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right";
  action?: () => void; // Action to perform when step is shown
}

interface UseOnboardingTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
  storageKey?: string;
}

interface UseOnboardingTourReturn {
  currentStep: number;
  isActive: boolean;
  currentStepData: TourStep | null;
  start: () => void;
  next: () => void;
  previous: () => void;
  skip: () => void;
  complete: () => void;
  goToStep: (step: number) => void;
}

export function useOnboardingTour({
  steps,
  onComplete,
  onSkip,
  autoStart = false,
  storageKey = "cv-builder-tour-completed",
}: UseOnboardingTourProps): UseOnboardingTourReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if tour was already completed
  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed && autoStart) {
      start();
    }
  }, [storageKey, autoStart]);

  const currentStepData = steps[currentStep] || null;

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      complete();
    }
  }, [currentStep, steps.length]);

  const previous = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    setIsActive(false);
    onSkip?.();
  }, [onSkip]);

  const complete = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(storageKey, "true");
    onComplete?.();
  }, [storageKey, onComplete]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
      }
    },
    [steps.length]
  );

  // Position tooltip
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (!targetElement || !tooltipRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (currentStepData.placement) {
      case "top":
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = targetRect.bottom + 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width - 10;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.right + 10;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }, [isActive, currentStepData]);

  // Execute step action
  useEffect(() => {
    if (isActive && currentStepData?.action) {
      currentStepData.action();
    }
  }, [isActive, currentStepData]);

  return {
    currentStep,
    isActive,
    currentStepData,
    start,
    next,
    previous,
    skip,
    complete,
    goToStep,
  };
}

// Predefined tour steps for CV builder
export const CVBuilderTourSteps: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='welcome']",
    title: "Welcome to ResumeBuilder! 🎉",
    content:
      "Let's take a quick tour to help you create an amazing resume. This will only take a minute!",
    placement: "bottom",
  },
  {
    id: "mode-selection",
    target: "[data-tour='mode-selection']",
    title: "Choose Your Starting Point",
    content:
      "You can either start from scratch with our guided form or upload your existing resume to modernize it.",
    placement: "bottom",
  },
  {
    id: "template-selection",
    target: "[data-tour='template-selection']",
    title: "Select a Template",
    content:
      "Choose from our professional, ATS-friendly templates. You can always change this later!",
    placement: "bottom",
  },
  {
    id: "personal-info",
    target: "[data-tour='personal-info']",
    title: "Personal Information",
    content:
      "Start by filling in your basic contact information. This section is always visible on your resume.",
    placement: "right",
  },
  {
    id: "sections",
    target: "[data-tour='sections']",
    title: "Resume Sections",
    content:
      "Add or remove sections to customize your resume. Click on any section to edit it.",
    placement: "right",
  },
  {
    id: "preview",
    target: "[data-tour='preview']",
    title: "Live Preview",
    content:
      "See your resume update in real-time as you make changes. Click here to toggle the preview.",
    placement: "left",
  },
  {
    id: "save-export",
    target: "[data-tour='save-export']",
    title: "Save & Export",
    content:
      "Save your work automatically or manually, and export as PDF when you're ready.",
    placement: "left",
  },
  {
    id: "keyboard-shortcuts",
    target: "[data-tour='keyboard-shortcuts']",
    title: "Keyboard Shortcuts",
    content:
      "Use Ctrl+S to save, Ctrl+Z to undo, and other shortcuts for faster editing. Check the help menu for more!",
    placement: "top",
  },
  {
    id: "complete",
    target: "[data-tour='complete']",
    title: "You're All Set! 🚀",
    content:
      "That's it! You now know how to use ResumeBuilder. Start creating your professional resume!",
    placement: "top",
  },
];
