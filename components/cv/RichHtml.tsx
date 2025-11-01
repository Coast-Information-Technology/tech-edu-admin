"use client";

import React from "react";
import { TemplateLayout } from "@/types/cv/template";
import { mapFontFamily } from "@/utils/cv/fontUtils";
import { sanitizeHtml } from "@/utils/cv/richText";

/** Ensure list markers show even with global resets (adds Tailwind list classes) */
function decorateLists(html: string): string {
  if (!html) return html;

  // <ul>
  html = html.replace(/<ul(\s[^>]*)?>/gi, (m, attrs = "") => {
    const clsMatch = /\bclass\s*=\s*["']([^"']*)["']/.exec(attrs || "");
    if (clsMatch) {
      const before = clsMatch[1];
      const after = [
        ...new Set(
          (before + " list-disc list-outside pl-6").split(/\s+/).filter(Boolean)
        ),
      ].join(" ");
      return m.replace(clsMatch[0], `class="${after}"`);
    }
    const attrsStr = attrs ? attrs.trim() : "";
    const space = attrsStr ? " " : "";
    return `<ul${space}${attrsStr} class="list-disc list-outside pl-6">`;
  });

  // <ol>
  html = html.replace(/<ol(\s[^>]*)?>/gi, (m, attrs = "") => {
    const clsMatch = /\bclass\s*=\s*["']([^"']*)["']/.exec(attrs || "");
    if (clsMatch) {
      const before = clsMatch[1];
      const after = [
        ...new Set(
          (before + " list-decimal list-outside pl-6")
            .split(/\s+/)
            .filter(Boolean)
        ),
      ].join(" ");
      return m.replace(clsMatch[0], `class="${after}"`);
    }
    const attrsStr = attrs ? attrs.trim() : "";
    const space = attrsStr ? " " : "";
    return `<ol${space}${attrsStr} class="list-decimal list-outside pl-6">`;
  });

  // <li>
  html = html.replace(/<li(\s[^>]*)?>/gi, (m, attrs = "") => {
    const clsMatch = /\bclass\s*=\s*["']([^"']*)["']/.exec(attrs || "");
    if (clsMatch) {
      const before = clsMatch[1];
      const after = [
        ...new Set((before + " my-1").split(/\s+/).filter(Boolean)),
      ].join(" ");
      return m.replace(clsMatch[0], `class="${after}"`);
    }
    const attrsStr = attrs ? attrs.trim() : "";
    const space = attrsStr ? " " : "";
    return `<li${space}${attrsStr} class="my-1">`;
  });

  return html;
}

function formatRichHtml(html: string) {
  return decorateLists(sanitizeHtml(html));
}

export default function RichHtml({
  html,
  template,
  className = "",
  sizeOffset = 0, // e.g. -1 if you want slightly smaller text
}: {
  html: string;
  template: TemplateLayout;
  className?: string;
  sizeOffset?: number;
}) {
  if (!html) return null;

  return (
    <div
      className={[
        // same “perfect” prose rules you liked on Summary, reusable everywhere
        "prose prose-sm max-w-none",
        "[&_h1]:text-lg [&_h1]:font-bold",
        "[&_h2]:text-base [&_h2]:font-bold",
        "[&_h3]:text-sm [&_h3]:font-bold",
        "[&_strong]:font-bold [&_em]:italic",
        "[&_u]:underline [&_s]:line-through",
        "[&_ol]:list-decimal [&_ol]:pl-6",
        "[&_ul]:list-disc [&_ul]:pl-6",
        "[&_li]:my-1",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-sm",
        "[&_a]:text-blue-600 [&_a]:underline",
        className,
      ].join(" ")}
      style={{
        color: template.styles.colors.text,
        fontFamily: mapFontFamily(template.styles.typography.fontFamily),
        fontSize: `${template.styles.typography.bodySize + sizeOffset}px`,
        lineHeight: template.styles.typography.lineHeight,
      }}
      dangerouslySetInnerHTML={{ __html: formatRichHtml(html) }}
    />
  );
}
