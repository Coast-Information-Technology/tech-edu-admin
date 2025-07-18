// CVTemplates.tsx
"use client";

import React from "react";

export const StudentCV = ({ data }: { data: any }) => (
  <div className="bg-white text-gray-800 p-6 rounded-md shadow">
    <h1 className="text-2xl font-bold text-center text-[#011F72]">
      {data.fullName || "Full Name"}
    </h1>
    <p className="text-center text-sm text-gray-600">{data.email}</p>
    <p className="text-center text-sm text-gray-600 mb-6">{data.phone}</p>

    <section className="mb-4">
      <h2 className="font-semibold text-blue-800">Objective</h2>
      <p>{data.objective || "A brief summary of your career goal."}</p>
    </section>

    <section className="mb-4">
      <h2 className="font-semibold text-blue-800">Education</h2>
      {data.education?.map((edu: any, i: number) => (
        <div key={i} className="mb-2">
          <p className="font-medium">
            {edu.degree} at {edu.institution}
          </p>
          <p className="text-xs text-gray-500">{edu.year}</p>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <h2 className="font-semibold text-blue-800">Skills</h2>
      <ul className="list-disc list-inside">
        {data.skills?.map((skill: string, i: number) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
    </section>

    {data.projects && (
      <section className="mb-4">
        <h2 className="font-semibold text-blue-800">Projects</h2>
        {data.projects.map((proj: any, i: number) => (
          <div key={i} className="mb-2">
            <p className="font-medium">{proj.title}</p>
            <p className="text-sm text-gray-600">{proj.description}</p>
          </div>
        ))}
      </section>
    )}
  </div>
);

export const GraduateCV = ({ data }: { data: any }) => (
  <div className="bg-white text-gray-800 p-6 rounded-md shadow grid grid-cols-3 gap-4">
    <div className="col-span-1">
      <section className="mb-4">
        <h2 className="font-semibold text-blue-800">Skills</h2>
        <ul className="list-disc list-inside">
          {data.skills?.map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </section>
      <section className="mb-4">
        <h2 className="font-semibold text-blue-800">Certifications</h2>
        <ul className="list-disc list-inside">
          {data.certifications?.map((cert: string, i: number) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </section>
    </div>

    <div className="col-span-2">
      <h1 className="text-2xl font-bold text-[#011F72]">{data.fullName}</h1>
      <p className="text-sm text-gray-600">
        {data.email} | {data.phone}
      </p>

      <section className="mt-4">
        <h2 className="font-semibold text-blue-800">Education</h2>
        {data.education?.map((edu: any, i: number) => (
          <div key={i} className="mb-2">
            <p className="font-medium">
              {edu.degree} - {edu.institution}
            </p>
            <p className="text-xs text-gray-500">{edu.year}</p>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="font-semibold text-blue-800">Internships</h2>
        {data.internships?.map((exp: any, i: number) => (
          <div key={i} className="mb-2">
            <p className="font-medium">
              {exp.title} - {exp.company}
            </p>
            <p className="text-xs text-gray-500">{exp.dates}</p>
            <p className="text-sm">{exp.responsibilities}</p>
          </div>
        ))}
      </section>
    </div>
  </div>
);

// Remaining components for Experienced, NGO, and Academic CVs will follow this format with unique layout structures
