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
  StudentStep1PersonalInfo,
  StudentStep2AcademicBackground,
  StudentStep3InterestAreas,
  StudentStep4Documents,
  StudentStep5Availability,
  StudentStep6Goals,
  StudentStep7ReferralConsent,
} from "./steps/student";

const initialForm = {
  // Step 1
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  countryOfResidence: "",
  preferredContactMethod: "",
  // Step 2
  highestQualification: "",
  currentInstitution: "",
  fieldOfStudy: "",
  academicLevel: "",
  graduationYear: "",
  // Step 3
  interestAreas: [] as string[],
  // Step 4
  transcript: null as File | null,
  cvResume: null as File | null,
  statementOfPurpose: null as File | null,
  researchProposal: null as File | null,
  // Step 5
  preferredDays: [] as string[],
  preferredTimeSlots: [] as string[],
  timeZone: "",
  // Step 6
  goals: "",
  challenges: "",
  // Step 7
  referralSource: "",
  referralCodeOrName: "",
  consentToStoreInfo: false,
  agreeToTerms: false,
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

export default function StudentOnboarding() {
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getCookie("token") || getCookie("access_token");
  const userType = "student";

  // Use onboarding status hook with token
  const {
    startOnboarding,
    getOnboardingProgress,
    setOnboardingStatus,
    skipStep,
    completeStep,
  } = useOnboardingStatus(token);

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

  // Fetch onboarding status and progress on load
  useEffect(() => {
    async function fetchStatusAndProgress() {
      if (!userId || !token) return;
      setLoading(true);
      setError(null);
      try {
        // FIRST: Always start onboarding
        await startOnboarding(userId, userType);
        console.log("Onboarding started successfully");

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
          router.push("/dashboard/student");
          return;
        }

        setProgress(progressData);
        if (
          typeof progressData.currentStep === "number" &&
          progressData.currentStep > 0
        ) {
          setStep(progressData.currentStep - 1);
        }
        const completedStepsArray = Array.from(
          { length: progressData.completedSteps || 0 },
          (_, i) => i
        );
        setCompletedSteps(new Set(completedStepsArray));

        if (progressData.steps && Array.isArray(progressData.steps)) {
          setDynamicSteps(progressData.steps);
        } else {
          // Fallback steps if backend doesn't provide them
          const fallbackSteps = [
            {
              stepNumber: 1,
              title: "Personal Information",
              description: "Tell us about yourself",
              completed: false,
              skipped: false,
              stepIdentifier: "personal-info",
            },
            {
              stepNumber: 2,
              title: "Academic Background",
              description: "Share your educational history",
              completed: false,
              skipped: false,
              stepIdentifier: "academic-background",
            },
            {
              stepNumber: 3,
              title: "Interest Areas",
              description: "Select your areas of interest",
              completed: false,
              skipped: false,
              stepIdentifier: "interest-areas",
            },
            {
              stepNumber: 4,
              title: "Documents",
              description: "Upload supporting documents",
              completed: false,
              skipped: false,
              stepIdentifier: "documents",
            },
            {
              stepNumber: 5,
              title: "Availability",
              description: "Set your preferred availability",
              completed: false,
              skipped: false,
              stepIdentifier: "availability",
            },
            {
              stepNumber: 6,
              title: "Goals",
              description: "Share your goals and challenges",
              completed: false,
              skipped: false,
              stepIdentifier: "goals",
            },
            {
              stepNumber: 7,
              title: "Referral & Consent",
              description: "How did you hear about us",
              completed: false,
              skipped: false,
              stepIdentifier: "referral-consent",
            },
          ];
          setDynamicSteps(fallbackSteps);
        }

        // Pre-fill form with existing data from progress
        if (
          progressData.stepData &&
          typeof progressData.stepData === "object" &&
          !Array.isArray(progressData.stepData)
        ) {
          const mergedFormData = Object.values(progressData.stepData).reduce(
            (acc: Record<string, any>, step: any) => {
              if (
                step &&
                typeof step === "object" &&
                step.data &&
                typeof step.data === "object"
              ) {
                return { ...acc, ...step.data };
              }
              return acc;
            },
            {}
          );
          setForm((prevForm) => ({ ...prevForm, ...mergedFormData }));
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load onboarding status");
        console.error("Onboarding fetch error:", err);
      } finally {
        setLoading(false);
        console.log("Loading set to false");
      }
    }
    fetchStatusAndProgress();
  }, [userId, token, startOnboarding, getOnboardingProgress]);

  // Show loading if still loading or if dynamicSteps is not loaded yet
  if (loading) {
    console.log("Loading state:", {
      loading,
      dynamicStepsLength: dynamicSteps.length,
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-700 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading onboarding...</p>
          <p className="text-xs text-gray-400 mt-2">
            Steps loaded: {dynamicSteps.length}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
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
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      setForm((prev) => ({ ...prev, [name]: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Real-time email validation for Step 1
    if (step === 0 && name === "email" && value.trim()) {
      // Check if email format is valid first
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        // Debounce the email check to avoid too many API calls
        const timeoutId = setTimeout(async () => {
          const emailExists = await checkEmailExists(value);
          if (emailExists) {
            setErrors((prev) => ({
              ...prev,
              email:
                "This email address is already registered. Please use a different email.",
            }));
          }
        }, 1000); // Wait 1 second after user stops typing

        // Clean up timeout on next change
        return () => clearTimeout(timeoutId);
      }
    }
  };

  // Handle array field changes (for checkboxes, multi-select, etc.)
  const handleArrayChange = (
    fieldName: string,
    value: string,
    checked: boolean
  ) => {
    setForm((prev) => {
      // Ensure the field is always an array
      const currentArray = Array.isArray(prev[fieldName as keyof typeof prev])
        ? (prev[fieldName as keyof typeof prev] as string[])
        : [];

      let newArray: string[];

      if (checked) {
        // Add value to array if not already present
        newArray = currentArray.includes(value)
          ? currentArray
          : [...currentArray, value];
      } else {
        // Remove value from array
        newArray = currentArray.filter((item) => item !== value);
      }

      return { ...prev, [fieldName]: newArray };
    });

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  // Check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/users/check-email?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.exists || false;
      }
      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      // Personal Information validation
      if (!String(form.fullName || "").trim())
        newErrors.fullName = "Full name is required.";
      if (!String(form.email || "").trim()) {
        newErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email))) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!String(form.phoneNumber || "").trim())
        newErrors.phoneNumber = "Phone number is required.";
      if (!String(form.countryOfResidence || "").trim())
        newErrors.countryOfResidence = "Country of residence is required.";
      if (!String(form.preferredContactMethod || "").trim())
        newErrors.preferredContactMethod =
          "Preferred contact method is required.";
    } else if (step === 1) {
      // Academic Background validation
      if (!String(form.highestQualification || "").trim())
        newErrors.highestQualification = "Highest qualification is required.";
      if (!String(form.fieldOfStudy || "").trim())
        newErrors.fieldOfStudy = "Field of study is required.";
      if (!String(form.academicLevel || "").trim())
        newErrors.academicLevel = "Academic level is required.";
      if (!String(form.graduationYear || "").trim())
        newErrors.graduationYear = "Graduation year is required.";
    } else if (step === 2) {
      // Interest Areas validation - ensure it's an array
      const interestAreas = Array.isArray(form.interestAreas)
        ? form.interestAreas
        : [];
      if (interestAreas.length === 0)
        newErrors.interestAreas = "Please select at least one interest area.";
    } else if (step === 4) {
      // Availability validation - ensure arrays are arrays
      const preferredDays = Array.isArray(form.preferredDays)
        ? form.preferredDays
        : [];
      const preferredTimeSlots = Array.isArray(form.preferredTimeSlots)
        ? form.preferredTimeSlots
        : [];

      if (preferredDays.length === 0)
        newErrors.preferredDays = "Please select at least one preferred day.";
      if (preferredTimeSlots.length === 0)
        newErrors.preferredTimeSlots =
          "Please select at least one preferred time slot.";
      if (!String(form.timeZone || "").trim())
        newErrors.timeZone = "Time zone is required.";
    } else if (step === 5) {
      // Goals validation
      if (!String(form.goals || "").trim())
        newErrors.goals = "Please describe your goals.";
    } else if (step === 6) {
      // Referral and Consent validation
      if (!form.agreeToTerms)
        newErrors.agreeToTerms = "You must agree to the terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextOrFinish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;

    // Get current step data from backend-driven steps
    const currentStepData = dynamicSteps[step];
    if (!currentStepData) {
      throw new Error("Invalid step data");
    }

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

      // Prepare step data based on current step
      let stepData: any = {};

      switch (step) {
        case 0: // Personal Information
          stepData = {
            fullName: form.fullName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            gender: form.gender || undefined,
            dateOfBirth: form.dateOfBirth || undefined,
            countryOfResidence: form.countryOfResidence,
            preferredContactMethod: form.preferredContactMethod,
          };
          break;
        case 1: // Academic Background
          stepData = {
            highestQualification: form.highestQualification,
            currentInstitution: form.currentInstitution || undefined,
            fieldOfStudy: form.fieldOfStudy,
            academicLevel: form.academicLevel,
            graduationYear:
              typeof form.graduationYear === "number"
                ? form.graduationYear
                : parseInt(String(form.graduationYear || "")),
          };
          break;
        case 2: // Interest Areas
          stepData = {
            interestAreas: form.interestAreas,
          };
          break;
        case 3: // Documents
          // Upload files first
          const transcriptUrl = form.transcript
            ? await uploadFile(form.transcript)
            : "";
          const cvResumeUrl = form.cvResume
            ? await uploadFile(form.cvResume)
            : "";
          const sopUrl = form.statementOfPurpose
            ? await uploadFile(form.statementOfPurpose)
            : "";
          const proposalUrl = form.researchProposal
            ? await uploadFile(form.researchProposal)
            : "";

          stepData = {
            transcript: transcriptUrl,
            cvResume: cvResumeUrl,
            statementOfPurpose: sopUrl,
            researchProposal: proposalUrl,
          };
          break;
        case 4: // Availability
          // Convert full day names to short form
          const dayMapping: { [key: string]: string } = {
            Monday: "Mon",
            Tuesday: "Tue",
            Wednesday: "Wed",
            Thursday: "Thu",
            Friday: "Fri",
            Saturday: "Sat",
            Sunday: "Sun",
          };

          // Ensure preferredDays is an array
          const preferredDaysArray = Array.isArray(form.preferredDays)
            ? form.preferredDays
            : [];
          const preferredDays = preferredDaysArray.map(
            (day: string) => dayMapping[day] || day
          );

          // Ensure preferredTimeSlots is an array
          const preferredTimeSlotsArray = Array.isArray(form.preferredTimeSlots)
            ? form.preferredTimeSlots
            : [];
          const preferredTimeSlots = preferredTimeSlotsArray.map(
            (slot: string) => slot.toLowerCase()
          );

          // Extract timezone from the full string - ensure it's a string
          const timeZoneString = String(form.timeZone || "");
          const timeZone = timeZoneString.split(" ")[0] || timeZoneString;

          stepData = {
            preferredDays,
            preferredTimeSlots,
            timeZone,
          };
          break;
        case 5: // Goals
          stepData = {
            goals: form.goals,
            challenges: form.challenges,
          };
          break;
        case 6: // Referral and Consent
          stepData = {
            referralSource: form.referralSource,
            referralCodeOrName: form.referralCodeOrName || "",
            consentToStoreInfo: form.consentToStoreInfo,
            agreeToTerms: form.agreeToTerms,
          };
          break;
        default:
          throw new Error("Invalid step number");
      }

      // Check if the current step is skipped and needs to be completed
      if (currentStepData.skipped && !currentStepData.completed) {
        // Use completeStep from the hook to mark the skipped step as completed
        const result = await completeStep(userId, step + 1, stepData);

        if (result?.status === 200) {
          setStepSuccess("Step completed successfully!");
          // Update the step status locally
          setDynamicSteps((prev) =>
            prev.map((s, i) =>
              i === step ? { ...s, completed: true, skipped: false } : s
            )
          );
          setCompletedSteps((prev) => new Set([...prev, step]));
        } else {
          throw new Error("Failed to complete step");
        }
      } else {
        // Submit step data using the step identifier from backend
        // Map step numbers to backend endpoint identifiers
        const stepEndpointMap: { [key: number]: string } = {
          0: "personal-info",
          1: "academic-background",
          2: "interest-areas",
          3: "documents",
          4: "availability",
          5: "goals",
          6: "referral-consent",
        };

        // Get step identifier from map (or fallback)
        const stepIdentifier = stepEndpointMap[step] || `step-${step + 1}`;

        // Submit step data to correct endpoint
        const result = await postApiRequest(
          `/api/onboarding/student/${userId}/${stepIdentifier}`,
          stepData,
          token ? { Authorization: `Bearer ${token}` } : {}
        );
      }

      // If this is the final step, mark onboarding as completed
      if (step === dynamicSteps.length - 1) {
        await setOnboardingStatus(userId, "completed");
        setStatus("completed");
        // Show completion modal
        setCompletionModal({
          open: true,
          message: "Welcome! Your onboarding is complete.",
        });
        setStepSuccess("Onboarding completed successfully!");
        setTimeout(() => {
          setCompletionModal({ open: false, message: "" });
          router.push("/dashboard/student");
        }, 2000);
        return;
      }

      // Fetch latest onboarding progress after step submission
      const progressRes = await getOnboardingProgress(userId);
      const progressData = progressRes?.data?.data;
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
          console.log("Setting completed steps:", completedStepsSet);
          setCompletedSteps(completedStepsSet);
        }
      }
      setStepSuccess("Step saved successfully!");
      setTimeout(() => {
        setStepSuccess("");
      }, 1000);
    } catch (error: any) {
      console.error("Step submission error:", error);

      // Handle specific duplicate email error
      if (
        error.message &&
        error.message.includes("E11000") &&
        error.message.includes("email")
      ) {
        setSubmitError(
          "This email address is already registered. Please use a different email or contact support if you believe this is an error."
        );
        return;
      }

      // Handle other duplicate key errors
      if (error.message && error.message.includes("E11000")) {
        setSubmitError(
          "This information already exists in our system. Please check your details and try again."
        );
        return;
      }

      // Use the consistent error handling from apiFetch
      if (error.details && Array.isArray(error.details)) {
        setSubmitError(error.details.join(", "));
      } else if (error.message) {
        // Check for specific error patterns
        if (
          error.message.includes("duplicate") ||
          error.message.includes("already exists")
        ) {
          setSubmitError(
            "This information already exists in our system. Please check your details and try again."
          );
        } else {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError(`Failed to save step ${step + 1}. Please try again.`);
      }
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
            Welcome to Your Academic Journey!
          </h1>
        </div>
        <p className="text-gray-700 text-center max-w-2xl mb-2 text-lg">
          We're excited to have you join Tech Edu Solution. This quick
          onboarding will help us tailor our academic services to your unique
          goals and background.
        </p>
        <p className="text-blue-900 text-center max-w-xl text-base font-medium">
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 mr-2 mb-1">
            🚀
          </span>
          Let's get started—your future begins here!
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-[10px] shadow-xl p-8 flex flex-col md:flex-row gap-8">
        {/* Vertical Progress Indicator */}
        <div className="flex md:flex-col flex-row md:items-start items-center md:w-48 w-full md:justify-start justify-start overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
          <div
            className="flex md:flex-col flex-row items-center md:gap-4 gap-2 md:min-h-[400px] min-w-max md:min-w-0 px-2"
            style={{ width: "100%" }}
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
          {stepDescription && (
            <p className="mb-4 text-gray-600">{stepDescription}</p>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="text-red-600 text-sm">{submitError}</p>
              {submitError.includes("email") &&
                submitError.includes("already registered") && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-[5px]">
                    <p className="text-blue-700 text-xs">
                      <strong>Need help?</strong> If you believe this email
                      should not be registered, please:
                    </p>
                    <ul className="text-blue-600 text-xs mt-1 ml-4 list-disc">
                      <li>Try using a different email address</li>
                      <li>Contact support at support@techedu.com</li>
                      <li>Check if you already have an account</li>
                    </ul>
                  </div>
                )}
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
            {/* Step 1: Personal Information */}
            {step === 0 && (
              <StudentStep1PersonalInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 2: Academic Background */}
            {step === 1 && (
              <StudentStep2AcademicBackground
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 3: Interest Areas */}
            {step === 2 && (
              <StudentStep3InterestAreas
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleArrayChange={handleArrayChange}
              />
            )}

            {/* Step 4: Documents */}
            {step === 3 && (
              <StudentStep4Documents
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 5: Availability */}
            {step === 4 && (
              <StudentStep5Availability
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleArrayChange={handleArrayChange}
              />
            )}

            {/* Step 6: Goals */}
            {step === 5 && (
              <StudentStep6Goals
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 7: Referral & Consent */}
            {step === 6 && (
              <StudentStep7ReferralConsent
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
                  disabled={stepSubmitting === step || submitting}
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

                {step < dynamicSteps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextOrFinish}
                    className="rounded-[10px] text-white hover:text-black"
                    disabled={stepSubmitting === step || submitting}
                  >
                    {stepSubmitting === step ? (
                      "Saving..."
                    ) : (
                      <>
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextOrFinish}
                    disabled={stepSubmitting === step || submitting}
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    {stepSubmitting === step ? "Submitting..." : "Finish"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
