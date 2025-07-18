"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { postApiRequest } from "@/lib/apiFetch";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { Button } from "@/components/ui/button";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

// Step Components
import {
  RecruiterStep1Welcome,
  RecruiterStep2Details,
  RecruiterStep3CompanyLink,
  RecruiterStep4HiringFocus,
  RecruiterStep5Regions,
  RecruiterStep6TermsConsent,
  RecruiterStep7PostJob,
} from "./steps/recruiter";

const initialForm = {
  // Step 1: Welcome (no data needed)
  // Step 2: Recruiter Details
  recruitingName: "",
  positionAtCompany: "",
  contactEmail: "",
  phoneNumber: "",
  // Step 3: Company Information
  companyId: "",
  companyName: "",
  companyType: "recruiter",
  rcNumber: "",
  industry: "",
  website: "",
  // Step 4: Hiring Focus
  recruitmentFocusAreas: [] as string[],
  preferredHiringModel: "",
  // Step 5: Hiring Regions
  hiringRegions: [] as string[],
  // Step 6: Terms & Consent
  agreeToTerms: false,
  referralSource: "",
  referralCodeOrName: "",
  // Step 7: Post Job
  jobTitle: "",
  jobDescription: "",
  employmentType: "",
  location: "",
  salaryRange: "",
  skipForNow: false,
};

// File upload helper
const uploadFile = async (file: File): Promise<string> => {
  // Placeholder for actual upload logic
  return `https://files.example.com/${file.name}`;
};

interface CompletionModal {
  open: boolean;
  message: string;
}

export default function RecruiterOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getCookie("token") || getCookie("access_token");
  const userType = "recruiter";

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
          router.push("/dashboard/recruiter");
          return;
        }

        setProgress(progressData);
        if (
          typeof progressData.currentStep === "number" &&
          progressData.currentStep > 0
        ) {
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
          "welcome",
          "details",
          "company-link",
          "hiring-focus",
          "regions",
          "terms-consent",
          "post-job",
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
              title: "Welcome",
              description: "Introduction and onboarding overview",
              completed: false,
              skipped: false,
              stepIdentifier: "welcome",
            },
            {
              stepNumber: 2,
              title: "Recruiter Details",
              description: "Your personal information",
              completed: false,
              skipped: false,
              stepIdentifier: "details",
            },
            {
              stepNumber: 3,
              title: "Company Information",
              description: "Link to your company",
              completed: false,
              skipped: false,
              stepIdentifier: "company-link",
            },
            {
              stepNumber: 4,
              title: "Hiring Focus",
              description: "Define your recruitment areas",
              completed: false,
              skipped: false,
              stepIdentifier: "hiring-focus",
            },
            {
              stepNumber: 5,
              title: "Hiring Regions",
              description: "Select your hiring regions",
              completed: false,
              skipped: false,
              stepIdentifier: "regions",
            },
            {
              stepNumber: 6,
              title: "Terms & Consent",
              description: "Agree to terms and conditions",
              completed: false,
              skipped: false,
              stepIdentifier: "terms-consent",
            },
            {
              stepNumber: 7,
              title: "Post Job",
              description: "Create your first job posting",
              completed: false,
              skipped: false,
              stepIdentifier: "post-job",
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

  // Show loading if dynamicSteps is not loaded
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
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (stepTitle === "Welcome") {
      // No validation needed for welcome step
      return true;
    }

    if (stepTitle === "Recruiter Details") {
      if (!form.recruitingName)
        newErrors.recruitingName = "Recruiter name is required.";
      if (!form.positionAtCompany)
        newErrors.positionAtCompany = "Position at company is required.";
      if (!form.contactEmail)
        newErrors.contactEmail = "Contact email is required.";
      if (!form.phoneNumber)
        newErrors.phoneNumber = "Phone number is required.";
    }

    if (stepTitle === "Company Information") {
      if (!form.companyName)
        newErrors.companyName = "Company name is required.";
      if (!form.industry) newErrors.industry = "Industry is required.";
    }

    if (stepTitle === "Hiring Focus") {
      if (!form.recruitmentFocusAreas.length)
        newErrors.recruitmentFocusAreas =
          "Select at least one recruitment focus area.";
      if (!form.preferredHiringModel)
        newErrors.preferredHiringModel = "Preferred hiring model is required.";
    }

    if (stepTitle === "Hiring Regions") {
      if (!form.hiringRegions.length)
        newErrors.hiringRegions = "Select at least one hiring region.";
    }

    if (stepTitle === "Terms & Consent") {
      if (!form.agreeToTerms)
        newErrors.agreeToTerms = "You must agree to the terms and conditions.";
    }

    if (stepTitle === "Post Job") {
      // Optional step - validation only if not skipping
      if (!form.skipForNow) {
        if (!form.jobTitle) newErrors.jobTitle = "Job title is required.";
        if (!form.jobDescription)
          newErrors.jobDescription = "Job description is required.";
        if (!form.employmentType)
          newErrors.employmentType = "Employment type is required.";
        if (!form.location) newErrors.location = "Location is required.";
      }
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

      let stepData;
      switch (step) {
        case 0: // Welcome - No API call needed
          // Skip API call for welcome step
          setStep((s) => s + 1);
          setStepSuccess("Welcome step completed!");
          setTimeout(() => {
            setStepSuccess("");
          }, 1000);
          return;
        case 1: // Recruiter Details
          stepData = {
            recruitingName: form.recruitingName,
            positionAtCompany: form.positionAtCompany,
            contactEmail: form.contactEmail,
            phoneNumber: form.phoneNumber,
          };
          break;
        case 2: // Company Information
          stepData = {
            companyId: form.companyId || undefined,
            companyName: form.companyName,
            companyType: form.companyType,
            rcNumber: form.rcNumber || undefined,
            industry: form.industry,
            website: form.website || undefined,
          };
          break;
        case 3: // Hiring Focus
          stepData = {
            recruitmentFocusAreas: form.recruitmentFocusAreas,
            preferredHiringModel: form.preferredHiringModel,
          };
          break;
        case 4: // Hiring Regions
          stepData = {
            hiringRegions: form.hiringRegions,
          };
          break;
        case 5: // Terms & Consent
          stepData = {
            agreeToTerms: form.agreeToTerms,
            referralSource: form.referralSource || "Direct",
            referralCodeOrName: form.referralCodeOrName || "",
          };
          break;
        case 6: // Post Job
          if (form.skipForNow) {
            // If skipping, only send the skip flag
            stepData = {
              skipForNow: true,
            };
          } else {
            // If not skipping, send all job data
            stepData = {
              jobTitle: form.jobTitle,
              jobDescription: form.jobDescription,
              employmentType: form.employmentType,
              location: form.location,
              salaryRange: form.salaryRange,
              skipForNow: false,
            };
          }
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
        const stepIdentifier =
          currentStepData.stepIdentifier || `step-${step + 1}`;
        const result = await postApiRequest(
          `/api/onboarding/recruiter/${userId}/${stepIdentifier}`,
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
          router.push("/dashboard/recruiter");
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
      setStepSuccess("Step saved successfully!");
      setTimeout(() => {
        setStepSuccess("");
      }, 1000);
    } catch (error: any) {
      // Use the consistent error handling from apiFetch
      if (error.details && Array.isArray(error.details)) {
        setSubmitError(error.details.join(", "));
      } else {
        setSubmitError(
          error.message || `Failed to save step ${step + 1}. Please try again.`
        );
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

    // Check if step can be skipped (Step 1, 2, and last step cannot be skipped)
    if (step === 0 || step === 1 || step === dynamicSteps.length - 1) {
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

  const stepComponents = [
    RecruiterStep1Welcome,
    RecruiterStep2Details,
    RecruiterStep3CompanyLink,
    RecruiterStep4HiringFocus,
    RecruiterStep5Regions,
    RecruiterStep6TermsConsent,
    RecruiterStep7PostJob,
  ];

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
            Welcome to Recruiter Onboarding!
          </h1>
        </div>
        <p className="text-gray-700 text-center max-w-2xl mb-2 text-lg">
          We're excited to partner with you for talent acquisition. This
          onboarding will help us understand your hiring needs and set up the
          perfect recruitment tools for your company.
        </p>
        <p className="text-blue-900 text-center max-w-xl text-base font-medium">
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 mr-2 mb-1">
            🎯
          </span>
          Let's find the perfect talent together!
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
            {/* Step 1: Recruiter Profile */}
            {step === 0 && (
              <RecruiterStep1Welcome
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 2: Company Information */}
            {step === 1 && (
              <RecruiterStep2Details
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 3: Hiring Goals */}
            {step === 2 && (
              <RecruiterStep3CompanyLink
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 4: Supporting Documents */}
            {step === 3 && (
              <RecruiterStep4HiringFocus
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 5: Access Method & Tools */}
            {step === 4 && (
              <RecruiterStep5Regions
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 6: Consent & Compliance */}
            {step === 5 && (
              <RecruiterStep6TermsConsent
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 7: Activate Hiring Tools */}
            {step === 6 && (
              <RecruiterStep7PostJob
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
