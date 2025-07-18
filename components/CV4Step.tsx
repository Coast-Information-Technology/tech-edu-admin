"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type SectionKey =
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "references";

interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
}

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  rating: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
}

interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export default function CVStep4({
  data,
  setData,
  onContinue,
  onBack,
}: {
  data: any;
  setData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [activeSection, setActiveSection] = useState<SectionKey>("education");

  // Debug logging
  console.log("CV4Step data:", data);
  console.log("data.education:", data?.education);
  console.log("typeof data.education:", typeof data?.education);

  // Initialize data if not exists with additional safety checks
  const education = Array.isArray(data?.education) ? data.education : [];
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const references = Array.isArray(data?.references) ? data.references : [];

  console.log("Initialized education:", education);

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
    };
    setData({ ...data, education: [...education, newEducation] });
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    const updated = education.map((edu: Education) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setData({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    const updated = education.filter((edu: Education) => edu.id !== id);
    setData({ ...data, education: updated });
  };

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      role: "",
      company: "",
      startYear: "",
      endYear: "",
      description: "",
    };
    setData({ ...data, experience: [...experience, newExperience] });
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updated = experience.map((exp: WorkExperience) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setData({ ...data, experience: updated });
  };

  const removeExperience = (id: string) => {
    const updated = experience.filter((exp: WorkExperience) => exp.id !== id);
    setData({ ...data, experience: updated });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      rating: 5,
    };
    setData({ ...data, skills: [...skills, newSkill] });
  };

  const updateSkill = (
    id: string,
    field: keyof Skill,
    value: string | number
  ) => {
    const updated = skills.map((skill: Skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    setData({ ...data, skills: updated });
  };

  const removeSkill = (id: string) => {
    const updated = skills.filter((skill: Skill) => skill.id !== id);
    setData({ ...data, skills: updated });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      stack: "",
    };
    setData({ ...data, projects: [...projects, newProject] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = projects.map((project: Project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    setData({ ...data, projects: updated });
  };

  const removeProject = (id: string) => {
    const updated = projects.filter((project: Project) => project.id !== id);
    setData({ ...data, projects: updated });
  };

  const addReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      name: "",
      position: "",
      company: "",
      email: "",
      phone: "",
    };
    setData({ ...data, references: [...references, newReference] });
  };

  const updateReference = (
    id: string,
    field: keyof Reference,
    value: string
  ) => {
    const updated = references.map((ref: Reference) =>
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    setData({ ...data, references: updated });
  };

  const removeReference = (id: string) => {
    const updated = references.filter((ref: Reference) => ref.id !== id);
    setData({ ...data, references: updated });
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-10">
        <p className="text-xs md:text-sm text-gray-600">Step 4 of 5</p>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Add Your CV Content
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Fill in your education, experience, skills, and other relevant
          information.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "education", title: "🎓 Education", icon: "🎓" },
            { key: "experience", title: "💼 Work Experience", icon: "💼" },
            { key: "skills", title: "🧠 Skills", icon: "🧠" },
            { key: "projects", title: "🛠 Projects", icon: "🛠" },
            { key: "references", title: "💬 References", icon: "💬" },
          ].map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key as SectionKey)}
              className={`px-3 md:px-4 py-2 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                activeSection === section.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Education Section */}
      {activeSection === "education" && (
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Education
            </h3>
            <button
              onClick={addEducation}
              className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add Education</span>
            </button>
          </div>

          {education.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <p className="text-sm">
                No education entries yet. Click "Add Education" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {education.map((edu: Education) => (
                <div
                  key={edu.id}
                  className="bg-gray-50 p-4 md:p-6 rounded-[10px] border"
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      Education Entry
                    </h4>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, "institution", e.target.value)
                        }
                        placeholder="e.g., University of Technology"
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Year
                      </label>
                      <input
                        type="number"
                        value={edu.startYear}
                        onChange={(e) =>
                          updateEducation(edu.id, "startYear", e.target.value)
                        }
                        placeholder="e.g., 2019"
                        min="1950"
                        max="2030"
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Year
                      </label>
                      <input
                        type="number"
                        value={edu.endYear}
                        onChange={(e) =>
                          updateEducation(edu.id, "endYear", e.target.value)
                        }
                        placeholder="e.g., 2023"
                        min="1950"
                        max="2030"
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Work Experience Section */}
      {activeSection === "experience" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Work Experience
            </h3>
            <button
              onClick={addExperience}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
            >
              <Plus size={16} />
              <span>Add Experience</span>
            </button>
          </div>

          {experience.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No work experience entries yet. Click "Add Experience" to get
                started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {experience.map((exp: WorkExperience) => (
                <div
                  key={exp.id}
                  className="bg-gray-50 p-6 rounded-[10px] border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      Work Experience Entry
                    </h4>
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
                        Role/Position
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(exp.id, "role", e.target.value)
                        }
                        placeholder="e.g., Frontend Developer"
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
                        Start Year
                      </label>
                      <input
                        type="number"
                        value={exp.startYear}
                        onChange={(e) =>
                          updateExperience(exp.id, "startYear", e.target.value)
                        }
                        placeholder="e.g., 2020"
                        min="1950"
                        max="2030"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Year
                      </label>
                      <input
                        type="number"
                        value={exp.endYear}
                        onChange={(e) =>
                          updateExperience(exp.id, "endYear", e.target.value)
                        }
                        placeholder="e.g., 2023 (or leave empty if current)"
                        min="1950"
                        max="2030"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description/Responsibilities
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value)
                      }
                      placeholder="Describe your role, key achievements, and responsibilities..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills Section */}
      {activeSection === "skills" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
            <button
              onClick={addSkill}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No skills added yet. Click "Add Skill" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill: Skill) => (
                <div
                  key={skill.id}
                  className="bg-gray-50 p-6 rounded-[10px] border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Skill Entry</h4>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(skill.id, "name", e.target.value)
                        }
                        placeholder="e.g., React.js, Project Management, Public Speaking"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proficiency Level (1-10)
                      </label>
                      <input
                        type="number"
                        value={skill.rating}
                        onChange={(e) =>
                          updateSkill(
                            skill.id,
                            "rating",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        max="10"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Section */}
      {activeSection === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
            <button
              onClick={addProject}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
            >
              <Plus size={16} />
              <span>Add Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No projects added yet. Click "Add Project" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project: Project) => (
                <div
                  key={project.id}
                  className="bg-gray-50 p-6 rounded-[10px] border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Project Entry</h4>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          updateProject(project.id, "title", e.target.value)
                        }
                        placeholder="e.g., E-commerce Platform, Portfolio Website"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe what the project does, your role, and key features..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies/Tools Used
                      </label>
                      <input
                        type="text"
                        value={project.stack}
                        onChange={(e) =>
                          updateProject(project.id, "stack", e.target.value)
                        }
                        placeholder="e.g., React, Node.js, MongoDB, AWS"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* References Section */}
      {activeSection === "references" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">References</h3>
            <button
              onClick={addReference}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
            >
              <Plus size={16} />
              <span>Add Reference</span>
            </button>
          </div>

          {references.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No references added yet. Click "Add Reference" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {references.map((ref: Reference) => (
                <div
                  key={ref.id}
                  className="bg-gray-50 p-6 rounded-[10px] border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      Reference Entry
                    </h4>
                    <button
                      onClick={() => removeReference(ref.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={ref.name}
                        onChange={(e) =>
                          updateReference(ref.id, "name", e.target.value)
                        }
                        placeholder="e.g., Dr. Jane Smith"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position/Title
                      </label>
                      <input
                        type="text"
                        value={ref.position}
                        onChange={(e) =>
                          updateReference(ref.id, "position", e.target.value)
                        }
                        placeholder="e.g., Senior Manager, Professor"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company/Institution
                      </label>
                      <input
                        type="text"
                        value={ref.company}
                        onChange={(e) =>
                          updateReference(ref.id, "company", e.target.value)
                        }
                        placeholder="e.g., Tech Solutions Inc., University of Technology"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={ref.email}
                        onChange={(e) =>
                          updateReference(ref.id, "email", e.target.value)
                        }
                        placeholder="e.g., jane.smith@company.com"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={ref.phone}
                        onChange={(e) =>
                          updateReference(ref.id, "phone", e.target.value)
                        }
                        placeholder="e.g., +1 (555) 123-4567"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-md shadow transition"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}
