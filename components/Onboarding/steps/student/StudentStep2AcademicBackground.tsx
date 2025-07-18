import React from "react";
import { Input } from "@/components/ui/input";

interface StudentStep2AcademicBackgroundProps {
  form: {
    highestQualification: string;
    currentInstitution: string;
    fieldOfStudy: string;
    academicLevel: string;
    graduationYear: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const qualifications = ["BSc", "MSc", "PhD", "Diploma", "Other"];

const academicLevels = [
  "Undergraduate Year 1",
  "Undergraduate Year 2",
  "Undergraduate Year 3",
  "Undergraduate Final Year",
  "Master's Year 1",
  "Master's Final Year",
  "PhD",
  "Other",
];

export default function StudentStep2AcademicBackground({
  form,
  errors,
  handleChange,
}: StudentStep2AcademicBackgroundProps) {
  return (
    <div className="space-y-4">
      <select
        name="highestQualification"
        value={form.highestQualification}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Highest Academic Qualification</option>
        {qualifications.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>
      {errors.highestQualification && (
        <p className="text-red-600 text-sm">{errors.highestQualification}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="currentInstitution"
        placeholder="Current Institution (if applicable)"
        value={form.currentInstitution}
        onChange={handleChange}
      />

      <Input
        className="rounded-[10px]"
        name="fieldOfStudy"
        placeholder="Field of Study / Department"
        value={form.fieldOfStudy}
        onChange={handleChange}
        required
      />
      {errors.fieldOfStudy && (
        <p className="text-red-600 text-sm">{errors.fieldOfStudy}</p>
      )}

      <select
        name="academicLevel"
        value={form.academicLevel}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Academic Level</option>
        {academicLevels.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      {errors.academicLevel && (
        <p className="text-red-600 text-sm">{errors.academicLevel}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="graduationYear"
        placeholder="Graduation Year (Expected or Completed)"
        value={form.graduationYear}
        onChange={handleChange}
        required
      />
      {errors.graduationYear && (
        <p className="text-red-600 text-sm">{errors.graduationYear}</p>
      )}
    </div>
  );
}
