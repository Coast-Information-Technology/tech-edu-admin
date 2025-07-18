import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface StudentStep6GoalsProps {
  form: {
    goals: string;
    challenges: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function StudentStep6Goals({
  form,
  errors,
  handleChange,
}: StudentStep6GoalsProps) {
  return (
    <div className="space-y-4">
      <label className="block mb-1">
        What do you hope to achieve with this academic service?
      </label>
      <Textarea
        className="rounded-[10px]"
        name="goals"
        value={form.goals}
        onChange={handleChange}
        rows={3}
        placeholder="Describe your academic goals and what you hope to achieve..."
      />

      <label className="block mb-1">
        Any challenges you've been facing academically or career-wise?
      </label>
      <Textarea
        className="rounded-[10px]"
        name="challenges"
        value={form.challenges}
        onChange={handleChange}
        rows={3}
        placeholder="Describe any challenges or obstacles you're facing..."
      />
    </div>
  );
}
