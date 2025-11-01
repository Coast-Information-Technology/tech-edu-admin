/**
 * Classic Template HTML Renderer
 *
 * Renders the classic template for web preview using shared section logic
 */

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
} from "@/utils/cv/templateConstants";
import Link from "next/link";
import { sanitizeHtml } from "@/utils/cv/richText";
import RichHtml from "../RichHtml";

export function MinimalTemplateHtmlRenderer({
  data,
  template,
}: {
  data: ResumeSection[];
  template: TemplateLayout;
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
      {/* Header */}
      {personalInfo && (
        <div
          className="flex justify-between items-start p-8"
          style={{
            backgroundColor:
              template.styles.colors.headerBackground || "#f8fafc",
            borderBottom: `2px solid ${
              template.styles.colors.primary || "#dc2626"
            }`,
          }}
        >
          {/* Left Side - Image, Name, Title, Contact */}
          <div className="flex items-start space-x-4">
            {personalInfo.data.image && (
              <img
                src={personalInfo.data.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
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
                {personalInfo.data.firstName} {personalInfo.data.lastName}
              </h1>
              {personalInfo.data.targetedJobTitle && (
                <p
                  className="text-lg text-gray-600 mt-1 italic"
                  style={{
                    color: template.styles.colors.secondary,
                    fontFamily: mapFontFamily(
                      template.styles.typography.fontFamily
                    ),
                  }}
                >
                  {personalInfo.data.targetedJobTitle}
                </p>
              )}

              {personalInfo.data.email && (
                <div className="text-sm">
                  <span className="font-semibold">Email: </span>
                  <span>{personalInfo.data.email}</span>
                </div>
              )}
              {personalInfo.data.phone && (
                <div className="text-sm">
                  <span className="font-semibold">Phone: </span>
                  <span>{personalInfo.data.phone}</span>
                </div>
              )}
              {personalInfo.data.location && (
                <div className="text-sm">
                  <span className="font-semibold">Location: </span>
                  <span>{personalInfo.data.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Location and Social Links */}
          <div className="flex flex-col space-y-2 text-right">
            <div className="space-y-1 mt-2">
              {personalInfo.data.linkedin && (
                <div className="text-sm">
                  <span className="font-semibold">LinkedIn: </span>
                  <Link
                    href={personalInfo.data.linkedin}
                    className="text-gray-600 hover:underline"
                  >
                    {personalInfo.data.linkedin}
                  </Link>
                </div>
              )}
              {personalInfo.data.github && (
                <div className="text-sm">
                  <span className="font-semibold">GitHub: </span>
                  <Link
                    href={personalInfo.data.github}
                    className="text-gray-600 hover:underline"
                  >
                    {personalInfo.data.github}
                  </Link>
                </div>
              )}
              {personalInfo.data.twitter && (
                <div className="text-sm">
                  <span className="font-semibold">Twitter: </span>
                  <Link
                    href={personalInfo.data.twitter}
                    className="text-gray-600 hover:underline"
                  >
                    {personalInfo.data.twitter}
                  </Link>
                </div>
              )}
              {personalInfo.data.instagram && (
                <div className="text-sm">
                  <span className="font-semibold">Instagram: </span>
                  <Link
                    href={personalInfo.data.instagram}
                    className="text-gray-600 hover:underline"
                  >
                    {personalInfo.data.instagram}
                  </Link>
                </div>
              )}
              {personalInfo.data.website && (
                <div className="text-sm">
                  <span className="font-semibold">Website: </span>
                  <Link
                    href={personalInfo.data.website}
                    className="text-blue-600 hover:underline"
                  >
                    {personalInfo.data.website}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8 px-8 space-y-6">
        {otherSections.map((section, sectionIndex) => {
          const items = formatSectionContent(section);
          const displayName = getSectionDisplayName(section.type, section);

          return (
            <div
              key={section.id}
              className="space-y-3"
              style={
                {
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                  pageBreakBefore: sectionIndex > 0 ? "auto" : "avoid",
                } as React.CSSProperties
              }
            >
              <h2
                className="font-bold uppercase text-sm tracking-wide bg-gray-100 p-2 w-full"
                style={{
                  color: template.styles.colors.text,
                  fontFamily: mapFontFamily(
                    template.styles.typography.fontFamily
                  ),
                  fontSize: `${template.styles.typography.headingSize}px`,
                }}
              >
                {displayName}
              </h2>

              {/* Skills - Render as badges */}
              {(section.type as string) === "skills" && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(items) &&
                    items.map((item: any, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-white text-sm"
                        style={{
                          backgroundColor:
                            template.styles.colors.primary || "#dc2626",
                          fontFamily: mapFontFamily(
                            template.styles.typography.fontFamily
                          ),
                          fontSize: `${
                            template.styles.typography.bodySize - 1
                          }px`,
                        }}
                      >
                        {item.name}
                      </span>
                    ))}
                </div>
              )}

              {/* Languages - Render as badges */}
              {(section.type as string) === "languages" && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(items) &&
                    items.map((item: any, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-white text-sm"
                        style={{
                          backgroundColor:
                            template.styles.colors.primary || "#dc2626",
                          fontFamily: mapFontFamily(
                            template.styles.typography.fontFamily
                          ),
                          fontSize: `${
                            template.styles.typography.bodySize - 1
                          }px`,
                        }}
                      >
                        {item.name}
                      </span>
                    ))}
                </div>
              )}

              {/* Other sections */}
              {Array.isArray(items) &&
                (section.type as string) !== "skills" &&
                (section.type as string) !== "languages" &&
                items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="space-y-1"
                    style={
                      {
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                        pageBreakBefore: i > 0 ? "auto" : "avoid",
                      } as React.CSSProperties
                    }
                  >
                    {/* Work Experience */}
                    {item.title && item.company && (
                      <div>
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
                            className="text-xs text-gray-500"
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
                            {item.bullets.map((bullet: string, j: number) => {
                              // Split by paragraph breaks and render each as a bullet
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
                                    color: template.styles.colors.text,
                                    fontFamily: mapFontFamily(
                                      template.styles.typography.fontFamily
                                    ),
                                    fontSize: `${
                                      template.styles.typography.bodySize - 1
                                    }px`,
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(paragraph),
                                  }}
                                />
                              ));
                            })}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Education */}
                    {item.degree && item.field && (
                      <div>
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
                            className="text-xs text-gray-500"
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
                      <div>
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
                        {item.technologies?.length > 0 && (
                          <p
                            className="text-xs text-gray-500"
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
                              color: template.styles.colors.text,
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
                    {item.title && item.issuer && section.type === "awards" && (
                      <div>
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
                      </div>
                    )}

                    {/* Interests */}
                    {item.name && section.type === "interests" && (
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
                    )}

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
                            lineHeight: template.styles.typography.lineHeight,
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
    </div>
  );
}
