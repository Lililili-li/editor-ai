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
import { Suspense, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorTool from "./EditorTool";
import {
  ChatBubble,
  DragMenu,
  TableBubbleMenu,
} from "../../../plugins/editor/bubble-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { ImageBlock } from "@/plugins/editor/image-extent/UploadImageExtent";
import TextAlign from "@tiptap/extension-text-align";
import Loading from "@/components/ui/Loading";
import type { RootState } from "@/store";
import { WorkContext } from "../Work";

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
  ImageBlock.configure({
    allowBase64: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

const EditorContainer = () => {
  const { debounceUpdate } = useContext(WorkContext)

  const { activeArticle } = useSelector((state: RootState) => state.article);
  const dispatch = useDispatch();
  const editor = useEditor({
    extensions,
    content: '',
    onUpdate: (props) => {
      debounceUpdate(activeArticle.id.toString(), {...activeArticle, content: props.editor.getHTML(), contentJson: props.editor.getJSON() })
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
  useEffect(() => {
    if (activeArticle.id) {
      editor.commands.setContent(activeArticle.content)
    }
  }, [activeArticle]);

  return (
    <div className="edit-container">
      <div className="border-b-gray-200 border-b">
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
