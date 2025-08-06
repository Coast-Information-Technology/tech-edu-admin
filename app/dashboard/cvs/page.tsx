"use client";

import { useRouter } from "next/navigation";

const templates = [
  {
    key: "classic",
    name: "Classic",
    description: "A clean, single-column modern layout.",
  },
  {
    key: "professional",
    name: "Professional",
    description: "A two-column professional layout with sidebar.",
  },
  // Add more templates as needed
];

export default function CVsPage() {
  const router = useRouter();

  const handleSelect = (templateKey: string) => {
    router.push(`/dashboard/cv-builder?template=${templateKey}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">CVs / Profiles</h1>
      <p className="mb-8">
        Select a CV/Resume layout to start building your professional profile.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <button
            key={tpl.key}
            onClick={() => handleSelect(tpl.key)}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-start hover:shadow-lg transition cursor-pointer text-left"
          >
            <div className="text-lg font-semibold mb-2">{tpl.name}</div>
            <div className="text-gray-500 text-sm mb-2">{tpl.description}</div>
            <span className="mt-auto text-blue-600 font-medium">Select</span>
          </button>
        ))}
      </div>
    </div>
  );
}
