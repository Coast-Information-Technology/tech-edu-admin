// components/cv/builder/QuillTextEditor.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type QuillType from "quill";
import "quill/dist/quill.snow.css";

export type EditorApi = {
  setHtml: (html: string, mode?: "replace" | "append") => void;
  getHtml: () => string;
  isReady: () => boolean;
};

type QuillTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  onReady?: (api: EditorApi) => void;
};

export default function QuillTextEditor({
  value,
  onChange,
  placeholder = "Start writing here...",
  maxLength = 5000,
  onReady,
}: QuillTextEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  const [textCount, setTextCount] = useState(0);

  const readyRef = useRef(false);
  const programmaticRef = useRef(false); // prevents loop on programmatic writes
  const externalPasteRef = useRef(false); // preserves your original guard
  const lastAppliedHtmlRef = useRef<string>(""); // cache last programmatically applied HTML

  onChangeRef.current = onChange;
  onReadyRef.current = onReady;

  const pasteHTML = (
    q: QuillType,
    html: string,
    source: "silent" | "api" = "silent"
  ) => {
    const dp: any = (q.clipboard as any).dangerouslyPasteHTML;
    if (typeof dp !== "function") return;
    if (dp.length === 2)
      dp.call(q.clipboard, html, source); // v2: (html, source)
    else dp.call(q.clipboard, 0, html, source); // v1: (index, html, source)
  };

  // INIT ONCE
  useEffect(() => {
    let mounted = true;
    let handler:
      | ((d: any, o: any, s: "user" | "api" | "silent") => void)
      | null = null;

    (async () => {
      const { default: Quill } = await import("quill");
      if (!mounted || !containerRef.current) return;

      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
          ],
          clipboard: { matchVisual: false },
        },
      });
      quillRef.current = quill;
      readyRef.current = true;

      // initial content from prop
      externalPasteRef.current = true;
      programmaticRef.current = true;
      const initialDelta = quill.clipboard.convert(value || "");
      quill.setContents(initialDelta, "silent");
      programmaticRef.current = false;
      lastAppliedHtmlRef.current = (value || "").trim();
      setTextCount(Math.max(0, quill.getLength() - 1));

      // expose stable API to parent
      onReadyRef.current?.({
        setHtml: (html: string, mode: "replace" | "append" = "replace") => {
          const q = quillRef.current;
          if (!q) return;

          programmaticRef.current = true;

          const incoming = q.clipboard.convert(html || "");
          if (mode === "replace") {
            q.setContents(incoming, "silent");
          } else {
            const merged = (q.getContents() as any).concat(incoming);
            q.setContents(merged, "silent");
            q.setSelection(q.getLength() - 1, 0, "silent");
          }

          lastAppliedHtmlRef.current = (html || "").trim();
          setTextCount(Math.max(0, q.getLength() - 1));
          // DO NOT call onChange here — parent already updated `value`
          q.focus();
          programmaticRef.current = false;
        },
        getHtml: () => {
          const q = quillRef.current;
          return q ? ((q.root as HTMLElement).innerHTML || "").trim() : "";
        },
        isReady: () => readyRef.current,
      });

      // text-change handler
      handler = (_delta, _old, source) => {
        // Ignore programmatic or non-user changes
        if (programmaticRef.current || source !== "user") {
          externalPasteRef.current = false;
          setTextCount(Math.max(0, quill.getLength() - 1));
          return;
        }

        // Enforce max length only for user edits
        const len = Math.max(0, quill.getLength() - 1);
        if (len > maxLength) {
          programmaticRef.current = true;
          quill.deleteText(maxLength, len - maxLength, "silent");
          programmaticRef.current = false;
        }

        setTextCount(Math.max(0, quill.getLength() - 1));
        const html = (quill.root as HTMLElement).innerHTML.trim();
        onChangeRef.current(html);
      };

      quill.on("text-change", handler);
      // console.log("[Quill] ready");
    })();

    return () => {
      mounted = false;
      const q = quillRef.current;
      if (q && handler) q.off("text-change", handler);
      quillRef.current = null;
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- init only once (do NOT depend on onReady/placeholder/maxLength)

  // Controlled sync for external value changes (robust)
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    const incomingHtml = normalize(value || "");
    const currentHtml = normalize((q.root as HTMLElement).innerHTML || "");

    // If what parent sends equals what's already in the editor, do nothing.
    if (incomingHtml === currentHtml) return;

    const sel = q.getSelection(); // remember caret
    programmaticRef.current = true;
    const delta = q.clipboard.convert(incomingHtml);
    q.setContents(delta, "silent");
    if (sel) {
      const end = Math.max(0, Math.min(sel.index, q.getLength() - 1));
      q.setSelection(end, 0, "silent"); // restore caret
    }
    programmaticRef.current = false;

    lastAppliedHtmlRef.current = incomingHtml; // keep cache in sync
    setTextCount(Math.max(0, q.getLength() - 1));
  }, [value]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-[10px] overflow-hidden">
      <div ref={containerRef} className="bg-white dark:bg-gray-800" />
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 p-2">
        {textCount} / {maxLength} characters
      </div>
    </div>
  );
}

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}
