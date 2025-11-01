"use client";
import React from "react";
import { TemplateLayout } from "@/types/cv/template";
import { mapFontFamily } from "@/utils/cv/fontUtils";
import { SPACING, FONT_SIZES, LAYOUT } from "@/utils/cv/templateConstants";

export function MinimalTemplatePlaceholder({
  template,
}: {
  template: TemplateLayout;
}) {
  return (
    <div
      className="mx-auto bg-white shadow-lg"
      style={
        {
          width: "210mm", // A4 width
          minHeight: "297mm", // A4 height
          maxWidth: "210mm", // Ensure it doesn't exceed A4 width
          pageBreakInside: "avoid",
          breakInside: "avoid",
          overflow: "hidden",
          transform: "scale(0.8)",
          transformOrigin: "top center",
          marginBottom: "20px",
        } as React.CSSProperties
      }
    >
      {/* Header Placeholder */}
      <div
        className="flex justify-between items-start p-8"
        style={{
          backgroundColor: template.styles.colors.headerBackground || "#f8fafc",
          borderBottom: `2px solid ${
            template.styles.colors.primary || "#dc2626"
          }`,
        }}
      >
        {/* Left Side - Image, Name, Title, Contact */}
        <div className="flex items-start space-x-4">
          {/* {personalInfo.data.image && (
            <img
              src={personalInfo.data.image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          )} */}
          <div className="flex flex-col">
            <h1
              className="text-4xl font-bold"
              style={{
                color: template.styles.colors.text,
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
              }}
            >
              John Doe
            </h1>
            <p
              className="text-lg text-gray-600 mt-1 italic"
              style={{
                color: template.styles.colors.secondary,
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
              }}
            >
              Software Engineer
            </p>

            <div className="text-sm">
              <span className="font-semibold">Email: </span>
              <span>john.doe@email.com</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Phone: </span>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Location: </span>
              <span>New York, NY</span>
            </div>
          </div>
        </div>

        {/* Right Side - Location and Social Links */}
        <div className="flex flex-col space-y-2 text-right">
          <div className="space-y-1 mt-2">
            <div className="text-sm">
              <span className="font-semibold">LinkedIn: </span>
              <span className="text-gray-600 hover:underline">
                linkedin.com/in/johndoe
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">GitHub: </span>
              <span className="text-gray-600 hover:underline">
                github.com/johndoe
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Website: </span>
              <span className="text-blue-600 hover:underline">johndoe.dev</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-8 space-y-6">
        {/* Professional Summary Placeholder */}
        <div className="space-y-3">
          <h2
            className="font-bold uppercase text-sm tracking-wide bg-gray-100 p-2 w-full"
            style={{
              color: template.styles.colors.text,
              fontFamily: mapFontFamily(template.styles.typography.fontFamily),
              fontSize: `${template.styles.typography.headingSize}px`,
            }}
          >
            Professional Summary
          </h2>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        {/* Work Experience Placeholder */}
        <div className="space-y-3">
          <h2
            className="font-bold uppercase text-sm tracking-wide bg-gray-100 p-2 w-full"
            style={{
              color: template.styles.colors.text,
              fontFamily: mapFontFamily(template.styles.typography.fontFamily),
              fontSize: `${template.styles.typography.headingSize}px`,
            }}
          >
            Work Experience
          </h2>
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <p
                className="font-semibold"
                style={{
                  color: template.styles.colors.text,
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: `${template.styles.typography.bodySize}px`,
                }}
              >
                Senior Software Engineer —{" "}
                <span className="italic">Tech Company Inc.</span>
              </p>
              <p
                className="text-xs text-gray-500"
                style={{
                  color: template.styles.colors.secondary,
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                }}
              >
                2020 – Present
              </p>
            </div>
            <p
              className="text-xs text-gray-500"
              style={{
                color: template.styles.colors.secondary,
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
              }}
            >
              San Francisco, CA
            </p>
            <div className="space-y-1 mt-2">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Education Placeholder */}
        <div className="space-y-3">
          <h2
            className="font-bold uppercase text-sm tracking-wide bg-gray-100 p-2 w-full"
            style={{
              color: template.styles.colors.text,
              fontFamily: mapFontFamily(template.styles.typography.fontFamily),
              fontSize: `${template.styles.typography.headingSize}px`,
            }}
          >
            Education
          </h2>
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <p
                className="font-semibold"
                style={{
                  color: template.styles.colors.text,
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: `${template.styles.typography.bodySize}px`,
                }}
              >
                Bachelor of Computer Science —{" "}
                <span className="italic">University of Technology</span>
              </p>
              <p
                className="text-xs text-gray-500"
                style={{
                  color: template.styles.colors.secondary,
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                }}
              >
                2016 – 2020
              </p>
            </div>
            <p
              className="text-xs text-gray-500"
              style={{
                color: template.styles.colors.secondary,
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
              }}
            >
              San Francisco, CA • GPA: 3.8/4.0
            </p>
          </div>
        </div>

        {/* Skills Placeholder */}
        <div className="space-y-3">
          <h2
            className="font-bold uppercase text-sm tracking-wide bg-gray-100 p-2 w-full"
            style={{
              color: template.styles.colors.text,
              fontFamily: mapFontFamily(template.styles.typography.fontFamily),
              fontSize: `${template.styles.typography.headingSize}px`,
            }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "JavaScript",
              "React",
              "Node.js",
              "Python",
              "SQL",
              "AWS",
              "Docker",
              "Git",
              "TypeScript",
              "MongoDB",
            ].map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-white text-sm"
                style={{
                  backgroundColor: template.styles.colors.primary || "#dc2626",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: `${template.styles.typography.bodySize - 1}px`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Languages Placeholder */}
        <div className="space-y-3">
          <h2
            className="font-bold uppercase text-sm tracking-wide bg-gray-100 p-2 w-full"
            style={{
              color: template.styles.colors.text,
              fontFamily: mapFontFamily(template.styles.typography.fontFamily),
              fontSize: `${template.styles.typography.headingSize}px`,
            }}
          >
            Languages
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "English (Native)",
              "Spanish (Fluent)",
              "French (Intermediate)",
            ].map((lang, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-white text-sm"
                style={{
                  backgroundColor: template.styles.colors.primary || "#dc2626",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: `${template.styles.typography.bodySize - 1}px`,
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
