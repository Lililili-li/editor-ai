import { TaskItem, TaskList } from "@tiptap/extension-list";
import Mention from "@tiptap/extension-mention";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import SuggestionExtent from "./suggestions/SuggestionExtent";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TabIndent from "./tab-indent/tab-indent";
import { ImageBlock } from "./image-extension/ImageExtent";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableCell, TableHeader, TableRow } from './table'

export const getExtensions = (options = {
  editable: true,
}) => {
  const { editable } = options
  return [
    TextStyleKit,
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      codeBlock: {
        defaultLanguage: "javascript",
      },
      link: {
        openOnClick: !editable,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
      }
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
    Table,
    TableCell,
    TableHeader,
    TableRow,
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
}