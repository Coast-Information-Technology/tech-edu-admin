import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step5Props {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const platformGoals = [
  "Access Online Training",
  "Get Recruited (Career Connect)",
  "Collaborate on Projects",
  "Become an Instructor",
  "Build Portfolio",
  "Get Mentored",
  "Get a remote job",
  "Upskill",
];

const jobTypes = ["Remote", "Hybrid", "Onsite"];

const currencies = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
];

const salaryPeriods = ["per year"];

export default function Step5CareerGoals({
  form,
  errors,
  handleChange,
}: Step5Props) {
  // Ensure platformGoals is always an array
  const platformGoalsArray = Array.isArray(form.platformGoals)
    ? form.platformGoals
    : [];

  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [selectedPeriod, setSelectedPeriod] = useState("per year");
  const [salaryAmount, setSalaryAmount] = useState("");

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : "₦";
  };

  // Handle salary input change
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    setSalaryAmount(value);

    // Format the complete salary expectation
    const formattedSalary = value
      ? `${getCurrencySymbol(selectedCurrency)}${value} ${selectedPeriod}`
      : "";

    // Create synthetic event to update form
    const syntheticEvent = {
      target: {
        name: "salaryExpectation",
        value: formattedSalary,
      },
    } as any;
    handleChange(syntheticEvent);
  };

  // Handle currency change
  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    if (salaryAmount) {
      const formattedSalary = `${getCurrencySymbol(
        currencyCode
      )}${salaryAmount} ${selectedPeriod}`;
      const syntheticEvent = {
        target: {
          name: "salaryExpectation",
          value: formattedSalary,
        },
      } as any;
      handleChange(syntheticEvent);
    }
  };

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (salaryAmount) {
      const formattedSalary = `${getCurrencySymbol(
        selectedCurrency
      )}${salaryAmount} ${period}`;
      const syntheticEvent = {
        target: {
          name: "salaryExpectation",
          value: formattedSalary,
        },
      } as any;
      handleChange(syntheticEvent);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-3 font-medium text-gray-700">
          What are you looking to achieve here? *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {platformGoals.map((goal) => (
            <label
              key={goal}
              className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50"
            >
              <input
                type="checkbox"
                name="platformGoals"
                value={goal}
                checked={platformGoalsArray.includes(goal)}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">{goal}</span>
            </label>
          ))}
        </div>
        {errors.platformGoals && (
          <p className="text-red-600 text-sm mt-1">{errors.platformGoals}</p>
        )}
      </div>

      <div className="flex items-center space-x-2 p-3 border rounded-[10px]">
        <input
          type="checkbox"
          id="interestedInTechAssessment"
          name="interestedInTechAssessment"
          checked={form.interestedInTechAssessment || false}
          onChange={handleChange}
          className="rounded"
        />
        <Label
          htmlFor="interestedInTechAssessment"
          className="text-sm text-gray-700"
        >
          I'm interested in taking tech assessments to showcase my skills
        </Label>
      </div>

      <div>
        <Label
          htmlFor="jobTypePreference"
          className="text-sm font-medium text-gray-700"
        >
          Preferred Job Type *
        </Label>
        <select
          id="jobTypePreference"
          name="jobTypePreference"
          value={form.jobTypePreference || ""}
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2 mt-1"
          required
        >
          <option value="">Select preferred job type</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.jobTypePreference && (
          <p className="text-red-600 text-sm mt-1">
            {errors.jobTypePreference}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Salary Expectations (Optional)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-gray-600 mb-1 block">Currency</Label>
            <Select
              value={selectedCurrency}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="rounded-[10px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] bg-white">
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-1 block">Amount</Label>
            <Input
              className="rounded-[10px]"
              placeholder="e.g., 5000000"
              value={salaryAmount}
              onChange={handleSalaryChange}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-1 block">Period</Label>
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="rounded-[10px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] bg-white">
                {salaryPeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {form.salaryExpectation && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-[10px]">
            <p className="text-sm text-green-800">
              <strong>Formatted:</strong> {form.salaryExpectation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
