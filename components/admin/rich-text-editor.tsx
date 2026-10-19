"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  minHeight = "220px",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: content || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none p-4 focus:outline-none min-h-[180px] text-slate-800 leading-relaxed",
      },
    },
  });

  // Sync content if changed externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "<p></p>", { emitUpdate: false });
    }
  }, [content, editor]);

  if (!isMounted || !editor) {
    return (
      <div
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-400 animate-pulse"
        style={{ minHeight }}
      >
        Loading rich text editor...
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/80 border-b border-slate-200/70 text-slate-600">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("bold")
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("italic")
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("bulletList")
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("orderedList")
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("blockquote")
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-white text-accent font-bold shadow-2xs"
              : "hover:bg-slate-200/70"
          }`}
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-200/70 disabled:opacity-40"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-200/70 disabled:opacity-40"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editable Area */}
      <div style={{ minHeight }} className="cursor-text">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
