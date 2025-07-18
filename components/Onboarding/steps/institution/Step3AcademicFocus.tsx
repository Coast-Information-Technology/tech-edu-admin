import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Step3AcademicFocusProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const academicFocusAreas = [
  "AI",
  "Machine Learning",
  "Data Science",
  "Software Engineering",
  "Web Development",
  "Mobile Development",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Blockchain",
  "IoT",
  "Social Sciences",
  "Business",
  "Healthcare",
  "Finance",
  "Education",
  "Other",
];

export default function Step3AcademicFocus({
  form,
  errors,
  handleChange,
}: Step3AcademicFocusProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newInterests = checked
      ? [...form.interests, value]
      : form.interests.filter((interest: string) => interest !== value);

    handleChange({
      target: { name: "interests", value: newInterests },
    } as any);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">
            Academic Focus Areas *
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            Select the areas your institution focuses on or plans to focus on
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {academicFocusAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={area}
                checked={form.interests.includes(area)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(area, checked as boolean)
                }
                className="rounded-[5px]"
              />
              <Label
                htmlFor={area}
                className="text-sm font-normal cursor-pointer"
              >
                {area}
              </Label>
            </div>
          ))}
        </div>

        {errors.interests && (
          <p className="text-red-500 text-sm">{errors.interests}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">
            Student Upload Support
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            Will your institution support student profile uploads to our
            platform?
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="proceedWithUpload"
            name="proceedWithUpload"
            checked={form.proceedWithUpload}
            onCheckedChange={(checked) =>
              handleChange({
                target: {
                  name: "proceedWithUpload",
                  type: "checkbox",
                  checked,
                },
              } as any)
            }
            className="rounded-[5px]"
          />
          <Label
            htmlFor="proceedWithUpload"
            className="text-sm font-normal cursor-pointer"
          >
            Yes, we will support student profile uploads and management
          </Label>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">
          Benefits of Student Upload Support:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Streamlined student profile management</li>
          <li>• Automated scholarship and opportunity matching</li>
          <li>• Centralized tracking of student progress</li>
          <li>• Enhanced career placement opportunities</li>
        </ul>
      </div>
    </div>
  );
}
