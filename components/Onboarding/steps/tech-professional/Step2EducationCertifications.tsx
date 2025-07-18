import React from "react";
import { Input } from "@/components/ui/input";

interface Step2Props {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const qualifications = ["BSc", "MSc", "PhD", "Diploma", "HND", "Other"];

export default function Step2EducationCertifications({
  form,
  errors,
  handleChange,
}: Step2Props) {
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
        name="fieldOfStudy"
        placeholder="Field of Study"
        value={form.fieldOfStudy}
        onChange={handleChange}
        required
      />
      {errors.fieldOfStudy && (
        <p className="text-red-600 text-sm">{errors.fieldOfStudy}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="graduationYear"
        type="number"
        placeholder="Year of Graduation"
        value={form.graduationYear}
        onChange={handleChange}
        required
      />
      {errors.graduationYear && (
        <p className="text-red-600 text-sm">{errors.graduationYear}</p>
      )}

      <div>
        <label className="block mb-2 font-medium">
          Relevant Certifications (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "AWS",
            "PMP",
            "Google",
            "Microsoft",
            "Cisco",
            "Oracle",
            "Other",
          ].map((cert) => (
            <label key={cert} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="certifications"
                value={cert}
                checked={form.certifications.includes(cert)}
                onChange={handleChange}
              />
              {cert}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1">Upload Certifications (Optional)</label>
        <input
          type="file"
          name="uploadCertifications"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
