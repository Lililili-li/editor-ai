import { TaskItem, TaskList } from "@tiptap/extension-list";
import Mention from "@tiptap/extension-mention";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import SuggestionExtent from "./suggestions/SuggestionExtent";
import { TableKit } from "@tiptap/extension-table";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TabIndent from "./tab-indent/tab-indent";
import { ImageBlock } from "./image-extent/UploadImageExtent";
import TextAlign from "@tiptap/extension-text-align";

export const extensions = [
  TextStyleKit,
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    codeBlock: {
      defaultLanguage: "javascript",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading" || node.type.name === "paragraph") {
        return "输入 / 设置格式, 输入Command + L 使用AI";
      }
      return "";
    },
  }),
  TabIndent.configure({
    indentSize: 4,
    nodeTypes: ["paragraph", "heading"],
  }),
  CharacterCount.configure({
    wordCounter: (text) => text.length,
  }),
  Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
    suggestion: SuggestionExtent,
  }),
  TableKit.configure({
    table: { resizable: true, allowTableNodeSelection: true },
  }),
  Subscript,
  Superscript,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  ImageBlock.configure({
    allowBase64: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];