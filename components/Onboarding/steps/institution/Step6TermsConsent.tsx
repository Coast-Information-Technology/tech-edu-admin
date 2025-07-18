import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Step6TermsConsentProps {
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
  "Search Engine",
  "Referral from Partner",
  "Email Campaign",
  "Conference/Event",
  "Direct Visit",
  "Other",
];

export default function Step6TermsConsent({
  form,
  errors,
  handleChange,
}: Step6TermsConsentProps) {
  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Terms & Consent</h3>
        <p className="text-sm text-gray-600">
          Please review and agree to our terms and conditions
        </p>
      </div> */}

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeToTerms"
              name="agreeToTerms"
              checked={form.agreeToTerms}
              onCheckedChange={(checked) =>
                handleChange({
                  target: { name: "agreeToTerms", type: "checkbox", checked },
                } as any)
              }
              className="mt-1 rounded-[5px]"
            />
            <div className="flex-1">
              <Label
                htmlFor="agreeToTerms"
                className="text-base font-medium cursor-pointer"
              >
                I agree to the Terms and Conditions *
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, you agree to our{" "}
                <Link
                  href="/terms-conditions"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                  target="_blank"
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

        <div className="space-y-4">
          <div>
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
                <SelectValue placeholder="Select referral source" />
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

          <div>
            <Label htmlFor="referralCodeOrName">
              Referral Code or Name (Optional)
            </Label>
            <Input
              id="referralCodeOrName"
              name="referralCodeOrName"
              value={form.referralCodeOrName}
              onChange={handleChange}
              placeholder="Enter referral code or name"
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
          <li>• Use of our platform in accordance with our terms</li>
          <li>• Collection and processing of institution and student data</li>
          <li>• Communication regarding platform updates and opportunities</li>
          <li>• Compliance with applicable laws and regulations</li>
          <li>
            • Sharing of student data for career opportunities (with consent)
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-[10px]">
        <p className="text-sm text-gray-700">
          <strong>Data Protection:</strong> We are committed to protecting your
          institution's and students' data. All data is encrypted, stored
          securely, and used only for the purposes outlined in our Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
