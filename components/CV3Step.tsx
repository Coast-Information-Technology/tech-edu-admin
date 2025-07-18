"use client";

import { useState } from "react";
import { CVData } from "@/types/cv-layout";
import { Plus, Trash2 } from "lucide-react";

export default function CVStep3({
  data,
  setData,
  onContinue,
  onBack,
}: {
  data: CVData;
  setData: (data: CVData) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  // Ensure experience is always an array
  const experience = Array.isArray(data.experience) ? data.experience : [];

  // Add a new experience entry
  const addExperience = () => {
    setData({
      ...data,
      experience: [
        ...experience,
        {
          id: Date.now().toString(),
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [],
        },
      ],
    });
  };

  // Update a field in an experience entry
  const updateExperience = (
    id: string,
    field: keyof CVData["experience"][0],
    value: any
  ) => {
    setData({
      ...data,
      experience: experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  // Remove an experience entry
  const removeExperience = (id: string) => {
    setData({
      ...data,
      experience: experience.filter((exp) => exp.id !== id),
    });
  };

  // Add an achievement to an experience entry
  const addAchievement = (id: string) => {
    setData({
      ...data,
      experience: experience.map((exp) =>
        exp.id === id
          ? { ...exp, achievements: [...(exp.achievements || []), ""] }
          : exp
      ),
    });
  };

  // Update an achievement in an experience entry
  const updateAchievement = (expId: string, idx: number, value: string) => {
    setData({
      ...data,
      experience: experience.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              achievements: exp.achievements?.map((ach, i) =>
                i === idx ? value : ach
              ),
            }
          : exp
      ),
    });
  };

  // Remove an achievement from an experience entry
  const removeAchievement = (expId: string, idx: number) => {
    setData({
      ...data,
      experience: experience.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              achievements: exp.achievements?.filter((_, i) => i !== idx),
            }
          : exp
      ),
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-10">
        <p className="text-xs md:text-sm text-gray-600">Step 3 of 7</p>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Work Experience
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Add your professional experience. Include achievements for each role.
        </p>
      </div>
      <div className="mb-8 flex justify-end">
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors text-sm"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>
      {experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>
            No experience entries yet. Click "Add Experience" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp.id} className="bg-gray-50 p-6 rounded-[10px] border">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Experience Entry</h4>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) =>
                      updateExperience(exp.id, "jobTitle", e.target.value)
                    }
                    placeholder="e.g., Software Engineer"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    placeholder="e.g., Tech Solutions Inc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location || ""}
                    onChange={(e) =>
                      updateExperience(exp.id, "location", e.target.value)
                    }
                    placeholder="e.g., New York, NY"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "startDate", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      updateExperience(exp.id, "endDate", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(exp.id, "description", e.target.value)
                  }
                  placeholder="Describe your role, responsibilities, etc."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements
                </label>
                {exp.achievements && exp.achievements.length > 0 ? (
                  <ul className="space-y-2 mb-2">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) =>
                            updateAchievement(exp.id, idx, e.target.value)
                          }
                          placeholder="e.g., Increased sales by 30%"
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeAchievement(exp.id, idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 mb-2">
                    No achievements yet.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => addAchievement(exp.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                >
                  <Plus size={14} />
                  <span>Add Achievement</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs md:text-sm text-gray-600 underline hover:text-gray-800"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-3 rounded-md shadow transition"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}
