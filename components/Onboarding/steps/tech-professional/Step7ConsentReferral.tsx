import React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Step7Props {
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
  "Friend",
  "Referral",
  "Tech Event",
  "Google Search",
  "LinkedIn",
  "GitHub",
  "Other",
];

export default function Step7ConsentReferral({
  form,
  errors,
  handleChange,
}: Step7Props) {
  return (
    <div className="space-y-4">
      <select
        name="referralSource"
        value={form.referralSource}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">How Did You Hear About Us?</option>
        {referralSources.map((src) => (
          <option key={src} value={src}>
            {src}
          </option>
        ))}
      </select>
      {errors.referralSource && (
        <p className="text-red-600 text-sm">{errors.referralSource}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="referralCodeOrName"
        placeholder="Referral Code (Optional)"
        value={form.referralCodeOrName}
        onChange={handleChange}
      />

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="consentToTerms"
          checked={form.consentToTerms}
          onChange={handleChange}
          required
        />
        <span>
          Agree to{" "}
          <Link href="/terms" className="underline text-[#011F72]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline text-[#011F72]">
            Privacy Policy
          </Link>
        </span>
      </label>
      {errors.consentToTerms && (
        <p className="text-red-600 text-sm">{errors.consentToTerms}</p>
      )}

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="subscribeToAlerts"
          checked={form.subscribeToAlerts}
          onChange={handleChange}
        />
        <span>Subscribe to Job Alerts & Newsletters (Optional)</span>
      </label>
    </div>
  );
}
