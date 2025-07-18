import React from "react";

interface Step6Props {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const availability = ["Full-Time", "Part-Time", "Internships"];

const workingHours = ["Flexible", "9-5", "Weekends", "Evenings"];

export default function Step6AdditionalDetails({
  form,
  errors,
  handleChange,
}: Step6Props) {
  // Ensure availability is always an array
  const availabilityArray = Array.isArray(form.availability)
    ? form.availability
    : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">
          Available for Part-Time / Full-Time / Internships?
        </label>
        <div className="flex gap-4">
          {availability.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="availability"
                value={option}
                checked={availabilityArray.includes(option)}
                onChange={handleChange}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.availability && (
          <p className="text-red-600 text-sm">{errors.availability}</p>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="openToRelocation"
          checked={form.openToRelocation}
          onChange={handleChange}
        />
        Open to Relocation?
      </label>

      <select
        name="preferredWorkingHours"
        value={form.preferredWorkingHours}
        onChange={handleChange}
        className="w-full border rounded-[10px] p-2"
        required
      >
        <option value="">Preferred Working Hours</option>
        {workingHours.map((hours) => (
          <option key={hours} value={hours}>
            {hours}
          </option>
        ))}
      </select>
      {errors.preferredWorkingHours && (
        <p className="text-red-600 text-sm">{errors.preferredWorkingHours}</p>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="willingToBeContacted"
          checked={form.willingToBeContacted}
          onChange={handleChange}
        />
        Willing to be contacted for verified job listings?
      </label>
    </div>
  );
}
