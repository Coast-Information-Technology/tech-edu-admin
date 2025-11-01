// components/cv/renderers/TwoColumnTemplatePdfRenderer.tsx
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Path,
  Font,
} from "@react-pdf/renderer";
import { ResumeSection } from "@/types/cv";
import { ColumnSectionType, TemplateLayout } from "@/types/cv/template";
import {
  formatSectionContent,
  getSectionDisplayName,
} from "@/utils/cv/sectionHelpers";
import { registerPDFFonts, mapFontFamily } from "@/utils/cv/fontUtils";
import {
  LAYOUT,
  SECTION_ORDER,
  FONTS,
  FONT_SIZES,
} from "@/utils/cv/templateConstants";

Font.registerHyphenationCallback((word) => [word]);
import RichPdf from "../RichPdf";

export function TwoColumnTemplatePdfRenderer({
  data,
  template,
}: {
  data: ResumeSection[];
  template: TemplateLayout;
}) {
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

  // order like HTML
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

  const leftColumnCfg = template.columns?.find((c) => c.id === "left");
  const rightColumnCfg = template.columns?.find((c) => c.id === "right");

  const leftColumnSections = otherSections.filter((section) =>
    leftColumnCfg?.sections?.includes(section.type as ColumnSectionType)
  );
  const rightColumnSections = otherSections.filter((section) =>
    rightColumnCfg?.sections?.includes(section.type as ColumnSectionType)
  );

  // Colors (mirror your HTML renderer defaults)
  const leftWidthPct = `${Number(leftColumnCfg?.width ?? 40)}%`;
  const rightWidthPct = `${100 - Number(leftColumnCfg?.width ?? 40)}%`;

  const leftBg = leftColumnCfg?.styles?.backgroundColor ?? "#1e3a8a";
  const rightBg = rightColumnCfg?.styles?.backgroundColor ?? "#ffffff";
  const leftText = leftColumnCfg?.styles?.textColor ?? "#f9fafb";
  const rightText = rightColumnCfg?.styles?.textColor ?? "#000000";

  const primary = template.styles?.colors?.primary ?? "#1e3a8a"; // used on right headings & dates in your HTML
  const secondary = template.styles?.colors?.secondary ?? "#64748b";
  const globalText = template.styles?.colors?.text ?? "#000000";
  const headerBg = template.styles?.colors?.headerBackground ?? "#60a5fa";

  // Sizing helpers to match HTML ui scale
  const pxToPt = (px: number) => px * 0.75;
  const htmlScale =
    typeof LAYOUT?.scale === "number" && LAYOUT.scale > 0 ? LAYOUT.scale : 1;

  const t = template.styles?.typography || ({} as any);
  const bodyPx = t.bodySize ?? 16; // default base size = 16px

  const sizesPx = {
    name: t.nameSize ?? FONT_SIZES.html.name ?? 48, // h1
    title: t.titleSize ?? FONT_SIZES.html.title ?? 24, // targeted title
    heading: t.headingSize ?? FONT_SIZES.html.heading ?? 18, // section headings
    body: bodyPx ?? 16, // base
    small: t.smallSize ?? FONT_SIZES.html.small ?? 16,
    // contact should equal body (per your requirement)
    contact: bodyPx ?? 16,
  };

  const SZ = {
    name: pxToPt(sizesPx.name * htmlScale),
    title: pxToPt(sizesPx.title * htmlScale),
    heading: pxToPt(sizesPx.heading * htmlScale),
    body: pxToPt(sizesPx.body * htmlScale),
    small: pxToPt(sizesPx.small * htmlScale),
    contact: pxToPt(sizesPx.contact * htmlScale),
  };

  const addPt = (px: number) => pxToPt(px * htmlScale);
  const bodyVPad = addPt(24); // vertical gutter that reappears on every split page
  const bodyHPad = addPt(0); // keep 0 so header looks identical to HTML (columns have their own p-8)
  const colPad = (px: number) => addPt(px);

  const styles = StyleSheet.create({
    // Ensure consistent vertical gutters on every page, including after page breaks
    page: {
      paddingTop: bodyVPad,
      paddingBottom: bodyVPad,
      paddingHorizontal: 0,
      fontSize: SZ.body,
      fontFamily: mapFontFamily(t.fontFamily) || FONTS.pdf.default,
      lineHeight: t.lineHeight || 1.4,
      color: globalText,
      flexDirection: "column",
    },

    // Simulate your split background with fixed layers (like your CSS gradient)
    pageBgFixed: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: rightBg,
    },
    leftBgFixed: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: leftWidthPct,
      backgroundColor: leftBg,
    },

    // Header (only page 1)
    header: {
      paddingVertical: colPad(32), // py-8
      paddingHorizontal: colPad(32), // px-8
      backgroundColor: headerBg,
      textAlign: "center",
      // Pull header up by the page's vertical padding so it hugs the top edge
      marginTop: -bodyVPad,
    },
    name: {
      fontSize: SZ.name, // text-5xl
      fontWeight: "bold",
      color: globalText,
      marginBottom: colPad(24),
    },
    title: {
      fontSize: SZ.title, // text-xl
      textTransform: "uppercase",
      color: rightBg,
      marginTop: colPad(12),
    },

    // FLOW WRAPPER under header
    body: {
      paddingTop: 0,
      paddingBottom: 0,
      // Cancel page top padding on first page only; continuation pages keep top padding
      marginTop: -bodyVPad,
      paddingHorizontal: bodyHPad,
      flexGrow: 1,
      flexDirection: "column",
    },

    twoColumnLayout: {
      flexDirection: "row",
      flexGrow: 1,
    },

    // Columns use p-8 (like your HTML)
    leftColumn: {
      width: leftWidthPct,
      paddingVertical: colPad(48),
      paddingHorizontal: colPad(42),
      backgroundColor: "transparent",
      color: leftText,
      alignSelf: "stretch",
    },
    rightColumn: {
      width: rightWidthPct,
      paddingVertical: colPad(48),
      paddingHorizontal: colPad(42),
      backgroundColor: "transparent",
      color: rightText,
      alignSelf: "stretch",
    },

    // Section titles (mirror borders + uppercase)
    sectionTitle: {
      fontSize: SZ.heading,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    leftSectionTitle: {
      color: leftText,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: leftText,
      borderBottomColor: leftText,
      paddingVertical: colPad(4),
      marginBottom: colPad(16),
    },
    rightSectionTitle: {
      color: primary,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: primary,
      borderBottomColor: primary,
      paddingVertical: colPad(4),
      marginBottom: colPad(8),
    },

    // Contact (same size as body)
    contactInfo: { marginBottom: colPad(32) },
    contactRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: colPad(8),
    },
    contactIcon: {
      marginRight: colPad(8),
      marginTop: 1,
      flexShrink: 0,
    },
    contactText: {
      fontSize: SZ.contact, // same as body
      lineHeight: t.lineHeight || 1.4,
      color: leftText,
    },

    // Items
    block: { marginBottom: colPad(32) }, // section gap
    item: { marginBottom: colPad(16) },
    itemTitle: {
      // in HTML you use bodySize + 2 for titles
      fontSize: SZ.body + addPt(2),
      fontWeight: "bold",
      marginBottom: colPad(4),
    },
    itemCompany: {
      fontSize: SZ.body,
      fontStyle: "italic",
      color: primary,
    },
    itemDate: {
      fontSize: SZ.body - addPt(1), // body - 1
      color: primary,
    },
    itemLocation: {
      fontSize: SZ.body - addPt(1),
      color: "#666666",
    },
    itemDescription: {
      fontSize: SZ.body,
      lineHeight: t.lineHeight || 1.4,
      color: rightText,
    },
    bullet: {
      fontSize: SZ.body - addPt(1), // bullets like HTML
      marginLeft: colPad(12), // list indent
    },

    // Left/body text variants
    leftTextBody: { color: leftText, fontSize: SZ.body },
    smallMuted: { fontSize: SZ.small, color: secondary },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Split background layers every page */}
        <View style={styles.pageBgFixed} fixed />
        <View style={styles.leftBgFixed} fixed />

        {/* Header only on page 1 */}
        {personalInfo && (
          <View style={styles.header} wrap={false}>
            <Text style={styles.name}>
              {personalInfo.data.firstName} {personalInfo.data.lastName}
            </Text>
            {personalInfo.data.targetedJobTitle && (
              <Text style={styles.title}>
                {personalInfo.data.targetedJobTitle}
              </Text>
            )}
          </View>
        )}

        {/* Flow wrapper adds vertical gutters on every continuation page */}
        <View style={styles.body}>
          <View style={styles.twoColumnLayout}>
            {/* LEFT COLUMN */}
            <View style={styles.leftColumn}>
              {/* Contact */}
              {personalInfo && (
                <View style={styles.block}>
                  <Text style={[styles.sectionTitle, styles.leftSectionTitle]}>
                    Contact
                  </Text>

                  {personalInfo.data.email && (
                    <View style={styles.contactRow}>
                      <Svg
                        width="11"
                        height="11"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                          fill={leftText}
                        />
                        <Path
                          d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                          fill={leftText}
                        />
                      </Svg>
                      <Text style={styles.contactText}>
                        {personalInfo.data.email}
                      </Text>
                    </View>
                  )}

                  {personalInfo.data.phone && (
                    <View style={styles.contactRow}>
                      <Svg
                        width="11"
                        height="11"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                          fill={leftText}
                        />
                      </Svg>
                      <Text style={styles.contactText}>
                        {personalInfo.data.phone}
                      </Text>
                    </View>
                  )}

                  {personalInfo.data.location && (
                    <View style={styles.contactRow}>
                      <Svg
                        width="11"
                        height="11"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          fill={leftText}
                        />
                      </Svg>
                      <Text style={styles.contactText}>
                        {personalInfo.data.location}
                      </Text>
                    </View>
                  )}

                  {personalInfo.data.linkedin && (
                    <View style={styles.contactRow}>
                      <Svg
                        width="11"
                        height="11"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          fill={leftText}
                        />
                      </Svg>
                      <Text style={styles.contactText}>
                        {personalInfo.data.linkedin}
                      </Text>
                    </View>
                  )}

                  {personalInfo.data.github && (
                    <View style={styles.contactRow}>
                      <Svg
                        width="11"
                        height="11"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          fill={leftText}
                        />
                      </Svg>
                      <Text style={styles.contactText}>
                        {personalInfo.data.github}
                      </Text>
                    </View>
                  )}

                  {personalInfo.data.website && (
                    <View style={styles.contactRow}>
                      <Svg
                        width="11"
                        height="11"
                        viewBox="0 0 20 20"
                        style={styles.contactIcon}
                      >
                        <Path
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          fill={leftText}
                        />
                      </Svg>
                      <Text style={styles.contactText}>
                        {personalInfo.data.website}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Left column sections */}
              {leftColumnSections.map((section) => {
                const items = formatSectionContent(section);
                const displayName = getSectionDisplayName(
                  section.type,
                  section
                );

                return (
                  <View key={section.id} style={styles.block}>
                    <Text
                      style={[styles.sectionTitle, styles.leftSectionTitle]}
                    >
                      {displayName.toUpperCase()}
                    </Text>

                    {Array.isArray(items) &&
                      items.map((item: any, i: number) => (
                        <View key={i} style={styles.item}>
                          {/* Skills */}
                          {item.name &&
                            item.level &&
                            section.type === "skills" && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Text style={[styles.leftTextBody]}>
                                  {item.name}
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                  {[1, 2, 3, 4, 5].map((dot) => {
                                    const levelMap = {
                                      Beginner: 1,
                                      Amateur: 2,
                                      Intermediate: 3,
                                      Advanced: 4,
                                      Expert: 5,
                                    };
                                    const filled =
                                      dot <=
                                      (levelMap[
                                        item.level as keyof typeof levelMap
                                      ] || 0);
                                    return (
                                      <View
                                        key={dot}
                                        style={{
                                          width: 4,
                                          height: 4,
                                          borderRadius: 2,
                                          marginLeft: 2,
                                          backgroundColor: filled
                                            ? leftText
                                            : `${leftText}40`,
                                        }}
                                      />
                                    );
                                  })}
                                </View>
                              </View>
                            )}

                          {/* Languages */}
                          {item.name &&
                            item.level &&
                            section.type === "languages" && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Text style={[styles.leftTextBody]}>
                                  {item.name}
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                  {[1, 2, 3, 4, 5].map((dot) => {
                                    const levelMap = {
                                      Basic: 1,
                                      Amateur: 2,
                                      Conversational: 3,
                                      Professional: 4,
                                      Native: 5,
                                    };
                                    const filled =
                                      dot <=
                                      (levelMap[
                                        item.level as keyof typeof levelMap
                                      ] || 0);
                                    return (
                                      <View
                                        key={dot}
                                        style={{
                                          width: 4,
                                          height: 4,
                                          borderRadius: 2,
                                          marginLeft: 2,
                                          backgroundColor: filled
                                            ? leftText
                                            : `${leftText}40`,
                                        }}
                                      />
                                    );
                                  })}
                                </View>
                              </View>
                            )}

                          {/* Interests */}
                          {item.name && section.type === "interests" && (
                            <Text style={[styles.leftTextBody]}>
                              {item.name}
                              {item.description && ` - ${item.description}`}
                            </Text>
                          )}

                          {/* Summary (left) */}
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

            {/* RIGHT COLUMN */}
            <View style={styles.rightColumn}>
              {rightColumnSections.map((section) => {
                const items = formatSectionContent(section);
                const displayName = getSectionDisplayName(
                  section.type,
                  section
                );

                return (
                  <View key={section.id} style={styles.block}>
                    <Text
                      style={[styles.sectionTitle, styles.rightSectionTitle]}
                    >
                      {displayName.toUpperCase()}
                    </Text>

                    {Array.isArray(items) &&
                      items.map((item: any, i: number) => (
                        <View key={i} style={styles.item}>
                          {/* Summary (right) */}
                          {item.summary &&
                          section.type === "professional-summary" ? (
                            <RichPdf html={item.summary} template={template} />
                          ) : null}

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
                                <Text
                                  style={[
                                    styles.itemTitle,
                                    { color: "#000000" },
                                  ]}
                                >
                                  {item.title}
                                </Text>
                                {item.startDate && (
                                  <Text style={styles.itemDate}>
                                    {item.startDate} –{" "}
                                    {item.endDate || "Present"}
                                  </Text>
                                )}
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: colPad(4),
                                }}
                              >
                                <Text style={styles.itemCompany}>
                                  {item.company}
                                </Text>
                                {item.location && (
                                  <Text style={styles.itemLocation}>
                                    {item.location}
                                  </Text>
                                )}
                              </View>

                              {/* 🟦 Quill HTML (paragraphs, inline styles, lists…) */}
                              {item.description ? (
                                <RichPdf
                                  html={item.description}
                                  template={template}
                                />
                              ) : null}

                              {/* 🟩 Optional explicit bullets array (kept for backwards-compat) */}
                              {item.bullets?.length > 0 && (
                                <View>
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
                                        <Text
                                          key={`${j}-${k}`}
                                          style={styles.bullet}
                                        >
                                          • {convertHtmlToPdfText(paragraph)}
                                        </Text>
                                      ));
                                    }
                                  )}
                                </View>
                              )}
                            </View>
                          )}

                          {/* Education */}
                          {item.degree && item.field && (
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Text
                                  style={[
                                    styles.itemTitle,
                                    { color: "#000000" },
                                  ]}
                                >
                                  {item.degree}
                                </Text>
                                {item.startDate && (
                                  <Text style={styles.itemDate}>
                                    {item.startDate} –{" "}
                                    {item.endDate || "Present"}
                                  </Text>
                                )}
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: colPad(4),
                                }}
                              >
                                <Text style={styles.itemCompany}>
                                  {item.field}
                                </Text>
                                {item.school && (
                                  <Text style={styles.itemLocation}>
                                    {item.school}
                                  </Text>
                                )}
                              </View>
                              {item.gpa && (
                                <Text style={styles.itemDate}>
                                  GPA: {item.gpa}
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

                          {/* Projects */}
                          {item.name && section.type === "projects" && (
                            <View>
                              <Text
                                style={[styles.itemTitle, { color: rightText }]}
                              >
                                {item.name}
                                {item.url && <Text> • {item.url}</Text>}
                              </Text>
                              {item.description ? (
                                <RichPdf
                                  html={item.description}
                                  template={template}
                                />
                              ) : null}
                              {item.technologies?.length > 0 && (
                                <Text
                                  style={[
                                    styles.itemDate,
                                    { color: secondary },
                                  ]}
                                >
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
                                <Text
                                  style={[
                                    styles.itemTitle,
                                    { color: rightText },
                                  ]}
                                >
                                  {item.name} — {item.issuer}
                                </Text>
                                {item.date && (
                                  <Text
                                    style={[
                                      styles.itemDate,
                                      { color: secondary },
                                    ]}
                                  >
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
                                <Text
                                  style={[
                                    styles.itemTitle,
                                    { color: rightText },
                                  ]}
                                >
                                  {item.title} — {item.issuer}
                                </Text>
                                {item.date && (
                                  <Text
                                    style={[
                                      styles.itemDate,
                                      { color: secondary },
                                    ]}
                                  >
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
          </View>
        </View>
      </Page>
    </Document>
  );
}
