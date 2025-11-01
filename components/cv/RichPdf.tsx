// components/RichPdf.tsx
import React from "react";
import { View, Text, StyleSheet, Link } from "@react-pdf/renderer";
import { TemplateLayout } from "@/types/cv/template";
import { mapFontFamily } from "@/utils/cv/fontUtils";
import { htmlToBlocks, InlineRun, PdfBlock } from "@/utils/cv/richBlocks";

/**
 * Styles strictly compatible with @react-pdf/renderer:
 * - Use arrays for multiple styles (no StyleSheet.flatten).
 * - Only Text contains strings/newlines; View used for block/rows.
 */
export function createRichPdfStyles(template: TemplateLayout) {
  const base = Math.max(9, (template?.styles?.typography?.bodySize ?? 10) - 1);
  const family = mapFontFamily(template?.styles?.typography?.fontFamily);
  const color = template?.styles?.colors?.text ?? "#111827";

  return StyleSheet.create({
    root: { marginTop: 4 },

    // Paragraphs / headings
    p: {
      fontSize: base,
      color,
      marginBottom: 3,
      fontFamily: family,
      lineHeight: 1.3,
    },
    h1: {
      fontSize: Math.max(14, base + 3),
      fontWeight: 700 as any,
      marginTop: 4,
      marginBottom: 2,
      color,
      fontFamily: family,
    },
    h2: {
      fontSize: Math.max(12, base + 1),
      fontWeight: 700 as any,
      marginTop: 4,
      marginBottom: 2,
      color,
      fontFamily: family,
    },
    h3: {
      fontSize: Math.max(11, base),
      fontWeight: 700 as any,
      marginTop: 4,
      marginBottom: 2,
      color,
      fontFamily: family,
    },

    // Inline flags (applied via arrays)
    bold: { fontWeight: 700 as any },
    italic: { fontStyle: "italic" },
    underline: { textDecoration: "underline" },
    strike: { textDecoration: "line-through" },
    codeInline: {
      fontFamily: "Courier",
      fontSize: base,
      backgroundColor: "#f3f4f6",
      paddingHorizontal: 2,
      borderRadius: 2,
    },
    link: { color: "#2563eb", textDecoration: "underline" },

    // Blockquote / pre
    blockquoteBox: {
      borderLeftWidth: 3,
      borderLeftColor: "#d1d5db",
      paddingLeft: 6,
      marginVertical: 4,
    },
    blockquoteText: {
      fontStyle: "italic",
      fontSize: base,
      color,
      fontFamily: family,
      lineHeight: 1.3,
    },
    preBox: {
      backgroundColor: "#f3f4f6",
      padding: 6,
      borderRadius: 3,
      marginVertical: 4,
    },
    preText: { fontFamily: "Courier", fontSize: base, color },

    // Lists
    listBox: { marginTop: 2, marginBottom: 4 },
    // in createRichPdfStyles
    liRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 3,
    },
    bullet: {
      width: 12,
      fontFamily: "Helvetica",
      fontSize: base,
      lineHeight: 1.3, // ⬅ match content lineHeight
      color,
      marginRight: 4, // small gap so wrapped lines don't touch bullet
    },
    liText: {
      flex: 1, // ⬅ important: content Text grows and defines row height
      fontSize: base,
      color,
      fontFamily: family,
      lineHeight: 1.3,
    },
  });
}

/**
 * Render a sequence of InlineRun objects.
 * IMPORTANT: split on "\n" so <br> becomes real line breaks inside paragraphs and <li>.
 */
function InlineRuns({
  runs,
  styles,
  baseStyle,
}: {
  runs: InlineRun[];
  styles: ReturnType<typeof createRichPdfStyles>;
  baseStyle: any;
}) {
  return (
    <Text style={baseStyle}>
      {runs.map((r, i) => {
        const styleParts: any[] = [];
        if (r.bold) styleParts.push(styles.bold);
        if (r.italic) styleParts.push(styles.italic);
        if (r.underline) styleParts.push(styles.underline);
        if (r.strike) styleParts.push(styles.strike);
        if (r.code) styleParts.push(styles.codeInline);

        const parts = (r.text ?? "").split("\n");

        if (r.href) {
          return (
            <React.Fragment key={i}>
              {parts.map((part, idx) => (
                <Link
                  key={`${i}-${idx}`}
                  src={r.href!}
                  style={[...styleParts, styles.link]}
                >
                  {part}
                  {idx < parts.length - 1 ? "\n" : ""}
                </Link>
              ))}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={i}>
            {parts.map((part, idx) => (
              <Text
                key={`${i}-${idx}`}
                style={styleParts.length ? styleParts : undefined}
              >
                {part}
                {idx < parts.length - 1 ? "\n" : ""}
              </Text>
            ))}
          </React.Fragment>
        );
      })}
    </Text>
  );
}

/** Ordered/Unordered list renderer. Each <li> is its own row (View). */
function List({
  items,
  ordered,
  S,
}: {
  items: InlineRun[][];
  ordered: boolean;
  S: ReturnType<typeof createRichPdfStyles>;
}) {
  let n = 1;
  return (
    <View style={S.listBox}>
      {items.map((runs, idx) => (
        <View key={idx} style={S.liRow}>
          <Text style={S.bullet}>{ordered ? `${n++}.` : "•"}</Text>
          {/* Content must be a Text sibling with flex:1 */}
          <InlineRuns runs={runs} styles={S} baseStyle={S.liText} />
        </View>
      ))}
    </View>
  );
}

/**
 * Drop-in component:
 *   <RichPdf html={quillHtml} template={template} />
 * Uses your htmlToBlocks (from richBlocks.ts) and renders with react-pdf primitives.
 */
export default function RichPdf({
  html,
  template,
}: {
  html: string;
  template: TemplateLayout;
}) {
  const S = createRichPdfStyles(template);
  const blocks: PdfBlock[] = htmlToBlocks(html);
  if (!blocks || blocks.length === 0) return null;

  return (
    <View style={S.root}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h":
            return (
              <InlineRuns
                key={i}
                runs={b.runs}
                styles={S}
                baseStyle={b.level === 1 ? S.h1 : b.level === 2 ? S.h2 : S.h3}
              />
            );

          case "p":
            return (
              <InlineRuns key={i} runs={b.runs} styles={S} baseStyle={S.p} />
            );

          case "blockquote":
            return (
              <View key={i} style={S.blockquoteBox}>
                <Text style={S.blockquoteText}>
                  <InlineRuns runs={b.runs} styles={S} baseStyle={{}} />
                </Text>
              </View>
            );

          case "pre":
            return (
              <View key={i} style={S.preBox}>
                <Text style={S.preText}>{b.text}</Text>
              </View>
            );

          case "ul":
            return <List key={i} items={b.items} ordered={false} S={S} />;

          case "ol":
            return <List key={i} items={b.items} ordered={true} S={S} />;

          case "br":
            // explicit line break block between paragraphs (rare)
            return (
              <Text key={i} style={S.p}>
                {"\n"}
              </Text>
            );

          default:
            return null;
        }
      })}
    </View>
  );
}
