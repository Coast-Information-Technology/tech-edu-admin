"use client";

import CVPreview from "@/components/CVPreview";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CVStep1 from "@/components/CV1Step";
import CVStep4 from "@/components/CV4Step";
import CVStep5 from "@/components/CV5Step";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegCircleXmark } from "react-icons/fa6";
import CVStep2 from "@/components/CVSteps/CV2Step";
import CVStep3 from "@/components/CVSteps/CV3Step";

const steps = [
  {
    id: 1,
    title: "Choose Your CV Track",
    description: "Select your background",
  },
  { id: 2, title: "Choose Your Layout", description: "Pick a format" },
  {
    id: 3,
    title: "Add Your Basic Info",
    description: "Enter personal details",
  },
  {
    id: 4,
    title: "Fill in Key Sections",
    description: "Education, skills, experience",
  },
  { id: 5, title: "Review & Export", description: "Preview and download" },
];

const page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    layout: "cv_1",
    name: "",
    email: "",
    phone: "",
    cvTrack: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    references: [],
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#60a5fa",
    },
    font: "inter",
    spacingValue: 1.0,
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cv-builder-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const structuredData = {
          layout: parsed.data?.layout || "cv_1",
          name: parsed.data?.name || "",
          email: parsed.data?.email || "",
          phone: parsed.data?.phone || "",
          cvTrack: parsed.data?.cvTrack || "",
          experience: Array.isArray(parsed.data?.experience)
            ? parsed.data.experience
            : [],
          education: Array.isArray(parsed.data?.education)
            ? parsed.data.education
            : [],
          skills: Array.isArray(parsed.data?.skills) ? parsed.data.skills : [],
          projects: Array.isArray(parsed.data?.projects)
            ? parsed.data.projects
            : [],
          references: Array.isArray(parsed.data?.references)
            ? parsed.data.references
            : [],
          colors: parsed.data?.colors || {
            primary: "#1e40af",
            secondary: "#3b82f6",
            accent: "#60a5fa",
          },
          font: parsed.data?.font || "inter",
          spacingValue: parsed.data?.spacingValue || 1.0,
        };
        setFormData(structuredData);
        setCurrentStep(parsed.step || 1);
      } catch (error) {
        console.error("Error parsing saved CV data:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Current formData:", formData);
    console.log("Current layout:", formData.layout);

    localStorage.setItem(
      "cv-builder-data",
      JSON.stringify({ data: formData, step: currentStep })
    );
  }, [formData, currentStep]);

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CVStep1
            data={formData}
            setData={setFormData}
            onContinue={() => goToStep(2)}
          />
        );
      case 2:
        return (
          <CVStep2
            data={formData}
            setData={setFormData}
            onContinue={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        );
      case 3:
        return (
          <CVStep3
            data={formData}
            setData={setFormData}
            onContinue={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        );
      case 4:
        return (
          <CVStep4
            data={formData}
            setData={setFormData}
            onContinue={() => goToStep(5)}
            onBack={() => goToStep(3)}
          />
        );
      case 5:
        return (
          <CVStep5
            data={formData}
            setData={setFormData}
            onContinue={() => {}}
            onBack={() => goToStep(4)}
          />
        );
      default:
        return null;
    }
  };

  const plans = ["Free", "Pro"];
  const features = [
    {
      name: "Create & Preview CV",
      availability: [true, true],
    },
    {
      name: "Export as PDF",
      availability: [false, true],
    },
    {
      name: "Share Public Link",
      availability: [true, true],
    },
    {
      name: "Coach Feedback",
      availability: [false, true],
    },
    {
      name: "Add CareerConnect Verification Badge",
      availability: [false, true],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mx-auto px-4 md:px-16 pt-24 pb-16 flex flex-col items-center justify-center text-center bg-[#011F72] h-full w-full md:h-[80vh]">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center pb-4">
          Let's Build Your CV — One Step at a Time
        </h1>
        <p className="text-lg text-gray-200 font-medium max-w-[70vw] mx-auto mt-4">
          Answer a few quick prompts and let our builder assemble a
          recruiter-ready CV. Whether you're a student, graduate, or jobseeker —
          this is your launchpad.
        </p>
        <Link
          href="#wizard"
          className="mt-6 bg-white text-[#011F72] hover:bg-blue-700 hover:text-white px-6 py-3 rounded-[10px] font-semibold transition"
        >
          Begin CV Builder Wizard
        </Link>
      </header>

      <section id="wizard" className="bg-white py-8 md:py-16 px-4 md:px-12">
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold uppercase text-outline text-white text-center mb-8 md:mb-12">
          CV Builder Steps
        </h2>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* Sidebar Stepper */}
          <aside className="w-full lg:w-1/4 xl:w-1/5 px-2 border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:sticky lg:top-24 lg:self-start lg:h-fit">
            <ol
              className="space-y-4 md:space-y-6"
              aria-label="CV Builder Progress"
            >
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = step.id < currentStep;

                return (
                  <li key={step.id} className="flex items-start gap-3 md:gap-4">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 text-xs md:text-sm font-bold transition flex-shrink-0
                        ${
                          isActive
                            ? "bg-blue-600 text-white border-blue-600"
                            : isCompleted
                            ? "bg-green-600 text-white border-green-600"
                            : "text-gray-500 border-gray-400"
                        }`}
                    >
                      {step.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs md:text-sm font-medium ${
                          isActive ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Toggle Preview on mobile */}
            <div className="mt-6 lg:mt-10 block lg:hidden">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full text-center bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium text-sm"
              >
                {showPreview ? "Hide" : "Show"} CV Preview
              </button>
            </div>
          </aside>

          {/* Main Wizard Content + Preview */}
          <div className="flex-1 min-h-[400px] md:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepComponent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CV Preview (hidden on mobile unless toggled) */}
          {currentStep > 2 && (
            <aside
              className={`w-full lg:w-[40%] ${
                showPreview ? "block" : "hidden lg:block"
              }`}
            >
              <div className="lg:sticky lg:top-24">
                <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-md max-h-[60vh] lg:max-h-[80vh] overflow-y-auto hide-custom-scrollbar">
                  <CVPreview data={formData} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      <section
        aria-labelledby="compare-plans-heading"
        className="max-w-5xl mx-auto px-4 py-12 md:py-20"
      >
        <h2
          id="compare-plans-heading"
          className="text-2xl md:text-3xl lg:text-5xl font-extrabold uppercase text-outline text-white text-center pb-8 md:pb-12"
        >
          Compare Plans
        </h2>

        <div className="overflow-x-auto">
          <table
            className="min-w-full text-xs md:text-sm text-left"
            aria-describedby="pricing-comparison"
          >
            <caption className="sr-only">Pricing plan comparison</caption>
            <thead className="text-black">
              <tr>
                <th
                  scope="col"
                  className="py-2 pr-2 md:pr-4 text-sm md:text-lg lg:text-xl font-semibold"
                >
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan}
                    scope="col"
                    className="py-2 px-2 md:px-4 text-sm md:text-lg lg:text-xl font-semibold text-center"
                  >
                    {plan}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {features.map((feature, index) => (
                <tr key={feature.name} className="border-t-2 border-gray-200">
                  <th
                    scope="row"
                    className="py-2 md:py-3 pr-2 md:pr-4 font-medium text-xs md:text-sm lg:text-base text-gray-800 whitespace-nowrap"
                  >
                    {feature.name}
                  </th>
                  {feature.availability.map((value, idx) => (
                    <td
                      key={idx}
                      className="py-2 md:py-3 px-2 md:px-4 text-center"
                      aria-label={`${plans[idx]} ${feature.name}`}
                    >
                      {typeof value === "boolean" ? (
                        value ? (
                          <IoMdCheckmarkCircleOutline
                            size={24}
                            className="mx-auto text-green-600 md:w-8 md:h-8 lg:w-9 lg:h-9"
                            aria-hidden="true"
                          />
                        ) : (
                          <FaRegCircleXmark
                            size={20}
                            className="mx-auto text-red-600 md:w-7 md:h-7 lg:w-8 lg:h-8"
                            aria-hidden="true"
                          />
                        )
                      ) : (
                        <span className="text-xs md:text-sm font-medium">
                          {value}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 md:mt-8 text-center flex flex-col sm:flex-row justify-center gap-3 md:gap-6">
          <Link
            href="#"
            className="inline-block text-[#011F72] bg-gray-200 font-medium hover:bg-gray-300 px-4 md:px-6 py-2 md:py-3 rounded-[8px] text-sm md:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#011F72]"
          >
            Upgrade to Pro →
          </Link>
          <Link
            href="#"
            className="inline-block text-[#011F72] bg-gray-200 font-medium hover:bg-gray-300 px-4 md:px-6 py-2 md:py-3 rounded-[8px] text-sm md:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#011F72]"
          >
            Continue Free →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default page;
