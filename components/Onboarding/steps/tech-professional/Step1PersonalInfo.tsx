import React from "react";
import { Input } from "@/components/ui/input";

interface Step1Props {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const countries = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Other",
];

export default function Step1PersonalInfo({
  form,
  errors,
  handleChange,
}: Step1Props) {
  return (
    <div className="space-y-4">
      <Input
        className="rounded-[10px]"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        required
      />
      {errors.fullName && (
        <p className="text-red-600 text-sm">{errors.fullName}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="email"
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

      <Input
        className="rounded-[10px]"
        name="phoneNumber"
        placeholder="Phone Number"
        value={form.phoneNumber}
        onChange={handleChange}
        required
      />
      {errors.phoneNumber && (
        <p className="text-red-600 text-sm">{errors.phoneNumber}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="rounded-[10px] border p-2 w-full"
        >
          <option value="">Gender (Optional)</option>
          {genderOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <Input
          className="rounded-[10px]"
          name="dateOfBirth"
          type="date"
          placeholder="Date of Birth"
          value={form.dateOfBirth}
          onChange={handleChange}
        />
      </div>

      <select
        name="nationality"
        value={form.nationality}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Nationality</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {errors.nationality && (
        <p className="text-red-600 text-sm">{errors.nationality}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="currentLocation"
        placeholder="Current Location (City, Country)"
        value={form.currentLocation}
        onChange={handleChange}
        required
      />
      {errors.currentLocation && (
        <p className="text-red-600 text-sm">{errors.currentLocation}</p>
      )}

      <Input
        className="rounded-[10px]"
        name="linkedin"
        placeholder="LinkedIn Profile URL (Optional)"
        value={form.linkedin}
        onChange={handleChange}
      />

      <Input
        className="rounded-[10px]"
        name="github"
        placeholder="GitHub URL (Optional)"
        value={form.github}
        onChange={handleChange}
      />

      <Input
        className="rounded-[10px]"
        name="portfolioUrl"
        placeholder="Portfolio URL (Optional)"
        value={form.portfolioUrl}
        onChange={handleChange}
      />
    </div>
  );
}
