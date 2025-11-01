"use client";
import React from "react";
import { ResumeSection } from "@/types/cv";
import { TemplateLayout } from "@/types/cv/template";
import {
  formatSectionContent,
  getSectionDisplayName,
} from "@/utils/cv/sectionHelpers";
import { mapFontFamily } from "@/utils/cv/fontUtils";
import {
  SPACING,
  FONT_SIZES,
  LAYOUT,
  SECTION_ORDER,
  SKILL_LEVELS,
  LANGUAGE_LEVELS,
  FONTS,
} from "@/utils/cv/templateConstants";
import Link from "next/link";
import { sanitizeHtml } from "@/utils/cv/richText";
import RichHtml from "../RichHtml";

export function ModernTemplateHtmlRenderer({
  data,
  template,
  leftColumnSections = ["skills", "languages", "awards", "certifications"],
}: {
  data: ResumeSection[];
  template: TemplateLayout;
  leftColumnSections?: string[];
}) {
  const personalInfo = data.find((s) => s.type === "personal-info");

  // Use standardized section order
  const sectionOrder = SECTION_ORDER;

  // Filter and sort other sections according to the desired order
  const otherSections = data
    .filter((s) => s.type !== "personal-info")
    .sort((a, b) => {
      const aIndex = sectionOrder.indexOf(a.type as string);
      const bIndex = sectionOrder.indexOf(b.type as string);

      // If section is not in the order list, put it at the end
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

  return (
    <div
      className="bg-white shadow-lg w-full h-full"
      style={
        {
          width: "210mm", // ✅ A4 width
          minHeight: "297mm", // ✅ A4 height
          maxWidth: "210mm",
          pageBreakInside: "avoid",
          breakInside: "avoid",
          marginBottom: "20px",
          fontFamily: FONTS.html.default,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      {personalInfo && (
        <div
          className="py-8 px-8 h-[40vh]"
          style={{
            backgroundColor: template.styles.colors.primary || "#1e40af",
            color: "#ffffff",
          }}
        >
          <div className="flex items-start space-x-6">
            {personalInfo.data.image && (
              <div className="w-[120px] h-[140px]">
                <img
                  src={personalInfo.data.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
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
                {personalInfo.data.firstName} {personalInfo.data.lastName}
              </h1>
              {personalInfo.data.targetedJobTitle && (
                <p
                  className="text-lg opacity-90 mb-4"
                  style={{
                    fontFamily: mapFontFamily(
                      template.styles.typography.fontFamily
                    ),
                    fontSize: "18px", // Standard job title size
                  }}
                >
                  {personalInfo.data.targetedJobTitle}
                </p>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                {personalInfo.data.email && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {/* <span className="font-semibold">Email: </span> */}
                    {personalInfo.data.email}
                  </div>
                )}
                {personalInfo.data.phone && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {/* <span className="font-semibold">Phone: </span> */}
                    {personalInfo.data.phone}
                  </div>
                )}
                {personalInfo.data.location && (
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
                    {/* <span className="font-semibold">Location: </span> */}
                    {personalInfo.data.location}
                  </div>
                )}
                {personalInfo.data.linkedin && (
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
                    <Link
                      href={personalInfo.data.linkedin}
                      className="text-white hover:underline"
                    >
                      {/* <span className="font-semibold">LinkedIn: </span> */}
                      {personalInfo.data.linkedin}
                    </Link>
                  </div>
                )}
                {personalInfo.data.github && (
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
                    <Link
                      href={personalInfo.data.github}
                      className="text-white hover:underline"
                    >
                      {/* <span className="font-semibold">GitHub: </span> */}
                      {personalInfo.data.github}
                    </Link>
                  </div>
                )}
                {personalInfo.data.twitter && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <Link
                      href={personalInfo.data.twitter}
                      className="text-white hover:underline"
                    >
                      {/* <span className="font-semibold">Twitter: </span> */}
                      {personalInfo.data.twitter}
                    </Link>
                  </div>
                )}
                {personalInfo.data.instagram && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C7.347 0 7 .347 7 .778v.44c0 .431.347.778.778.778h4.444c.431 0 .778-.347.778-.778v-.44C13 .347 12.653 0 12.222 0H10zM3.556 2.222C1.597 2.222 0 3.819 0 5.778v8.444C0 16.181 1.597 17.778 3.556 17.778h12.888C18.403 17.778 20 16.181 20 14.222V5.778c0-1.959-1.597-3.556-3.556-3.556H3.556zM10 4.444c3.056 0 5.556 2.5 5.556 5.556S13.056 15.556 10 15.556 4.444 13.056 4.444 10 6.944 4.444 10 4.444zm0 1.778c-2.083 0-3.778 1.695-3.778 3.778S7.917 13.778 10 13.778 13.778 12.083 13.778 10 12.083 6.222 10 6.222zM15.556 4.444c.694 0 1.222.528 1.222 1.222s-.528 1.222-1.222 1.222-1.222-.528-1.222-1.222.528-1.222 1.222-1.222z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Link
                      href={personalInfo.data.instagram}
                      className="text-white hover:underline"
                    >
                      {/* <span className="font-semibold">Instagram: </span> */}
                      {personalInfo.data.instagram}
                    </Link>
                  </div>
                )}
                {personalInfo.data.website && (
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
                    <Link
                      href={personalInfo.data.website}
                      className="text-white hover:underline"
                    >
                      {/* <span className="font-semibold">Website: </span> */}
                      {personalInfo.data.website}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - 35% (Summary, Skills, Languages, Awards, Certificates) */}
          <div className="col-span-4 space-y-6">
            {otherSections
              .filter((section) => leftColumnSections.includes(section.type))
              .sort((a, b) => {
                return (
                  leftColumnSections.indexOf(a.type) -
                  leftColumnSections.indexOf(b.type)
                );
              })
              .map((section, sectionIndex) => {
                const items = formatSectionContent(section);
                const displayName = getSectionDisplayName(
                  section.type,
                  section
                );

                return (
                  <div
                    key={section.id}
                    className="space-y-4"
                    style={
                      {
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                        pageBreakBefore: sectionIndex > 0 ? "auto" : "avoid",
                      } as React.CSSProperties
                    }
                  >
                    <h2
                      className="text-base font-bold py-2 px-4 rounded-[10px]"
                      style={{
                        backgroundColor:
                          template.styles.colors.primary || "#1e40af",
                        color: "#ffffff",
                        fontFamily: mapFontFamily(
                          template.styles.typography.fontFamily
                        ),
                        fontSize: "16px", // Standard section header size
                      }}
                    >
                      {displayName}
                    </h2>

                    {/* Skills - Render once for the entire section */}
                    {(section.type as string) === "skills" && (
                      <div
                        className="flex flex-wrap gap-2"
                        style={{ width: "100%", maxWidth: "100%" }}
                      >
                        {Array.isArray(items) &&
                          items.map((item: any, i: number) => (
                            <span
                              key={i}
                              className="text-white px-2 py-1 rounded text-xs"
                              style={{
                                fontFamily: mapFontFamily(
                                  template.styles.typography.fontFamily
                                ),
                                backgroundColor:
                                  template.styles.colors.primary || "#1e40af",
                              }}
                            >
                              {item.name}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Languages - Render once for the entire section */}
                    {(section.type as string) === "languages" && (
                      <div
                        className="flex flex-wrap gap-2"
                        style={{ width: "100%", maxWidth: "100%" }}
                      >
                        {Array.isArray(items) &&
                          items.map((item: any, i: number) => (
                            <span
                              key={i}
                              className="text-white px-2 py-1 rounded text-xs"
                              style={{
                                fontFamily: mapFontFamily(
                                  template.styles.typography.fontFamily
                                ),
                                backgroundColor:
                                  template.styles.colors.primary || "#1e40af",
                              }}
                            >
                              {item.name}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Other left column sections - Individual items */}
                    {Array.isArray(items) &&
                      (section.type as string) !== "skills" &&
                      (section.type as string) !== "languages" &&
                      items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="space-y-2"
                          style={
                            {
                              pageBreakInside: "avoid",
                              breakInside: "avoid",
                            } as React.CSSProperties
                          }
                        >
                          {/* Professional Summary */}
                          {item.summary &&
                            section.type === "professional-summary" && (
                              <div
                                className="prose prose-sm max-w-none [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm [&_a]:text-blue-600 [&_a]:underline"
                                style={{
                                  color: template.styles.colors.text,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: "12px", // Standard body text size
                                  lineHeight:
                                    template.styles.typography.lineHeight,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(item.summary),
                                }}
                              />
                            )}

                          {/* Certifications */}
                          {item.name &&
                            item.issuer &&
                            section.type === "certifications" && (
                              <div
                                className="border-l-4 pl-4"
                                style={{
                                  borderLeftColor:
                                    template.styles.colors.primary || "#1e40af",
                                }}
                              >
                                <p
                                  className="font-semibold"
                                  style={{
                                    color: template.styles.colors.text,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: "12px", // Standard body text size
                                  }}
                                >
                                  {item.name} — {item.issuer}
                                </p>
                                {item.date && (
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{
                                      color: template.styles.colors.secondary,
                                      fontFamily: mapFontFamily(
                                        template.styles.typography.fontFamily
                                      ),
                                    }}
                                  >
                                    {item.date}
                                    {item.credentialId &&
                                      ` • ID: ${item.credentialId}`}
                                  </p>
                                )}
                              </div>
                            )}

                          {/* Awards */}
                          {item.title &&
                            item.issuer &&
                            section.type === "awards" && (
                              <div
                                className="border-l-4 pl-4"
                                style={{
                                  borderLeftColor:
                                    template.styles.colors.primary || "#1e40af",
                                }}
                              >
                                <p
                                  className="font-semibold"
                                  style={{
                                    color: template.styles.colors.text,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: "12px", // Standard body text size
                                  }}
                                >
                                  {item.title} — {item.issuer}
                                </p>
                                {item.date && (
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{
                                      color: template.styles.colors.secondary,
                                      fontFamily: mapFontFamily(
                                        template.styles.typography.fontFamily
                                      ),
                                    }}
                                  >
                                    {item.date}
                                  </p>
                                )}
                                {item.description && (
                                  <div
                                    className="prose prose-sm max-w-none mt-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm [&_a]:text-blue-600 [&_a]:underline"
                                    style={{
                                      color: template.styles.colors.text,
                                      fontFamily: mapFontFamily(
                                        template.styles.typography.fontFamily
                                      ),
                                      fontSize: `${
                                        template.styles.typography.bodySize - 1
                                      }px`,
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHtml(item.description),
                                    }}
                                  />
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>

          {/* Right Column - 65% (Other sections) */}
          <div className="col-span-8 space-y-6">
            {otherSections
              .filter((section) => !leftColumnSections.includes(section.type))
              .map((section, sectionIndex) => {
                const items = formatSectionContent(section);
                const displayName = getSectionDisplayName(
                  section.type,
                  section
                );

                return (
                  <div
                    key={section.id}
                    className="space-y-4"
                    style={
                      {
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                        pageBreakBefore: sectionIndex > 0 ? "auto" : "avoid",
                      } as React.CSSProperties
                    }
                  >
                    <h2
                      className="text-lg font-bold py-2 px-4 rounded-[10px]"
                      style={{
                        backgroundColor:
                          template.styles.colors.primary || "#1e40af",
                        color: "#ffffff",
                        fontFamily: mapFontFamily(
                          template.styles.typography.fontFamily
                        ),
                        fontSize: "18px", // Standard right column header size
                      }}
                    >
                      {displayName}
                    </h2>

                    {Array.isArray(items) &&
                      items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="space-y-2"
                          style={
                            {
                              pageBreakInside: "avoid",
                              breakInside: "avoid",
                            } as React.CSSProperties
                          }
                        >
                          {/* Professional Summary */}
                          {item.summary &&
                            section.type === "professional-summary" && (
                              <div
                                className="prose prose-sm max-w-none [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm [&_a]:text-blue-600 [&_a]:underline"
                                style={{
                                  color: template.styles.colors.text,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                  lineHeight:
                                    template.styles.typography.lineHeight,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(item.summary),
                                }}
                              />
                            )}

                          {/* Work Experience */}
                          {item.title && item.company && (
                            <div
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
                                  {item.title} —{" "}
                                  <span className="italic">{item.company}</span>
                                </p>
                                {item.startDate && (
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{
                                      color: template.styles.colors.secondary,
                                      fontFamily: mapFontFamily(
                                        template.styles.typography.fontFamily
                                      ),
                                    }}
                                  >
                                    {item.startDate} – {item.endDate}
                                  </p>
                                )}
                              </div>
                              {item.location && (
                                <p
                                  className="text-md text-gray-500"
                                  style={{
                                    color: template.styles.colors.secondary,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                  }}
                                >
                                  {item.location}
                                </p>
                              )}

                              {/* 🟦 Quill HTML (paragraphs, inline styles, lists…) */}
                              {item.description && (
                                <RichHtml
                                  html={item.description}
                                  template={template}
                                  sizeOffset={-1}
                                />
                              )}

                              {/* 🟩 Optional explicit bullets array (kept for backwards-compat) */}
                              {item.bullets?.length > 0 && (
                                <ul className="list-disc pl-6 mt-2">
                                  {item.bullets.map(
                                    (bullet: string, j: number) => {
                                      const paragraphs = bullet
                                        .split(/<\/p>\s*<p[^>]*>/i)
                                        .map((p) =>
                                          p
                                            .replace(/<p[^>]*>|<\/p>/gi, "")
                                            .trim()
                                        )
                                        .filter((p) => p.length > 0);

                                      return paragraphs.map((paragraph, k) => (
                                        <li
                                          key={`${j}-${k}`}
                                          className="prose prose-sm max-w-none [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm [&_a]:text-blue-600 [&_a]:underline"
                                          style={{
                                            color: template.styles.colors.text,
                                            fontFamily: mapFontFamily(
                                              template.styles.typography
                                                .fontFamily
                                            ),
                                            fontSize: `${
                                              template.styles.typography
                                                .bodySize - 1
                                            }px`,
                                          }}
                                          dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(paragraph),
                                          }}
                                        />
                                      ));
                                    }
                                  )}
                                </ul>
                              )}
                            </div>
                          )}

                          {/* Education */}
                          {item.degree && item.field && (
                            <div
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
                                  {item.degree} —{" "}
                                  <span className="italic">{item.field}</span>
                                </p>
                                {item.startDate && (
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{
                                      color: template.styles.colors.secondary,
                                      fontFamily: mapFontFamily(
                                        template.styles.typography.fontFamily
                                      ),
                                    }}
                                  >
                                    {item.startDate} – {item.endDate}
                                  </p>
                                )}
                              </div>
                              {item.school && (
                                <p
                                  className="text-md text-gray-500"
                                  style={{
                                    color: template.styles.colors.secondary,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                  }}
                                >
                                  {item.school}
                                  {item.gpa && ` • GPA: ${item.gpa}`}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Projects */}
                          {item.name && section.type === "projects" && (
                            <div
                              className="border-l-4 pl-4"
                              style={{
                                borderLeftColor:
                                  template.styles.colors.primary || "#1e40af",
                              }}
                            >
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
                                {item.name}
                                {item.url && (
                                  <span className="text-blue-600 ml-2">
                                    <Link
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.url}
                                    </Link>
                                  </span>
                                )}
                              </p>
                              {item.description && (
                                <div
                                  style={{
                                    color: template.styles.colors.text,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: `${
                                      template.styles.typography.bodySize - 1
                                    }px`,
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: item.description,
                                  }}
                                />
                              )}
                              {item.technologies?.length > 0 && (
                                <p
                                  className="text-md text-gray-500"
                                  style={{
                                    color: template.styles.colors.secondary,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                  }}
                                >
                                  Technologies: {item.technologies.join(", ")}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Interests */}
                          {item.name && section.type === "interests" && (
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    template.styles.colors.primary || "#1e40af",
                                }}
                              ></div>
                              <p
                                style={{
                                  color: template.styles.colors.text,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.name}
                                {item.description && ` - ${item.description}`}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
