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
  Step1Welcome,
  Step2InstitutionalInfo,
  Step3AcademicFocus,
  Step4Verification,
  Step5ContactPreferences,
  Step6TermsConsent,
  Step7InviteStudents,
} from "./steps/institution";

const initialForm = {
  // Step 1: Welcome (no data needed)
  // Step 2: Institutional Information
  institutionName: "",
  institutionType: "",
  country: "",
  stateRegion: "",
  cityTown: "",
  websiteUrl: "",
  officialEmail: "",
  phoneNumber: "",
  // Step 3: Academic Focus
  interests: [] as string[],
  proceedWithUpload: false,
  // Step 4: Verification
  accreditationDocument: null as File | null,
  courseBrochure: null as File | null,
  // Step 5: Contact Preferences
  preferredContactMethod: "",
  // Step 6: Terms & Consent
  agreeToTerms: false,
  referralSource: "",
  referralCodeOrName: "",
  // Step 7: Invite Students
  adminTeamMembers: [] as { name: string; email: string; role: string }[],
  studentsOrProfessionals: [] as {
    name: string;
    email: string;
    type: string;
  }[],
  skipAndInviteLater: false,
};

const institutionTypes = [
  "University",
  "Polytechnic",
  "Bootcamp",
  "Training Center",
  "Other",
];
const interestsOptions = [
  "Upload tech professionals for recruitment",
  "Enroll students in training",
  "Host events/certifications jointly",
  "Boost institutional visibility",
];
const uploadModes = ["Manual entry", "Bulk CSV upload", "API Integration"];
const contactMethods = ["email", "phone", "whatsapp"];

// File upload helper
const uploadFile = async (file: File): Promise<string> => {
  return `https://files.example.com/${file.name}`;
};

interface CompletionModal {
  open: boolean;
  message: string;
}

export default function InstitutionOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getCookie("token") || getCookie("access_token");
  const userType = "institution";

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
          router.push("/dashboard/institution");
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
          "welcome",
          "institutional-info",
          "academic-focus",
          "verification",
          "contact-preferences",
          "terms-consent",
          "invite-students",
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
              title: "Institutional Information",
              description: "Basic institution details",
              completed: false,
              skipped: false,
              stepIdentifier: "institutional-info",
            },
            {
              stepNumber: 3,
              title: "Academic Focus",
              description: "Academic areas and student support",
              completed: false,
              skipped: false,
              stepIdentifier: "academic-focus",
            },
            {
              stepNumber: 4,
              title: "Verification",
              description: "Upload accreditation documents",
              completed: false,
              skipped: false,
              stepIdentifier: "verification",
            },
            {
              stepNumber: 5,
              title: "Contact Preferences",
              description: "Set communication preferences",
              completed: false,
              skipped: false,
              stepIdentifier: "contact-preferences",
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
              title: "Invite Students",
              description: "Add team members and students",
              completed: false,
              skipped: false,
              stepIdentifier: "invite-students",
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
      } else {
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
    console.log("Loading state:", {
      loading,
      dynamicStepsLength: dynamicSteps.length,
    });
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
    if (type === "checkbox" && name === "interests") {
      setForm((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i: string) => i !== value),
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // For team and students multi-entry
  const handleAddAdminTeamMember = () => {
    setForm((prev) => ({
      ...prev,
      adminTeamMembers: [
        ...prev.adminTeamMembers,
        { name: "", email: "", role: "" },
      ],
    }));
  };
  const handleAdminTeamMemberChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.adminTeamMembers];
      updated[idx][field as keyof (typeof updated)[number]] = value;
      return { ...prev, adminTeamMembers: updated };
    });
  };
  const handleRemoveAdminTeamMember = (idx: number) => {
    setForm((prev) => {
      const updated = [...prev.adminTeamMembers];
      updated.splice(idx, 1);
      return { ...prev, adminTeamMembers: updated };
    });
  };
  const handleAddStudentOrProfessional = () => {
    setForm((prev) => ({
      ...prev,
      studentsOrProfessionals: [
        ...prev.studentsOrProfessionals,
        { name: "", email: "", type: "student" },
      ],
    }));
  };
  const handleStudentOrProfessionalChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.studentsOrProfessionals];
      updated[idx][field as keyof (typeof updated)[number]] = value;
      return { ...prev, studentsOrProfessionals: updated };
    });
  };
  const handleRemoveStudentOrProfessional = (idx: number) => {
    setForm((prev) => {
      const updated = [...prev.studentsOrProfessionals];
      updated.splice(idx, 1);
      return { ...prev, studentsOrProfessionals: updated };
    });
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (stepTitle === "Welcome") {
      // No validation needed for welcome step
      return true;
    }

    if (stepTitle === "Institutional Information") {
      if (!form.institutionName)
        newErrors.institutionName = "Institution name is required.";
      if (!form.institutionType)
        newErrors.institutionType = "Institution type is required.";
      if (!form.country) newErrors.country = "Country is required.";
      if (!form.stateRegion)
        newErrors.stateRegion = "State/Region is required.";
      if (!form.cityTown) newErrors.cityTown = "City/Town is required.";
      if (!form.officialEmail)
        newErrors.officialEmail = "Official email is required.";
      if (!form.phoneNumber)
        newErrors.phoneNumber = "Phone number is required.";
    }

    if (stepTitle === "Academic Focus") {
      if (!form.interests.length)
        newErrors.interests = "Select at least one academic focus area.";
    }

    if (stepTitle === "Verification") {
      if (!form.accreditationDocument)
        newErrors.accreditationDocument = "Accreditation document is required.";
    }

    if (stepTitle === "Contact Preferences") {
      if (!form.preferredContactMethod)
        newErrors.preferredContactMethod =
          "Preferred contact method is required.";
    }

    if (stepTitle === "Terms & Consent") {
      if (!form.agreeToTerms)
        newErrors.agreeToTerms = "You must agree to the terms and conditions.";
    }

    if (stepTitle === "Invite Students") {
      // Optional step - no validation required
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update navigation and validation to use currentStep
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
        case 1: // Institutional Information
          stepData = {
            institutionName: form.institutionName,
            institutionType: form.institutionType,
            country: form.country,
            state: form.stateRegion,
            address: form.cityTown,
            officialWebsite: form.websiteUrl || undefined,
            contactEmail: form.officialEmail,
            phoneNumber: form.phoneNumber,
          };
          break;
        case 2: // Academic Focus
          stepData = {
            academicFocusAreas: form.interests,
            supportsStudentUploads: form.proceedWithUpload,
          };
          break;
        case 3: // Verification
          const accreditationUrl = form.accreditationDocument
            ? await uploadFile(form.accreditationDocument)
            : "";
          const complianceUrl = form.courseBrochure
            ? await uploadFile(form.courseBrochure)
            : "";
          stepData = {
            accreditationDocuments: accreditationUrl,
            complianceDocuments: complianceUrl,
          };
          break;
        case 4: // Contact Preferences
          stepData = {
            preferredContactMethod: form.preferredContactMethod,
          };
          break;
        case 5: // Terms & Consent
          stepData = {
            agreeToTerms: form.agreeToTerms,
            referralSource: form.referralSource || "Direct",
            referralCodeOrName: form.referralCodeOrName || "",
          };
          break;
        case 6: // Invite Students
          stepData = {
            teamMembers: form.adminTeamMembers,
            students: form.studentsOrProfessionals,
            skipAndInviteLater: form.skipAndInviteLater,
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
        const stepIdentifier =
          currentStepData.stepIdentifier || `step-${step + 1}`;
        const result = await postApiRequest(
          `/api/onboarding/institution/${userId}/${stepIdentifier}`,
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
          router.push("/dashboard/institution");
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
          console.log("Setting completed steps:", completedStepsSet);
          setCompletedSteps(completedStepsSet);
        }
      }
      setStepSuccess("Step saved successfully!");
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
            Welcome to Institution Onboarding!
          </h1>
        </div>
        <p className="text-gray-700 text-center max-w-2xl mb-2 text-lg">
          We're excited to partner with your institution. This onboarding will
          help us understand your needs and set up the perfect collaboration for
          your students and tech professionals.
        </p>
        <p className="text-blue-900 text-center max-w-xl text-base font-medium">
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 mr-2 mb-1">
            🏫
          </span>
          Let's build the future of tech education together!
        </p>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-[10px] shadow-xl p-8 flex flex-col md:flex-row gap-8">
        {/* Progress Indicator */}
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
            {/* Step 1: Institutional Information */}
            {step === 0 && (
              <Step1Welcome
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 2: Institutional Contact Person */}
            {step === 1 && (
              <Step2InstitutionalInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 3: Areas of Interest & Objectives */}
            {step === 2 && (
              <Step3AcademicFocus
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 4: Supporting Documents */}
            {step === 3 && (
              <Step4Verification
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 5: Tech Professional Upload Options */}
            {step === 4 && (
              <Step5ContactPreferences
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 6: Terms, Verification & Consent */}
            {step === 5 && (
              <Step6TermsConsent
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 7: Invite Additional Team Members or Students */}
            {step === 6 && (
              <Step7InviteStudents
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleAddAdminTeamMember={handleAddAdminTeamMember}
                handleAdminTeamMemberChange={handleAdminTeamMemberChange}
                handleRemoveAdminTeamMember={handleRemoveAdminTeamMember}
                handleAddStudentOrProfessional={handleAddStudentOrProfessional}
                handleStudentOrProfessionalChange={
                  handleStudentOrProfessionalChange
                }
                handleRemoveStudentOrProfessional={
                  handleRemoveStudentOrProfessional
                }
              />
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
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
