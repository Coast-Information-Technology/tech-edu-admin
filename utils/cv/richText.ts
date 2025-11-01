// utils/cv/richText.ts

/** Remove unsafe tags + normalize spaces (no DOM needed) */
export function stripTags(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // strip style
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // strip script
    .replace(/<[^>]+>/g, " ") // drop all tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Light "sanitize": remove only dangerous blocks, keep formatting tags */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return (
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      // optionally: strip on* handlers
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      // Clean up Quill-specific attributes that might cause issues
      .replace(/data-[^=]*="[^"]*"/gi, "")
      .replace(/data-[^=]*='[^']*'/gi, "")
      // Ensure proper paragraph structure
      .replace(/<p><br><\/p>/gi, "<br>")
      .replace(/<p><\/p>/gi, "")
  );
}

export type PdfBlocks = {
  paragraphs: string[];
  bullets: string[];
};

/**
 * Extract paragraphs and list items from Quill-ish HTML.
 * Works in Node/browser (no DOM APIs).
 */
export function extractPdfBlocks(html: string): PdfBlocks {
  if (!html) return { paragraphs: [], bullets: [] };

  const bullets: string[] = [];
  const paragraphs: string[] = [];

  // <li>…</li> → bullets
  const liMatches = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
  for (const li of liMatches) {
    const text = stripTags(li);
    if (text) bullets.push(text);
  }

  // <p>…</p> → paragraphs
  const pMatches = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const p of pMatches) {
    const text = stripTags(p);
    if (text) paragraphs.push(text);
  }

  // Fallback: no p/li found → treat all as a paragraph
  if (!bullets.length && !paragraphs.length) {
    const all = stripTags(html);
    if (all) paragraphs.push(all);
  }

  return { paragraphs, bullets };
}

/** If you need a single plain text blob for PDF or elsewhere */
export function htmlToPlainText(html: string): string {
  return stripTags(html);
}
