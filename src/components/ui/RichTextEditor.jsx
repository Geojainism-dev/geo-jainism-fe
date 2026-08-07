import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Table as TableIcon,
  Eye,
  Edit3,
  Columns,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write content here...",
  minRows = 10,
  label,
  required = false,
  error,
  allowSplit = true,
  simple = false,
}) {
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'preview' | 'split'
  const textareaRef = useRef(null);

  // Helper to insert formatting at current cursor position
  const insertFormat = (prefix, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <span className="text-[10px] font-semibold text-slate-400">
            {value.length} characters
          </span>
        </div>
      )}

      {/* Editor Main Container Card */}
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all dark:border-slate-700 dark:bg-slate-900",
          error && "border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20"
        )}
      >
        {/* Editor Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/60">
          {/* Formatting Action Tools */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormat("**", "**", "bold text")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("*", "*", "italic text")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("<u>", "</u>", "underlined text")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Underline (<u>text</u>)"
            >
              <Underline className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("~~", "~~", "strikethrough text")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </button>

            <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Headings */}
            {!simple && (
              <>
                <button
                  type="button"
                  onClick={() => insertFormat("# ", "", "Heading 1")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Heading 1"
                >
                  <Heading1 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("## ", "", "Heading 2")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("### ", "", "Heading 3")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Heading 3"
                >
                  <Heading3 className="h-3.5 w-3.5" />
                </button>

                <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />
              </>
            )}

            {/* Lists & Quotes */}
            <button
              type="button"
              onClick={() => insertFormat("- ", "", "List item")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Bullet List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("1. ", "", "List item")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("> ", "", "Quote text")}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              title="Quote"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>

            {!simple && (
              <>
                <button
                  type="button"
                  onClick={() => insertFormat("```\n", "\n```", "code block")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Code Block"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("[", "](https://example.com)", "link title")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Insert Link"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("![", "](image-url.jpg)", "image alt text")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Insert Image"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("\n---\n", "")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Horizontal Divider"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n")}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
                  title="Insert Table"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          {/* View Mode Switcher: Edit | Preview | Split */}
          {allowSplit && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 transition-all",
                  activeTab === "edit"
                    ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                )}
              >
                <Edit3 className="h-3 w-3" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 transition-all",
                  activeTab === "preview"
                    ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                )}
              >
                <Eye className="h-3 w-3" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("split")}
                className={cn(
                  "hidden sm:flex items-center gap-1 rounded-md px-2.5 py-1 transition-all",
                  activeTab === "split"
                    ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                )}
              >
                <Columns className="h-3 w-3" />
                <span>Split</span>
              </button>
            </div>
          )}
        </div>

        {/* Editor Body */}
        <div className={cn("grid w-full bg-white dark:bg-slate-900", activeTab === "split" && "grid-cols-1 sm:grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800")}>
          {/* Write / Edit Mode */}
          {(activeTab === "edit" || activeTab === "split") && (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={minRows}
              className="w-full bg-transparent p-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 resize-y border-none"
            />
          )}

          {/* Preview Mode */}
          {(activeTab === "preview" || activeTab === "split") && (
            <div className="prose prose-slate max-w-none p-4 text-sm dark:prose-invert overflow-y-auto max-h-[500px]">
              {value.trim() ? (
                <ReactMarkdown>{value}</ReactMarkdown>
              ) : (
                <p className="text-slate-400 italic">Nothing to preview yet...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
}
