import React from "react";

interface StudentStep4DocumentsProps {
  form: {
    transcript: File | null;
    cvResume: File | null;
    statementOfPurpose: File | null;
    researchProposal: File | null;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function StudentStep4Documents({
  form,
  errors,
  handleChange,
}: StudentStep4DocumentsProps) {
  return (
    <div className="space-y-4">
      <div className="mb-2 font-medium">
        Upload supporting documents (optional):
      </div>

      <div>
        <label className="block mb-1">
          Academic Transcript or Result (PDF)
        </label>
        <input
          type="file"
          name="transcript"
          accept=".pdf"
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2"
        />
      </div>

      <div>
        <label className="block mb-1">CV/Resume (PDF or DOCX)</label>
        <input
          type="file"
          name="cvResume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2"
        />
      </div>

      <div>
        <label className="block mb-1">Statement of Purpose (if prepared)</label>
        <input
          type="file"
          name="statementOfPurpose"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2"
        />
      </div>

      <div>
        <label className="block mb-1">
          Research Proposal or Abstract (if applicable)
        </label>
        <input
          type="file"
          name="researchProposal"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2"
        />
      </div>
    </div>
  );
}
