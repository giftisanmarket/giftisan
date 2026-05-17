"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle, FontSize, Color } from "@tiptap/extension-text-style";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Strikethrough,
  Undo,
  Redo,
} from "lucide-react";

const FONT_SIZES = [
  { label: "Small", value: "13px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "XL", value: "26px" },
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm shrink-0 ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-primary/50 hover:text-primary hover:bg-primary/5"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-primary/10 mx-1 shrink-0" />;
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onDirChange?: (dir: "rtl" | "ltr") => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
  isAr?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  onDirChange,
  dir = "ltr",
  placeholder,
  isAr,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      // Auto-detect script direction from plain text
      if (onDirChange) {
        const text = editor.getText();
        const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
        const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
        if (arabicChars > 0 || latinChars > 0) {
          onDirChange(arabicChars >= latinChars ? "rtl" : "ltr");
        }
      }
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[280px] leading-relaxed text-primary text-base font-medium",
        spellcheck: "false",
      },
    },
    immediatelyRender: false,
    autofocus: false,
  });

  // Sync external dir changes to text-align
  useEffect(() => {
    if (!editor) return;
    editor.chain().setTextAlign(dir === "rtl" ? "right" : "left").run();
  }, [dir, editor]);

  if (!editor) return null;

  const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";

  return (
    <div className="border border-primary/5 rounded-[2rem] overflow-hidden bg-white focus-within:border-accent transition-all shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-4 py-3 border-b border-primary/5 bg-cream/40">

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Font Size */}
        <select
          value={currentFontSize}
          onChange={(e) => {
            editor.chain().focus().setFontSize(e.target.value).run();
          }}
          className="h-8 px-2 rounded-lg text-xs font-bold text-primary/70 bg-transparent hover:bg-primary/5 cursor-pointer outline-none border border-primary/5 focus:border-accent transition-all"
        >
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Divider />

        {/* Bold / Italic / Underline / Strike */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Text Color */}
        <div className="relative flex items-center" title="Text Color">
          <input
            type="color"
            className="w-8 h-8 rounded-lg cursor-pointer opacity-0 absolute inset-0"
            value={editor.getAttributes("textStyle").color || "#1a2c2c"}
            onChange={(e) => {
              editor.chain().focus().setColor(e.target.value).run();
            }}
          />
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary/10 pointer-events-none"
            title="Text Color"
          >
            <span
              className="text-xs font-black"
              style={{ color: editor.getAttributes("textStyle").color || "#1a2c2c" }}
            >
              A
            </span>
          </div>
        </div>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

      </div>

      {/* Editor area */}
      <div
        className="relative px-6 py-5 cursor-text"
        dir={dir}
        onClick={() => editor.commands.focus()}
      >
        {editor.isEmpty && placeholder && (
          <p className="absolute top-5 text-primary/25 font-medium text-base pointer-events-none whitespace-pre-line select-none">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
