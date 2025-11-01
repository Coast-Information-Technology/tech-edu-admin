// utils/cv/richBlocks.ts
export type InlineRun = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  href?: string | null; // when this run is a link
};

export type PdfBlock =
  | { type: "p"; runs: InlineRun[] }
  | { type: "h"; level: 1 | 2 | 3; runs: InlineRun[] }
  | { type: "ul"; items: InlineRun[][] } // array of list-item runs
  | { type: "ol"; items: InlineRun[][] }
  | { type: "blockquote"; runs: InlineRun[] }
  | { type: "pre"; text: string } // preserve mono text
  | { type: "br" };

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

export function decodeEntities(s: string) {
  return s.replace(/&(?:nbsp|amp|lt|gt|quot|apos);/g, (m) => ENTITIES[m] ?? m);
}

function stripAllTags(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse a small, Quill-ish inline subset (b/strong, i/em, u, s/strike, code, a, br).
 * Produces an array of InlineRun objects with style flags + optional href.
 */
export function parseInline(html = ""): InlineRun[] {
  if (!html) return [];

  // Normalize newlines and remove scripts/styles
  html = html
    .replace(/\r\n?|\r/g, "\n")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // Normalize common block wrappers INSIDE inline contexts:
  // - Convert paragraph-ish boundaries to a newline so we don't lose breaks.
  // - Then drop the wrapper tags.
  html = html
    .replace(/<\/(p|div|section|article|header|footer)>\s*<\1[^>]*>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|footer)>/gi, "")
    .replace(/<(p|div|section|article|header|footer)[^>]*>/gi, "")
    // Drop neutral wrappers that sometimes sneak in
    .replace(/<(span|font)[^>]*>/gi, "")
    .replace(/<\/(span|font)>/gi, "");

  type Mark = {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code?: boolean;
    href?: string | null;
  };
  const stack: Mark[] = [{}];
  const runs: InlineRun[] = [];

  function current(): Mark {
    return stack[stack.length - 1];
  }

  function pushText(t: string) {
    if (!t) return;
    runs.push({ text: decodeEntities(t), ...current() });
  }

  // Tokenize a very small subset
  const re = /<(\/)?(strong|b|em|i|u|s|strike|code|a|br)\b([^>]*)>|([^<]+)/gi;

  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const [, closing, tagRaw, attr, textNode] = m;
    const tag = tagRaw ? tagRaw.toLowerCase() : "";

    if (textNode) {
      pushText(textNode);
      continue;
    }

    if (tag === "br") {
      pushText("\n");
      continue;
    }

    if (closing) {
      switch (tag) {
        case "strong":
        case "b":
        case "em":
        case "i":
        case "u":
        case "s":
        case "strike":
        case "code":
        case "a":
          if (stack.length > 1) stack.pop();
          break;
      }
      continue;
    }

    // opening marks
    const top = { ...current() };
    switch (tag) {
      case "strong":
      case "b":
        stack.push({ ...top, bold: true });
        break;
      case "em":
      case "i":
        stack.push({ ...top, italic: true });
        break;
      case "u":
        stack.push({ ...top, underline: true });
        break;
      case "s":
      case "strike":
        stack.push({ ...top, strike: true });
        break;
      case "code":
        stack.push({ ...top, code: true });
        break;
      case "a": {
        const hrefMatch = /href\s*=\s*"(.*?)"|href\s*=\s*'(.*?)'/i.exec(
          attr || ""
        );
        const href = hrefMatch
          ? (hrefMatch[1] || hrefMatch[2] || "").trim()
          : null;
        stack.push({ ...top, href });
        break;
      }
    }
  }

  // Merge adjacent runs with identical styles
  const merged: InlineRun[] = [];
  for (const r of runs) {
    const prev = merged[merged.length - 1];
    const same =
      prev &&
      prev.bold === r.bold &&
      prev.italic === r.italic &&
      prev.underline === r.underline &&
      prev.strike === r.strike &&
      prev.code === r.code &&
      prev.href === r.href;
    if (same) prev.text += r.text;
    else merged.push({ ...r });
  }

  // Trim whitespace-only runs (but keep intentional newlines)
  return merged.filter(
    (r) => r.text.replace(/[ \t]+/g, "").length > 0 || /\S|\n/.test(r.text)
  );
}

/** Robustly extract list items, unwrapping <p>/<div> wrappers and preserving breaks. */
function extractListItems(innerHtml: string): InlineRun[][] {
  const items = innerHtml.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];

  return items
    .map((li) => {
      // inner content of the <li>…</li>
      let inner = li.replace(/^<li[^>]*>/i, "").replace(/<\/li>$/i, "");

      // If each item is wrapped with <p> or <div>, unwrap but keep paragraph boundaries as \n
      inner = inner
        .replace(/<\/(p|div)>\s*<\1[^>]*>/gi, "\n")
        .replace(/<\/(p|div)>/gi, "")
        .replace(/<(p|div)[^>]*>/gi, "");

      // Now parse as inline (supports <br>, <strong>, <a>, etc.)
      const runs = parseInline(inner);
      return runs;
    })
    .filter((arr) => arr.length > 0);
}

/** Turn Quill-ish HTML into block nodes with inline runs (for PDF rendering). */
export function htmlToBlocks(htmlRaw = ""): PdfBlock[] {
  if (!htmlRaw) return [];
  // Normalize and drop script/style early
  let html = htmlRaw
    .replace(/\r\n?|\r/g, "\n")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  const blocks: PdfBlock[] = [];
  let cursor = 0;

  // Closed block tokens (must have explicit closing tag) or <br/> tokens
  const tokenRe =
    /<(ul|ol|p|h1|h2|h3|blockquote|pre)\b[^>]*>[\s\S]*?<\/\1>|<br\s*\/?>/gi;

  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(html))) {
    const i = m.index;
    const full = m[0];

    // Emit plain text before the token once (avoids duplication)
    if (i > cursor) {
      const free = stripAllTags(html.slice(cursor, i));
      if (free) blocks.push({ type: "p", runs: [{ text: free }] });
    }

    if (/^<br/i.test(full)) {
      blocks.push({ type: "br" });
    } else {
      // closed block: get tag + inner HTML
      const openTag = /^<([a-z0-9]+)\b[^>]*>/i.exec(full)!;
      const tag = openTag[1].toLowerCase();
      const inner = full.replace(/^<[^>]+>/, "").replace(/<\/[^>]+>$/, "");

      switch (tag) {
        case "ul":
          blocks.push({ type: "ul", items: extractListItems(inner) });
          break;
        case "ol":
          blocks.push({ type: "ol", items: extractListItems(inner) });
          break;
        case "p": {
          const runs = parseInline(inner);
          if (runs.length) blocks.push({ type: "p", runs });
          break;
        }
        case "h1":
        case "h2":
        case "h3": {
          const level = Number(tag.substring(1)) as 1 | 2 | 3;
          const runs = parseInline(inner);
          if (runs.length) blocks.push({ type: "h", level, runs });
          break;
        }
        case "blockquote": {
          const runs = parseInline(inner);
          if (runs.length) blocks.push({ type: "blockquote", runs });
          break;
        }
        case "pre": {
          const text = decodeEntities(
            inner.replace(/<\/?code[^>]*>/gi, "")
          ).replace(/\s+$/g, "");
          if (text) blocks.push({ type: "pre", text });
          break;
        }
      }
    }

    cursor = i + full.length;
  }

  // trailing text
  if (cursor < html.length) {
    const tail = stripAllTags(html.slice(cursor));
    if (tail) blocks.push({ type: "p", runs: [{ text: tail }] });
  }

  return blocks;
}
