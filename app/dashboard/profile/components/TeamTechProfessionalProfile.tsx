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
  Users,
  Award,
  Building,
  Target,
  AlertCircle,
} from "lucide-react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfile } from "@/contexts/ProfileContext";

interface TeamTechProfessionalProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function TeamTechProfessionalProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: TeamTechProfessionalProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(userProfile.profile);

  // Step-to-field mapping for team tech professional onboarding
  const stepFieldMapping = {
    1: ["teamName", "contactEmail", "contactPhone", "location", "teamSize"],
    2: ["company", "companyId"],
    3: ["learningGoals", "preferredTechStack", "softSkills"],
    4: ["members"],
    5: [
      "interestedInTraining",
      "availableAsInstructor",
      "remoteWorkExperience",
      "lookingForJobs",
      "trainingAvailability",
    ],
    6: ["additionalProjectLinks"],
    // ...add more steps/fields as needed
  };

  // Onboarding progress logic
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

  // Edit/save/cancel logic for skipped steps
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

  // Helper functions for nested fields
  const location = draft.location
    ? [draft.location.city, draft.location.state, draft.location.country]
        .filter(Boolean)
        .join(", ")
    : "Not provided";

  const company = draft.company?.name || "Not provided";
  const companyLocation = draft.company?.location
    ? [
        draft.company.location.city,
        draft.company.location.state,
        draft.company.location.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const learningGoals = draft.learningGoals
    ? `${draft.learningGoals.goalType || ""}${
        draft.learningGoals.priorityAreas?.length
          ? " (" + draft.learningGoals.priorityAreas.join(", ") + ")"
          : ""
      }${
        draft.learningGoals.trainingTimeline
          ? " - " + draft.learningGoals.trainingTimeline
          : ""
      }`
    : "Not provided";

  const members = draft.members || [];

  // Show skipped steps UI
  const skippedStepsList = getSkippedSteps();
  const allStepsCompleted = areAllStepsCompleted();

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100 mb-6 lg:mb-0">
        <div className="w-24 h-24 rounded-full bg-[#011F72] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
          {userProfile.fullName.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-[#011F72] mb-1 text-center">
          {userProfile.fullName}
        </h2>
        <p className="text-sm text-gray-500 mb-2 text-center">
          Team Lead / Manager
        </p>
        <div className="flex flex-col gap-2 w-full mt-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail size={16} />
            <span className="text-sm break-all">{userProfile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone size={16} />
            <span className="text-sm">
              {draft.contactPhone || "Not provided"}
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          {draft.linkedinProfile && (
            <a
              href={draft.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Linkedin size={22} />
            </a>
          )}
          {draft.githubPortfolioUrl && (
            <a
              href={draft.githubPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Github size={22} />
            </a>
          )}
          {draft.portfolio && (
            <a
              href={draft.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Globe size={22} />
            </a>
          )}
        </div>
        <div className="mt-8 w-full">
          <button
            onClick={handleEdit}
            className="w-full bg-[#011F72] hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        {/* Skipped Steps Banner */}
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
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} /> Save Skipped Steps
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
          </div>
        )}

        {/* Location & Company */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-8">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <MapPin size={18} className="text-blue-500" />
            <span className="font-medium">Location:</span>
            <span className="text-gray-700">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building size={18} className="text-blue-500" />
            <span className="font-medium">Company:</span>
            <span className="text-gray-700">{company}</span>
            {companyLocation && (
              <span className="text-xs text-gray-400 ml-2">
                ({companyLocation})
              </span>
            )}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-2">
            <Target size={20} /> Learning Goals
          </h3>
          <div className="bg-blue-50/60 rounded-[10px] p-4 text-blue-900">
            {learningGoals}
          </div>
        </div>

        {/* Preferred Tech Stack */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-2">
            <BookOpen size={20} /> Preferred Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {(draft.preferredTechStack || []).length === 0 && (
              <span className="text-gray-500">Not specified</span>
            )}
            {(draft.preferredTechStack || []).map((tech: string) => (
              <span
                key={tech}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-2">
            <Users size={20} /> Team Members
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Invited At</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-2 text-gray-500">
                      No team members
                    </td>
                  </tr>
                )}
                {members.map((m: any) => (
                  <tr key={m._id}>
                    <td className="p-2">{m.role}</td>
                    <td className="p-2">{m.status}</td>
                    <td className="p-2">
                      {m.invitedAt
                        ? new Date(m.invitedAt).toLocaleDateString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Profile Details */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Interested in Training:</span>{" "}
            <span>{draft.interestedInTraining ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="font-medium">Available as Instructor:</span>{" "}
            <span>{draft.availableAsInstructor ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="font-medium">Remote Work Experience:</span>{" "}
            <span>{draft.remoteWorkExperience ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="font-medium">Looking for Jobs:</span>{" "}
            <span>{draft.lookingForJobs ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="font-medium">Training Availability:</span>{" "}
            <span>{draft.trainingAvailability || "Not specified"}</span>
          </div>
        </div>

        {/* Soft Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-2">
            <Award size={20} /> Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(draft.softSkills || []).length === 0 && (
              <span className="text-gray-500">Not specified</span>
            )}
            {(draft.softSkills || []).map((skill: string) => (
              <span
                key={skill}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Project Links */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-2">
            <LinkIcon size={20} /> Additional Project Links
          </h3>
          <div className="flex flex-col gap-2">
            {(draft.additionalProjectLinks || []).length === 0 && (
              <span className="text-gray-500">None</span>
            )}
            {(draft.additionalProjectLinks || []).map(
              (link: string, idx: number) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline break-all"
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
