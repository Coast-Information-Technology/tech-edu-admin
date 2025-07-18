"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  User2,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Clock,
  Target,
  FileText,
  Save,
  Edit2,
  X,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfile } from "@/contexts/ProfileContext";
import { toast, ToastContainer } from "react-toastify";

interface StudentProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function StudentProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: StudentProfileProps) {
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

  // Map step numbers to field groups
  const stepFieldMapping = {
    1: [
      "fullName",
      "phoneNumber",
      "gender",
      "dateOfBirth",
      "countryOfResidence",
    ], // Personal Information
    2: [
      "highestQualification",
      "fieldOfStudy",
      "academicLevel",
      "graduationYear",
    ], // Academic Background
    3: ["interestAreas"], // Interest Areas
    4: ["cvResume", "transcript", "statementOfPurpose", "researchProposal"], // Documents
    5: ["preferredDays", "preferredTimeSlots"], // Availability
    6: ["goals", "challenges"], // Goals and Challenges
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
              <p className="flex flex-col text-sm text-gray-500 mb-2 text-center">
                <span>{currentProfile.academicLevel}</span>
                <span>{currentProfile.fieldOfStudy}</span>
              </p>

              <div className="flex flex-col items-center gap-2 w-full mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} />
                  <span className="text-sm">{userProfile.email}</span>
                </div>
                {currentProfile.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={16} />
                    <span className="text-sm">
                      {currentProfile.phoneNumber}
                    </span>
                  </div>
                )}
                {currentProfile.gender && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User2 size={16} />
                    <span className="text-sm">{currentProfile.gender}</span>
                  </div>
                )}
                {currentProfile.dateOfBirth && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} />
                    <span className="text-sm">
                      {formatDate(currentProfile.dateOfBirth)}
                    </span>
                  </div>
                )}
                {currentProfile.countryOfResidence && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={16} />
                    <span className="text-sm">
                      {currentProfile.countryOfResidence}
                    </span>
                  </div>
                )}
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
                  isFieldCompleted("fullName")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                value={draft.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled={isFieldCompleted("fullName")}
                placeholder={
                  isFieldCompleted("fullName") ? "Completed" : "Full Name"
                }
              />
              <div className="flex flex-col gap-2 w-full mb-2">
                <input
                  className={`flex-1 text-sm text-gray-500 text-center border-b border-blue-100 focus:outline-none ${
                    isFieldCompleted("academicLevel")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.academicLevel || ""}
                  onChange={(e) =>
                    handleChange("academicLevel", e.target.value)
                  }
                  disabled={isFieldCompleted("academicLevel")}
                  placeholder={
                    isFieldCompleted("academicLevel")
                      ? "Completed"
                      : "Academic Level"
                  }
                />
                <input
                  className={`flex-1 text-sm text-gray-500 text-center border-b border-blue-100 focus:outline-none ${
                    isFieldCompleted("fieldOfStudy")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.fieldOfStudy || ""}
                  onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
                  disabled={isFieldCompleted("fieldOfStudy")}
                  placeholder={
                    isFieldCompleted("fieldOfStudy")
                      ? "Completed"
                      : "Field of Study"
                  }
                />
              </div>

              <div className="flex flex-col gap-2 w-full mt-4">
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("phoneNumber")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  disabled={isFieldCompleted("phoneNumber")}
                  placeholder={
                    isFieldCompleted("phoneNumber")
                      ? "Completed"
                      : "Phone Number"
                  }
                />
                <select
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("gender")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={isFieldCompleted("gender")}
                >
                  <option value="">
                    {isFieldCompleted("gender") ? "Completed" : "Select Gender"}
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("dateOfBirth")
                      ? "bg-gray-100 text-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={
                    draft.dateOfBirth ? draft.dateOfBirth.split("T")[0] : ""
                  }
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  disabled={isFieldCompleted("dateOfBirth")}
                  type="date"
                />
                <input
                  className={`border-b border-blue-100 focus:outline-none text-sm ${
                    isFieldCompleted("countryOfResidence")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={draft.countryOfResidence || ""}
                  onChange={(e) =>
                    handleChange("countryOfResidence", e.target.value)
                  }
                  disabled={isFieldCompleted("countryOfResidence")}
                  placeholder={
                    isFieldCompleted("countryOfResidence")
                      ? "Completed"
                      : "Country of Residence"
                  }
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
          {/* Academic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <GraduationCap size={20} /> Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Academic Level
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.academicLevel || "Not specified"}
                  </p>
                ) : (
                  <select
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("academicLevel")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.academicLevel || ""}
                    onChange={(e) =>
                      handleChange("academicLevel", e.target.value)
                    }
                    disabled={isFieldCompleted("academicLevel")}
                  >
                    <option value="">
                      {isFieldCompleted("academicLevel")
                        ? "Completed"
                        : "Select Academic Level"}
                    </option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate First Year">
                      Undergraduate First Year
                    </option>
                    <option value="Undergraduate Second Year">
                      Undergraduate Second Year
                    </option>
                    <option value="Undergraduate Third Year">
                      Undergraduate Third Year
                    </option>
                    <option value="Undergraduate Final Year">
                      Undergraduate Final Year
                    </option>
                    <option value="Graduate Student">Graduate Student</option>
                    <option value="PhD Student">PhD Student</option>
                  </select>
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Field of Study
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.fieldOfStudy || "Not specified"}
                  </p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("fieldOfStudy")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.fieldOfStudy || ""}
                    onChange={(e) =>
                      handleChange("fieldOfStudy", e.target.value)
                    }
                    disabled={isFieldCompleted("fieldOfStudy")}
                    placeholder={
                      isFieldCompleted("fieldOfStudy")
                        ? "Completed"
                        : "e.g., Computer Science"
                    }
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Highest Qualification
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.highestQualification || "Not specified"}
                  </p>
                ) : (
                  <select
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("highestQualification")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.highestQualification || ""}
                    onChange={(e) =>
                      handleChange("highestQualification", e.target.value)
                    }
                    disabled={isFieldCompleted("highestQualification")}
                  >
                    <option value="">
                      {isFieldCompleted("highestQualification")
                        ? "Completed"
                        : "Select Qualification"}
                    </option>
                    <option value="High School Diploma">
                      High School Diploma
                    </option>
                    <option value="BSc">BSc</option>
                    <option value="BA">BA</option>
                    <option value="MSc">MSc</option>
                    <option value="MA">MA</option>
                    <option value="PhD">PhD</option>
                  </select>
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Graduation Year
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.graduationYear || "Not specified"}
                  </p>
                ) : (
                  <input
                    className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("graduationYear")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={draft.graduationYear || ""}
                    onChange={(e) =>
                      handleChange("graduationYear", e.target.value)
                    }
                    disabled={isFieldCompleted("graduationYear")}
                    type="number"
                    min="2024"
                    max="2030"
                    placeholder={
                      isFieldCompleted("graduationYear")
                        ? "Completed"
                        : "e.g., 2029"
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Interest Areas */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Target size={20} /> Interest Areas
            </h3>
            {!editMode ? (
              <div className="flex flex-wrap gap-2">
                {currentProfile.interestAreas &&
                currentProfile.interestAreas.length > 0 ? (
                  currentProfile.interestAreas.map((interest: string) => (
                    <span
                      key={interest}
                      className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No interest areas specified</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Select your areas of interest:
                </p>
                {[
                  "Academic Transition Guidance",
                  "Academic Research Publication Support",
                  "Statement of Purpose/Proposal Help",
                  "CV/Resume Review",
                  "Interview Preparation",
                  "Career Guidance",
                  "Technical Skills Development",
                  "Project Portfolio Building",
                  "Scholarship Coaching",
                  "General Mentoring",
                ].map((interest) => (
                  <label key={interest} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.interestAreas?.includes(interest) || false}
                      onChange={(e) => {
                        const current = draft.interestAreas || [];
                        if (e.target.checked) {
                          handleArrayChange("interestAreas", [
                            ...current,
                            interest,
                          ]);
                        } else {
                          handleArrayChange(
                            "interestAreas",
                            current.filter((i: string) => i !== interest)
                          );
                        }
                      }}
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Clock size={20} /> Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Days
                </label>
                {!editMode ? (
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.preferredDays &&
                    currentProfile.preferredDays.length > 0 ? (
                      currentProfile.preferredDays.map((day: string) => (
                        <span
                          key={day}
                          className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          {day}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No preferred days specified
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <label key={day} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              draft.preferredDays?.includes(day) || false
                            }
                            onChange={(e) => {
                              const current = draft.preferredDays || [];
                              if (e.target.checked) {
                                handleArrayChange("preferredDays", [
                                  ...current,
                                  day,
                                ]);
                              } else {
                                handleArrayChange(
                                  "preferredDays",
                                  current.filter((d: string) => d !== day)
                                );
                              }
                            }}
                            className="rounded border-green-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Time Slots
                </label>
                {!editMode ? (
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.preferredTimeSlots &&
                    currentProfile.preferredTimeSlots.length > 0 ? (
                      currentProfile.preferredTimeSlots.map((time: string) => (
                        <span
                          key={time}
                          className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          {time}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No preferred time slots specified
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {["morning", "afternoon", "evening", "night"].map(
                      (time) => (
                        <label key={time} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              draft.preferredTimeSlots?.includes(time) || false
                            }
                            onChange={(e) => {
                              const current = draft.preferredTimeSlots || [];
                              if (e.target.checked) {
                                handleArrayChange("preferredTimeSlots", [
                                  ...current,
                                  time,
                                ]);
                              } else {
                                handleArrayChange(
                                  "preferredTimeSlots",
                                  current.filter((t: string) => t !== time)
                                );
                              }
                            }}
                            className="rounded border-green-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm capitalize">{time}</span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <FileText size={20} /> Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  CV/Resume
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.cvResume ? "Uploaded" : "Not uploaded"}
                  </p>
                ) : (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full mt-1 text-sm"
                    onChange={(e) =>
                      handleChange("cvResume", e.target.files?.[0])
                    }
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Transcript
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.transcript ? "Uploaded" : "Not uploaded"}
                  </p>
                ) : (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full mt-1 text-sm"
                    onChange={(e) =>
                      handleChange("transcript", e.target.files?.[0])
                    }
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Statement of Purpose
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.statementOfPurpose
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                ) : (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full mt-1 text-sm"
                    onChange={(e) =>
                      handleChange("statementOfPurpose", e.target.files?.[0])
                    }
                  />
                )}
              </div>
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <label className="text-sm font-medium text-gray-700">
                  Research Proposal
                </label>
                {!editMode ? (
                  <p className="text-blue-900">
                    {currentProfile.researchProposal
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                ) : (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full mt-1 text-sm"
                    onChange={(e) =>
                      handleChange("researchProposal", e.target.files?.[0])
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Goals and Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
                <Target size={20} /> Goals
              </h3>
              {!editMode ? (
                <div className="bg-blue-50/60 rounded-[10px] p-4">
                  <p className="text-blue-900">
                    {currentProfile.goals || "No goals specified"}
                  </p>
                </div>
              ) : (
                <textarea
                  className="w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={draft.goals || ""}
                  onChange={(e) => handleChange("goals", e.target.value)}
                  placeholder="Describe your academic and career goals..."
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
                <BookOpen size={20} /> Challenges
              </h3>
              {!editMode ? (
                <div className="bg-blue-50/60 rounded-[10px] p-4">
                  <p className="text-blue-900">
                    {currentProfile.challenges || "No challenges specified"}
                  </p>
                </div>
              ) : (
                <textarea
                  className="w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={draft.challenges || ""}
                  onChange={(e) => handleChange("challenges", e.target.value)}
                  placeholder="Describe any challenges you're facing..."
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
