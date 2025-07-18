"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { postApiRequest } from "@/lib/apiFetch";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { Button } from "@/components/ui/button";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

// Step Components
import {
  Step1TeamLeadInfo,
  Step2CompanyDetails,
  Step3TeamProfile,
  Step4AddMembers,
  Step5TeamLearningGoals,
  Step6SupportingDocuments,
  Step7ConsentSubmission,
} from "./steps/team-tech-professional";

const initialForm = {
  // Step 1: Team Lead Information
  isTeam: true,
  teamLeadFullName: "",
  teamLeadEmail: "",
  teamLeadPhoneNumber: "",
  jobTitle: "",
  linkedInProfile: "",
  alreadyVerifiedTechPro: false,
  // Step 2: Company Details
  companyName: "",
  companyType: "tech_professional",
  rcNumber: "",
  industry: "",
  location: {
    country: "",
    state: "",
    city: "",
  },
  website: "",
  logoUrl: "",
  contactEmail: "",
  contactPhone: "",
  // Step 3: Team Profile
  teamName: "",
  teamSize: 0,
  teamLocation: {
    country: "",
    state: "",
    city: "",
  },
  techStack: [] as string[],
  trainingAvailability: "",
  teamContactEmail: "",
  teamContactPhone: "",
  // Step 4: Add Members
  members: [] as Array<{
    userId: string;
    fullName: string;
    email: string;
    role: string;
  }>,
  // Step 5: Team Learning Goals
  goalType: "",
  priorityAreas: [] as string[],
  trainingTimeline: "",
  // Step 6: Supporting Documents
  companyIntroUrl: "",
  skillMatrixUrl: "",
  // Step 7: Consent & Submission
  consentToTerms: false,
  teamAcknowledged: false,
};

// API utility functions
const uploadFile = async (file: File): Promise<string> => {
  // This is a placeholder - you'll need to implement actual file upload
  // For now, we'll return a mock URL
  return `https://files.example.com/${file.name}`;
};

interface CompletionModal {
  open: boolean;
  message: string;
}

export default function TeamTechProfessionalOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getCookie("token") || getCookie("access_token");
  const userType = "teamTechProfessional";

  // All state hooks must be called first
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [stepSubmitting, setStepSubmitting] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepSuccess, setStepSuccess] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionModal, setCompletionModal] = useState<CompletionModal>({
    open: false,
    message: "",
  });
  const [dynamicSteps, setDynamicSteps] = useState<any[]>([]);

  // Get userId from URL params or cookies
  useEffect(() => {
    const urlUserId = searchParams.get("userId");
    if (urlUserId) {
      setUserId(urlUserId);
      setCookie("userId", urlUserId, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } else {
      const storedUserId = getCookie("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        deleteCookie("userId");
        router.push("/login");
      }
    }
  }, [searchParams, router]);

  // Use onboarding status hook with token
  const {
    startOnboarding,
    getOnboardingProgress,
    setOnboardingStatus,
    skipStep,
    completeStep,
  } = useOnboardingStatus(token);

  // Handle step click for navigation
  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any step that is completed, current, or skipped
    const currentStepData = dynamicSteps[stepIndex];
    if (currentStepData) {
      const isCompleted = completedSteps.has(stepIndex);
      const isSkipped = currentStepData.skipped && !currentStepData.completed;
      const isCurrent = step === stepIndex;

      // Allow navigation if step is completed, current, or skipped
      if (isCompleted || isCurrent || isSkipped) {
        setStep(stepIndex);
      }
    }
  };

  // Check if current step can be skipped
  const canSkipStep = step > 0 && step < dynamicSteps.length - 1;

  // Fetch onboarding status and progress on load
  useEffect(() => {
    async function fetchStatusAndProgress() {
      if (!userId || !token) return;
      setLoading(true);
      setError(null);
      try {
        // FIRST: Always start onboarding
        await startOnboarding(userId, userType);

        // THEN: Get onboarding progress
        const progressRes = await getOnboardingProgress(userId);

        const progressData = progressRes?.data?.data || progressRes?.data;
        const progressStatus = progressData?.status || null;
        setStatus(progressStatus);

        if (!progressData) {
          setLoading(false);
          setError("No onboarding data found.");
          return;
        }

        if (progressStatus === "completed") {
          setLoading(false);
          router.push("/dashboard/team-tech-professional");
          return;
        }

        setProgress(progressData);
        if (
          typeof progressData.currentStep === "number" &&
          progressData.currentStep > 0
        ) {
          // Backend currentStep is 1-indexed, convert to 0-indexed for frontend
          setStep(progressData.currentStep - 1);
        }
        // Set completed steps
        if (
          progressData.completedSteps !== undefined &&
          progressData.completedSteps !== null
        ) {
          // completedSteps is a number representing the count of completed steps
          const completedStepsArray = Array.from(
            { length: progressData.completedSteps },
            (_, i) => i
          );
          const completedStepsSet = new Set(completedStepsArray);
          setCompletedSteps(completedStepsSet);
        }

        // Step endpoint mapping for API calls
        const stepEndpointMap = [
          "team-lead-info",
          "company-details",
          "team-profile",
          "add-members",
          "team-learning-goals",
          "supporting-documents",
          "consent-submission",
        ];

        if (progressData.steps && Array.isArray(progressData.steps)) {
          // Enrich steps with proper step identifiers for API calls
          const enrichedSteps = (progressData.steps || []).map(
            (stepObj: any, index: number) => ({
              ...stepObj,
              stepIdentifier: stepEndpointMap[index] || `step-${index + 1}`,
            })
          );
          setDynamicSteps(enrichedSteps);
        } else {
          // Fallback steps if backend doesn't provide them
          const fallbackSteps = [
            {
              stepNumber: 1,
              title: "Team Type & Lead Information",
              description:
                "Establish who's managing the team and collect lead details.",
              completed: false,
              skipped: false,
              stepIdentifier: "team-lead-info",
            },
            {
              stepNumber: 2,
              title: "Company Details",
              description:
                "Connect to an existing company or create a new one.",
              completed: false,
              skipped: false,
              stepIdentifier: "company-details",
            },
            {
              stepNumber: 3,
              title: "Team Profile",
              description: "Core attributes of the team.",
              completed: false,
              skipped: false,
              stepIdentifier: "team-profile",
            },
            {
              stepNumber: 4,
              title: "Add Team Members",
              description: "Add existing Tech Professionals as team members.",
              completed: false,
              skipped: false,
              stepIdentifier: "add-members",
            },
            {
              stepNumber: 5,
              title: "Team Learning Goals",
              description: "Understand the team objective on the platform.",
              completed: false,
              skipped: false,
              stepIdentifier: "team-learning-goals",
            },
            {
              stepNumber: 6,
              title: "Upload Supporting Documents",
              description:
                "Optional but useful for verifying and guiding training.",
              completed: false,
              skipped: false,
              stepIdentifier: "supporting-documents",
            },
            {
              stepNumber: 7,
              title: "Consent & Submission",
              description: "Finalize setup and trigger review.",
              completed: false,
              skipped: false,
              stepIdentifier: "consent-submission",
            },
          ];
          setDynamicSteps(fallbackSteps);
        }

        // Pre-fill form with existing data from progress
        if (
          progressData.stepData &&
          typeof progressData.stepData === "object"
        ) {
          const allStepData: any = {};
          Object.values(progressData.stepData).forEach((stepInfo: any) => {
            if (stepInfo.data && typeof stepInfo.data === "object") {
              Object.assign(allStepData, stepInfo.data);
            }
          });

          // Merge all step data into form
          setForm((prevForm) => ({
            ...prevForm,
            ...allStepData,
          }));
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load onboarding status");
        console.error("Onboarding fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatusAndProgress();
  }, [userId, token, startOnboarding, getOnboardingProgress]);

  // Pre-fill form with all step data from progress response
  useEffect(() => {
    if (progress && progress.stepData && dynamicSteps.length > 0) {
      // Merge all step data into the form
      const allStepData: any = Object.values(progress.stepData).reduce(
        (acc: any, stepInfo: any) => {
          if (stepInfo.data) {
            return { ...acc, ...stepInfo.data };
          }
          return acc;
        },
        {}
      );

      if (Object.keys(allStepData).length > 0) {
        setForm((prev: any) => {
          const newForm = { ...prev, ...allStepData };
          return newForm;
        });
      }

      // Set the current step from backend
      if (progress.currentStep && typeof progress.currentStep === "number") {
        // Backend uses 1-indexed steps, convert to 0-indexed for frontend
        const currentStepIndex = progress.currentStep - 1;
        setStep(currentStepIndex);
      }

      // Set completed steps
      if (
        progress.completedSteps !== undefined &&
        progress.completedSteps !== null
      ) {
        // completedSteps is a number representing the count of completed steps
        const completedStepsArray = Array.from(
          { length: progress.completedSteps },
          (_, i) => i
        );
        const completedStepsSet = new Set(completedStepsArray);
        setCompletedSteps(completedStepsSet);
      }
    }
  }, [progress, dynamicSteps]);

  // Show loading state
  if (loading || dynamicSteps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-700 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">
            {loading
              ? "Loading onboarding..."
              : "Setting up onboarding steps..."}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Steps loaded: {dynamicSteps.length}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-12 px-4 md:px-20">
        <div className="w-full max-w-2xl bg-white rounded-[10px] shadow-xl p-8 mt-12 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-[#011F72]">
            Onboarding Error
          </h2>
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            className="bg-[#003294] hover:bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  // Get current step data
  const currentStepData = dynamicSteps[step];
  const stepTitle = currentStepData?.title || `Step ${step + 1}`;
  const stepDescription = currentStepData?.description || "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as any;

    if (type === "checkbox") {
      if (
        name === "certifications" ||
        name === "programmingLanguages" ||
        name === "frameworksLibraries" ||
        name === "toolsPlatforms" ||
        name === "softSkills" ||
        name === "goals" ||
        name === "availability"
      ) {
        setForm((prev) => ({
          ...prev,
          [name]: checked
            ? [...(prev[name as keyof typeof prev] as string[]), value]
            : (prev[name as keyof typeof prev] as string[]).filter(
                (item: string) => item !== value
              ),
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (stepTitle === "Team Type & Lead Information") {
      if (!form.teamLeadFullName)
        newErrors.teamLeadFullName = "Team lead full name is required.";
      if (!form.teamLeadEmail)
        newErrors.teamLeadEmail = "Team lead email is required.";
      if (!form.teamLeadPhoneNumber)
        newErrors.teamLeadPhoneNumber = "Team lead phone number is required.";
      if (!form.jobTitle) newErrors.jobTitle = "Job title is required.";
    }

    if (stepTitle === "Company Details") {
      if (!form.companyName)
        newErrors.companyName = "Company name is required.";
      if (!form.rcNumber) newErrors.rcNumber = "RC number is required.";
      if (!form.industry) newErrors.industry = "Industry is required.";
      if (!form.location.country) newErrors.location = "Country is required.";
      if (!form.location.state) newErrors.location = "State is required.";
      if (!form.location.city) newErrors.location = "City is required.";
      if (!form.contactEmail)
        newErrors.contactEmail = "Contact email is required.";
      if (!form.contactPhone)
        newErrors.contactPhone = "Contact phone is required.";
    }

    if (stepTitle === "Team Profile") {
      if (!form.teamName) newErrors.teamName = "Team name is required.";
      if (!form.teamSize || form.teamSize <= 0)
        newErrors.teamSize = "Team size must be greater than 0.";
      if (!form.teamLocation.country)
        newErrors.teamLocation = "Country is required.";
      if (!form.teamLocation.state)
        newErrors.teamLocation = "State is required.";
      if (!form.teamLocation.city) newErrors.teamLocation = "City is required.";
      if (!form.techStack.length)
        newErrors.techStack = "Select at least one tech stack.";
      if (!form.trainingAvailability)
        newErrors.trainingAvailability = "Training availability is required.";
      if (!form.teamContactEmail)
        newErrors.teamContactEmail = "Team contact email is required.";
      if (!form.teamContactPhone)
        newErrors.teamContactPhone = "Team contact phone is required.";
    }

    if (stepTitle === "Add Team Members") {
      if (!form.members.length)
        newErrors.members = "At least one team member is required.";
    }

    if (stepTitle === "Team Learning Goals") {
      if (!form.goalType) newErrors.goalType = "Goal type is required.";
      if (!form.priorityAreas.length)
        newErrors.priorityAreas = "Select at least one priority area.";
      if (!form.trainingTimeline)
        newErrors.trainingTimeline = "Training timeline is required.";
    }

    if (stepTitle === "Upload Supporting Documents") {
      // This step is optional, no validation required
    }

    if (stepTitle === "Consent & Submission") {
      if (!form.consentToTerms)
        newErrors.consentToTerms = "You must agree to the terms.";
      if (!form.teamAcknowledged)
        newErrors.teamAcknowledged = "Team acknowledgment is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update navigation and validation to use currentStep
  const handleNextOrFinish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;

    // Check if current step is already completed
    if (completedSteps.has(step)) {
      // Step is already completed, just move to next step without submitting
      if (step < dynamicSteps.length - 1) {
        setStep(step + 1);
      }
      return;
    }

    setStepSubmitting(step);
    setSubmitError("");
    setStepSuccess("");
    try {
      if (!userId) {
        deleteCookie("userId");
        throw new Error("User ID not found. Please log in again.");
      }

      let stepData;
      switch (step) {
        case 0: // Team Lead Information
          stepData = {
            isTeam: form.isTeam,
            teamLeadFullName: form.teamLeadFullName,
            teamLeadEmail: form.teamLeadEmail,
            teamLeadPhoneNumber: form.teamLeadPhoneNumber,
            jobTitle: form.jobTitle,
            linkedInProfile: form.linkedInProfile || undefined,
            alreadyVerifiedTechPro: form.alreadyVerifiedTechPro,
          };
          break;
        case 1: // Company Details
          stepData = {
            companyName: form.companyName,
            companyType: form.companyType,
            rcNumber: form.rcNumber,
            industry: form.industry,
            location: form.location,
            website: form.website || undefined,
            logoUrl: form.logoUrl || undefined,
            contactEmail: form.contactEmail,
            contactPhone: form.contactPhone,
          };
          break;
        case 2: // Team Profile
          stepData = {
            teamName: form.teamName,
            teamSize: form.teamSize,
            location: form.teamLocation,
            techStack: form.techStack,
            trainingAvailability: form.trainingAvailability,
            contactEmail: form.teamContactEmail,
            contactPhone: form.teamContactPhone,
          };
          break;
        case 3: // Add Members
          stepData = {
            members: form.members,
          };
          break;
        case 4: // Team Learning Goals
          stepData = {
            goalType: form.goalType,
            priorityAreas: form.priorityAreas,
            trainingTimeline: form.trainingTimeline,
          };
          break;
        case 5: // Supporting Documents
          stepData = {
            companyIntroUrl: form.companyIntroUrl || undefined,
            skillMatrixUrl: form.skillMatrixUrl || undefined,
          };
          break;
        case 6: // Consent & Submission
          stepData = {
            consentToTerms: form.consentToTerms,
            teamAcknowledged: form.teamAcknowledged,
          };
          break;
        default:
          throw new Error("Invalid step number");
      }

      // Submit step data using the step identifier from backend
      const stepIdentifierMap: Record<number, string> = {
        1: "team-lead-info",
        2: "company-details",
        3: "team-profile",
        4: "add-members",
        5: "team-learning-goals",
        6: "supporting-documents",
        7: "consent-submission",
      };

      const stepIdentifier = stepIdentifierMap[step + 1];
      if (!stepIdentifier) {
        throw new Error(`No step identifier found for step ${step + 1}`);
      }

      const result = await postApiRequest(
        `/api/onboarding/team-tech-professional/${userId}/${stepIdentifier}`,
        stepData,
        token ? { Authorization: `Bearer ${token}` } : {}
      );

      // If this is the final step, mark onboarding as completed
      if (step === dynamicSteps.length - 1) {
        await setOnboardingStatus(userId, "completed");
        setStatus("completed");
        // Show completion modal
        setCompletionModal({
          open: true,
          message: "Welcome! Your team onboarding is complete.",
        });
        setStepSuccess(result?.message || "Onboarding completed successfully!");
        setTimeout(() => {
          setCompletionModal({ open: false, message: "" });
          router.push("/dashboard/team-tech-professional");
        }, 2000);
        return;
      }

      // Fetch latest onboarding progress after step submission
      const progressRes = await getOnboardingProgress(userId);
      const progressData = progressRes?.data?.data || progressRes?.data;
      setProgress(progressData || null);
      if (progressData) {
        if (
          typeof progressData.currentStep === "number" &&
          progressData.currentStep > 0
        ) {
          setStep(progressData.currentStep - 1);
        } else {
          setStep((s) => s + 1);
        }
        // Set completed steps
        if (
          progressData.completedSteps !== undefined &&
          progressData.completedSteps !== null
        ) {
          // completedSteps is a number representing the count of completed steps
          const completedStepsArray = Array.from(
            { length: progressData.completedSteps },
            (_, i) => i
          );
          const completedStepsSet = new Set(completedStepsArray);
          setCompletedSteps(completedStepsSet);
        }
      }
      setStepSuccess(result?.message || `${stepTitle} saved successfully!`);
      setTimeout(() => {
        setStepSuccess("");
      }, 1000);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to save step ${step + 1}. Please try again.`
      );
    } finally {
      setStepSubmitting(null);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  // Handle skip step
  const handleSkipStep = async () => {
    if (!userId || !token) {
      setSubmitError("Authentication required to skip step");
      return;
    }

    // Check if step can be skipped (Step 1 and last step cannot be skipped)
    if (step === 0 || step === dynamicSteps.length - 1) {
      setSubmitError("This step cannot be skipped");
      return;
    }

    try {
      setStepSubmitting(step);
      setSubmitError("");
      setStepSuccess("");

      const result = await skipStep(
        userId,
        step + 1,
        "User chose to skip this step"
      );

      if (result?.status === 200) {
        setStepSuccess("Step skipped successfully!");
        setCompletedSteps((prev) => new Set([...prev, step]));

        // Move to next step after a short delay
        setTimeout(() => {
          setStep(step + 1);
          setStepSuccess("");
        }, 1000);
      } else {
        setSubmitError(result?.message || "Failed to skip step");
      }
    } catch (error) {
      console.error("Error skipping step:", error);
      setSubmitError("Failed to skip step. Please try again.");
    } finally {
      setStepSubmitting(null);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-12 px-4 md:px-20">
      {/* Completion Modal */}
      {completionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-[10px] shadow-lg p-8 flex flex-col items-center max-w-md w-full">
            <Loader2 className="animate-spin text-blue-700 w-10 h-10 mb-4" />
            <h2 className="text-xl font-bold text-[#003294] mb-2">
              Onboarding Complete!
            </h2>
            <p className="text-gray-700 text-center mb-2">
              {completionModal.message}
            </p>
            <p className="text-blue-900 text-center text-sm">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}
      {/* Welcoming Section */}
      <div className="w-full max-w-3xl bg-gradient-to-r from-blue-50 to-white rounded-[16px] shadow-lg p-8 flex flex-col items-center mb-8 border border-blue-100">
        <div className="flex justify-between w-full max-w-3xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 rounded-[10px] p-6 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 bg-[#003294] hover:bg-blue-500 text-white text-left p-2 mb-6 rounded-[10px]"
          >
            ← Go Back
          </button>
          <Link href="/">
            <Image
              src="/assets/techedusolution.jpg"
              alt="Tech Edu Solution Logo"
              width={80}
              height={80}
              className="rounded-[5px]"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <CheckCircle className="w-10 h-10 text-blue-700 animate-bounce" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#003294]">
            Welcome to Team Tech Professional Onboarding!
          </h1>
        </div>
        <p className="text-gray-700 text-center max-w-2xl mb-2 text-lg">
          We're excited to have your team join our tech community. This
          onboarding will help us create a customized learning experience for
          your entire team.
        </p>
        <p className="text-blue-900 text-center max-w-xl text-base font-medium">
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 mr-2 mb-1">
            👥
          </span>
          Let's accelerate your team's tech journey!
        </p>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-[10px] shadow-xl p-8 flex flex-col md:flex-row gap-8">
        {/* Vertical Progress Indicator */}
        <div className="flex md:flex-col flex-row md:items-start items-center md:w-48 w-full md:justify-start justify-start overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
          <div
            className="flex md:flex-col flex-row items-center md:gap-4 gap-2 md:min-h-[400px] min-w-max md:min-w-0 px-2"
            style={{
              width: "100%",
            }}
          >
            {dynamicSteps.map((stepObj, idx) => (
              <React.Fragment key={stepObj.stepNumber || idx}>
                <div className="flex flex-col md:flex-row gap-2 items-center transition-all duration-300">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-sm transition-all duration-300 cursor-pointer hover:scale-105 ${
                      step === idx
                        ? "bg-blue-700 scale-110 shadow-lg"
                        : completedSteps.has(idx)
                        ? "bg-green-500"
                        : stepObj.skipped && !stepObj.completed
                        ? "bg-orange-500 hover:bg-orange-600"
                        : step > idx
                        ? "bg-green-400"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => handleStepClick(idx)}
                    title={
                      stepObj.skipped && !stepObj.completed
                        ? "Click to complete this skipped step"
                        : completedSteps.has(idx)
                        ? "Click to review this completed step"
                        : step === idx
                        ? "Current step"
                        : "Click to navigate to this step"
                    }
                  >
                    {completedSteps.has(idx)
                      ? "✓"
                      : stepObj.skipped && !stepObj.completed
                      ? "!"
                      : idx + 1}
                  </div>
                  <span
                    className={`text-xs text-center md:text-left mt-1 w-20 whitespace-pre-line transition-colors ${
                      stepObj.skipped && !stepObj.completed
                        ? "text-orange-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {stepObj.title}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-[#011F72]">{stepTitle}</h2>
          <p className="mb-4 text-gray-600">{stepDescription}</p>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          {stepSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-[10px]">
              <p className="text-green-600 text-sm">{stepSuccess}</p>
            </div>
          )}

          <form
            onSubmit={handleNextOrFinish}
            className={submitting ? "opacity-50 pointer-events-none" : ""}
          >
            {/* Step 1: Team Lead Information */}
            {step === 0 && (
              <Step1TeamLeadInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 2: Company Details */}
            {step === 1 && (
              <Step2CompanyDetails
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 3: Team Profile */}
            {step === 2 && (
              <Step3TeamProfile
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 4: Add Members */}
            {step === 3 && (
              <Step4AddMembers
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 5: Team Learning Goals */}
            {step === 4 && (
              <Step5TeamLearningGoals
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 6: Supporting Documents */}
            {step === 5 && (
              <Step6SupportingDocuments
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 7: Consent & Submission */}
            {step === 6 && (
              <Step7ConsentSubmission
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="rounded-[10px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Prev
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                {canSkipStep && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSkipStep}
                    className="text-gray-600 hover:text-gray-800"
                    disabled={stepSubmitting === step || submitting}
                  >
                    {stepSubmitting === step ? "Skipping..." : "Skip"}
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={stepSubmitting === step || submitting}
                  className="rounded-[10px] text-white hover:text-black"
                >
                  {step < dynamicSteps.length - 1 ? (
                    stepSubmitting === step ? (
                      "Saving..."
                    ) : (
                      <>
                        <span>Next</span>{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )
                  ) : submitting ? (
                    "Submitting..."
                  ) : (
                    "Finish"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
