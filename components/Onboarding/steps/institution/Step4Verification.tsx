import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Shield } from "lucide-react";

interface Step4VerificationProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function Step4Verification({
  form,
  errors,
  handleChange,
}: Step4VerificationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Shield className="w-8 h-8 text-blue-700" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Document Verification
        </h3>
        <p className="text-sm text-gray-600">
          Please upload the required documents for verification and compliance
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="accreditationDocument"
              className="text-base font-semibold"
            >
              Accreditation Documents *
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Upload your institution's accreditation certificates, licenses, or
              regulatory approvals
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <Input
              id="accreditationDocument"
              name="accreditationDocument"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="hidden"
            />
            <Label htmlFor="accreditationDocument" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
            {form.accreditationDocument && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600">
                <FileText className="w-4 h-4" />
                {form.accreditationDocument.name}
              </div>
            )}
          </div>
          {errors.accreditationDocument && (
            <p className="text-red-500 text-sm">
              {errors.accreditationDocument}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="courseBrochure" className="text-base font-semibold">
              Compliance Documents
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Upload additional compliance documents, course brochures, or
              institutional policies
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <Input
              id="courseBrochure"
              name="courseBrochure"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="hidden"
            />
            <Label htmlFor="courseBrochure" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
            {form.courseBrochure && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600">
                <FileText className="w-4 h-4" />
                {form.courseBrochure.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-[10px] border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-2">
          Verification Process:
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Documents will be reviewed within 2-3 business days</li>
          <li>• You'll receive email confirmation once verified</li>
          <li>• Additional documents may be requested if needed</li>
          <li>
            • Verification is required before accessing full platform features
          </li>
        </ul>
      </div>
    </div>
  );
}
