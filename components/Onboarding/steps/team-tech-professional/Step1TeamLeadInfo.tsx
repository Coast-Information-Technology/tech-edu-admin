import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Step1TeamLeadInfoProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export function Step1TeamLeadInfo({
  form,
  errors,
  handleChange,
}: Step1TeamLeadInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="teamLeadFullName"
            className="text-sm font-medium text-gray-700"
          >
            Team Lead Full Name *
          </Label>
          <Input
            id="teamLeadFullName"
            name="teamLeadFullName"
            type="text"
            value={form.teamLeadFullName}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamLeadFullName ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter team lead's full name"
          />
          {errors.teamLeadFullName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.teamLeadFullName}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="teamLeadEmail"
            className="text-sm font-medium text-gray-700"
          >
            Team Lead Email *
          </Label>
          <Input
            id="teamLeadEmail"
            name="teamLeadEmail"
            type="email"
            value={form.teamLeadEmail}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamLeadEmail ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter team lead's email"
          />
          {errors.teamLeadEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.teamLeadEmail}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="teamLeadPhoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Team Lead Phone Number *
          </Label>
          <Input
            id="teamLeadPhoneNumber"
            name="teamLeadPhoneNumber"
            type="tel"
            value={form.teamLeadPhoneNumber}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamLeadPhoneNumber ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="+2348012345678"
          />
          {errors.teamLeadPhoneNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.teamLeadPhoneNumber}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="jobTitle"
            className="text-sm font-medium text-gray-700"
          >
            Job Title *
          </Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={form.jobTitle}
            onChange={handleChange}
            className={`mt-1 ${
              errors.jobTitle ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., Lead Developer, Team Manager"
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="linkedInProfile"
            className="text-sm font-medium text-gray-700"
          >
            LinkedIn Profile
          </Label>
          <Input
            id="linkedInProfile"
            name="linkedInProfile"
            type="url"
            value={form.linkedInProfile}
            onChange={handleChange}
            className="mt-1 rounded-[10px]"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="alreadyVerifiedTechPro"
          name="alreadyVerifiedTechPro"
          checked={form.alreadyVerifiedTechPro}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: "alreadyVerifiedTechPro",
                type: "checkbox",
                checked: checked as boolean,
              },
            } as any;
            handleChange(event);
          }}
          className="rounded-[5px]"
        />
        <Label
          htmlFor="alreadyVerifiedTechPro"
          className="text-sm text-gray-700"
        >
          I am already a verified Tech Professional on this platform
        </Label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Team Lead Information
        </h4>
        <p className="text-sm text-blue-800">
          This information will be used to identify the primary contact person
          for your team. The team lead will be responsible for managing team
          activities and communications.
        </p>
      </div>
    </div>
  );
}
