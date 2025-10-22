import EditorTitle from "./EditorTitle";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { TextStyleKit } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import TabIndent from "@/plugins/editor/tab-indent";
import { CharacterCount } from "@tiptap/extensions";
import { setWordsCount } from "@/store/features/articleSlice.ts";
import Mention from "@tiptap/extension-mention";
import SuggestionExtent from "@/plugins/editor/suggestions/SuggestionExtent";
import { TableKit } from "@tiptap/extension-table";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import EditorTool from "./EditorTool";
import { ChatBubble, DragMenu, TableBubbleMenu } from "../../../plugins/editor/bubble-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import UploadImageExtent from "@/plugins/editor/upload-image/UploadImageExtent";
import TextAlign from "@tiptap/extension-text-align";
import Loading from "@/components/ui/Loading";

// const EditorContent = lazy(() => import('@tiptap/react'))

const extensions = [
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
  UploadImageExtent,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

const EditorContainer = () => {
  const dispatch = useDispatch();
  const editor = useEditor({
    extensions,
    content: `
<h2>Hi there,</h2><p>this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p><pre><code class="language-css">body {
  display: none;
}</code></pre><p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Mom</p></blockquote><p></p>
`,
    onUpdate: (props) => {
      console.log(props);
      
    },
  });
  const { wordsCount } = useEditorState({
    editor,
    selector: (context) => ({
      wordsCount: context.editor.storage.characterCount.words(),
    }),
  });
  useEffect(() => {
    dispatch(setWordsCount(wordsCount));
  }, [wordsCount]);

  return (
    <div className="edit-container">
      <div className="border-b-gray-200 border-b-[1px]">
        <EditorTool editor={editor} />
      </div>
      <ScrollArea style={{ height: "calc(100dvh - 110px)" }}>
        <div
          className="content mx-auto my-12 mb-30"
          style={{ maxWidth: "850px" }}
        >
          <EditorTitle />
          <Suspense fallback={<Loading />}>
            <EditorContent
              editor={editor}
              className="border-0 outline-0 h-full w-full"
            />
          </Suspense>

          <DragMenu editor={editor} />
        </div>
      </ScrollArea>
      <TableBubbleMenu editor={editor} />
      <ChatBubble editor={editor} />
    </div>
  );
};

export default EditorContainer;
