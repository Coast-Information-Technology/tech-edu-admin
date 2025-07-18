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
  Step1PersonalInfo,
  Step2EducationCertifications,
  Step3SkillsSpecialization,
  Step4ProfessionalBackground,
  Step5CareerGoals,
  Step6AdditionalDetails,
  Step7ConsentReferral,
} from "./steps/tech-professional";

const initialForm = {
  // Step 1: Personal Information
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  nationality: "",
  currentLocation: "",
  linkedIn: "",
  github: "",
  portfolioUrl: "",
  // Step 2: Education & Certifications
  highestQualification: "",
  fieldOfStudy: "",
  graduationYear: "",
  certifications: [] as string[],
  uploadCertifications: undefined as File | undefined,
  // Step 3: Skills & Specialization
  primarySpecialization: "",
  programmingLanguages: [] as string[],
  frameworksAndTools: [] as string[],
  softSkills: [] as string[],
  preferredTechStack: "",
  // Step 4: Professional Background
  currentJobTitle: "",
  yearsOfExperience: "",
  industryFocus: "",
  employmentStatus: "",
  remoteWorkExperience: false,
  resumeUrl: "",
  uploadCvResume: undefined as File | undefined,
  uploadPortfolio: undefined as File | undefined,
  // Step 5: Career Goals & Platform Use
  platformGoals: [] as string[],
  jobTypePreference: "",
  salaryExpectation: "",
  availabilityType: "",
  workingHoursPreference: "",
  // Step 6: Availability & Preferences
  availability: [] as string[],
  openToRelocation: false,
  preferredWorkingHours: "",
  skillAssessmentInterest: true,
  availableAsInstructor: false,
  preferredStartTime: "",
  portfolioProjects: [] as string[],
  willingToBeContacted: false,
  // Step 7: Final Confirmation
  referralSource: "",
  referralCodeOrName: "",
  consentToTerms: false,
  subscribeToAlerts: false,
};

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const countries = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Other",
];

const qualifications = ["BSc", "MSc", "PhD", "Diploma", "HND", "Other"];

const specializations = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Mobile Development",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
  "Other",
];

const programmingLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "TypeScript",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Other",
];

const frameworksLibraries = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "Next.js",
  "Nuxt.js",
  "Other",
];

const toolsPlatforms = [
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Git",
  "Jenkins",
  "Jira",
  "Figma",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Other",
];

const softSkills = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Adaptability",
  "Critical Thinking",
  "Creativity",
  "Emotional Intelligence",
  "Other",
];

const industryFocus = [
  "Fintech",
  "Healthtech",
  "E-commerce",
  "Edtech",
  "SaaS",
  "Gaming",
  "AI/ML",
  "IoT",
  "Blockchain",
  "Other",
];

const employmentStatus = [
  "Employed",
  "Freelancing",
  "Job-seeking",
  "Student",
  "Entrepreneur",
  "Other",
];

const goals = [
  "Access Online Training",
  "Get Recruited (Career Connect)",
  "Collaborate on Projects",
  "Become an Instructor",
  "Build Portfolio",
  "Get Mentored",
];

const jobTypes = ["Remote", "Hybrid", "Onsite"];

const availability = ["Full-Time", "Part-Time", "Internships"];

const workingHours = ["Flexible", "9-5", "Weekends", "Evenings"];

const referralSources = [
  "Social Media",
  "Friend",
  "Referral",
  "Tech Event",
  "Google Search",
  "LinkedIn",
  "GitHub",
  "Other",
];

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

export default function IndividualindividualTechProfessionalOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getCookie("token") || getCookie("access_token");
  const userType = "individualTechProfessional";

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
          router.push("/dashboard/tech-professional");
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
          "personal-info",
          "education-certifications",
          "skills-specialization",
          "work-background",
          "career-goals",
          "additional-details",
          "consent-referral",
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
              title: "Personal Information",
              description: "Provide your personal details.",
              completed: false,
              skipped: false,
              stepIdentifier: "personal-info",
            },
            {
              stepNumber: 2,
              title: "Education & Certifications",
              description: "Share your academic background and certifications.",
              completed: false,
              skipped: false,
              stepIdentifier: "education-certifications",
            },
            {
              stepNumber: 3,
              title: "Skills & Specialization",
              description: "List your skills and specialization.",
              completed: false,
              skipped: false,
              stepIdentifier: "skills-specialization",
            },
            {
              stepNumber: 4,
              title: "Work Background",
              description: "Describe your professional experience.",
              completed: false,
              skipped: false,
              stepIdentifier: "work-background",
            },
            {
              stepNumber: 5,
              title: "Career Goals",
              description: "Tell us your goals and preferences.",
              completed: false,
              skipped: false,
              stepIdentifier: "career-goals",
            },
            {
              stepNumber: 6,
              title: "Additional Details",
              description: "Share more about your interests and availability.",
              completed: false,
              skipped: false,
              stepIdentifier: "additional-details",
            },
            {
              stepNumber: 7,
              title: "Consent & Referral",
              description:
                "How did you hear about us? Agree to terms and submit.",
              completed: false,
              skipped: false,
              stepIdentifier: "consent-referral",
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
          setForm((prevForm) => {
            const newForm = { ...prevForm, ...allStepData };

            // Ensure array fields are always arrays
            const arrayFields = [
              "certifications",
              "programmingLanguages",
              "frameworksAndTools",
              "softSkills",
              "platformGoals",
              "portfolioProjects",
              "availability",
            ];

            arrayFields.forEach((field) => {
              if (!Array.isArray(newForm[field])) {
                newForm[field] = [];
              }
            });

            return newForm;
          });
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

          // Ensure array fields are always arrays
          const arrayFields = [
            "certifications",
            "programmingLanguages",
            "frameworksAndTools",
            "softSkills",
            "platformGoals",
            "portfolioProjects",
            "availability",
          ];

          arrayFields.forEach((field) => {
            if (!Array.isArray(newForm[field])) {
              newForm[field] = [];
            }
          });

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
        name === "frameworksAndTools" ||
        name === "softSkills" ||
        name === "platformGoals" ||
        name === "portfolioProjects" ||
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

    if (stepTitle === "Personal Information") {
      if (!form.fullName) newErrors.fullName = "Full name is required.";
      if (!form.email) newErrors.email = "Email is required.";
      if (!form.phoneNumber)
        newErrors.phoneNumber = "Phone number is required.";
      if (!form.nationality) newErrors.nationality = "Nationality is required.";
      if (!form.currentLocation)
        newErrors.currentLocation = "Current location is required.";
    }

    if (stepTitle === "Education & Certifications") {
      if (!form.highestQualification)
        newErrors.highestQualification = "Highest qualification is required.";
      if (!form.fieldOfStudy)
        newErrors.fieldOfStudy = "Field of study is required.";
      if (!form.graduationYear)
        newErrors.graduationYear = "Graduation year is required.";
    }

    if (stepTitle === "Skills & Specialization") {
      if (!form.primarySpecialization)
        newErrors.primarySpecialization = "Primary specialization is required.";
      if (!form.programmingLanguages.length)
        newErrors.programmingLanguages =
          "Select at least one programming language.";
      if (!form.frameworksAndTools.length)
        newErrors.frameworksAndTools = "Select at least one framework/library.";
      if (!form.softSkills.length)
        newErrors.softSkills = "Select at least one soft skill.";
    }

    if (stepTitle === "Professional Background") {
      if (!form.currentJobTitle)
        newErrors.currentJobTitle = "Current job title is required.";
      if (!form.yearsOfExperience)
        newErrors.yearsOfExperience = "Years of experience is required.";
      if (!form.industryFocus)
        newErrors.industryFocus = "Industry focus is required.";
      if (!form.employmentStatus)
        newErrors.employmentStatus = "Employment status is required.";
    }

    if (stepTitle === "Career Goals") {
      if (!form.platformGoals.length)
        newErrors.platformGoals = "Select at least one goal.";
      if (!form.jobTypePreference)
        newErrors.jobTypePreference = "Preferred job type is required.";
    }

    if (stepTitle === "Additional Details") {
      if (!form.availability || form.availability.length === 0)
        newErrors.availability = "Select at least one availability option.";
      if (!form.preferredWorkingHours)
        newErrors.preferredWorkingHours =
          "Preferred working hours is required.";
    }

    if (stepTitle === "Consent & Referral") {
      if (!form.referralSource)
        newErrors.referralSource = "Referral source is required.";
      if (!form.consentToTerms)
        newErrors.consentToTerms = "You must agree to the terms.";
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
        case 0: // Personal Information
          stepData = {
            fullName: form.fullName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            gender: form.gender || undefined,
            dateOfBirth: form.dateOfBirth || undefined,
            nationality: form.nationality,
            currentLocation: form.currentLocation,
            linkedIn: form.linkedIn || undefined,
            github: form.github || undefined,
            portfolioUrl: form.portfolioUrl || undefined,
          };
          break;
        case 1: // Education & Certifications
          stepData = {
            highestQualification: form.highestQualification,
            fieldOfStudy: form.fieldOfStudy,
            graduationYear: parseInt(form.graduationYear),
            certifications: form.certifications,
          };
          break;
        case 2: // Skills & Specialization
          // Separate frameworksAndTools into frameworksLibraries and toolsPlatforms
          const frameworksAndTools = form.frameworksAndTools || [];
          const frameworksLibraries = [
            "React",
            "Vue.js",
            "Angular",
            "Node.js",
            "Express",
            "Django",
            "Flask",
            "Spring Boot",
            "Laravel",
            "Ruby on Rails",
            "Next.js",
            "Nuxt.js",
            "Other Framework",
          ];
          const toolsPlatforms = [
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure",
            "Google Cloud",
            "Git",
            "Jenkins",
            "Jira",
            "Figma",
            "PostgreSQL",
            "MongoDB",
            "Redis",
            "Other Tool",
          ];

          const frameworksLibrariesSelected = frameworksAndTools.filter(
            (item: string) => frameworksLibraries.includes(item)
          );
          const toolsPlatformsSelected = frameworksAndTools.filter(
            (item: string) => toolsPlatforms.includes(item)
          );

          stepData = {
            primarySpecialization: form.primarySpecialization,
            programmingLanguages: form.programmingLanguages,
            frameworksLibraries: frameworksLibrariesSelected,
            toolsPlatforms: toolsPlatformsSelected,
            softSkills: form.softSkills,
            preferredTechStack:
              typeof form.preferredTechStack === "string"
                ? form.preferredTechStack
                : "",
          };
          break;
        case 3: // Professional Background
          stepData = {
            currentJobTitle: form.currentJobTitle,
            yearsOfExperience: parseInt(form.yearsOfExperience),
            industryFocus: form.industryFocus,
            employmentStatus: form.employmentStatus,
            remoteWorkExperience: form.remoteWorkExperience,
            uploadCvResume: form.uploadCvResume || "",
            resumeUrl: form.uploadCvResume || "",
          };
          break;
        case 4: // Career Goals & Platform Use
          stepData = {
            goals: form.platformGoals || [],
            interestedInTechAssessment: form.skillAssessmentInterest || false,
            preferredJobType: form.jobTypePreference || "",
            salaryExpectation: form.salaryExpectation || undefined,
          };
          break;
        case 5: // Availability & Preferences
          stepData = {
            availability: form.availability,
            openToRelocation: form.openToRelocation,
            preferredWorkingHours: form.preferredWorkingHours,
            willingToBeContacted: form.willingToBeContacted,
          };
          break;
        case 6: // Final Confirmation
          stepData = {
            referralSource: form.referralSource,
            referralCodeOrName: form.referralCodeOrName || undefined,
            consentToTerms: form.consentToTerms,
            agreeToTerms: form.consentToTerms, // Send both to satisfy backend validation
            subscribeToAlerts: form.subscribeToAlerts,
          };
          break;
        default:
          throw new Error("Invalid step number");
      }

      // Submit step data using the step identifier from backend
      const stepIdentifierMap: Record<number, string> = {
        1: "personal-info",
        2: "education-certifications",
        3: "skills-specialization",
        4: "work-background",
        5: "career-goals",
        6: "additional-details",
        7: "consent-referral",
      };

      const stepIdentifier = stepIdentifierMap[step + 1];
      if (!stepIdentifier) {
        throw new Error(`No step identifier found for step ${step + 1}`);
      }

      const result = await postApiRequest(
        `/api/onboarding/individual-tech-professional/${userId}/${stepIdentifier}`,
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
          message: "Welcome! Your onboarding is complete.",
        });
        setStepSuccess(result?.message || "Onboarding completed successfully!");
        setTimeout(() => {
          setCompletionModal({ open: false, message: "" });
          router.push("/dashboard/tech-professional");
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
            Welcome to Tech Professional Onboarding!
          </h1>
        </div>
        <p className="text-gray-700 text-center max-w-2xl mb-2 text-lg">
          We're excited to have you join our tech community. This onboarding
          will help us connect you with the right opportunities and showcase
          your skills to top employers.
        </p>
        <p className="text-blue-900 text-center max-w-xl text-base font-medium">
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 mr-2 mb-1">
            💻
          </span>
          Let's accelerate your tech career!
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
            {/* Step 1: Personal Information */}
            {step === 0 && (
              <Step1PersonalInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 2: Education & Certifications */}
            {step === 1 && (
              <Step2EducationCertifications
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 3: Skills & Specialization */}
            {step === 2 && (
              <Step3SkillsSpecialization
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 4: Professional Background */}
            {step === 3 && (
              <Step4ProfessionalBackground
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 5: Career Goals */}
            {step === 4 && (
              <Step5CareerGoals
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 6: Additional Details */}
            {step === 5 && (
              <Step6AdditionalDetails
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {/* Step 7: Consent & Referral */}
            {step === 6 && (
              <Step7ConsentReferral
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
