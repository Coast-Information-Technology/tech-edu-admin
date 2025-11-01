// components/renderers/TwoColumnTemplateHtmlRenderer.tsx
"use client";
import React from "react";
import Link from "next/link";
import { sanitizeHtml } from "@/utils/cv/richText";
import RichHtml from "../RichHtml";

import { ResumeSection } from "@/types/cv";
import { ColumnSectionType, TemplateLayout } from "@/types/cv/template";
import {
  formatSectionContent,
  getSectionDisplayName,
} from "@/utils/cv/sectionHelpers";
import { mapFontFamily } from "@/utils/cv/fontUtils";
import {
  SPACING,
  LAYOUT,
  SECTION_ORDER,
  SKILL_LEVELS,
  LANGUAGE_LEVELS,
  FONTS,
} from "@/utils/cv/templateConstants";

export function TwoColumnTemplateHtmlRenderer({
  data,
  template,
}: {
  data: ResumeSection[];
  template: TemplateLayout;
}) {
  const personalInfo = data.find((s) => s.type === "personal-info");

  // Filter and sort other sections according to desired order
  const otherSections = data
    .filter((s) => s.type !== "personal-info")
    .sort((a, b) => {
      const aIndex = SECTION_ORDER.indexOf(a.type as string);
      const bIndex = SECTION_ORDER.indexOf(b.type as string);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  // Split sections into left and right columns based on template configuration
  const leftColumnSections = otherSections.filter((section) => {
    const leftColumn = template.columns?.find((col) => col.id === "left");
    return leftColumn?.sections?.includes(section.type as ColumnSectionType);
  });
  const rightColumnSections = otherSections.filter((section) => {
    const rightColumn = template.columns?.find((col) => col.id === "right");
    return rightColumn?.sections?.includes(section.type as ColumnSectionType);
  });

  const leftColumn = template.columns?.find((col) => col.id === "left");
  const rightColumn = template.columns?.find((col) => col.id === "right");

  // Compute split background and colors
  const leftWidthPct = Number(leftColumn?.width ?? 40);
  const rightWidthPct = 100 - leftWidthPct;

  const leftBg = leftColumn?.styles?.backgroundColor ?? "#1e3a8a";
  const rightBg = rightColumn?.styles?.backgroundColor ?? "#ffffff";
  const leftText = leftColumn?.styles?.textColor ?? "#f9fafb";
  const rightText = rightColumn?.styles?.textColor ?? "#000000";

  return (
    <>
      {/* Print/A4 rules and disable preview scale when printing */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html,
          body {
            width: 210mm;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-scale-for-print {
            transform: none !important;
          }
        }
      `}</style>

      <div
        className="mx-auto bg-white shadow-lg no-scale-for-print flex flex-col" // <-- flex column page
        style={
          {
            width: LAYOUT.a4Width,
            minHeight: LAYOUT.a4Height, // A4 body height
            maxWidth: LAYOUT.maxWidth,
            pageBreakInside: "avoid",
            breakInside: "avoid",
            transform: `scale(${LAYOUT.scale})`, // preview scale; disabled on print
            transformOrigin: "top center",
            marginBottom: `${SPACING.xl}px`,
            fontFamily: FONTS.html.default,
          } as React.CSSProperties
        }
      >
        {/* Header */}
        {personalInfo && (
          <div
            className="py-8 px-8 text-center"
            style={{
              backgroundColor:
                template.styles.colors.headerBackground || "#60a5fa",
            }}
          >
            <h1
              className="text-5xl font-bold"
              style={{
                color: template.styles.colors.text,
                fontFamily: mapFontFamily(
                  template.styles.typography.fontFamily
                ),
              }}
            >
              {personalInfo.data.firstName} {personalInfo.data.lastName}
            </h1>
            {personalInfo.data.targetedJobTitle && (
              <p
                className="text-xl uppercase"
                style={{
                  color: template.styles.colors.background,
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                }}
              >
                {personalInfo.data.targetedJobTitle}
              </p>
            )}
          </div>
        )}

        {/* Two Column Layout — split background lives here and fills the page bottom */}
        <div
          className="flex flex-1" // <-- fills the remaining page height
          style={{
            background: `linear-gradient(
              to right,
              ${leftBg} 0%,
              ${leftBg} ${leftWidthPct}%,
              ${rightBg} ${leftWidthPct}%,
              ${rightBg} 100%
            )`,
          }}
        >
          {/* Left Column (transparent) */}
          <div
            className="p-8"
            style={{
              width: `${leftWidthPct}%`,
              backgroundColor: "transparent",
              color: leftText,
            }}
          >
            {/* Contact */}
            {personalInfo && (
              <div className="mb-8">
                <h2
                  className="text-lg font-bold mb-4 uppercase tracking-wide border-t border-b"
                  style={{
                    color: leftText,
                    borderTopColor: leftText,
                    borderBottomColor: leftText,
                    fontFamily: mapFontFamily(
                      template.styles.typography.fontFamily
                    ),
                    fontSize: `${template.styles.typography.headingSize}px`,
                  }}
                >
                  Contact
                </h2>
                <div className="space-y-2 text-sm">
                  {personalInfo.data.email && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{personalInfo.data.email}</span>
                    </div>
                  )}
                  {personalInfo.data.phone && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{personalInfo.data.phone}</span>
                    </div>
                  )}
                  {personalInfo.data.location && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{personalInfo.data.location}</span>
                    </div>
                  )}
                  {personalInfo.data.linkedin && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                        className="hover:underline"
                      >
                        {personalInfo.data.linkedin}
                      </Link>
                    </div>
                  )}
                  {personalInfo.data.github && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                        className="hover:underline"
                      >
                        {personalInfo.data.github}
                      </Link>
                    </div>
                  )}
                  {personalInfo.data.website && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                        className="hover:underline"
                      >
                        {personalInfo.data.website}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Left Column Sections */}
            {leftColumnSections.map((section, sectionIndex) => {
              const items = formatSectionContent(section);
              const displayName = getSectionDisplayName(section.type, section);

              return (
                <div
                  key={section.id}
                  className="mb-8"
                  style={
                    {
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                      pageBreakBefore: sectionIndex > 0 ? "auto" : "avoid",
                    } as React.CSSProperties
                  }
                >
                  <h2
                    className="text-lg font-bold mb-4 uppercase tracking-wide border-t border-b"
                    style={{
                      color: leftText,
                      borderTopColor: leftText,
                      borderBottomColor: leftText,
                      fontFamily: mapFontFamily(
                        template.styles.typography.fontFamily
                      ),
                      fontSize: `${template.styles.typography.headingSize}px`,
                    }}
                  >
                    {displayName.toUpperCase()}
                  </h2>

                  {Array.isArray(items) &&
                    items.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="mb-4"
                        style={
                          {
                            pageBreakInside: "avoid",
                            breakInside: "avoid",
                            pageBreakBefore:
                              sectionIndex > 0 ? "auto" : "avoid",
                          } as React.CSSProperties
                        }
                      >
                        {/* Skills */}
                        {item.name &&
                          item.level &&
                          section.type === "skills" && (
                            <div className="mb-3 flex justify-between items-center">
                              <p
                                style={{
                                  color: leftText,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.name}
                              </p>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((dot) => {
                                  const filledDots =
                                    SKILL_LEVELS[
                                      item.level as keyof typeof SKILL_LEVELS
                                    ] || 0;
                                  const isFilled = dot <= filledDots;
                                  return (
                                    <div
                                      key={dot}
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: isFilled
                                          ? leftText
                                          : `${leftText}40`,
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {/* Languages */}
                        {item.name &&
                          item.level &&
                          section.type === "languages" && (
                            <div className="mb-3 flex justify-between items-center">
                              <p
                                style={{
                                  color: leftText,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.name}
                              </p>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((dot) => {
                                  const filledDots =
                                    LANGUAGE_LEVELS[
                                      item.level as keyof typeof LANGUAGE_LEVELS
                                    ] || 0;
                                  const isFilled = dot <= filledDots;
                                  return (
                                    <div
                                      key={dot}
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: isFilled
                                          ? leftText
                                          : `${leftText}40`,
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {/* Interests */}
                        {item.name && section.type === "interests" && (
                          <div className="mb-2">
                            <p
                              style={{
                                color: leftText,
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

                        {/* Professional Summary (if left) */}
                        {item.summary &&
                          section.type === "professional-summary" && (
                            <div
                              className="prose prose-sm max-w-none [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm [&_a]:text-blue-600 [&_a]:underline"
                              style={{
                                color: leftText,
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
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

          {/* Right Column (transparent) */}
          <div
            className="p-8"
            style={{
              width: `${rightWidthPct}%`,
              backgroundColor: "transparent",
              color: rightText,
            }}
          >
            {rightColumnSections.map((section, sectionIndex) => {
              const items = formatSectionContent(section);
              const displayName = getSectionDisplayName(section.type, section);

              return (
                <div
                  key={section.id}
                  className="mb-8"
                  style={
                    {
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                      pageBreakBefore: sectionIndex > 0 ? "auto" : "avoid",
                    } as React.CSSProperties
                  }
                >
                  <h2
                    className="text-xl font-bold mb-2 border-t border-b uppercase tracking-wide"
                    style={{
                      color: "#1e3a8a",
                      borderTopColor: "#1e3a8a",
                      borderBottomColor: "#1e3a8a",
                      fontFamily: mapFontFamily(
                        template.styles.typography.fontFamily
                      ),
                      fontSize: `${template.styles.typography.headingSize}px`,
                    }}
                  >
                    {displayName.toUpperCase()}
                  </h2>

                  {Array.isArray(items) &&
                    items.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="mb-6"
                        style={
                          {
                            pageBreakInside: "avoid",
                            breakInside: "avoid",
                            pageBreakBefore:
                              sectionIndex > 0 ? "auto" : "avoid",
                          } as React.CSSProperties
                        }
                      >
                        {/* Summary */}
                        {item.summary &&
                          section.type === "professional-summary" && (
                            <div
                              style={{
                                color: rightText,
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
                          <div className="mb-4">
                            <div className="flex justify-between items-start">
                              <h3
                                className="font-semibold text-lg"
                                style={{
                                  color: "#000000",
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${
                                    template.styles.typography.bodySize + 2
                                  }px`,
                                }}
                              >
                                {item.title}
                              </h3>
                              {item.startDate && (
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: "#1e3a8a",
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: `${
                                      template.styles.typography.bodySize - 1
                                    }px`,
                                  }}
                                >
                                  {item.startDate} – {item.endDate || "Present"}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-start mb-2">
                              <p
                                className="text-lg italic font-medium"
                                style={{
                                  color: "#1e3a8a",
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.company}
                              </p>
                              {item.location && (
                                <p
                                  className="text-sm"
                                  style={{
                                    color: "#666666",
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: `${
                                      template.styles.typography.bodySize - 1
                                    }px`,
                                  }}
                                >
                                  {item.location}
                                </p>
                              )}
                            </div>

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
                              <ul className="list-disc pl-6 mt-2 space-y-1">
                                {item.bullets.map(
                                  (bullet: string, j: number) => {
                                    const paragraphs = bullet
                                      .split(/<\/p>\s*<p[^>]*>/i)
                                      .map((p) =>
                                        p.replace(/<p[^>]*>|<\/p>/gi, "").trim()
                                      )
                                      .filter((p) => p.length > 0);

                                    return paragraphs.map((paragraph, k) => (
                                      <li
                                        key={`${j}-${k}`}
                                        className="prose prose-sm max-w-none [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm [&_a]:text-blue-600 [&_a]:underline"
                                        style={{
                                          color: "#000000",
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
                          <div className="mb-4">
                            <div className="flex justify-between items-start">
                              <h3
                                className="font-semibold text-lg"
                                style={{
                                  color: "#000000",
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${
                                    template.styles.typography.bodySize + 2
                                  }px`,
                                }}
                              >
                                {item.degree}
                              </h3>
                              {item.startDate && (
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: "#1e3a8a",
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: `${
                                      template.styles.typography.bodySize - 1
                                    }px`,
                                  }}
                                >
                                  {item.startDate} – {item.endDate || "Present"}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-start mb-2">
                              <p
                                className="text-lg italic font-medium"
                                style={{
                                  color: "#1e3a8a",
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.field}
                              </p>
                              {item.school && (
                                <p
                                  className="text-sm"
                                  style={{
                                    color: "#666666",
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: `${
                                      template.styles.typography.bodySize - 1
                                    }px`,
                                  }}
                                >
                                  {item.school}
                                </p>
                              )}
                            </div>
                            {item.gpa && (
                              <p
                                className="text-sm font-medium"
                                style={{
                                  color: "#1e3a8a",
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${
                                    template.styles.typography.bodySize - 1
                                  }px`,
                                }}
                              >
                                GPA: {item.gpa}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Projects */}
                        {item.name && section.type === "projects" && (
                          <div>
                            <p
                              className="font-semibold"
                              style={{
                                color: rightText,
                                fontFamily: mapFontFamily(
                                  template.styles.typography.fontFamily
                                ),
                                fontSize: `${template.styles.typography.bodySize}px`,
                              }}
                            >
                              {item.name}
                              {item.url && (
                                <span className="ml-2">
                                  <Link
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {item.url}
                                  </Link>
                                </span>
                              )}
                            </p>
                            {item.description && (
                              <div
                                style={{
                                  color: rightText,
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
                                className="text-sm"
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

                        {/* Certifications */}
                        {item.name &&
                          item.issuer &&
                          section.type === "certifications" && (
                            <div>
                              <p
                                className="font-semibold"
                                style={{
                                  color: rightText,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.name} — {item.issuer}
                              </p>
                              {item.date && (
                                <p
                                  className="text-sm"
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
                            <div>
                              <p
                                className="font-semibold"
                                style={{
                                  color: rightText,
                                  fontFamily: mapFontFamily(
                                    template.styles.typography.fontFamily
                                  ),
                                  fontSize: `${template.styles.typography.bodySize}px`,
                                }}
                              >
                                {item.title} — {item.issuer}
                              </p>
                              {item.date && (
                                <p
                                  className="text-sm"
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
                                  style={{
                                    color: rightText,
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
    </>
  );
}
