import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecruiterStep2DetailsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function RecruiterStep2Details({
  form,
  errors,
  handleChange,
}: RecruiterStep2DetailsProps) {
  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Recruiter Details
        </h3>
        <p className="text-sm text-gray-600">
          Tell us about yourself and your role in the company
        </p>
      </div> */}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="recruitingName">Full Name *</Label>
          <Input
            id="recruitingName"
            name="recruitingName"
            value={form.recruitingName}
            onChange={handleChange}
            placeholder="e.g., Sarah Johnson"
            className={
              errors.recruitingName ? "border-red-500" : "rounded-[10px]"
            }
          />
          {errors.recruitingName && (
            <p className="text-red-500 text-sm">{errors.recruitingName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="positionAtCompany">Position at Company *</Label>
          <Input
            id="positionAtCompany"
            name="positionAtCompany"
            value={form.positionAtCompany}
            onChange={handleChange}
            placeholder="e.g., Talent Lead, HR Manager"
            className={
              errors.positionAtCompany ? "border-red-500" : "rounded-[10px]"
            }
          />
          {errors.positionAtCompany && (
            <p className="text-red-500 text-sm">{errors.positionAtCompany}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="e.g., sarah.johnson@company.com"
            className={
              errors.contactEmail ? "border-red-500" : "rounded-[10px]"
            }
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-sm">{errors.contactEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="e.g., +2348012345678"
            className={errors.phoneNumber ? "border-red-500" : "rounded-[10px]"}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">
          Why we need this information:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• To personalize your recruitment experience</li>
          <li>• For direct communication about candidates and opportunities</li>
          <li>• To provide account support and updates</li>
          <li>• For verification and security purposes</li>
        </ul>
      </div>
    </div>
  );
}
