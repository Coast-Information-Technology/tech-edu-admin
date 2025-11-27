import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Link,
  Svg,
  Path,
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
  FONTS,
} from "@/utils/cv/templateConstants";
import RichPdf from "../RichPdf";

export function ModernTemplatePdfRenderer({
  data,
  template,
  leftColumnSections = ["skills", "languages", "awards", "certifications"],
}: {
  data: ResumeSection[];
  template: TemplateLayout;
  leftColumnSections?: string[];
}) {
  // Register fonts before creating styles
  registerPDFFonts();

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
    result = result.replace(
      /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
      (match, content) => {
        return `\`\`\`\n${convertHtmlToPdfText(content)}\n\`\`\`\n`;
      }
    );
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
      padding: 0,
      fontSize: 10, // Reduced from 12 for PDF
      fontFamily: FONTS.pdf.default,
      lineHeight: 1.3,
      color: template.styles.colors.text,
      hyphenationCallback: (word: string) => [word], // Disable hyphenation
    },
    header: {
      paddingVertical: 20,
      paddingHorizontal: 24,
      backgroundColor: template.styles.colors.primary || "#1e40af",
      color: "#ffffff",
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 24,
    },
    profileImage: {
      width: 80,
      height: 100,
      objectFit: "cover",
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontSize: 24, // Reduced from 36 for PDF
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 6,
      fontFamily: FONTS.pdf.default,
    },
    title: {
      fontSize: 12, // Reduced from 18 for PDF
      color: "#ffffff",
      opacity: 0.9,
      marginTop: 10,
      marginBottom: 12,
      fontStyle: "italic",
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    contactGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    contactItem: {
      fontSize: 9, // Reduced from 14 for PDF
      color: "#ffffff",
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
      width: "45%",
      // marginBottom: 3,
    },
    contactItemWithIcon: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
      width: "45%",
      marginBottom: 3,
    },
    contactIcon: {
      color: "#ffffff",
      flexShrink: 0,
      marginTop: 1,
    },
    mainContent: {
      paddingVertical: 20,
      paddingHorizontal: 24,
    },
    twoColumnLayout: {
      flexDirection: "row",
      gap: 20,
    },
    leftColumn: {
      width: "35%", // 4/12 = 33% (col-span-4)
    },
    rightColumn: {
      width: "65%", // 8/12 = 67% (col-span-8)
    },
    sectionContainer: {
      marginBottom: 12,
    },
    leftSectionTitle: {
      fontSize: 11, // Reduced from 16 for PDF
      fontWeight: "bold",
      backgroundColor: template.styles.colors.primary || "#1e40af",
      color: "#ffffff",
      paddingVertical: 6,
      paddingHorizontal: 12,
      // borderRadius: 3,
      marginBottom: 8,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    rightSectionTitle: {
      fontSize: 12, // Reduced from 18 for PDF
      fontWeight: "bold",
      backgroundColor: template.styles.colors.primary || "#1e40af",
      color: "#ffffff",
      paddingVertical: 6,
      paddingHorizontal: 12,
      // borderRadius: 3,
      marginBottom: 8,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemContainer: {
      marginBottom: 12,
    },
    borderedItem: {
      borderLeftWidth: 3,
      borderLeftColor: template.styles.colors.primary || "#1e40af",
      paddingLeft: 12,
    },
    itemTitle: {
      fontSize: 10, // Reduced from 12 for PDF
      fontWeight: "bold",
      color: template.styles.colors.text,
      // marginBottom: 3,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemSubtitle: {
      fontSize: 9, // Reduced from 12 for PDF
      color: template.styles.colors.text,
      // marginBottom: 3,
      fontStyle: "italic",
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemDate: {
      fontSize: 8, // Reduced from 10 for PDF
      color: template.styles.colors.secondary,
      marginBottom: 3,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    itemDescription: {
      fontSize: 9, // Reduced from 11 for PDF
      color: template.styles.colors.text,
      // marginBottom: 3,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
      textAlign: "justify",
    },
    bullet: {
      marginLeft: 10,
      fontSize: 9, // Reduced from 11 for PDF
      color: template.styles.colors.text,
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
    },
    bulletList: {
      marginTop: 8,
    },
    skillItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    skillDot: {
      width: 12,
      height: 12,
      // borderRadius: 6,
      backgroundColor: template.styles.colors.primary || "#1e40af",
    },
    summaryBox: {
      marginBottom: 6,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    skillBadge: {
      backgroundColor: template.styles.colors.primary || "#1e40af", // Matches HTML: bg-blue-600
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 2,
    },
    skillBadgeText: {
      color: "#ffffff",
      fontFamily: mapFontFamily(template.styles.typography.fontFamily),
      fontSize: 7, // Reduced from 8 for PDF
    },
    workExperienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      // marginBottom: 4,
    },
    educationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      // marginBottom: 4,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {personalInfo && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {personalInfo.data.image &&
              personalInfo.data.image.trim() !== "" ? (
                <Image
                  src={personalInfo.data.image}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    {
                      backgroundColor: "#e5e7eb",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={{ color: "#6b7280", fontSize: 8 }}>
                    No Image
                  </Text>
                </View>
              )}
              <View style={styles.headerText}>
                <Text style={styles.name}>
                  {personalInfo.data.firstName} {personalInfo.data.lastName}
                </Text>
                {personalInfo.data.targetedJobTitle && (
                  <Text style={styles.title}>
                    {personalInfo.data.targetedJobTitle}
                  </Text>
                )}

                {/* Contact Info */}
                <View style={styles.contactGrid}>
                  {personalInfo.data.email && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                          fill="white"
                        />
                        <Path
                          d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.email}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.phone && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.phone}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.location && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.location}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.linkedin && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.linkedin}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.github && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.github}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.twitter && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.twitter}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.instagram && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M10 0C7.347 0 7 .347 7 .778v.44c0 .431.347.778.778.778h4.444c.431 0 .778-.347.778-.778v-.44C13 .347 12.653 0 12.222 0H10zM3.556 2.222C1.597 2.222 0 3.819 0 5.778v8.444C0 16.181 1.597 17.778 3.556 17.778h12.888C18.403 17.778 20 16.181 20 14.222V5.778c0-1.959-1.597-3.556-3.556-3.556H3.556zM10 4.444c3.056 0 5.556 2.5 5.556 5.556S13.056 15.556 10 15.556 4.444 13.056 4.444 10 6.944 4.444 10 4.444zm0 1.778c-2.083 0-3.778 1.695-3.778 3.778S7.917 13.778 10 13.778 13.778 12.083 13.778 10 12.083 6.222 10 6.222zM15.556 4.444c.694 0 1.222.528 1.222 1.222s-.528 1.222-1.222 1.222-1.222-.528-1.222-1.222.528-1.222 1.222-1.222z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.instagram}
                      </Text>
                    </View>
                  )}
                  {personalInfo.data.website && (
                    <View style={styles.contactItemWithIcon}>
                      <Svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          fill="white"
                        />
                      </Svg>
                      <Text style={styles.contactItem}>
                        {personalInfo.data.website}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Main Content - Two Column Layout */}
        <View style={styles.mainContent}>
          <View style={styles.twoColumnLayout}>
            {/* Left Column - 33% (Summary, Skills, Languages, Awards, Certificates) */}
            <View style={styles.leftColumn}>
              {otherSections
                .filter((section) => leftColumnSections.includes(section.type))
                .sort((a, b) => {
                  return (
                    leftColumnSections.indexOf(a.type) -
                    leftColumnSections.indexOf(b.type)
                  );
                })
                .map((section) => {
                  const items = formatSectionContent(section);
                  const displayName = getSectionDisplayName(
                    section.type,
                    section
                  );

                  return (
                    <View key={section.id} style={styles.sectionContainer}>
                      <Text style={styles.leftSectionTitle}>{displayName}</Text>

                      {/* Skills - Badge style */}
                      {(section.type as string) === "skills" && (
                        <View style={styles.skillsContainer}>
                          {Array.isArray(items) &&
                            items.map((item: any, i: number) => (
                              <View key={i} style={styles.skillBadge}>
                                <Text style={styles.skillBadgeText}>
                                  {item.name}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}

                      {/* Languages - Badge style */}
                      {(section.type as string) === "languages" && (
                        <View style={styles.skillsContainer}>
                          {Array.isArray(items) &&
                            items.map((item: any, i: number) => (
                              <View key={i} style={styles.skillBadge}>
                                <Text style={styles.skillBadgeText}>
                                  {item.name}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}

                      {/* Other left column sections - Individual items */}
                      {Array.isArray(items) &&
                        (section.type as string) !== "skills" &&
                        (section.type as string) !== "languages" &&
                        items.map((item: any, i: number) => (
                          <View key={i} style={styles.itemContainer}>
                            {/* Professional Summary */}
                            {item.summary &&
                              section.type === "professional-summary" && (
                                <View style={styles.summaryBox}>
                                  <RichPdf
                                    html={item.summary}
                                    template={template}
                                  />
                                </View>
                              )}

                            {/* Certifications */}
                            {item.name &&
                              item.issuer &&
                              section.type === "certifications" && (
                                <View style={styles.borderedItem}>
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
                                <View style={styles.borderedItem}>
                                  <Text style={styles.itemTitle}>
                                    {item.title} — {item.issuer}
                                  </Text>
                                  {item.date && (
                                    <Text style={styles.itemDate}>
                                      {item.date}
                                    </Text>
                                  )}
                                  {item.description ? (
                                    <RichPdf
                                      html={item.description}
                                      template={template}
                                    />
                                  ) : null}
                                </View>
                              )}
                          </View>
                        ))}
                    </View>
                  );
                })}
            </View>

            {/* Right Column - 67% (Other sections) */}
            <View style={styles.rightColumn}>
              {otherSections
                .filter((section) => !leftColumnSections.includes(section.type))
                .map((section) => {
                  const items = formatSectionContent(section);
                  const displayName = getSectionDisplayName(
                    section.type,
                    section
                  );

                  return (
                    <View key={section.id} style={styles.sectionContainer}>
                      <Text style={styles.rightSectionTitle}>
                        {displayName}
                      </Text>

                      {Array.isArray(items) &&
                        items.map((item: any, i: number) => (
                          <View key={i} style={styles.itemContainer}>
                            {/* Professional Summary */}
                            {item.summary &&
                              section.type === "professional-summary" && (
                                <View style={styles.summaryBox}>
                                  <RichPdf
                                    html={item.summary}
                                    template={template}
                                  />
                                </View>
                              )}

                            {/* Work Experience */}
                            {item.title && item.company && (
                              <View style={styles.borderedItem}>
                                <View style={styles.workExperienceHeader}>
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
                                  <Text style={styles.itemDate}>
                                    {item.location}
                                  </Text>
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

                                        return paragraphs.map(
                                          (paragraph, k) => (
                                            <Text
                                              key={`${j}-${k}`}
                                              style={styles.bullet}
                                            >
                                              •{" "}
                                              {paragraph.replace(
                                                /<[^>]*>/g,
                                                ""
                                              )}
                                            </Text>
                                          )
                                        );
                                      }
                                    )}
                                  </View>
                                )}
                              </View>
                            )}

                            {/* Education */}
                            {item.degree && item.field && (
                              <View style={styles.borderedItem}>
                                <View style={styles.educationHeader}>
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
                                {item.school && (
                                  <Text style={styles.itemDate}>
                                    {item.school}
                                    {item.gpa && ` • GPA: ${item.gpa}`}
                                  </Text>
                                )}
                              </View>
                            )}

                            {/* Projects */}
                            {item.name && section.type === "projects" && (
                              <View style={styles.borderedItem}>
                                <Text style={styles.itemTitle}>
                                  {item.name}
                                  {item.url && (
                                    <Text style={{ color: "#2563eb" }}>
                                      {" "}
                                      • {item.url}
                                    </Text>
                                  )}
                                </Text>
                                {item.description && (
                                  <Text style={styles.itemDescription}>
                                    {item.description.replace(/<[^>]*>/g, "")}
                                  </Text>
                                )}
                                {item.technologies?.length > 0 && (
                                  <Text style={styles.itemDate}>
                                    Technologies: {item.technologies.join(", ")}
                                  </Text>
                                )}
                              </View>
                            )}

                            {/* Interests */}
                            {item.name && section.type === "interests" && (
                              <View style={styles.skillItem}>
                                <View style={styles.skillDot} />
                                <Text style={styles.itemDescription}>
                                  {item.name}
                                  {item.description && ` - ${item.description}`}
                                </Text>
                              </View>
                            )}
                          </View>
                        ))}
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
