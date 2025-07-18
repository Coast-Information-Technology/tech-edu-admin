"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  MapPin,
  Building2,
  Users,
  Briefcase,
  Link as LinkIcon,
  X,
  Plus,
  Save,
  Edit2,
  Calendar,
  Star,
} from "lucide-react";

const initialProfile = {
  companyName: "TechEdu Solutions",
  industry: "Education Technology",
  size: "50-100 employees",
  founded: "2020",
  location: "Lagos, Nigeria",
  phone: "+234 801 234 5678",
  email: "contact@techedu.com",
  website: "https://techedu.com",
  description:
    "Leading education technology company focused on bridging the gap between education and employment through innovative learning solutions.",
  profileImageUrl: "/assets/logo.png",
  hiringPreferences: [
    "Remote work friendly",
    "Flexible hours",
    "Professional development",
    "Competitive salary",
  ],
  teamMembers: [
    {
      name: "Sarah Johnson",
      role: "HR Manager",
      email: "sarah@techedu.com",
    },
    {
      name: "Mike Chen",
      role: "Recruitment Lead",
      email: "mike@techedu.com",
    },
  ],
  achievements: [
    "Hired 50+ developers in 2023",
    "95% employee retention rate",
    "Featured in Top 100 Companies to Work For",
  ],
  links: {
    linkedIn: "https://linkedin.com/company/techedu",
    twitter: "https://twitter.com/techedu",
    facebook: "https://facebook.com/techedu",
  },
};

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(profile);

  // Handlers
  const handleEdit = () => {
    setDraft(profile);
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
  };
  const handleSave = () => {
    setProfile(draft);
    setEditMode(false);
  };
  const handleChange = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };
  const handleLinkChange = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, links: { ...prev.links, [field]: value } }));
  };

  // Hiring Preferences
  const handlePreferenceChange = (idx: number, value: string) => {
    const newPreferences = [...draft.hiringPreferences];
    newPreferences[idx] = value;
    setDraft((prev) => ({ ...prev, hiringPreferences: newPreferences }));
  };
  const handleAddPreference = () => {
    setDraft((prev) => ({
      ...prev,
      hiringPreferences: [...prev.hiringPreferences, ""],
    }));
  };
  const handleRemovePreference = (idx: number) => {
    const newPreferences = draft.hiringPreferences.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, hiringPreferences: newPreferences }));
  };

  // Team Members
  const handleTeamChange = (
    idx: number,
    field: "name" | "role" | "email",
    value: string
  ) => {
    const newTeam = [...draft.teamMembers];
    newTeam[idx][field] = value;
    setDraft((prev) => ({ ...prev, teamMembers: newTeam }));
  };
  const handleAddTeamMember = () => {
    setDraft((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", role: "", email: "" }],
    }));
  };
  const handleRemoveTeamMember = (idx: number) => {
    const newTeam = draft.teamMembers.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, teamMembers: newTeam }));
  };

  // Achievements
  const handleAchievementChange = (idx: number, value: string) => {
    const newAchievements = [...draft.achievements];
    newAchievements[idx] = value;
    setDraft((prev) => ({ ...prev, achievements: newAchievements }));
  };
  const handleAddAchievement = () => {
    setDraft((prev) => ({ ...prev, achievements: [...prev.achievements, ""] }));
  };
  const handleRemoveAchievement = (idx: number) => {
    const newAchievements = draft.achievements.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, achievements: newAchievements }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto py-10">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100">
        <img
          src={profile.profileImageUrl}
          alt={profile.companyName}
          className="w-32 h-32 rounded-full object-cover border-4 border-[#011F72] mb-4 shadow-md"
        />
        {!editMode ? (
          <>
            <h2 className="text-xl font-bold text-[#011F72] mb-1 text-center">
              {profile.companyName}
            </h2>
            <p className="text-sm text-gray-500 mb-2 text-center">
              {profile.description}
            </p>
            <div className="flex flex-col gap-1 w-full mt-4 items-center lg:items-start">
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 size={16} /> <span>{profile.industry}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={16} /> <span>{profile.size}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} /> <span>Founded {profile.founded}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} /> <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} /> <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} /> <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Globe size={16} /> <span>{profile.website}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {profile.links.linkedIn && (
                <a
                  href={profile.links.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <Linkedin size={22} />
                </a>
              )}
              {profile.links.twitter && (
                <a
                  href={profile.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <LinkIcon size={22} />
                </a>
              )}
              {profile.links.facebook && (
                <a
                  href={profile.links.facebook}
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
              className="mt-8 w-full bg-[#011F72] hover:bg-blue-400 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full text-xl font-bold text-[#011F72] mb-1 text-center border-b border-blue-100 focus:outline-none"
              value={draft.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
            <textarea
              className="w-full text-sm text-gray-500 mb-2 text-center border-b border-blue-100 focus:outline-none"
              value={draft.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <div className="flex flex-col gap-2 w-full mt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.founded}
                  onChange={(e) => handleChange("founded", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Globe size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <input
                className="border-b border-blue-100 focus:outline-none"
                placeholder="LinkedIn URL"
                value={draft.links.linkedIn}
                onChange={(e) => handleLinkChange("linkedIn", e.target.value)}
              />
              <input
                className="border-b border-blue-100 focus:outline-none"
                placeholder="Twitter URL"
                value={draft.links.twitter}
                onChange={(e) => handleLinkChange("twitter", e.target.value)}
              />
              <input
                className="border-b border-blue-100 focus:outline-none"
                placeholder="Facebook URL"
                value={draft.links.facebook}
                onChange={(e) => handleLinkChange("facebook", e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-8 w-full">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-400 hover:bg-[#011F72] text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save
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
        {/* Hiring Preferences */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <Briefcase size={20} /> Hiring Preferences
          </h3>
          {!editMode ? (
            <div className="flex flex-wrap gap-2">
              {profile.hiringPreferences.map((preference) => (
                <span
                  key={preference}
                  className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                >
                  {preference}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {draft.hiringPreferences.map((preference, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold focus:outline-none"
                    value={preference}
                    onChange={(e) =>
                      handlePreferenceChange(idx, e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleRemovePreference(idx)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddPreference}
                className="text-blue-400 hover:text-blue-600 ml-2"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <Users size={20} /> Team Members
          </h3>
          {!editMode ? (
            <div className="space-y-4">
              {profile.teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">
                      {member.name}
                    </span>
                    <span className="text-xs text-blue-400 font-medium">
                      {member.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {member.email}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {draft.teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100 flex flex-col gap-2"
                >
                  <div className="flex gap-2">
                    <input
                      className="font-semibold text-blue-900 bg-transparent border-b border-blue-100 focus:outline-none flex-1"
                      value={member.name}
                      onChange={(e) =>
                        handleTeamChange(idx, "name", e.target.value)
                      }
                      placeholder="Name"
                    />
                    <input
                      className="text-xs text-blue-400 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                      value={member.role}
                      onChange={(e) =>
                        handleTeamChange(idx, "role", e.target.value)
                      }
                      placeholder="Role"
                    />
                  </div>
                  <input
                    className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                    value={member.email}
                    onChange={(e) =>
                      handleTeamChange(idx, "email", e.target.value)
                    }
                    placeholder="Email"
                  />
                  <button
                    onClick={() => handleRemoveTeamMember(idx)}
                    className="text-red-400 hover:text-red-600 self-end"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddTeamMember}
                className="text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Add Team Member
              </button>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <Star size={20} /> Company Achievements
          </h3>
          {!editMode ? (
            <div className="space-y-2">
              {profile.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {draft.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="flex-1 border-b border-blue-100 focus:outline-none"
                    value={achievement}
                    onChange={(e) =>
                      handleAchievementChange(idx, e.target.value)
                    }
                    placeholder="Achievement"
                  />
                  <button
                    onClick={() => handleRemoveAchievement(idx)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddAchievement}
                className="text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Add Achievement
              </button>
            </div>
          )}
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <LinkIcon size={20} /> Links
          </h3>
          {!editMode ? (
            <div className="flex flex-col gap-2">
              {profile.links.linkedIn && (
                <a
                  href={profile.links.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
              {profile.links.twitter && (
                <a
                  href={profile.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <LinkIcon size={16} /> Twitter
                </a>
              )}
              {profile.links.facebook && (
                <a
                  href={profile.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Globe size={16} /> Facebook
                </a>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
