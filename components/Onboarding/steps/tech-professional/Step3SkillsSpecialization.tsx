import React from "react";
import { Input } from "@/components/ui/input";

interface Step3SkillsSpecializationProps {
  form: {
    primarySpecialization: string;
    programmingLanguages: string[];
    frameworksAndTools: string[];
    softSkills: string[];
    preferredTechStack: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleArrayChange?: (
    fieldName: string,
    value: string,
    checked: boolean
  ) => void;
}

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

const programmingLanguagesOptions = [
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

const softSkillsOptions = [
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

export default function Step3SkillsSpecialization({
  form,
  errors,
  handleChange,
  handleArrayChange,
}: Step3SkillsSpecializationProps) {
  // Ensure arrays are always arrays
  const programmingLanguages = Array.isArray(form.programmingLanguages)
    ? form.programmingLanguages
    : [];
  const frameworksAndTools = Array.isArray(form.frameworksAndTools)
    ? form.frameworksAndTools
    : [];
  const softSkills = Array.isArray(form.softSkills) ? form.softSkills : [];

  const handleCheckboxChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handleArrayChange) {
        // Use the array-specific handler
        handleArrayChange(fieldName, e.target.value, e.target.checked);
      } else {
        // Fallback to regular handler
        handleChange(e);
      }
    };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Primary Specialization *
        </label>
        <select
          name="primarySpecialization"
          value={form.primarySpecialization}
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2"
          required
        >
          <option value="">Select your primary specialization</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        {errors.primarySpecialization && (
          <p className="text-red-600 text-sm mt-1">
            {errors.primarySpecialization}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Programming Languages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {programmingLanguagesOptions.map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="programmingLanguages"
                value={lang}
                checked={programmingLanguages.includes(lang)}
                onChange={handleCheckboxChange("programmingLanguages")}
              />
              {lang}
            </label>
          ))}
        </div>
        {errors.programmingLanguages && (
          <p className="text-red-600 text-sm mt-1">
            {errors.programmingLanguages}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Frameworks & Tools
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[...frameworksLibraries, ...toolsPlatforms].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="frameworksAndTools"
                value={item}
                checked={frameworksAndTools.includes(item)}
                onChange={handleCheckboxChange("frameworksAndTools")}
              />
              {item}
            </label>
          ))}
        </div>
        {errors.frameworksAndTools && (
          <p className="text-red-600 text-sm mt-1">
            {errors.frameworksAndTools}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Soft Skills</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {softSkillsOptions.map((skill) => (
            <label key={skill} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="softSkills"
                value={skill}
                checked={softSkills.includes(skill)}
                onChange={handleCheckboxChange("softSkills")}
              />
              {skill}
            </label>
          ))}
        </div>
        {errors.softSkills && (
          <p className="text-red-600 text-sm mt-1">{errors.softSkills}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Preferred Tech Stack
        </label>
        <textarea
          name="preferredTechStack"
          value={form.preferredTechStack}
          onChange={handleChange}
          placeholder="Describe your preferred technology stack or any specific technologies you'd like to work with..."
          className="w-full border rounded-[10px] p-2 h-20"
        />
        {errors.preferredTechStack && (
          <p className="text-red-600 text-sm mt-1">
            {errors.preferredTechStack}
          </p>
        )}
      </div>
    </div>
  );
}
