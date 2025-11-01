// components/cv/builder/RichTextEditor.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Eraser,
  Braces,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing here...",
  maxLength = 5000,
}: RichTextEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        // ❗ Fix: do NOT set `true` here; either omit or pass an empty object
        codeBlock: {},
        // blockquote/bold/italic/code etc. are included by default
      }),
      Underline,
      Strike,
      Highlight,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
        validate: (href) => {
          try {
            const base =
              typeof window !== "undefined"
                ? window.location.origin
                : "https://example.com";
            const url = new URL(href, base);
            return ["http:", "https:", "mailto:"].includes(url.protocol);
          } catch {
            return false;
          }
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false }),
      HardBreak.configure({ keepMarks: true }),
      CharacterCount.configure({ limit: maxLength }),
      Placeholder.configure({ placeholder }),
    ],
    [maxLength, placeholder]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(cleanupHtml(html));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert p-2 min-h-[150px] outline-none leading-tight",
      },
      // Enforce max length on typing
      handleTextInput(view, from, to, text) {
        const used = editor?.storage.characterCount.characters() ?? 0;
        const capacity = maxLength - used;
        if (capacity <= 0) return true; // block
        if (text.length > capacity) {
          editor?.commands.insertContent(text.slice(0, capacity));
          return true;
        }
        return false;
      },
      // Enforce max length on paste
      handlePaste(view, event) {
        const plain = event.clipboardData?.getData("text/plain") ?? "";
        if (!plain) return false;
        const used = editor?.storage.characterCount.characters() ?? 0;
        const capacity = maxLength - used;
        if (capacity <= 0) return true;
        if (plain.length > capacity) {
          event.preventDefault();
          editor?.commands.insertContent(plain.slice(0, capacity));
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (normalize(current) !== normalize(value || "")) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) return null;

  const isActive = editor.isActive.bind(editor);

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    title,
    isOn,
    disabled,
  }: {
    icon: any;
    onClick: () => void;
    title: string;
    isOn?: boolean;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed text-gray-400"
          : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
      } ${
        isOn
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          : ""
      }`}
      title={title}
      aria-pressed={!!isOn}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  const insertOrEditLink = () => {
    const prev = editor.getAttributes("link")?.href as string | undefined;
    const href = window.prompt("Enter URL:", prev ?? "https://")?.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const insertImage = () => {
    const url = window.prompt("Enter image URL:", "https://")?.trim();
    if (!url) return;
    try {
      new URL(url);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {}
  };

  const clearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-[10px] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        {/* Headings */}
        <ToolbarButton
          icon={Heading1}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
          isOn={isActive("heading", { level: 1 })}
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
          }
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
          isOn={isActive("heading", { level: 2 })}
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <ToolbarButton
          icon={Heading3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
          isOn={isActive("heading", { level: 3 })}
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          }
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Marks */}
        <ToolbarButton
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          isOn={isActive("bold")}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          isOn={isActive("italic")}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={UnderlineIcon}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
          isOn={isActive("underline")}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          icon={Strikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          isOn={isActive("strike")}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          icon={Highlighter}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
          isOn={isActive("highlight")}
          disabled={!editor.can().chain().focus().toggleHighlight().run()}
        />
        <ToolbarButton
          icon={Braces}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
          isOn={isActive("code")}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        />
        <ToolbarButton
          icon={Code}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
          isOn={isActive("codeBlock")}
          disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          icon={Eraser}
          onClick={clearFormatting}
          title="Clear Formatting"
          disabled={false}
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
          isOn={isActive({ textAlign: "left" })}
          disabled={!editor.can().chain().focus().setTextAlign("left").run()}
        />
        <ToolbarButton
          icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
          isOn={isActive({ textAlign: "center" })}
          disabled={!editor.can().chain().focus().setTextAlign("center").run()}
        />
        <ToolbarButton
          icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
          isOn={isActive({ textAlign: "right" })}
          disabled={!editor.can().chain().focus().setTextAlign("right").run()}
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists & Quotes */}
        <ToolbarButton
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          isOn={isActive("bulletList")}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
          isOn={isActive("orderedList")}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
          isOn={isActive("blockquote")}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Links & Media */}
        <ToolbarButton
          icon={LinkIcon}
          onClick={insertOrEditLink}
          title={isActive("link") ? "Edit Link" : "Insert Link"}
          isOn={isActive("link")}
        />
        <ToolbarButton
          icon={Unlink}
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove Link"
          disabled={!isActive("link")}
        />
        <ToolbarButton
          icon={ImageIcon}
          onClick={insertImage}
          title="Insert Image"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* History */}
        <ToolbarButton
          icon={Undo}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <ToolbarButton
          icon={Redo}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
          disabled={!editor.can().chain().focus().redo().run()}
        />
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-white dark:bg-gray-800 px-3 py-2"
      />

      {/* Character Count */}
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 p-2">
        {editor.storage.characterCount.characters()} / {maxLength} characters
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function cleanupHtml(html: string) {
  return html
    .replace(/<p>(\s|&nbsp;)*<\/p>/g, "")
    .replace(/\s+<\/(p|li|h[1-6])>/g, "</$1>")
    .trim();
}

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}
