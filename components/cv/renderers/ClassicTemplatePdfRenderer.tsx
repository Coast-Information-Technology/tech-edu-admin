/**
 * Classic Template PDF Renderer
 *
 * Renders the classic template for PDF using shared section logic
 */

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { ResumeSection } from "@/types/cv";
import { TemplateLayout } from "@/types/cv/template";
import {
  formatSectionContent,
  getSectionDisplayName,
} from "@/utils/cv/sectionHelpers";
import { registerPDFFonts, mapFontFamily } from "@/utils/cv/fontUtils";
import {
  SPACING,
  FONT_SIZES,
  LAYOUT,
  SECTION_ORDER,
} from "@/utils/cv/templateConstants";
import {
  scaleToPDF,
  getConsistentFontSize,
  getConsistentPadding,
  PDF_SCALE_FACTOR,
  A4_WIDTH,
  A4_HEIGHT,
} from "@/utils/cv/pdfScaling";
import RichPdf from "../RichPdf";

// Helper function to convert HTML to PDF-friendly text with enhanced formatting
function convertHtmlToPdfText(html: string): string {
  if (!html) return "";

  let result = html;

  // Handle headers with emphasis
  result = result.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "**$1**\n"); // H1 as bold
  result = result.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "**$1**\n"); // H2 as bold
  result = result.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "**$1**\n"); // H3 as bold

  // Handle text formatting
  result = result.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**"); // Bold
  result = result.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**"); // Bold
  result = result.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*"); // Italic
  result = result.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*"); // Italic
  result = result.replace(/<u[^>]*>(.*?)<\/u>/gi, "_$1_"); // Underline
  result = result.replace(/<s[^>]*>(.*?)<\/s>/gi, "~~$1~~"); // Strikethrough
  result = result.replace(/<strike[^>]*>(.*?)<\/strike>/gi, "~~$1~~"); // Strikethrough

  // Handle lists
  result = result.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (items) {
      return (
        items
          .map((item: string, index: number) => {
            const text = item.replace(/<li[^>]*>(.*?)<\/li>/i, "$1");
            return `${index + 1}. ${convertHtmlToPdfText(text)}`;
          })
          .join("\n") + "\n"
      );
    }
    return "";
  });

  result = result.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (items) {
      return (
        items
          .map((item: string) => {
            const text = item.replace(/<li[^>]*>(.*?)<\/li>/i, "$1");
            return `• ${convertHtmlToPdfText(text)}`;
          })
          .join("\n") + "\n"
      );
    }
    return "";
  });

  // Handle individual list items (only if not part of a proper list)
  // Note: This is handled by the <ul> and <ol> processing above

  // Handle blockquotes
  result = result.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (match, content) => {
      return `> ${convertHtmlToPdfText(content)}\n`;
    }
  );

  // Handle code blocks
  result = result.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, content) => {
    return `\`\`\`\n${convertHtmlToPdfText(content)}\n\`\`\`\n`;
  });
  result = result.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`"); // Inline code

  // Handle links
  result = result.replace(
    /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi,
    "$2 ($1)"
  );

  // Handle paragraphs
  result = result.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

  // Handle line breaks
  result = result.replace(/<br[^>]*\/?>/gi, "\n");

  // Remove remaining HTML tags
  result = result.replace(/<[^>]*>/g, "");

  // Handle HTML entities
  result = result.replace(/&nbsp;/g, " ");
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&lt;/g, "<");
  result = result.replace(/&gt;/g, ">");
  result = result.replace(/&quot;/g, '"');
  result = result.replace(/&apos;/g, "'");

  // Normalize whitespace
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

export function ClassicTemplatePdfRenderer({
  data,
  template,
}: {
  data: ResumeSection[];
  template: TemplateLayout;
}) {
  // Register fonts before creating styles
  registerPDFFonts();

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

  const styles = StyleSheet.create({
    page: {
      padding: 20, // Reduced padding to match web preview better
      fontSize: 10, // Smaller base font size to match web preview
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
      lineHeight: 1.4, // Tighter line height
      color: template.styles.colors.text,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: template.styles.colors.headerBackground || "#f8fafc",
      borderBottomWidth: 2,
      borderBottomColor: template.styles.colors.primary || "#dc2626",
      paddingHorizontal: 16, // p-4 = 16px (match HTML)
      paddingVertical: 16, // p-4 = 16px (match HTML)
      marginBottom: 0,
      lineHeight: 1.0,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 16, // space-x-4 = 16px
      lineHeight: 1,
    },
    profileImage: {
      width: 96, // w-24 = 96px (match HTML)
      height: 96, // h-24 = 96px (match HTML)
      borderRadius: 48, // rounded-full
      objectFit: "cover",
    },
    nameTitle: {
      flexDirection: "column",
    },
    name: {
      fontSize: 28, // text-4xl = 36px (match HTML)
      fontWeight: "bold",
      color: template.styles.colors.text,
      marginBottom: 8, // mb-2 = 8px (match HTML)
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    title: {
      fontSize: 16, // text-xl = 20px (match HTML)
      fontStyle: "italic",
      color: template.styles.colors.secondary,
      marginTop: 8, // mt-1 = 4px
      marginBottom: 8, // mb-4 = 16px (match HTML)
      fontWeight: "500", // font-medium (match HTML)
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    contactInfo: {
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 8, // space-y-2 = 8px
    },
    contactItem: {
      fontSize: 10, // text-sm = 14px (match HTML)
      color: template.styles.colors.text,
      fontWeight: "normal",
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    socialLinks: {
      flexDirection: "column",
      marginTop: 8, // mt-2 = 8px
      gap: 4, // space-y-1 = 4px
    },
    socialLink: {
      fontSize: 10, // text-sm = 14px (match HTML)
      color: template.styles.colors.text,
      fontWeight: "normal",
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    mainContent: {
      // paddingHorizontal: 32, // p-8 = 32px (match HTML)
      paddingVertical: 12, // p-8 = 32px (match HTML)
    },
    sectionContainer: {
      marginBottom: 14, // space-y-6 = 18px
    },
    sectionTitle: {
      fontSize: 10, // text-sm = 14px (match HTML)
      fontWeight: "bold",
      marginBottom: 6, // space-y-3 = 12px (match HTML)
      backgroundColor: "#f3f4f6", // bg-gray-100 (match HTML)
      paddingVertical: 8, // p-3 = 12px (match HTML)
      paddingHorizontal: 12, // p-3 = 12px (match HTML)
      textTransform: "uppercase",
      letterSpacing: 0.05, // tracking-wide
      color: template.styles.colors.text,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
      borderLeftWidth: 4, // border-l-4 (match HTML)
      borderLeftColor: "#dc2626", // border-red-600 (match HTML)
    },
    sectionContent: {
      marginBottom: 6, // space-y-3 = 12px
    },
    itemContainer: {
      marginBottom: 10, // space-y-1 = 4px
    },
    itemTitle: {
      fontSize: template.styles.typography.bodySize || 10,
      fontWeight: "bold", // font-semibold
      color: template.styles.colors.text,
      marginBottom: 2,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemSubtitle: {
      fontSize: template.styles.typography.bodySize || 10,
      color: template.styles.colors.secondary,
      marginBottom: 4,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemDate: {
      fontSize: (template.styles.typography.bodySize || 10) - 1, // text-xs
      color: template.styles.colors.secondary,
      marginBottom: 6,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemDescription: {
      fontSize: (template.styles.typography.bodySize || 10) - 1,
      color: template.styles.colors.text,
      marginBottom: 4,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    bullet: {
      marginLeft: 6, // pl-6 = 24px
      fontSize: (template.styles.typography.bodySize || 10) - 1,
      color: template.styles.colors.text,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    bulletList: {
      marginTop: 2, // mt-2 = 8px
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {personalInfo && (
          <View style={styles.header}>
            {/* Left Side - Image, Name, Title, Contact */}
            <View style={styles.headerLeft}>
              {/* {personalInfo.data.image && (
                <Image
                  src={personalInfo.data.image}
                  style={styles.profileImage}
                />
              )} */}
              <View style={styles.nameTitle}>
                <Text style={styles.name}>
                  {personalInfo.data.firstName} {personalInfo.data.lastName}
                </Text>
                {personalInfo.data.targetedJobTitle && (
                  <Text style={styles.title}>
                    {personalInfo.data.targetedJobTitle}
                  </Text>
                )}

                {personalInfo.data.email && (
                  <Text style={styles.contactItem}>
                    <Text style={{ fontWeight: "600" }}>Email: </Text>
                    {personalInfo.data.email}
                  </Text>
                )}
                {personalInfo.data.phone && (
                  <Text style={styles.contactItem}>
                    <Text style={{ fontWeight: "600" }}>Phone: </Text>
                    {personalInfo.data.phone}
                  </Text>
                )}
                {personalInfo.data.location && (
                  <Text style={styles.contactItem}>
                    <Text style={{ fontWeight: "600" }}>Location: </Text>
                    {personalInfo.data.location}
                  </Text>
                )}
              </View>
            </View>

            {/* Right Side - Location and Social Links */}
            <View style={styles.contactInfo}>
              {/* Social Links */}
              <View style={styles.socialLinks}>
                {personalInfo.data.linkedin && (
                  <Text style={styles.socialLink}>
                    <Text style={{ fontWeight: "600" }}>LinkedIn: </Text>
                    {personalInfo.data.linkedin}
                  </Text>
                )}
                {personalInfo.data.github && (
                  <Text style={styles.socialLink}>
                    <Text style={{ fontWeight: "600" }}>GitHub: </Text>
                    {personalInfo.data.github}
                  </Text>
                )}
                {personalInfo.data.twitter && (
                  <Text style={styles.socialLink}>
                    <Text style={{ fontWeight: "600" }}>Twitter: </Text>
                    {personalInfo.data.twitter}
                  </Text>
                )}
                {personalInfo.data.instagram && (
                  <Text style={styles.socialLink}>
                    <Text style={{ fontWeight: "600" }}>Instagram: </Text>
                    {personalInfo.data.instagram}
                  </Text>
                )}
                {personalInfo.data.website && (
                  <Text style={styles.socialLink}>
                    <Text style={{ fontWeight: "600" }}>Website: </Text>
                    {personalInfo.data.website}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {otherSections.map((section) => {
            const items = formatSectionContent(section);
            const displayName = getSectionDisplayName(section.type, section);

            return (
              <View key={section.id} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{displayName}</Text>

                {/* Skills - Render once for the entire section */}
                {(section.type as string) === "skills" && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 3, // gap-6 = 24px (match HTML)
                      marginBottom: 10,
                    }}
                  >
                    {Array.isArray(items) &&
                      items.map((item: any, i: number) => (
                        <View
                          key={i}
                          style={{
                            backgroundColor: "#2563eb", // bg-blue-600
                            paddingHorizontal: 8, // px-2 = 8px
                            paddingVertical: 4, // py-1 = 4px
                            borderRadius: 4, // rounded = 4px (match HTML)
                            marginBottom: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "#ffffff", // text-white
                              fontFamily: mapFontFamily(
                                template.styles.typography.fontFamily
                              ),
                              fontSize:
                                template.styles.typography.bodySize || 10,
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}

                {/* Languages - Render once for the entire section */}
                {(section.type as string) === "languages" && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 3, // gap-6 = 24px (match HTML)
                      marginBottom: 10,
                    }}
                  >
                    {Array.isArray(items) &&
                      items.map((item: any, i: number) => (
                        <View
                          key={i}
                          style={{
                            backgroundColor: "#2563eb", // bg-blue-600
                            paddingHorizontal: 8, // px-2 = 8px
                            paddingVertical: 4, // py-1 = 4px
                            borderRadius: 4, // rounded = 4px (match HTML)
                            marginBottom: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "#ffffff", // text-white
                              fontFamily: mapFontFamily(
                                template.styles.typography.fontFamily
                              ),
                              fontSize:
                                template.styles.typography.bodySize || 10,
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}

                {/* Other sections - Individual items */}
                {Array.isArray(items) &&
                  (section.type as string) !== "skills" &&
                  (section.type as string) !== "languages" &&
                  items.map((item: any, i: number) => (
                    <View key={i} style={styles.itemContainer}>
                      {/* Work Experience */}
                      {item.title && item.company && (
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text style={styles.itemTitle}>
                              {item.title} —{" "}
                              <Text style={{ fontStyle: "italic" }}>
                                {item.company}
                              </Text>
                            </Text>
                            {item.startDate && (
                              <Text style={styles.itemDate}>
                                {item.startDate} – {item.endDate}
                              </Text>
                            )}
                          </View>
                          {item.location && (
                            <Text style={styles.itemDate}>{item.location}</Text>
                          )}

                          {/* 🟦 Quill HTML (paragraphs, inline styles, lists…) */}
                          {item.description ? (
                            <RichPdf
                              html={item.description}
                              template={template}
                            />
                          ) : null}

                          {/* 🟩 Optional explicit bullets array (kept for backwards-compat) */}
                          {item.bullets?.length > 0 && (
                            <View style={styles.bulletList}>
                              {item.bullets.map((bullet: string, j: number) => {
                                // Split by paragraph breaks and render each as a bullet
                                const paragraphs = bullet
                                  .split(/<\/p>\s*<p[^>]*>/i)
                                  .map((p) =>
                                    p.replace(/<p[^>]*>|<\/p>/gi, "").trim()
                                  )
                                  .filter((p) => p.length > 0);

                                return paragraphs.map((paragraph, k) => (
                                  <Text key={`${j}-${k}`} style={styles.bullet}>
                                    • {convertHtmlToPdfText(paragraph)}
                                  </Text>
                                ));
                              })}
                            </View>
                          )}
                        </View>
                      )}

                      {/* Education */}
                      {item.degree && item.school && (
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text style={styles.itemTitle}>
                              {item.degree} —{" "}
                              <Text style={{ fontStyle: "italic" }}>
                                {item.field}
                              </Text>
                            </Text>
                            {item.startDate && (
                              <Text style={styles.itemDate}>
                                {item.startDate} – {item.endDate}
                              </Text>
                            )}
                          </View>
                          {item.location && (
                            <Text style={styles.itemDate}>
                              {item.school}
                              {item.gpa && ` • GPA: ${item.gpa}`}
                            </Text>
                          )}
                        </View>
                      )}

                      {/* Projects */}
                      {item.name && section.type === "projects" && (
                        <View>
                          <Text style={styles.itemTitle}>
                            {item.name}
                            {item.url && (
                              <Text style={{ color: "#2563eb" }}>
                                {" "}
                                • {item.url}
                              </Text>
                            )}
                          </Text>
                          {item.description ? (
                            <RichPdf
                              html={item.description}
                              template={template}
                            />
                          ) : null}
                          {item.technologies?.length > 0 && (
                            <Text style={styles.itemDate}>
                              Technologies: {item.technologies.join(", ")}
                            </Text>
                          )}
                        </View>
                      )}

                      {/* Certifications */}
                      {item.name &&
                        item.issuer &&
                        section.type === "certifications" && (
                          <View>
                            <Text style={styles.itemTitle}>
                              {item.name} — {item.issuer}
                            </Text>
                            {item.date && (
                              <Text style={styles.itemDate}>
                                {item.date}
                                {item.credentialId &&
                                  ` • ID: ${item.credentialId}`}
                              </Text>
                            )}
                          </View>
                        )}

                      {/* Awards */}
                      {item.title &&
                        item.issuer &&
                        section.type === "awards" && (
                          <View>
                            <Text style={styles.itemTitle}>
                              {item.title} — {item.issuer}
                            </Text>
                            {item.date && (
                              <Text style={styles.itemDate}>{item.date}</Text>
                            )}
                            {item.description ? (
                              <RichPdf
                                html={item.description}
                                template={template}
                              />
                            ) : null}
                          </View>
                        )}

                      {/* Interests */}
                      {item.name && section.type === "interests" && (
                        <Text style={styles.itemDescription}>
                          {item.name}
                          {item.description && ` - ${item.description}`}
                        </Text>
                      )}

                      {/* Professional Summary */}
                      {item.summary &&
                      section.type === "professional-summary" ? (
                        <RichPdf html={item.summary} template={template} />
                      ) : null}
                    </View>
                  ))}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
