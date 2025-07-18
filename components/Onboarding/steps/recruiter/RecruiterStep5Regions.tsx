import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RecruiterStep5RegionsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const hiringRegions = [
  "Africa",
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Australia",
  "Remote",
  "Local",
];

export default function RecruiterStep5Regions({
  form,
  errors,
  handleChange,
}: RecruiterStep5RegionsProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newRegions = checked
      ? [...form.hiringRegions, value]
      : form.hiringRegions.filter((region: string) => region !== value);

    handleChange({
      target: { name: "hiringRegions", value: newRegions },
    } as any);
  };

  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Hiring Regions</h3>
        <p className="text-sm text-gray-600">
          Select the regions where you typically hire from
        </p>
      </div> */}

      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Hiring Regions *</Label>
          <p className="text-sm text-gray-600 mt-1">
            Choose all regions where you're open to hiring candidates
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {hiringRegions.map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <Checkbox
                id={region}
                checked={form.hiringRegions.includes(region)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(region, checked as boolean)
                }
                className="rounded-[5px]"
              />
              <Label
                htmlFor={region}
                className="text-sm font-normal cursor-pointer"
              >
                {region}
              </Label>
            </div>
          ))}
        </div>

        {errors.hiringRegions && (
          <p className="text-red-500 text-sm">{errors.hiringRegions}</p>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-green-900 mb-2">
          Benefits of selecting regions:
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Access to candidates from your preferred regions</li>
          <li>• Region-specific job posting optimization</li>
          <li>• Local market insights and salary data</li>
          <li>• Timezone-friendly candidate matching</li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-yellow-900 mb-2">
          Remote Hiring Tips:
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Select "Remote" if you're open to remote workers</li>
          <li>• Consider timezone differences for collaboration</li>
          <li>• Remote candidates often have diverse skill sets</li>
          <li>• You can always adjust preferences later</li>
        </ul>
      </div>
    </div>
  );
}
