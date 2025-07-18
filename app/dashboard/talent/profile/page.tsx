"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  User2,
  Calendar,
  MapPin,
  BookOpen,
  Briefcase,
  Link as LinkIcon,
  X,
  Plus,
  Save,
  Edit2,
  Award,
  Star,
} from "lucide-react";

const initialProfile = {
  fullName: "John Smith",
  gender: "Male",
  dateOfBirth: "1990-03-15",
  nationality: "Nigerian",
  phone: "+234 801 234 5678",
  email: "john.smith@email.com",
  bio: "Experienced software engineer with 5+ years in full-stack development. Passionate about creating scalable solutions and mentoring junior developers.",
  profileImageUrl: "/assets/placeholder-avatar.jpg",
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "AWS",
    "Docker",
    "MongoDB",
    "PostgreSQL",
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-12-01",
      expiry: "2026-12-01",
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2023-06-15",
      expiry: "2025-06-15",
    },
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechEdu Solutions",
      duration: "2022 - Present",
      description:
        "Leading development of the TechEdu platform. Mentoring junior developers and implementing best practices.",
    },
    {
      title: "Full Stack Developer",
      company: "InnovateX",
      duration: "2020 - 2022",
      description:
        "Built and maintained multiple web applications using React and Node.js.",
    },
  ],
  education: [
    {
      school: "University of Lagos",
      degree: "B.Sc.",
      field: "Computer Science",
      year: "2016 - 2020",
    },
  ],
  achievements: [
    "Led team of 5 developers to deliver project 2 weeks early",
    "Reduced application load time by 40% through optimization",
    "Mentored 3 junior developers to senior level",
  ],
  links: {
    linkedIn: "https://linkedin.com/in/johnsmith",
    github: "https://github.com/johnsmith",
    portfolio: "https://johnsmith.dev",
    twitter: "https://twitter.com/johnsmith",
  },
};

export default function TalentProfilePage() {
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

  // Skills
  const handleSkillChange = (idx: number, value: string) => {
    const newSkills = [...draft.skills];
    newSkills[idx] = value;
    setDraft((prev) => ({ ...prev, skills: newSkills }));
  };
  const handleAddSkill = () => {
    setDraft((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };
  const handleRemoveSkill = (idx: number) => {
    const newSkills = draft.skills.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, skills: newSkills }));
  };

  // Certifications
  const handleCertChange = (
    idx: number,
    field: "name" | "issuer" | "date" | "expiry",
    value: string
  ) => {
    const newCerts = [...draft.certifications];
    newCerts[idx][field] = value;
    setDraft((prev) => ({ ...prev, certifications: newCerts }));
  };
  const handleAddCert = () => {
    setDraft((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", date: "", expiry: "" },
      ],
    }));
  };
  const handleRemoveCert = (idx: number) => {
    const newCerts = draft.certifications.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, certifications: newCerts }));
  };

  // Experience
  const handleExpChange = (
    idx: number,
    field: "title" | "company" | "duration" | "description",
    value: string
  ) => {
    const newExp = [...draft.experience];
    newExp[idx][field] = value;
    setDraft((prev) => ({ ...prev, experience: newExp }));
  };
  const handleAddExp = () => {
    setDraft((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", duration: "", description: "" },
      ],
    }));
  };
  const handleRemoveExp = (idx: number) => {
    const newExp = draft.experience.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, experience: newExp }));
  };

  // Education
  const handleEduChange = (
    idx: number,
    field: "school" | "degree" | "field" | "year",
    value: string
  ) => {
    const newEdu = [...draft.education];
    newEdu[idx][field] = value;
    setDraft((prev) => ({ ...prev, education: newEdu }));
  };
  const handleAddEdu = () => {
    setDraft((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", field: "", year: "" },
      ],
    }));
  };
  const handleRemoveEdu = (idx: number) => {
    const newEdu = draft.education.filter((_, i) => i !== idx);
    setDraft((prev) => ({ ...prev, education: newEdu }));
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
          alt={profile.fullName}
          className="w-32 h-32 rounded-full object-cover border-4 border-[#011F72] mb-4 shadow-md"
        />
        {!editMode ? (
          <>
            <h2 className="text-xl font-bold text-[#011F72] mb-1 text-center">
              {profile.fullName}
            </h2>
            <p className="text-sm text-gray-500 mb-2 text-center">
              {profile.bio}
            </p>
            <div className="flex flex-col gap-1 w-full mt-4 items-center lg:items-start">
              <div className="flex items-center gap-2 text-gray-700">
                <User2 size={16} /> <span>{profile.gender}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} /> <span>{profile.dateOfBirth}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} /> <span>{profile.nationality}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} /> <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} /> <span>{profile.email}</span>
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
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <Github size={22} />
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={profile.links.portfolio}
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
              value={draft.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
            <textarea
              className="w-full text-sm text-gray-500 mb-2 text-center border-b border-blue-100 focus:outline-none"
              value={draft.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
            <div className="flex flex-col gap-2 w-full mt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User2 size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  type="date"
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                <input
                  className="border-b border-blue-100 focus:outline-none"
                  value={draft.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
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
                placeholder="GitHub URL"
                value={draft.links.github}
                onChange={(e) => handleLinkChange("github", e.target.value)}
              />
              <input
                className="border-b border-blue-100 focus:outline-none"
                placeholder="Portfolio URL"
                value={draft.links.portfolio}
                onChange={(e) => handleLinkChange("portfolio", e.target.value)}
              />
              <input
                className="border-b border-blue-100 focus:outline-none"
                placeholder="Twitter URL"
                value={draft.links.twitter}
                onChange={(e) => handleLinkChange("twitter", e.target.value)}
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
        {/* Skills */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <BookOpen size={20} /> Skills
          </h3>
          {!editMode ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {draft.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold focus:outline-none"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
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
          )}
        </div>

        {/* Certifications */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <Award size={20} /> Certifications
          </h3>
          {!editMode ? (
            <div className="space-y-4">
              {profile.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">
                      {cert.name}
                    </span>
                    <span className="text-xs text-blue-400 font-medium">
                      {cert.date}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {cert.issuer}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Expires: {cert.expiry}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {draft.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100 flex flex-col gap-2"
                >
                  <div className="flex gap-2">
                    <input
                      className="font-semibold text-blue-900 bg-transparent border-b border-blue-100 focus:outline-none flex-1"
                      value={cert.name}
                      onChange={(e) =>
                        handleCertChange(idx, "name", e.target.value)
                      }
                      placeholder="Certification Name"
                    />
                    <input
                      className="text-xs text-blue-400 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                      value={cert.date}
                      onChange={(e) =>
                        handleCertChange(idx, "date", e.target.value)
                      }
                      placeholder="Date"
                      type="date"
                    />
                  </div>
                  <input
                    className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                    value={cert.issuer}
                    onChange={(e) =>
                      handleCertChange(idx, "issuer", e.target.value)
                    }
                    placeholder="Issuer"
                  />
                  <input
                    className="text-xs text-gray-500 mt-1 bg-transparent border-b border-blue-100 focus:outline-none"
                    value={cert.expiry}
                    onChange={(e) =>
                      handleCertChange(idx, "expiry", e.target.value)
                    }
                    placeholder="Expiry Date"
                    type="date"
                  />
                  <button
                    onClick={() => handleRemoveCert(idx)}
                    className="text-red-400 hover:text-red-600 self-end"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddCert}
                className="text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Add Certification
              </button>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <Briefcase size={20} /> Experience
          </h3>
          {!editMode ? (
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
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
              {draft.experience.map((exp, idx) => (
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
                      placeholder="Title"
                    />
                    <input
                      className="text-xs text-blue-400 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                      value={exp.duration}
                      onChange={(e) =>
                        handleExpChange(idx, "duration", e.target.value)
                      }
                      placeholder="Duration"
                    />
                  </div>
                  <input
                    className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                    value={exp.company}
                    onChange={(e) =>
                      handleExpChange(idx, "company", e.target.value)
                    }
                    placeholder="Company"
                  />
                  <textarea
                    className="text-xs text-gray-500 mt-1 bg-transparent border-b border-blue-100 focus:outline-none"
                    value={exp.description}
                    onChange={(e) =>
                      handleExpChange(idx, "description", e.target.value)
                    }
                    placeholder="Description"
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

        {/* Education */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <BookOpen size={20} /> Education
          </h3>
          {!editMode ? (
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">
                      {edu.degree} in {edu.field}
                    </span>
                    <span className="text-xs text-blue-400 font-medium">
                      {edu.year}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {edu.school}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {draft.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/60 rounded-[10px] p-4 border border-blue-100 flex flex-col gap-2"
                >
                  <div className="flex gap-2">
                    <input
                      className="font-semibold text-blue-900 bg-transparent border-b border-blue-100 focus:outline-none flex-1"
                      value={edu.degree}
                      onChange={(e) =>
                        handleEduChange(idx, "degree", e.target.value)
                      }
                      placeholder="Degree"
                    />
                    <input
                      className="text-xs text-blue-400 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                      value={edu.year}
                      onChange={(e) =>
                        handleEduChange(idx, "year", e.target.value)
                      }
                      placeholder="Year"
                    />
                  </div>
                  <input
                    className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                    value={edu.field}
                    onChange={(e) =>
                      handleEduChange(idx, "field", e.target.value)
                    }
                    placeholder="Field"
                  />
                  <input
                    className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-100 focus:outline-none"
                    value={edu.school}
                    onChange={(e) =>
                      handleEduChange(idx, "school", e.target.value)
                    }
                    placeholder="School"
                  />
                  <button
                    onClick={() => handleRemoveEdu(idx)}
                    className="text-red-400 hover:text-red-600 self-end"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddEdu}
                className="text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-3">
            <Star size={20} /> Achievements
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
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={profile.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-400"
                >
                  <Globe size={16} /> Portfolio
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
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
