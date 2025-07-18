"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  User2,
  Calendar,
  MapPin,
  BookOpen,
  Briefcase,
  Link as LinkIcon,
  Linkedin,
  Github,
  Globe,
  Save,
  Edit2,
  X,
  Plus,
  DollarSign,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfile } from "@/contexts/ProfileContext";

interface IndividualTechProfessionalProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function IndividualTechProfessionalProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: IndividualTechProfessionalProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(userProfile.profile);
  // Expanded stepFieldMapping to include all fields rendered in the UI
  const stepFieldMapping = {
    1: [
      "fullName",
      "email",
      "phoneNumber",
      "gender",
      "dateOfBirth",
      "nationality",
      "currentLocation",
      "linkedinProfile",
      "githubPortfolioUrl",
    ],
    2: [
      "highestQualification",
      "fieldOfStudy",
      "graduationYear",
      "certifications",
      "uploadCertifications",
    ],
    3: [
      "primarySpecialization",
      "programmingLanguages",
      "frameworksLibraries",
      "toolsPlatforms",
      "softSkills",
      "preferredTechStack",
    ],
    4: [
      "currentJobTitle",
      "yearsOfExperience",
      "industryFocus",
      "employmentStatus",
      "remoteWorkExperience",
      "uploadCvResume",
      "uploadPortfolio",
    ],
    5: [
      "goals",
      "interestedInTechAssessment",
      "preferredJobType",
      "salaryExpectations",
    ],
    6: [
      "availability",
      "openToRelocation",
      "preferredWorkingHours",
      "willingToBeContacted",
    ],
    7: ["referralSource", "referralCode", "agreeToTerms", "subscribeToAlerts"],
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
    setDraft(userProfile.profile);
    setEditMode(true);
  };
  const handleCancel = () => setEditMode(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      const skippedStepsFromProgress = getSkippedSteps();
      if (skippedStepsFromProgress.length === 0) {
        alert("No skipped steps found to complete");
        setLoading(false);
        return;
      }
      const stepsToComplete = new Map<number, any>();
      for (const skippedStep of skippedStepsFromProgress) {
        const stepNumber =
          skippedStep.stepNumber as keyof typeof stepFieldMapping;
        const fields = stepFieldMapping[stepNumber];
        if (!fields) continue;
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
          }
        });
        if (hasData) stepsToComplete.set(stepNumber, stepData);
      }
      if (stepsToComplete.size === 0) {
        alert("No data found for any skipped steps");
        setLoading(false);
        return;
      }
      for (const [stepNumber, stepData] of stepsToComplete) {
        try {
          await completeStep(userId, stepNumber, stepData);
          updateProfile(stepData);
        } catch (error) {
          console.error(`Failed to complete step ${stepNumber}:`, error);
        }
      }
      setEditMode(false);
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
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (field: string, value: any) =>
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  const handleArrayChange = (field: string, value: string[]) =>
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  const handleSkillChange = (idx: number, value: string) => {
    const newSkills = [...(draft.skills || [])];
    newSkills[idx] = value;
    setDraft((prev: any) => ({ ...prev, skills: newSkills }));
  };

  const handleAddSkill = () => {
    setDraft((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), ""],
    }));
  };

  const handleRemoveSkill = (idx: number) => {
    const newSkills = (draft.skills || []).filter(
      (_: string, i: number) => i !== idx
    );
    setDraft((prev: any) => ({ ...prev, skills: newSkills }));
  };

  const handleExpChange = (
    idx: number,
    field: "title" | "company" | "duration" | "description",
    value: string
  ) => {
    const newExp = [...(draft.experience || [])];
    newExp[idx][field] = value;
    setDraft((prev: any) => ({ ...prev, experience: newExp }));
  };

  const handleAddExp = () => {
    setDraft((prev: any) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { title: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const handleRemoveExp = (idx: number) => {
    const newExp = (draft.experience || []).filter(
      (_: any, i: number) => i !== idx
    );
    setDraft((prev: any) => ({ ...prev, experience: newExp }));
  };

  const currentProfile = editMode
    ? draft
    : contextProfile || userProfile.profile;
  const skippedStepsList = getSkippedSteps();
  const allStepsCompleted = areAllStepsCompleted();

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
              {currentProfile.title || "Individual Tech Professional"}
            </p>
            <p className="text-xs text-gray-400 mb-4 text-center">
              Independent Consultant
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
                <User2 size={16} />
                <span className="text-sm">
                  {currentProfile.gender || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} />
                <span className="text-sm">
                  {currentProfile.dateOfBirth
                    ? new Date(currentProfile.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                <span className="text-sm">
                  {currentProfile.location || "Not provided"}
                </span>
              </div>
              {currentProfile.hourlyRate && (
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign size={16} />
                  <span className="text-sm">
                    ${currentProfile.hourlyRate}/hr
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {currentProfile.linkedIn && (
                <a
                  href={currentProfile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <Linkedin size={22} />
                </a>
              )}
              {currentProfile.github && (
                <a
                  href={currentProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <Github size={22} />
                </a>
              )}
              {currentProfile.portfolio && (
                <a
                  href={currentProfile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <Globe size={22} />
                </a>
              )}
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
              className={`w-full text-xl font-bold text-[#011F72] mb-1 text-center border-b border-blue-100 focus:outline-none ${
                isFieldCompleted("title") ? "bg-gray-100 text-gray-400" : ""
              }`}
              value={draft.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={
                isFieldCompleted("title") ? "Completed" : "Professional Title"
              }
              disabled={!isFieldEditable("title")}
            />
            <textarea
              className={`w-full text-sm text-gray-500 mb-2 text-center border-b border-blue-100 focus:outline-none ${
                isFieldCompleted("bio") ? "bg-gray-100 text-gray-400" : ""
              }`}
              value={draft.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder={
                isFieldCompleted("bio") ? "Completed" : "Professional bio"
              }
              disabled={!isFieldEditable("bio")}
            />

            <div className="flex flex-col gap-2 w-full mt-4">
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("phoneNumber")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
                value={draft.phoneNumber || ""}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder={
                  isFieldCompleted("phoneNumber") ? "Completed" : "Phone Number"
                }
                disabled={!isFieldEditable("phoneNumber")}
              />
              <select
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("gender") ? "bg-gray-100 text-gray-400" : ""
                }`}
                value={draft.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                disabled={!isFieldEditable("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("dateOfBirth")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
                value={draft.dateOfBirth ? draft.dateOfBirth.split("T")[0] : ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                type="date"
                disabled={!isFieldEditable("dateOfBirth")}
              />
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("location")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
                value={draft.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder={
                  isFieldCompleted("location") ? "Completed" : "Location"
                }
                disabled={!isFieldEditable("location")}
              />
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("hourlyRate")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
                value={draft.hourlyRate || ""}
                onChange={(e) => handleChange("hourlyRate", e.target.value)}
                type="number"
                placeholder={
                  isFieldCompleted("hourlyRate")
                    ? "Completed"
                    : "Hourly Rate ($)"
                }
                disabled={!isFieldEditable("hourlyRate")}
              />
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("linkedIn")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
                placeholder={
                  isFieldCompleted("linkedIn") ? "Completed" : "LinkedIn URL"
                }
                value={draft.linkedIn || ""}
                onChange={(e) => handleChange("linkedIn", e.target.value)}
                disabled={!isFieldEditable("linkedIn")}
              />
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("github") ? "bg-gray-100 text-gray-400" : ""
                }`}
                placeholder={
                  isFieldCompleted("github") ? "Completed" : "GitHub URL"
                }
                value={draft.github || ""}
                onChange={(e) => handleChange("github", e.target.value)}
                disabled={!isFieldEditable("github")}
              />
              <input
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("portfolio")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
                placeholder={
                  isFieldCompleted("portfolio") ? "Completed" : "Portfolio URL"
                }
                value={draft.portfolio || ""}
                onChange={(e) => handleChange("portfolio", e.target.value)}
                disabled={!isFieldEditable("portfolio")}
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
        {/* Bio */}
        {currentProfile.bio && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <User2 size={20} /> About
            </h3>
            {!editMode ? (
              <div className="bg-blue-50/60 rounded-[10px] p-4">
                <p className="text-blue-900">{currentProfile.bio}</p>
              </div>
            ) : (
              <textarea
                className="w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={draft.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder={
                  isFieldCompleted("bio")
                    ? "Completed"
                    : "Tell us about yourself, your expertise, and what you do as an independent tech professional..."
                }
              />
            )}
          </div>
        )}

        {/* Skills */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <BookOpen size={20} /> Skills & Technologies
          </h3>
          {!editMode ? (
            <div className="flex flex-wrap gap-2">
              {currentProfile.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 items-center">
                {(draft.skills || []).map((skill: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1">
                    <input
                      className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold focus:outline-none"
                      value={skill}
                      onChange={(e) => handleSkillChange(idx, e.target.value)}
                      placeholder={
                        isFieldCompleted("skills") ? "Completed" : "Skill"
                      }
                    />
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddSkill}
                  className="text-blue-400 hover:text-blue-600 ml-2"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Add your technical skills, programming languages, frameworks,
                and tools
              </p>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Briefcase size={20} /> Professional Experience
          </h3>
          {!editMode ? (
            <div className="space-y-4">
              {currentProfile.experience?.map((exp: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">
                      {exp.title}
                    </span>
                    <span className="text-xs text-blue-400 font-medium">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {exp.company}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(draft.experience || []).map((exp: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100 flex flex-col gap-2"
                >
                  <div className="flex gap-2">
                    <input
                      className="font-semibold text-blue-900 bg-transparent border-b border-blue-100 focus:outline-none flex-1"
                      value={exp.title}
                      onChange={(e) =>
                        handleExpChange(idx, "title", e.target.value)
                      }
                      placeholder={
                        isFieldCompleted("experience")
                          ? "Completed"
                          : "Job Title"
                      }
                    />
                    <input
                      className="text-xs text-blue-400 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                      value={exp.duration}
                      onChange={(e) =>
                        handleExpChange(idx, "duration", e.target.value)
                      }
                      placeholder={
                        isFieldCompleted("experience")
                          ? "Completed"
                          : "Duration"
                      }
                    />
                  </div>
                  <input
                    className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                    value={exp.company}
                    onChange={(e) =>
                      handleExpChange(idx, "company", e.target.value)
                    }
                    placeholder={
                      isFieldCompleted("experience")
                        ? "Completed"
                        : "Company/Client"
                    }
                  />
                  <textarea
                    className="text-xs text-gray-500 mt-1 bg-transparent border-b border-blue-100 focus:outline-none"
                    value={exp.description}
                    onChange={(e) =>
                      handleExpChange(idx, "description", e.target.value)
                    }
                    placeholder={
                      isFieldCompleted("experience")
                        ? "Completed"
                        : "Description of your role and achievements"
                    }
                  />
                  <button
                    onClick={() => handleRemoveExp(idx)}
                    className="text-red-400 hover:text-red-600 self-end"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddExp}
                className="text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>
          )}
        </div>

        {/* Specialization Areas */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Award size={20} /> Specialization Areas
          </h3>
          {!editMode ? (
            <div className="flex flex-wrap gap-2">
              {currentProfile.specializations?.map((spec: string) => (
                <span
                  key={spec}
                  className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200"
                >
                  {spec}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Select your specialization areas:
              </p>
              {[
                "Frontend Development",
                "Backend Development",
                "Full Stack Development",
                "Mobile Development",
                "DevOps & Cloud",
                "Data Science & AI",
                "Cybersecurity",
                "UI/UX Design",
                "Product Management",
                "Technical Leadership",
                "Consulting",
                "Training & Mentoring",
                "System Architecture",
                "Database Design",
                "API Development",
                "Testing & QA",
              ].map((spec) => (
                <label key={spec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.specializations?.includes(spec) || false}
                    onChange={(e) => {
                      if (isFieldCompleted("specializations")) return;
                      const current = draft.specializations || [];
                      if (e.target.checked) {
                        handleArrayChange("specializations", [
                          ...current,
                          spec,
                        ]);
                      } else {
                        handleArrayChange(
                          "specializations",
                          current.filter((s: string) => s !== spec)
                        );
                      }
                    }}
                    className={`rounded border-green-300 text-green-600 focus:ring-green-500 ${
                      isFieldCompleted("specializations")
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isFieldCompleted("specializations")}
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Availability & Rates */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Clock size={20} /> Availability & Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Availability Status
              </label>
              {!editMode ? (
                <p className="text-blue-900 capitalize">
                  {currentProfile.availabilityStatus || "Not specified"}
                </p>
              ) : (
                <select
                  className="w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={draft.availabilityStatus || ""}
                  onChange={(e) =>
                    handleChange("availabilityStatus", e.target.value)
                  }
                >
                  <option value="">Select Availability</option>
                  <option value="available">Available for new projects</option>
                  <option value="limited">Limited availability</option>
                  <option value="unavailable">Currently unavailable</option>
                  <option value="part-time">Part-time only</option>
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Preferred Project Types
              </label>
              {!editMode ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentProfile.preferredProjectTypes?.map((type: string) => (
                    <span
                      key={type}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 mt-1">
                  {[
                    "Short-term",
                    "Long-term",
                    "Consulting",
                    "Freelance",
                    "Contract",
                    "Remote",
                    "On-site",
                  ].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          draft.preferredProjectTypes?.includes(type) || false
                        }
                        onChange={(e) => {
                          if (isFieldCompleted("preferredProjectTypes")) return;
                          const current = draft.preferredProjectTypes || [];
                          if (e.target.checked) {
                            handleArrayChange("preferredProjectTypes", [
                              ...current,
                              type,
                            ]);
                          } else {
                            handleArrayChange(
                              "preferredProjectTypes",
                              current.filter((t: string) => t !== type)
                            );
                          }
                        }}
                        className={`rounded border-blue-300 text-blue-600 focus:ring-blue-500 ${
                          isFieldCompleted("preferredProjectTypes")
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isFieldCompleted("preferredProjectTypes")}
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <LinkIcon size={20} /> Professional Links
          </h3>
          {!editMode ? (
            <div className="flex flex-col gap-2">
              {currentProfile.linkedIn && (
                <a
                  href={currentProfile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Linkedin size={16} /> LinkedIn Profile
                </a>
              )}
              {currentProfile.github && (
                <a
                  href={currentProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Github size={16} /> GitHub Profile
                </a>
              )}
              {currentProfile.portfolio && (
                <a
                  href={currentProfile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Globe size={16} /> Portfolio Website
                </a>
              )}
            </div>
          ) : null}
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
