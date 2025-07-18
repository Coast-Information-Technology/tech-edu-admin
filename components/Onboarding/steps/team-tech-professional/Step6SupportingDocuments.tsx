import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, FileSpreadsheet } from "lucide-react";

interface Step6SupportingDocumentsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export function Step6SupportingDocuments({
  form,
  errors,
  handleChange,
}: Step6SupportingDocumentsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Supporting Documents</h4>
        <p className="text-sm text-blue-800">
          Upload supporting documents to help us better understand your team's
          needs and provide more targeted training recommendations. These
          documents are optional but highly recommended.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-[10px] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h5 className="font-medium text-gray-900">
                Company Introduction
              </h5>
              <p className="text-sm text-gray-600">
                Company overview and background
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label
                htmlFor="companyIntroUrl"
                className="text-sm font-medium text-gray-700"
              >
                Document URL
              </Label>
              <Input
                id="companyIntroUrl"
                name="companyIntroUrl"
                type="url"
                value={form.companyIntroUrl}
                onChange={handleChange}
                className="mt-1"
                placeholder="https://example.com/company-intro.pdf"
              />
            </div>

            <div className="text-xs text-gray-500">
              <p>Recommended formats: PDF, DOC, DOCX</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-[10px] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            <div>
              <h5 className="font-medium text-gray-900">Skill Matrix</h5>
              <p className="text-sm text-gray-600">Team skills assessment</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label
                htmlFor="skillMatrixUrl"
                className="text-sm font-medium text-gray-700"
              >
                Document URL
              </Label>
              <Input
                id="skillMatrixUrl"
                name="skillMatrixUrl"
                type="url"
                value={form.skillMatrixUrl}
                onChange={handleChange}
                className="mt-1"
                placeholder="https://example.com/skill-matrix.xlsx"
              />
            </div>

            <div className="text-xs text-gray-500">
              <p>Recommended formats: XLSX, XLS, CSV</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
        <h4 className="font-medium text-yellow-900 mb-2">
          Document Guidelines
        </h4>
        <div className="text-sm text-yellow-800 space-y-2">
          <p>
            <strong>Company Introduction should include:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Company mission and vision</li>
            <li>Current projects and technologies used</li>
            <li>Team structure and roles</li>
            <li>Challenges and areas for improvement</li>
          </ul>

          <p className="mt-3">
            <strong>Skill Matrix should include:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Individual team member skills assessment</li>
            <li>Proficiency levels (Beginner, Intermediate, Advanced)</li>
            <li>Areas requiring training or development</li>
            <li>Career goals and aspirations</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
        <h4 className="font-medium text-green-900 mb-2">
          Benefits of Providing Documents
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• More personalized training recommendations</li>
          <li>• Better understanding of team dynamics</li>
          <li>• Targeted skill development programs</li>
          <li>• Improved learning outcomes</li>
          <li>• Faster onboarding to training programs</li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-4">
        <h4 className="font-medium text-gray-900 mb-2">Privacy & Security</h4>
        <p className="text-sm text-gray-700">
          All uploaded documents are treated with strict confidentiality. They
          are only used for training program customization and will not be
          shared with third parties without your explicit consent.
        </p>
      </div>
    </div>
  );
}
