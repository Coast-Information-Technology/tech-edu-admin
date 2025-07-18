"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Users,
  FileText,
  Save,
  Edit2,
  X,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfile } from "@/contexts/ProfileContext";

interface RecruiterProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function RecruiterProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: RecruiterProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(userProfile.profile);
  // Expanded stepFieldMapping to include all fields rendered in the UI
  const stepFieldMapping = {
    2: ["recruitingName", "positionAtCompany", "contactEmail", "phoneNumber"],
    3: [
      "companyId",
      "companyName",
      "companyType",
      "rcNumber",
      "industry",
      "website",
      "companySize",
      "companyAddress",
    ],
    4: ["recruitmentFocusAreas", "preferredHiringModel", "hiringGoals"],
    5: ["hiringRegions"],
    6: ["agreeToTerms", "referralSource", "referralCodeOrName"],
    7: [
      "jobTitle",
      "jobDescription",
      "employmentType",
      "location",
      "salaryRange",
      "skipForNow",
    ],
  };

  // Add onboarding progress, skipped/completed steps, and editability logic
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { getOnboardingProgress, completeStep } = useOnboardingStatus(token);
  const { profile: contextProfile, updateProfile } = useProfile();

  useEffect(() => {
    const fetchOnboardingProgress = async () => {
      if (!userId || !token) return;
      try {
        const progressRes = await getOnboardingProgress(userId);
        const progressData = progressRes?.data?.data || progressRes?.data;
        if (progressData && progressData.steps) {
          setOnboardingProgress(progressData);
          const skipped = new Set<number>();
          const completed = new Set<number>();
          progressData.steps.forEach((step: any, index: number) => {
            if (step.skipped && !step.completed) skipped.add(index);
            else if (step.completed) completed.add(index);
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

  const isFieldEditable = (fieldName: string): boolean => {
    if (!onboardingProgress) return true;
    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return skippedSteps.has(stepIndex);
      }
    }
    return false;
  };
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
  const areAllStepsCompleted = () => {
    if (!onboardingProgress?.steps) return false;
    return onboardingProgress.steps.every((step: any) => step.completed);
  };
  const getSkippedSteps = () => {
    if (!onboardingProgress?.steps) return [];
    return onboardingProgress.steps
      .map((step: any, index: number) => ({ ...step, index }))
      .filter((step: any) => step.skipped && !step.completed)
      .map((step: any) => ({ ...step, stepNumber: step.index + 1 }));
  };

  const handleEdit = () => {
    setDraft(userProfile.profile || {});
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await onUpdate(draft);
    if (result.success) {
      setEditMode(false);
    } else {
      alert(result.error || "Failed to update profile");
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: any) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  const currentProfile = editMode ? draft : userProfile.profile || {};

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const hiringGoals = [
    "Entry-level positions",
    "Mid-level positions",
    "Senior-level positions",
    "Executive positions",
    "Contract/Freelance",
    "Internships",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Non-profit",
    "Government",
    "Other",
  ];

  const recruitmentFocusAreas = [
    "Software Development",
    "Data Science",
    "Product Management",
    "UX/UI Design",
    "Marketing",
    "Sales",
    "Operations",
    "Finance",
    "HR",
    "Legal",
    "Other",
  ];

  const preferredHiringModels = [
    "Direct Hire",
    "Contract/Freelance",
    "Internship",
    "Temporary/Contract-to-Hire",
    "Other",
  ];

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Other",
  ];

  const skippedStepsList = getSkippedSteps();

  return (
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
              {currentProfile.jobTitle || "Recruiter"}
            </p>
            <p className="text-xs text-gray-400 mb-4 text-center">
              {currentProfile.companyName || "Company not specified"}
            </p>

            <div className="flex flex-col gap-2 w-full mt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} />
                <span className="text-sm">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                <span className="text-sm">
                  {currentProfile.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Building size={16} />
                <span className="text-sm">
                  {currentProfile.companyName || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                <span className="text-sm">
                  {currentProfile.location || "Not provided"}
                </span>
              </div>
            </div>

            <button
              onClick={handleEdit}
              className="mt-8 w-full bg-[#011F72] hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              value={draft.jobTitle || ""}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              placeholder="Job Title"
              disabled={!isFieldEditable("jobTitle")}
              className={`w-full text-xl font-bold text-[#011F72] mb-1 text-center border-b border-blue-100 focus:outline-none ${
                isFieldCompleted("jobTitle") ? "bg-gray-100 text-gray-400" : ""
              }`}
            />
            <input
              value={draft.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder={
                isFieldCompleted("companyName") ? "Completed" : "Company Name"
              }
              disabled={isFieldCompleted("companyName")}
              className={`w-full text-sm text-gray-500 mb-2 text-center border-b border-blue-100 focus:outline-none ${
                isFieldCompleted("companyName")
                  ? "bg-gray-100 text-gray-400"
                  : ""
              }`}
            />

            <div className="flex flex-col gap-2 w-full mt-4">
              <input
                value={draft.phoneNumber || ""}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="Phone Number"
                disabled={!isFieldEditable("phoneNumber")}
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("phoneNumber")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
              />
              <input
                value={draft.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
                disabled={!isFieldEditable("location")}
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("location")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
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
        {/* Company Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Building size={20} /> Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.companyName || "Not specified"}
                </p>
              ) : (
                <input
                  value={draft.companyName || ""}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder={
                    isFieldCompleted("companyName")
                      ? "Completed"
                      : "Company Name"
                  }
                  disabled={isFieldCompleted("companyName")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("companyName")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Company Size
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.companySize || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.companySize || ""}
                  onChange={(e) => handleChange("companySize", e.target.value)}
                  disabled={!isFieldEditable("companySize")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("companySize")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Company Size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Industry
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.industry || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.industry || ""}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  disabled={!isFieldEditable("industry")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("industry")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Company Website
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.companyWebsite ? (
                    <a
                      href={currentProfile.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {currentProfile.companyWebsite}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              ) : (
                <input
                  value={draft.companyWebsite || ""}
                  onChange={(e) =>
                    handleChange("companyWebsite", e.target.value)
                  }
                  type="url"
                  placeholder="https://company.com"
                  disabled={!isFieldEditable("companyWebsite")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("companyWebsite")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Hiring Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Users size={20} /> Hiring Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Hiring Goals
              </label>
              {!editMode ? (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.hiringGoals?.map((goal: string) => (
                    <span
                      key={goal}
                      className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {hiringGoals.map((goal) => (
                    <label key={goal} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={draft.hiringGoals?.includes(goal) || false}
                        onChange={(e) => {
                          if (isFieldCompleted("hiringGoals")) return;
                          const current = draft.hiringGoals || [];
                          if (e.target.checked) {
                            handleArrayChange("hiringGoals", [
                              ...current,
                              goal,
                            ]);
                          } else {
                            handleArrayChange(
                              "hiringGoals",
                              current.filter((g: string) => g !== goal)
                            );
                          }
                        }}
                        disabled={isFieldCompleted("hiringGoals")}
                        className={`rounded border-green-300 text-green-600 focus:ring-green-500 ${
                          isFieldCompleted("hiringGoals")
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <span className="text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Target Roles
              </label>
              {!editMode ? (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.targetRoles?.map((role: string) => (
                    <span
                      key={role}
                      className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={draft.targetRoles?.join(", ") || ""}
                    onChange={(e) => {
                      const roles = e.target.value
                        .split(",")
                        .map((role) => role.trim())
                        .filter((role) => role);
                      handleArrayChange("targetRoles", roles);
                    }}
                    placeholder="Enter target roles separated by commas (e.g., Software Engineer, Product Manager, Data Scientist)"
                    disabled={!isFieldEditable("targetRoles")}
                    className={`w-full border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("targetRoles")
                        ? "bg-gray-100 text-gray-400"
                        : ""
                    }`}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the specific roles you're hiring for, separated by
                    commas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recruiting Preferences */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Users size={20} /> Recruiting Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              {!editMode ? (
                <p className="text-blue-900 capitalize">
                  {currentProfile.preferredContactMethod || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.preferredContactMethod || ""}
                  onChange={(e) =>
                    handleChange("preferredContactMethod", e.target.value)
                  }
                  disabled={!isFieldEditable("preferredContactMethod")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("preferredContactMethod")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Contact Method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Urgency Level
              </label>
              {!editMode ? (
                <p className="text-blue-900 capitalize">
                  {currentProfile.urgencyLevel || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.urgencyLevel || ""}
                  onChange={(e) => handleChange("urgencyLevel", e.target.value)}
                  disabled={!isFieldEditable("urgencyLevel")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("urgencyLevel")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Urgency Level</option>
                  <option value="low">Low - Planning ahead</option>
                  <option value="medium">
                    Medium - Need within 1-3 months
                  </option>
                  <option value="high">High - Need immediately</option>
                  <option value="urgent">Urgent - Critical need</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <FileText size={20} /> Hiring Requirements
            </h3>
            {!editMode ? (
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <p className="text-blue-900">
                  {currentProfile.hiringRequirements ||
                    "No specific requirements specified"}
                </p>
              </div>
            ) : (
              <textarea
                rows={4}
                value={draft.hiringRequirements || ""}
                onChange={(e) =>
                  handleChange("hiringRequirements", e.target.value)
                }
                placeholder="Describe your specific hiring requirements, qualifications needed, and any other relevant details..."
                disabled={!isFieldEditable("hiringRequirements")}
                className={`w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldCompleted("hiringRequirements")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
              />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Briefcase size={20} /> Company Culture
            </h3>
            {!editMode ? (
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <p className="text-blue-900">
                  {currentProfile.companyCulture ||
                    "No company culture information provided"}
                </p>
              </div>
            ) : (
              <textarea
                rows={4}
                value={draft.companyCulture || ""}
                onChange={(e) => handleChange("companyCulture", e.target.value)}
                placeholder="Describe your company culture, values, work environment, and what makes your company unique..."
                disabled={!isFieldEditable("companyCulture")}
                className={`w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldCompleted("companyCulture")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
              />
            )}
          </div>
        </div>
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
      </section>
    </div>
  );
}
