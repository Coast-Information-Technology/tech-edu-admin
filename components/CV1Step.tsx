"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CVData } from "@/types/cv-layout";

const options = [
  {
    id: "student",
    label: "Student / No Experience",
    icon: "/icons/student.svg",
  },
  {
    id: "graduate",
    label: "Graduate / Entry-Level",
    icon: "/icons/graduate.svg",
  },
  {
    id: "experienced",
    label: "Experienced Professional",
    icon: "/icons/experienced.svg",
  },
  {
    id: "ngo",
    label: "NGO / Development Role",
    icon: "/icons/ngo.svg",
  },
  {
    id: "academic",
    label: "Academic / Research",
    icon: "/icons/academic.svg",
  },
];

interface CVStep1Props {
  data: CVData;
  setData: (data: CVData) => void;
  onContinue: () => void;
}

export default function CVStep1({ data, setData, onContinue }: CVStep1Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [newContactLabel, setNewContactLabel] = useState("");
  const [newContactValue, setNewContactValue] = useState("");

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addOtherContact = () => {
    if (newContactLabel && newContactValue) {
      setData({
        ...data,
        otherContacts: [
          ...(data.otherContacts || []),
          { label: newContactLabel, value: newContactValue },
        ],
      });
      setNewContactLabel("");
      setNewContactValue("");
    }
  };

  const removeOtherContact = (idx: number) => {
    setData({
      ...data,
      otherContacts: (data.otherContacts || []).filter((_, i) => i !== idx),
    });
  };

  const handleContinue = () => {
    if (selected) {
      setData({ ...data });
      onContinue();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-10 w-full">
      {/* Main Content */}
      <div className="flex-1">
        <h2 className="text-xs md:text-sm font-medium text-gray-600 mb-1">
          Step 1
        </h2>
        <h1 className="text-xl md:text-2xl font-bold mb-1">
          Choose Your CV Track
        </h1>
        <p className="text-sm text-gray-600 mb-4 md:mb-6">
          Select the type of CV that best fits you:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              aria-pressed={selected === option.id}
              className={cn(
                "relative group border-2 rounded-[8px] px-3 md:px-4 py-4 md:py-6 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200",
                selected === option.id
                  ? "border-blue-600 ring-1 ring-blue-300 bg-blue-50"
                  : "hover:border-gray-400 hover:bg-gray-50"
              )}
            >
              <div className="flex justify-center mb-2 md:mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110">
                <Image
                  src={option.icon}
                  alt={option.label + " icon"}
                  width={60}
                  height={60}
                  className="mx-auto md:w-20 md:h-20"
                />
              </div>

              <p className="text-sm md:text-base font-medium text-gray-800 leading-tight">
                {option.label}
              </p>
              <div className="absolute top-2 md:top-3 right-2 md:right-3 w-4 h-4 md:w-5 md:h-5 rounded-full border border-gray-400 flex items-center justify-center">
                {selected === option.id && (
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 md:mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selected}
            className={cn(
              "text-white px-4 md:px-6 py-2 md:py-3 rounded text-sm md:text-base font-medium transition-colors",
              selected && "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            )}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
