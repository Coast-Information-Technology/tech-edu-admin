"use client";
import React from "react";
import { TemplateLayout } from "@/types/cv/template";
import { mapFontFamily } from "@/utils/cv/fontUtils";
import { SPACING, FONT_SIZES, LAYOUT } from "@/utils/cv/templateConstants";

export function ModernTemplatePlaceholder({
  template,
}: {
  template: TemplateLayout;
}) {
  return (
    <div
      className="mx-auto bg-white shadow-lg"
      style={
        {
          width: "210mm", // ✅ A4 width
          minHeight: "297mm", // ✅ A4 height
          maxWidth: "210mm",
          pageBreakInside: "avoid",
          breakInside: "avoid",
          marginBottom: "20px",
        } as React.CSSProperties
      }
    >
      {/* Header Placeholder */}
      <div
        className="py-8 px-8 h-[40vh]"
        style={{
          backgroundColor: template.styles.colors.primary || "#1e40af",
          color: "#ffffff",
        }}
      >
        <div className="flex items-start space-x-6">
          {/* Profile Image Placeholder */}
          <div className="w-[120px] h-[140px]">
            <div
              className="w-full h-full bg-gray-300 rounded flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <svg
                className="w-8 h-8 text-white opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
                fontSize: "36px", // Standard name size
              }}
            >
              John Doe
            </h1>
            <p
              className="text-lg opacity-90 mb-4"
              style={{
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
                fontSize: "18px", // Standard job title size
              }}
            >
              Software Engineer
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                john.doe@email.com
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                New York, NY
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
                linkedin.com/in/johndoe
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                github.com/johndoe
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                johndoe.dev
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - 35% (Summary, Skills, Languages, Awards, Certificates) */}
          <div className="col-span-4 space-y-6">
            {/* Professional Summary Placeholder */}
            <div className="space-y-4">
              <h2
                className="text-base font-bold py-2 px-4 rounded-[10px]"
                style={{
                  backgroundColor: template.styles.colors.primary || "#1e40af",
                  color: "#ffffff",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: "16px", // Standard section header size
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

            {/* Skills Placeholder */}
            <div className="space-y-4">
              <h2
                className="text-base font-bold py-2 px-4 rounded-[10px]"
                style={{
                  backgroundColor: template.styles.colors.primary || "#1e40af",
                  color: "#ffffff",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: "16px", // Standard section header size
                }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "React", "Node.js", "Python", "SQL"].map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      style={{
                        fontFamily: mapFontFamily(
                          template.styles.typography.fontFamily
                        ),
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Languages Placeholder */}
            <div className="space-y-4">
              <h2
                className="text-base font-bold py-2 px-4 rounded-[10px]"
                style={{
                  backgroundColor: template.styles.colors.primary || "#1e40af",
                  color: "#ffffff",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: "16px", // Standard section header size
                }}
              >
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "English (Native)",
                  "Spanish (Fluent)",
                  "French (Intermediate)",
                ].map((lang, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    style={{
                      fontFamily: mapFontFamily(
                        template.styles.typography.fontFamily
                      ),
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 65% (Other sections) */}
          <div className="col-span-8 space-y-6">
            {/* Work Experience Placeholder */}
            <div className="space-y-4">
              <h2
                className="text-lg font-bold py-2 px-4 rounded-[10px]"
                style={{
                  backgroundColor: template.styles.colors.primary || "#1e40af",
                  color: "#ffffff",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: "18px", // Standard right column header size
                }}
              >
                Work Experience
              </h2>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="border-l-4 pl-4"
                    style={{
                      borderLeftColor:
                        template.styles.colors.primary || "#1e40af",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <p
                        className="font-semibold text-sm"
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
                      className="text-md text-gray-500"
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
                ))}
              </div>
            </div>

            {/* Education Placeholder */}
            <div className="space-y-4">
              <h2
                className="text-lg font-bold py-2 px-4 rounded-[10px]"
                style={{
                  backgroundColor: template.styles.colors.primary || "#1e40af",
                  color: "#ffffff",
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: "18px", // Standard right column header size
                }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="border-l-4 pl-4"
                    style={{
                      borderLeftColor:
                        template.styles.colors.primary || "#1e40af",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <p
                        className="font-semibold text-sm"
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
                      className="text-md text-gray-500"
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
