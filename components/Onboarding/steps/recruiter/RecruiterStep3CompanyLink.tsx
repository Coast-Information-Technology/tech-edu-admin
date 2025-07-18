import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecruiterStep3CompanyLinkProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const industries = [
  "Technology",
  "Fintech",
  "Healthtech",
  "E-commerce",
  "Edtech",
  "SaaS",
  "Gaming",
  "AI/ML",
  "IoT",
  "Blockchain",
  "Consulting",
  "Manufacturing",
  "Other",
];

export default function RecruiterStep3CompanyLink({
  form,
  errors,
  handleChange,
}: RecruiterStep3CompanyLinkProps) {
  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Company Information
        </h3>
        <p className="text-sm text-gray-600">
          Tell us about your company and link it to your recruitment account
        </p>
      </div> */}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g., Tech Solutions Ltd"
            className={errors.companyName ? "border-red-500" : "rounded-[10px]"}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select
            name="industry"
            value={form.industry}
            onValueChange={(value) =>
              handleChange({ target: { name: "industry", value } } as any)
            }
          >
            <SelectTrigger
              className={errors.industry ? "border-red-500" : "rounded-[10px]"}
            >
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-red-500 text-sm">{errors.industry}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rcNumber">RC Number</Label>
          <Input
            id="rcNumber"
            name="rcNumber"
            value={form.rcNumber}
            onChange={handleChange}
            placeholder="e.g., RC123456"
            className="rounded-[10px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="e.g., https://techsolutions.com"
            className="rounded-[10px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyId">Company ID (Optional)</Label>
          <Input
            id="companyId"
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            placeholder="e.g., 507f1f77bcf86cd799439011"
            className="rounded-[10px]"
          />
          <p className="text-xs text-gray-500">
            If your company is already registered on our platform
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-green-900 mb-2">
          Benefits of linking your company:
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Access to company-specific analytics and reports</li>
          <li>• Team collaboration features for multiple recruiters</li>
          <li>• Branded job postings with company logo</li>
          <li>• Centralized candidate management</li>
        </ul>
      </div>
    </div>
  );
}
