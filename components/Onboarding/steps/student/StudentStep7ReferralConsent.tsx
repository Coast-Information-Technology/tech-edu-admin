import React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface StudentStep7ReferralConsentProps {
  form: {
    referralSource: string;
    referralCodeOrName: string;
    consentToStoreInfo: boolean;
    agreeToTerms: boolean;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const referralSources = [
  "Social Media",
  "Referral",
  "Institution",
  "Ad",
  "Other",
];

export default function StudentStep7ReferralConsent({
  form,
  errors,
  handleChange,
}: StudentStep7ReferralConsentProps) {
  return (
    <div className="space-y-4">
      <select
        name="referralSource"
        value={form.referralSource}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">How did you hear about us?</option>
        {referralSources.map((src) => (
          <option key={src} value={src}>
            {src}
          </option>
        ))}
      </select>

      <Input
        className="rounded-[10px]"
        name="referralCodeOrName"
        placeholder="Referral Code or Name (if any)"
        value={form.referralCodeOrName}
        onChange={handleChange}
      />

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="consentToStoreInfo"
          checked={form.consentToStoreInfo}
          onChange={handleChange}
          required
        />
        <span>
          I consent to Tech Edu Solution storing and using this information to
          provide academic services
        </span>
      </label>
      {errors.consentToStoreInfo && (
        <p className="text-red-600 text-sm">{errors.consentToStoreInfo}</p>
      )}

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={form.agreeToTerms}
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
      {errors.agreeToTerms && (
        <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>
      )}
    </div>
  );
}
