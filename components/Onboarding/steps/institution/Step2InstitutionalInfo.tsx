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

interface Step2InstitutionalInfoProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const institutionTypes = [
  "university",
  "polytechnic",
  "college",
  "bootcamp",
  "training_center",
  "other",
];

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
  "United Kingdom",
  "Canada",
  "Other",
];

export default function Step2InstitutionalInfo({
  form,
  errors,
  handleChange,
}: Step2InstitutionalInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institutionName">Institution Name *</Label>
          <Input
            id="institutionName"
            name="institutionName"
            value={form.institutionName}
            onChange={handleChange}
            placeholder="e.g., Tech University of Lagos"
            className={
              errors.institutionName ? "border-red-500" : "rounded-[10px]"
            }
          />
          {errors.institutionName && (
            <p className="text-red-500 text-sm">{errors.institutionName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionType">Institution Type *</Label>
          <Select
            name="institutionType"
            value={form.institutionType}
            onValueChange={(value) =>
              handleChange({
                target: { name: "institutionType", value },
              } as any)
            }
          >
            <SelectTrigger
              className={
                errors.institutionType ? "border-red-500" : "rounded-[10px]"
              }
            >
              <SelectValue placeholder="Select institution type" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white">
              {institutionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.institutionType && (
            <p className="text-red-500 text-sm">{errors.institutionType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            name="country"
            value={form.country}
            onValueChange={(value) =>
              handleChange({ target: { name: "country", value } } as any)
            }
          >
            <SelectTrigger
              className={errors.country ? "border-red-500" : "rounded-[10px]"}
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateRegion">State/Region *</Label>
          <Input
            id="stateRegion"
            name="stateRegion"
            value={form.stateRegion}
            onChange={handleChange}
            placeholder="e.g., Lagos"
            className={errors.stateRegion ? "border-red-500" : "rounded-[10px]"}
          />
          {errors.stateRegion && (
            <p className="text-red-500 text-sm">{errors.stateRegion}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cityTown">City/Town *</Label>
          <Input
            id="cityTown"
            name="cityTown"
            value={form.cityTown}
            onChange={handleChange}
            placeholder="e.g., Victoria Island"
            className={errors.cityTown ? "border-red-500" : "rounded-[10px]"}
          />
          {errors.cityTown && (
            <p className="text-red-500 text-sm">{errors.cityTown}</p>
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

        <div className="space-y-2">
          <Label htmlFor="officialEmail">Official Email *</Label>
          <Input
            id="officialEmail"
            name="officialEmail"
            type="email"
            value={form.officialEmail}
            onChange={handleChange}
            placeholder="e.g., info@techuniversity.edu.ng"
            className={
              errors.officialEmail ? "border-red-500" : "rounded-[10px]"
            }
          />
          {errors.officialEmail && (
            <p className="text-red-500 text-sm">{errors.officialEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Official Website</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            value={form.websiteUrl}
            onChange={handleChange}
            placeholder="e.g., https://techuniversity.edu.ng"
            className="rounded-[10px]"
          />
        </div>
      </div>
    </div>
  );
}
