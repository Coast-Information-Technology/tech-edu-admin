"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Users,
  FileText,
  CheckCircle,
  Save,
  Edit2,
  X,
  AlertCircle,
} from "lucide-react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "react-toastify";

interface InstitutionProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function InstitutionProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: InstitutionProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(userProfile.profile);
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Use onboarding status hook and profile context
  const { getOnboardingProgress, completeStep } = useOnboardingStatus(token);
  const { profile: contextProfile, updateProfile } = useProfile();

  // Fetch onboarding progress on component mount
  useEffect(() => {
    const fetchOnboardingProgress = async () => {
      if (!userId || !token) return;

      try {
        const progressRes = await getOnboardingProgress(userId);
        const progressData = progressRes?.data?.data || progressRes?.data;

        if (progressData && progressData.steps) {
          setOnboardingProgress(progressData);

          // Identify skipped and completed steps
          const skipped = new Set<number>();
          const completed = new Set<number>();

          progressData.steps.forEach((step: any, index: number) => {
            if (step.skipped && !step.completed) {
              skipped.add(index);
            } else if (step.completed) {
              completed.add(index);
            }
          });

          setSkippedSteps(skipped);
          setCompletedSteps(completed);
        }
      } catch (error) {
        console.error("Failed to fetch onboarding progress:", error);
      }
    };

    fetchOnboardingProgress();
  }, [userId, token, getOnboardingProgress]);

  // Expanded stepFieldMapping to include all fields rendered in the UI
  const stepFieldMapping = {
    2: [
      "institutionName",
      "institutionType",
      "country",
      "state",
      "address",
      "cityTown",
      "websiteUrl",
      "officialEmail",
      "contactEmail",
      "phoneNumber",
    ],
    3: ["academicFocusAreas", "interests", "proceedWithUpload"],
    4: ["accreditationDocument", "courseBrochure"],
    5: ["preferredContactMethod", "supportsStudentUploads"],
    6: ["agreeToTerms", "referralSource", "referralCodeOrName"],
    7: ["adminTeamMembers", "studentsOrProfessionals", "skipAndInviteLater"],
  };

  // Check if a field is editable (belongs to a skipped step)
  const isFieldEditable = (fieldName: string): boolean => {
    if (!onboardingProgress) return true; // Default to editable if no progress data

    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return skippedSteps.has(stepIndex);
      }
    }
    return false;
  };

  // Check if a field belongs to a completed step
  const isFieldCompleted = (fieldName: string): boolean => {
    if (!onboardingProgress) return false;

    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return completedSteps.has(stepIndex);
      }
    }
    return false;
  };

  // Get step number for a field
  const getStepNumberForField = (fieldName: string): number | null => {
    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        return parseInt(stepNum);
      }
    }
    return null;
  };

  const handleEdit = () => {
    setDraft(userProfile.profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Get the actual skipped steps from onboarding progress
      const skippedStepsFromProgress = getSkippedSteps();

      if (skippedStepsFromProgress.length === 0) {
        alert("No skipped steps found to complete");
        setLoading(false);
        return;
      }

      console.log("Skipped steps from progress:", skippedStepsFromProgress);

      // Group data by actual step numbers from onboarding progress
      const stepsToComplete = new Map<number, any>(); // stepNumber -> stepData

      for (const skippedStep of skippedStepsFromProgress) {
        const stepNumber =
          skippedStep.stepNumber as keyof typeof stepFieldMapping;
        const stepIndex = (stepNumber as number) - 1;
        const fields = stepFieldMapping[stepNumber];

        if (!fields) {
          console.warn(`No field mapping found for step ${stepNumber}`);
          continue;
        }

        console.log(
          `Checking step ${stepNumber} (fields: ${fields.join(", ")})`
        );

        // Check if any field in this step has data
        const stepData: any = {};
        let hasData = false;

        (fields as string[]).forEach((field: string) => {
          const value = draft[field];
          if (
            value &&
            ((typeof value === "string" && value.trim() !== "") ||
              (Array.isArray(value) && value.length > 0) ||
              (typeof value === "object" && value !== null))
          ) {
            stepData[field] = value;
            hasData = true;
            console.log(`  Field "${field}" has data:`, value);
          } else {
            console.log(`  Field "${field}" is empty or null`);
          }
        });

        if (hasData) {
          stepsToComplete.set(stepNumber, stepData);
          console.log(
            `  Step ${stepNumber} will be completed with data:`,
            stepData
          );
        } else {
          console.log(`  Step ${stepNumber} has no data, skipping completion`);
        }
      }

      console.log(`Total steps to complete: ${stepsToComplete.size}`);

      if (stepsToComplete.size === 0) {
        toast.warn("No data found for any skipped steps");
        setLoading(false);
        return;
      }

      // Complete the steps with their specific data using actual step numbers
      for (const [stepNumber, stepData] of stepsToComplete) {
        try {
          console.log(`Completing step ${stepNumber} with payload:`, {
            stepNumber,
            stepData,
          });
          await completeStep(userId, stepNumber, stepData);
          console.log(`✅ Successfully completed step ${stepNumber}`);

          // Update the context with the saved data
          updateProfile(stepData);
        } catch (error) {
          console.error(`❌ Failed to complete step ${stepNumber}:`, error);
        }
      }

      setEditMode(false);

      // Refresh onboarding progress
      const progressRes = await getOnboardingProgress(userId);
      const progressData = progressRes?.data?.data || progressRes?.data;
      if (progressData && progressData.steps) {
        setOnboardingProgress(progressData);

        const skipped = new Set<number>();
        const completed = new Set<number>();

        progressData.steps.forEach((step: any, index: number) => {
          if (step.skipped && !step.completed) {
            skipped.add(index);
          } else if (step.completed) {
            completed.add(index);
          }
        });

        setSkippedSteps(skipped);
        setCompletedSteps(completed);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const currentProfile = editMode
    ? draft
    : contextProfile || userProfile.profile;

  // Helper function to get step status for display
  const getStepStatus = (stepNumber: number) => {
    if (!onboardingProgress) return null;
    const stepIndex = stepNumber - 1;
    const step = onboardingProgress.steps?.[stepIndex];
    if (!step) return null;

    if (step.completed) return { status: "completed", text: "✓ Completed" };
    if (step.skipped && !step.completed)
      return { status: "skipped", text: "⚠ Needs Completion" };
    return { status: "pending", text: "⏳ Pending" };
  };

  // Get skipped steps that need completion
  const getSkippedSteps = () => {
    if (!onboardingProgress?.steps) return [];

    return onboardingProgress.steps
      .map((step: any, index: number) => ({ ...step, index }))
      .filter((step: any) => step.skipped && !step.completed)
      .map((step: any) => ({ ...step, stepNumber: step.index + 1 }));
  };

  // Check if all steps are completed
  const areAllStepsCompleted = () => {
    if (!onboardingProgress?.steps) return false;

    return onboardingProgress.steps.every((step: any) => step.completed);
  };

  const skippedStepsList = getSkippedSteps();
  const allStepsCompleted = areAllStepsCompleted();

  const institutionTypes = [
    "university",
    "college",
    "polytechnic",
    "secondary_school",
    "primary_school",
    "vocational_institute",
    "research_institute",
    "other",
  ];

  const academicFocusAreas = [
    "AI",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "Software Engineering",
    "Mobile Development",
    "Cybersecurity",
    "UI/UX Design",
    "Blockchain",
    "Social Sciences",
    "Business",
    "Healthcare",
    "Finance",
    "Education",
    "Other",
  ];

  const contactMethods = ["email", "phone", "whatsapp"];

  return (
    <div className="">
      {/* Skipped Steps Alert */}
      {skippedStepsList.length > 0 && (
        <div className="w-full mb-6 p-4 bg-orange-50 border border-orange-200 rounded-[10px]">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-orange-800 font-semibold">
              Complete Skipped Steps
            </h3>
          </div>
          <p className="text-orange-700 text-sm mb-3">
            The following onboarding steps were skipped and need to be
            completed:
          </p>
          <div className="flex flex-wrap gap-2">
            {skippedStepsList.map((step: any) => (
              <span
                key={step.stepNumber}
                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium border border-orange-300"
              >
                Step {step.stepNumber}: {step.title}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100">
          <div className="w-32 h-32 rounded-full bg-[#011F72] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
            {userProfile.fullName.charAt(0).toUpperCase()}
          </div>

          {!editMode ? (
            <>
              <h2 className="text-xl font-bold text-[#011F72] mb-1 text-center">
                {userProfile.fullName}
              </h2>
              <p className="text-sm text-gray-500 mb-2 text-center">
                {currentProfile.institutionName}
              </p>
              <p className="text-xs text-gray-400 mb-4 text-center capitalize">
                {currentProfile.institutionType?.replace("_", " ")}
              </p>

              <div className="flex flex-col items-center gap-2 w-full mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} />
                  <span className="text-sm">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} />
                  <span className="text-sm">{currentProfile.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={16} />
                  <span className="text-sm">{currentProfile.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {currentProfile.address}, {currentProfile.state},{" "}
                    {currentProfile.country}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">
                    Verification Status
                  </span>
                </div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    currentProfile.verificationStatus === "verified"
                      ? "bg-green-100 text-green-800"
                      : currentProfile.verificationStatus === "submitted"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentProfile.verificationStatus?.charAt(0).toUpperCase() +
                    currentProfile.verificationStatus?.slice(1)}
                </span>
              </div>

              {!allStepsCompleted ? (
                <button
                  onClick={handleEdit}
                  className="mt-8 w-full bg-[#011F72] hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              ) : (
                <div className="mt-8 w-full bg-green-50 border border-green-200 rounded-[10px] p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-800">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="font-semibold">Profile Complete</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    All onboarding steps have been completed
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <input
                className={`w-full text-xl font-bold text-[#011F72] mb-1 text-center border-b border-blue-100 focus:outline-none ${
                  isFieldCompleted("institutionName")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                value={draft.institutionName}
                onChange={(e) =>
                  handleChange("institutionName", e.target.value)
                }
                disabled={isFieldCompleted("institutionName")}
                placeholder={
                  isFieldCompleted("institutionName")
                    ? "Completed"
                    : "Institution Name"
                }
              />
              <select
                className={`w-full text-sm text-gray-500 mb-2 text-center border-b border-blue-100 focus:outline-none ${
                  isFieldCompleted("institutionType")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                value={draft.institutionType}
                onChange={(e) =>
                  handleChange("institutionType", e.target.value)
                }
                disabled={isFieldCompleted("institutionType")}
              >
                <option value="">
                  {isFieldCompleted("institutionType")
                    ? "Completed"
                    : "Select Institution Type"}
                </option>
                {institutionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-2 w-full mt-4">
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("contactEmail")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder={
                    isFieldCompleted("contactEmail")
                      ? "Completed"
                      : "Contact Email"
                  }
                  disabled={isFieldCompleted("contactEmail")}
                />
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("phoneNumber")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder={
                    isFieldCompleted("phoneNumber")
                      ? "Completed"
                      : "Phone Number"
                  }
                  disabled={isFieldCompleted("phoneNumber")}
                />
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("address")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder={
                    isFieldCompleted("address") ? "Completed" : "Address"
                  }
                  disabled={isFieldCompleted("address")}
                />
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("state")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder={
                    isFieldCompleted("state") ? "Completed" : "State"
                  }
                  disabled={isFieldCompleted("state")}
                />
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("country")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder={
                    isFieldCompleted("country") ? "Completed" : "Country"
                  }
                  disabled={isFieldCompleted("country")}
                />
              </div>

              <div className="flex gap-2 mt-8 w-full">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={18} /> Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Main Content */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          {/* Institution Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Building size={20} /> Institution Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Institution Name
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.institutionName}
                  </p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("institutionName")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.institutionName}
                    onChange={(e) =>
                      handleChange("institutionName", e.target.value)
                    }
                    placeholder={
                      isFieldCompleted("institutionName")
                        ? "Completed"
                        : "Enter institution name"
                    }
                    disabled={isFieldCompleted("institutionName")}
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Institution Type
                </label>
                {!editMode ? (
                  <p className="text-blue-900 capitalize">
                    {currentProfile.institutionType?.replace("_", " ")}
                  </p>
                ) : (
                  <select
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("institutionType")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.institutionType}
                    onChange={(e) =>
                      handleChange("institutionType", e.target.value)
                    }
                    disabled={isFieldCompleted("institutionType")}
                  >
                    <option value="">Select Institution Type</option>
                    {institutionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                {!editMode ? (
                  <p className="text-blue-900">{currentProfile.contactEmail}</p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("contactEmail")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.contactEmail}
                    onChange={(e) =>
                      handleChange("contactEmail", e.target.value)
                    }
                    type="email"
                    placeholder={
                      isFieldCompleted("contactEmail")
                        ? "Completed"
                        : "contact@institution.com"
                    }
                    disabled={isFieldCompleted("contactEmail")}
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                {!editMode ? (
                  <p className="text-blue-900">{currentProfile.phoneNumber}</p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("phoneNumber")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    placeholder={
                      isFieldCompleted("phoneNumber")
                        ? "Completed"
                        : "+1234567890"
                    }
                    disabled={isFieldCompleted("phoneNumber")}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <MapPin size={20} /> Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                {!editMode ? (
                  <p className="text-blue-900">{currentProfile.address}</p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("address")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder={
                      isFieldCompleted("address")
                        ? "Completed"
                        : "Street address"
                    }
                    disabled={isFieldCompleted("address")}
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  State/Province
                </label>
                {!editMode ? (
                  <p className="text-blue-900">{currentProfile.state}</p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("state")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder={
                      isFieldCompleted("state")
                        ? "Completed"
                        : "State or province"
                    }
                    disabled={isFieldCompleted("state")}
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                {!editMode ? (
                  <p className="text-blue-900">{currentProfile.country}</p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("country")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder={
                      isFieldCompleted("country") ? "Completed" : "Country"
                    }
                    disabled={isFieldCompleted("country")}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Academic Focus Areas */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Globe size={20} /> Academic Focus Areas
            </h3>
            {!editMode ? (
              <div className="flex flex-wrap gap-2">
                {currentProfile.academicFocusAreas?.map((area: string) => (
                  <span
                    key={area}
                    className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Select your academic focus areas:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {academicFocusAreas.map((area) => (
                    <label key={area} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          draft.academicFocusAreas?.includes(area) || false
                        }
                        onChange={(e) => {
                          if (isFieldCompleted("academicFocusAreas")) return;
                          const current = draft.academicFocusAreas || [];
                          if (e.target.checked) {
                            handleArrayChange("academicFocusAreas", [
                              ...current,
                              area,
                            ]);
                          } else {
                            handleArrayChange(
                              "academicFocusAreas",
                              current.filter((a: string) => a !== area)
                            );
                          }
                        }}
                        className={`rounded border-blue-300 text-blue-600 focus:ring-blue-500 ${
                          isFieldCompleted("academicFocusAreas")
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isFieldCompleted("academicFocusAreas")}
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Users size={20} /> Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Preferred Contact Method
                </label>
                {!editMode ? (
                  <p className="text-blue-900 capitalize">
                    {currentProfile.preferredContactMethod}
                  </p>
                ) : (
                  <select
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("preferredContactMethod")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.preferredContactMethod}
                    onChange={(e) =>
                      handleChange("preferredContactMethod", e.target.value)
                    }
                    disabled={isFieldCompleted("preferredContactMethod")}
                  >
                    <option value="">Select Contact Method</option>
                    {contactMethods.map((method) => (
                      <option key={method} value={method}>
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Supports Student Uploads
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.supportsStudentUploads ? "Yes" : "No"}
                  </p>
                ) : (
                  <select
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("supportsStudentUploads")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.supportsStudentUploads?.toString()}
                    onChange={(e) =>
                      handleChange(
                        "supportsStudentUploads",
                        e.target.value === "true"
                      )
                    }
                    disabled={isFieldCompleted("supportsStudentUploads")}
                  >
                    <option value="">Select Option</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Referral Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <FileText size={20} /> Referral Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Referral Source
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.referralSource}
                  </p>
                ) : (
                  <select
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("referralSource")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.referralSource}
                    onChange={(e) =>
                      handleChange("referralSource", e.target.value)
                    }
                    disabled={isFieldCompleted("referralSource")}
                  >
                    <option value="">Select Referral Source</option>
                    <option value="Search Engine">Search Engine</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Word of Mouth">Word of Mouth</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Partner Organization">
                      Partner Organization
                    </option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Referral Code/Name
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.referralCodeOrName || "Not specified"}
                  </p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("referralCodeOrName")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.referralCodeOrName}
                    onChange={(e) =>
                      handleChange("referralCodeOrName", e.target.value)
                    }
                    placeholder={
                      isFieldCompleted("referralCodeOrName")
                        ? "Completed"
                        : "Referral code or name"
                    }
                    disabled={isFieldCompleted("referralCodeOrName")}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-blue-50/60 rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Terms and Conditions
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {currentProfile.agreeToTerms
                ? "You have agreed to the terms and conditions."
                : "You have not agreed to the terms and conditions."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
