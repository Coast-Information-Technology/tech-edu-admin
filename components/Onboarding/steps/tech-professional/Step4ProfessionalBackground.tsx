import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step4Props {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const industryFocus = [
  "Fintech",
  "Healthtech",
  "E-commerce",
  "Edtech",
  "SaaS",
  "Gaming",
  "AI/ML",
  "IoT",
  "Blockchain",
  "Technology",
  "Other",
];

const employmentStatus = [
  "Employed",
  "Freelancing",
  "Job-seeking",
  "Student",
  "Entrepreneur",
  "Other",
];

// Mock file upload function - replace with actual upload logic
const uploadFile = async (file: File): Promise<string> => {
  // This is a placeholder - you'll need to implement actual file upload
  // For now, we'll return a mock URL
  return `https://files.example.com/${file.name}`;
};

export default function Step4ProfessionalBackground({
  form,
  errors,
  handleChange,
}: Step4Props) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        const fileUrl = await uploadFile(files[0]);
        // Create a synthetic event to update the form
        const syntheticEvent = {
          target: {
            name: name,
            value: fileUrl,
          },
        } as any;
        handleChange(syntheticEvent);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="currentJobTitle"
          className="text-sm font-medium text-gray-700"
        >
          Current Job Title/Role *
        </Label>
        <Input
          id="currentJobTitle"
          className="rounded-[10px] mt-1"
          name="currentJobTitle"
          placeholder="e.g., Senior Frontend Developer"
          value={form.currentJobTitle}
          onChange={handleChange}
          required
        />
        {errors.currentJobTitle && (
          <p className="text-red-600 text-sm mt-1">{errors.currentJobTitle}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="yearsOfExperience"
          className="text-sm font-medium text-gray-700"
        >
          Years of Experience *
        </Label>
        <Input
          id="yearsOfExperience"
          className="rounded-[10px] mt-1"
          name="yearsOfExperience"
          type="number"
          min="0"
          max="50"
          placeholder="e.g., 5"
          value={form.yearsOfExperience}
          onChange={handleChange}
          required
        />
        {errors.yearsOfExperience && (
          <p className="text-red-600 text-sm mt-1">
            {errors.yearsOfExperience}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="industryFocus"
          className="text-sm font-medium text-gray-700"
        >
          Industry Focus *
        </Label>
        <select
          id="industryFocus"
          name="industryFocus"
          value={form.industryFocus}
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2 mt-1"
          required
        >
          <option value="">Select industry focus</option>
          {industryFocus.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industryFocus && (
          <p className="text-red-600 text-sm mt-1">{errors.industryFocus}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="employmentStatus"
          className="text-sm font-medium text-gray-700"
        >
          Current Employment Status *
        </Label>
        <select
          id="employmentStatus"
          name="employmentStatus"
          value={form.employmentStatus}
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2 mt-1"
          required
        >
          <option value="">Select employment status</option>
          {employmentStatus.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.employmentStatus && (
          <p className="text-red-600 text-sm mt-1">{errors.employmentStatus}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remoteWorkExperience"
          name="remoteWorkExperience"
          checked={form.remoteWorkExperience}
          onChange={handleChange}
          className="rounded"
        />
        <Label htmlFor="remoteWorkExperience" className="text-sm text-gray-700">
          I have remote work experience
        </Label>
      </div>

      <div>
        <Label
          htmlFor="uploadCvResume"
          className="text-sm font-medium text-gray-700"
        >
          Upload CV/Resume (PDF or DOCX) *
        </Label>
        <Input
          id="uploadCvResume"
          type="file"
          name="uploadCvResume"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mt-1 rounded-[10px]"
          required
        />
        {form.uploadCvResume && (
          <p className="text-green-600 text-sm mt-1">
            ✓ File uploaded: {form.uploadCvResume.split("/").pop()}
          </p>
        )}
        {errors.uploadCvResume && (
          <p className="text-red-600 text-sm mt-1">{errors.uploadCvResume}</p>
        )}
      </div>

      {/* <div>
        <Label
          htmlFor="uploadPortfolio"
          className="text-sm font-medium text-gray-700"
        >
          Upload Portfolio/Project Links (Optional)
        </Label>
        <Input
          id="uploadPortfolio"
          type="file"
          name="uploadPortfolio"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mt-1"
        />
        {form.uploadPortfolio && (
          <p className="text-green-600 text-sm mt-1">
            ✓ File uploaded: {form.uploadPortfolio.split("/").pop()}
          </p>
        )}
      </div> */}
    </div>
  );
}
