import React from "react";

interface StudentStep5AvailabilityProps {
  form: {
    preferredDays: string[];
    preferredTimeSlots: string[];
    timeZone: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleArrayChange?: (
    fieldName: string,
    value: string,
    checked: boolean
  ) => void;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const preferredTimeSlots = ["Morning", "Afternoon", "Evening"];

const timeZones = [
  "Africa/Lagos (GMT+1)",
  "UTC (GMT+0)",
  "America/New_York (GMT-5)",
  "Europe/London (GMT+0)",
  "Asia/Kolkata (GMT+5:30)",
  "Other",
];

export default function StudentStep5Availability({
  form,
  errors,
  handleChange,
  handleArrayChange,
}: StudentStep5AvailabilityProps) {
  // Ensure arrays are always arrays
  const preferredDays = Array.isArray(form.preferredDays)
    ? form.preferredDays
    : [];
  const preferredTimeSlots = Array.isArray(form.preferredTimeSlots)
    ? form.preferredTimeSlots
    : [];

  const handleCheckboxChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handleArrayChange) {
        // Use the array-specific handler
        handleArrayChange(fieldName, e.target.value, e.target.checked);
      } else {
        // Fallback to regular handler
        handleChange(e);
      }
    };

  return (
    <div className="space-y-4">
      <div className="mb-2 font-medium">Preferred Day(s) for Consultation:</div>
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day) => (
          <label key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="preferredDays"
              value={day}
              checked={preferredDays.includes(day)}
              onChange={handleCheckboxChange("preferredDays")}
            />
            {day}
          </label>
        ))}
      </div>

      <div className="mb-2 font-medium">Preferred Time Slots:</div>
      <div className="flex gap-4">
        {preferredTimeSlots.map((slot) => (
          <label key={slot} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="preferredTimeSlots"
              value={slot}
              checked={preferredTimeSlots.includes(slot)}
              onChange={handleCheckboxChange("preferredTimeSlots")}
            />
            {slot}
          </label>
        ))}
      </div>

      <select
        name="timeZone"
        value={form.timeZone}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Time Zone</option>
        {timeZones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
    </div>
  );
}
