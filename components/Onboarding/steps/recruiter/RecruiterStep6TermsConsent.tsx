import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface RecruiterStep6TermsConsentProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const referralSources = [
  "Social Media",
  "Google Search",
  "Referral",
  "Advertisement",
  "Event/Conference",
  "Direct",
  "Other",
];

export default function RecruiterStep6TermsConsent({
  form,
  errors,
  handleChange,
}: RecruiterStep6TermsConsentProps) {
  const handleCheckboxChange = (checked: boolean) => {
    handleChange({
      target: { name: "agreeToTerms", value: checked },
    } as any);
  };

  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Terms & Consent</h3>
        <p className="text-sm text-gray-600">
          Review and agree to our terms and conditions
        </p>
      </div> */}

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={form.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              className="mt-1 rounded-[5px]"
            />
            <div className="space-y-2">
              <Label
                htmlFor="agreeToTerms"
                className="text-sm font-normal cursor-pointer"
              >
                I agree to the Terms and Conditions *
              </Label>
              <p className="text-xs text-gray-600">
                By checking this box, you agree to our{" "}
                <Link
                  href="/terms-conditions"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {errors.agreeToTerms && (
            <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="referralSource">How did you hear about us?</Label>
            <Select
              name="referralSource"
              value={form.referralSource}
              onValueChange={(value) =>
                handleChange({
                  target: { name: "referralSource", value },
                } as any)
              }
            >
              <SelectTrigger className="rounded-[10px]">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] bg-white">
                {referralSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCodeOrName">
              Referral Code or Name (Optional)
            </Label>
            <Input
              id="referralCodeOrName"
              name="referralCodeOrName"
              value={form.referralCodeOrName}
              onChange={handleChange}
              placeholder="e.g., REF123 or John Doe"
              className="rounded-[10px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">
          What you're agreeing to:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use of our recruitment platform in accordance with our policies
          </li>
          <li>• Respect for candidate privacy and data protection</li>
          <li>• Fair and non-discriminatory hiring practices</li>
          <li>• Accurate representation of job opportunities</li>
          <li>• Compliance with applicable labor laws and regulations</li>
        </ul>
      </div>

      <div className="bg-green-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-green-900 mb-2">
          Your rights and protections:
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Secure handling of your company and personal information</li>
          <li>• Access to comprehensive recruitment tools and analytics</li>
          <li>• Support from our recruitment specialists</li>
          <li>• Ability to modify preferences and settings anytime</li>
        </ul>
      </div>
    </div>
  );
}
