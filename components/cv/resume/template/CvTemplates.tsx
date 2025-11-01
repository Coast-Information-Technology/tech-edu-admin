// src/components/resume/templates/CvTemplates.tsx
// Classic (one-column) and Sidebar (two-column) resume templates
// Wire these up to your existing section components via `sectionRenderers`.
// Drop-in usage:
//   import { TemplateClassic, TemplateSidebar } from "@/components/resume/templates/CvTemplates";
//   <TemplateClassic sections={sections} />
//   <TemplateSidebar sections={sections} />

import * as React from "react";
import { sectionRenderers } from "../sections/SectionRenderers";
// If your types live elsewhere, adjust this import:
import type { ResumeSection } from "@/types/cv";

/**
 * Shared style contract for templates. Your existing sections already accept a `templateStyles`
 * object with a very similar shape, so we keep it compatible on purpose.
 */
export type TemplateStyles = {
  colors: {
    primary: string;
    text: string;
    secondary?: string;
    background?: string;
    divider?: string;
  };
  typography: {
    headingSize: number; // section titles
    bodySize: number; // section body font size
    fontFamily?: string;
  };
  spacing: {
    sectionGap: number; // vertical gap between sections
    margin: number; // bottom margin under headings
    pagePadding?: number; // overall page padding
    columnGap?: number; // used by Sidebar layout
  };
  accents?: {
    chipBg?: string; // useful if your SkillsSection uses a pill/chip
    pillRadius?: number;
  };
};

const defaultStyles: TemplateStyles = {
  colors: {
    primary: "#1e3a8a",
    text: "#111827",
    secondary: "#6b7280",
    background: "#ffffff",
    divider: "#e5e7eb",
  },
  typography: {
    headingSize: 18,
    bodySize: 14,
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial",
  },
  spacing: {
    sectionGap: 24,
    margin: 16,
    pagePadding: 28,
    columnGap: 28,
  },
  accents: {
    chipBg: "#1e3a8a10",
    pillRadius: 16,
  },
};

/** Utility to shallow-merge user style overrides into defaults */
function mergeStyles(overrides?: Partial<TemplateStyles>): TemplateStyles {
  if (!overrides) return defaultStyles;
  return {
    colors: { ...defaultStyles.colors, ...(overrides.colors || {}) },
    typography: {
      ...defaultStyles.typography,
      ...(overrides.typography || {}),
    },
    spacing: { ...defaultStyles.spacing, ...(overrides.spacing || {}) },
    accents: { ...defaultStyles.accents, ...(overrides.accents || {}) },
  };
}

/**
 * Render helper — forwards each section to its dedicated renderer.
 * Ensures we always pass the resolved `templateStyles` down to keep look & feel consistent.
 */
function renderSection(section: ResumeSection, tplStyles: TemplateStyles) {
  // Every section already expects `templateStyles` on the object; if missing, inject here
  const hydrated: ResumeSection = section.templateStyles
    ? section
    : ({ ...section, templateStyles: tplStyles } as ResumeSection);

  const fn = sectionRenderers[hydrated.type];
  return fn ? (
    <div
      key={(hydrated as any).id ?? hydrated.type + Math.random()}
      className="cv-section"
      style={{ breakInside: "avoid" }}
    >
      {fn(hydrated)}
    </div>
  ) : null;
}

/** A couple of sensible defaults for grouping in the Sidebar template */
const DEFAULT_SIDEBAR_LEFT: ResumeSection["type"][] = [
  "personal-info",
  "skills",
  "languages",
  "certifications",
  "awards",
  "interests",
];

export type TemplateProps = {
  /** Ordered list of sections to render */
  sections: ResumeSection[];
  /** Optional overall style overrides for this template */
  styles?: Partial<TemplateStyles>;
  /** Extra className for outer wrapper */
  className?: string;
  /**
   * Sidebar template only: which section types should be pinned to the left column.
   * Everything else will flow to the right column in the order supplied by `sections`.
   */
  sidebarLeftTypes?: ResumeSection["type"][];
  /** Whether to hide the heading for certain types (e.g., Summary under Personal Info) */
  hideHeadingsForTypes?: ResumeSection["type"][];
};

/**
 * Template 1 — Classic One-Column
 *
 * A clean, single-column layout. Good for ATS and simple printing.
 */
export function TemplateClassic({
  sections,
  styles,
  className,
  hideHeadingsForTypes = ["professional-summary"],
}: TemplateProps) {
  const tpl = mergeStyles(styles);

  // Optionally hide headings by mutating section flags on the fly
  const prepared = sections.map((s) =>
    hideHeadingsForTypes.includes(s.type)
      ? ({ ...s, showHeading: false } as ResumeSection)
      : s
  );

  return (
    <div
      className={className}
      style={{
        background: tpl.colors.background,
        color: tpl.colors.text,
        fontFamily: tpl.typography.fontFamily,
        padding: tpl.spacing.pagePadding,
      }}
    >
      {/* Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tpl.spacing.sectionGap,
        }}
      >
        {prepared.map((sec) => renderSection(sec, tpl))}
      </div>

      {/* Print / pagination helpers */}
      <style jsx>{`
        @media print {
          .cv-section {
            page-break-inside: avoid;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Template 2 — Modern Sidebar (Two-Column)
 *
 * Left column for identity & quick facts; right column for narrative sections.
 */
export function TemplateSidebar({
  sections,
  styles,
  className,
  sidebarLeftTypes = DEFAULT_SIDEBAR_LEFT,
  hideHeadingsForTypes = ["personal-info", "professional-summary"],
}: TemplateProps) {
  const tpl = mergeStyles(styles);

  // Partition into left vs right based on the provided type list but keep original order
  const left: ResumeSection[] = [];
  const right: ResumeSection[] = [];

  for (const s of sections) {
    if (sidebarLeftTypes.includes(s.type)) left.push(s);
    else right.push(s);
  }

  // Hide headings for some types commonly better without titles in a sidebar layout
  const prepare = (arr: ResumeSection[]) =>
    arr.map((s) =>
      hideHeadingsForTypes.includes(s.type)
        ? ({ ...s, showHeading: false } as ResumeSection)
        : s
    );

  const leftPrepared = prepare(left);
  const rightPrepared = prepare(right);

  return (
    <div
      className={className}
      style={{
        background: tpl.colors.background,
        color: tpl.colors.text,
        fontFamily: tpl.typography.fontFamily,
        padding: tpl.spacing.pagePadding,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "32% 1fr",
          gap: tpl.spacing.columnGap,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: tpl.spacing.sectionGap,
            borderRight: `1px solid ${tpl.colors.divider}`,
            paddingRight: (tpl.spacing.columnGap || 28) / 2,
          }}
        >
          {leftPrepared.map((sec) => renderSection(sec, tpl))}
        </aside>

        {/* RIGHT */}
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            gap: tpl.spacing.sectionGap,
          }}
        >
          {rightPrepared.map((sec) => renderSection(sec, tpl))}
        </main>
      </div>

      {/* Print helpers */}
      <style jsx>{`
        @media print {
          .cv-section {
            page-break-inside: avoid;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

/** Optional: a tiny registry to switch templates by key */
export const resumeTemplates = {
  classic: TemplateClassic,
  sidebar: TemplateSidebar,
} as const;

export type TemplateKey = keyof typeof resumeTemplates;

export function ResumeRenderer({
  template = "classic",
  ...props
}: { template?: TemplateKey } & TemplateProps) {
  const Tpl = resumeTemplates[template];
  return <Tpl {...props} />;
}

/**
 * Default export for quick visual smoke test in this Canvas.
 * In your app, you likely won't use this component; instead, import the named exports above.
 */
export default function CvTemplatesPreview() {
  // --- Example snippets shown below as strings to avoid JSX escaping noise ---
  const sampleClassic = `\u003cTemplateClassic sections={sections} styles={{ colors: { primary: "#7c3aed" } }} /\u003e`;
  const sampleSidebar = `\u003cTemplateSidebar sections={sections} sidebarLeftTypes={["personal-info","skills","languages"]} /\u003e`;

  // --- Minimal DEV sanity tests (run-time) ---
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    // 1) mergeStyles should override provided keys
    const testStyles = mergeStyles({
      colors: { primary: "#000", text: "#111827" },
    });
    if (testStyles.colors.primary !== "#000") {
      // eslint-disable-next-line no-console
      console.error("[TEST] mergeStyles override failed");
    }

    // 2) renderSection should return a valid React node when a known section is provided
    const demoSec = {
      type: "professional-summary",
      heading: "Summary",
      data: { summary: "<p>Quick summary</p>" },
    } as unknown as ResumeSection;
    const node = renderSection(demoSec, defaultStyles);
    if (node === undefined) {
      // eslint-disable-next-line no-console
      console.error("[TEST] renderSection returned undefined");
    }
  }

  return (
    <div style={{ fontFamily: defaultStyles.typography.fontFamily }}>
      <p style={{ fontSize: 14, color: "#6b7280" }}>
        <strong>CV Templates loaded.</strong> Import {"{"}TemplateClassic,
        TemplateSidebar{"}"}" and render them with your <code>sections</code>{" "}
        array.
      </p>

      <ul style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
        <li>
          <pre style={{ margin: 0 }}>
            <code>{sampleClassic}</code>
          </pre>
        </li>
        <li>
          <pre style={{ margin: 0 }}>
            <code>{sampleSidebar}</code>
          </pre>
        </li>
      </ul>

      {/* Optional: tiny live preview using minimal sections (safe, as components are resilient) */}
      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: "pointer", fontSize: 12, color: "#6b7280" }}>
          Dev preview (renders both templates with minimal data)
        </summary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 12,
          }}
        >
          {(() => {
            const demoSections: ResumeSection[] = [
              {
                type: "personal-info",
                heading: "",
                data: {
                  firstName: "Ada",
                  lastName: "Lovelace",
                  email: "ada@example.com",
                  phone: "+2340000000000",
                  location: "Lagos, NG",
                  targetedJobTitle: "Software Engineer",
                },
              } as unknown as ResumeSection,
              {
                type: "professional-summary",
                heading: "Professional Summary",
                data: {
                  summary: "Innovative engineer with a love for clean code.",
                },
              } as unknown as ResumeSection,
            ];
            return (
              <>
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 8 }}>
                  <TemplateClassic sections={demoSections} />
                </div>
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 8 }}>
                  <TemplateSidebar sections={demoSections} />
                </div>
              </>
            );
          })()}
        </div>
      </details>
    </div>
  );
}
