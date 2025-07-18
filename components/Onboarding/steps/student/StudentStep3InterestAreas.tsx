import React from "react";

interface StudentStep3InterestAreasProps {
  form: {
    interestAreas: string[];
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

const interestOptions = [
  "Academic Transition Guidance",
  "Scholarship Coaching",
  "PhD Admission & Mentorship",
  "Thesis/Dissertation Review",
  "Master's Project Supervision",
  "Academic Research Publication Support",
  "General Mentoring",
  "CV/Resume Building",
  "Statement of Purpose/Proposal Help",
];

export default function StudentStep3InterestAreas({
  form,
  errors,
  handleChange,
  handleArrayChange,
}: StudentStep3InterestAreasProps) {
  // Ensure interestAreas is always an array
  const interestAreas = Array.isArray(form.interestAreas)
    ? form.interestAreas
    : [];

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleArrayChange) {
      // Use the array-specific handler
      handleArrayChange("interestAreas", e.target.value, e.target.checked);
    } else {
      // Fallback to regular handler
      handleChange(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-2 font-medium">Select your interest areas:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {interestOptions.map((interest) => (
          <label key={interest} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="interestAreas"
              value={interest}
              checked={interestAreas.includes(interest)}
              onChange={handleCheckboxChange}
            />
            {interest}
          </label>
        ))}
      </div>
      {errors.interestAreas && (
        <p className="text-red-600 text-sm">{errors.interestAreas}</p>
      )}
    </div>
  );
}
