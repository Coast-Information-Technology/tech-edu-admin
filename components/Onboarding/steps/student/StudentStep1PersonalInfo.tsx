import React from "react";
import { Input } from "@/components/ui/input";

interface StudentStep1PersonalInfoProps {
  form: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    countryOfResidence: string;
    preferredContactMethod: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const countries = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Australia",
  "Other",
];

export default function StudentStep1PersonalInfo({
  form,
  errors,
  handleChange,
}: StudentStep1PersonalInfoProps) {
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
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer_not_to_say">Prefer not to say</option>
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
        name="countryOfResidence"
        value={form.countryOfResidence}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Country of Residence</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {errors.countryOfResidence && (
        <p className="text-red-600 text-sm">{errors.countryOfResidence}</p>
      )}

      <select
        name="preferredContactMethod"
        value={form.preferredContactMethod}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Preferred Contact Method</option>
        <option value="phone">Phone</option>
        <option value="email">Email</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
      {errors.preferredContactMethod && (
        <p className="text-red-600 text-sm">{errors.preferredContactMethod}</p>
      )}
    </div>
  );
}
