import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecruiterStep4HiringFocusProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const recruitmentFocusAreas = [
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "AI Engineers",
  "Mobile Development",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "QA/Testing",
  "Product Management",
  "Other",
];

const hiringModels = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
];

export default function RecruiterStep4HiringFocus({
  form,
  errors,
  handleChange,
}: RecruiterStep4HiringFocusProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newFocusAreas = checked
      ? [...form.recruitmentFocusAreas, value]
      : form.recruitmentFocusAreas.filter((area: string) => area !== value);

    handleChange({
      target: { name: "recruitmentFocusAreas", value: newFocusAreas },
    } as any);
  };

  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Hiring Focus</h3>
        <p className="text-sm text-gray-600">
          Define your recruitment focus areas and preferred hiring model
        </p>
      </div> */}

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">
              Recruitment Focus Areas *
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Select the areas you typically recruit for
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {recruitmentFocusAreas.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={form.recruitmentFocusAreas.includes(area)}
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

          {errors.recruitmentFocusAreas && (
            <p className="text-red-500 text-sm">
              {errors.recruitmentFocusAreas}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="preferredHiringModel"
              className="text-base font-semibold"
            >
              Preferred Hiring Model *
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              What type of employment do you typically offer?
            </p>
          </div>

          <Select
            name="preferredHiringModel"
            value={form.preferredHiringModel}
            onValueChange={(value) =>
              handleChange({
                target: { name: "preferredHiringModel", value },
              } as any)
            }
          >
            <SelectTrigger
              className={
                errors.preferredHiringModel
                  ? "border-red-500"
                  : "rounded-[10px]"
              }
            >
              <SelectValue placeholder="Select hiring model" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white">
              {hiringModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model.charAt(0).toUpperCase() +
                    model.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.preferredHiringModel && (
            <p className="text-red-500 text-sm">
              {errors.preferredHiringModel}
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">How this helps us:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Match you with relevant candidates in your focus areas</li>
          <li>• Show you job posting templates for your hiring model</li>
          <li>• Provide industry-specific recruitment insights</li>
          <li>• Connect you with candidates who match your preferences</li>
        </ul>
      </div>
    </div>
  );
}
