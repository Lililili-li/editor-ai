import EditorTitle from "./EditorTitle";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorTool from "./EditorTool";
import {
  ChatBubble,
  DragMenu,
  LinkBubble,
  TableBubbleMenu,
} from "@editor-document/extensions/bubble-menu";
import type { RootState } from "@src/store";
import { HotKeys } from "@douyinfe/semi-ui";
import { useDevice } from "@src/composable/use-device";
import { useParams } from "react-router";
import { useRequest } from "ahooks";
import articleService from "@src/api/article-service";
import LoadingSpinner from "@components/LoadingSpinner";
import {
  setActiveArticle,
  setWordsCount,
} from "@src/store/features/articleSlice.ts";
import { ScrollArea } from "@components/scroll-area";

import { getExtensions } from "@editor-document/extensions";

// export interface EditorState {
//   isBold: boolean;
//   canBold: boolean;
//   isItalic: boolean;
//   canItalic: boolean;
//   isStrike: boolean;
//   isAlginLeft: boolean;
//   isAlginCenter: boolean;
//   isAlginRight: boolean;
//   canStrike: boolean;
//   isUnderline: boolean;
//   canUnderline: boolean;
//   isCode: boolean;
//   canCode: boolean;
//   canClearMarks: boolean;
//   isParagraph: boolean;
//   isHeading1: boolean;
//   isHeading2: boolean;
//   isHeading3: boolean;
//   isHeading4: boolean;
//   isHeading5: boolean;
//   isHeading6: boolean;
//   isBulletList: boolean;
//   isOrderedList: boolean;
//   isTaskList: boolean;
//   isCodeBlock: boolean;
//   isBlockquote: boolean;
//   isLink: boolean;
//   canUndo: boolean;
//   canRedo: boolean;
//   color: string;
//   backgroundColor: string;
// }

const macHotKeys = [HotKeys.Keys.Meta, HotKeys.Keys.S];
const windowHotKeys = [HotKeys.Keys.Control, HotKeys.Keys.S];

const EditorContainer = ({
  debounceUpdate,
}: {
  debounceUpdate: (id: string, article: any) => void;
}) => {
  const [isInit, setIsInit] = useState(true);
  const { activeArticle } = useSelector((state: RootState) => state.article);
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: getExtensions({ editable: true }),
    onUpdate: (props) => {
      if (isInit) return;
      debounceUpdate(activeArticle.id.toString(), {
        ...activeArticle,
        content: props.editor.getHTML(),
        content_json: JSON.stringify(props.editor.getJSON()),
      });
    },
  });

  // const editorState = useEditorState({
  //   editor,
  //   selector: (ctx): EditorState => {
  //     return {
  //       isBold: ctx.editor.isActive("bold") ?? false,
  //       canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
  //       isItalic: ctx.editor.isActive("italic") ?? false,
  //       canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
  //       isStrike: ctx.editor.isActive("strike") ?? false,
  //       isAlginLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
  //       isAlginCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
  //       isAlginRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
  //       canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
  //       isUnderline: ctx.editor.isActive("underline") ?? false,
  //       canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
  //       isCode: ctx.editor.isActive("code") ?? false,
  //       canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
  //       canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
  //       isParagraph: ctx.editor.isActive("paragraph") ?? false,
  //       isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
  //       isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
  //       isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
  //       isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
  //       isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
  //       isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
  //       isBulletList: ctx.editor.isActive("bulletList") ?? false,
  //       isOrderedList: ctx.editor.isActive("orderedList") ?? false,
  //       isTaskList: ctx.editor.isActive("taskList") ?? false,
  //       isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
  //       isBlockquote: ctx.editor.isActive("blockquote") ?? false,
  //       isLink: ctx.editor.isActive("link") ?? false,
  //       canUndo: ctx.editor.can().chain().undo().run() ?? false,
  //       canRedo: ctx.editor.can().chain().redo().run() ?? false,
  //       color: ctx.editor.getAttributes("textStyle").color,
  //       backgroundColor: ctx.editor.getAttributes("textStyle").backgroundColor,
  //     };
  //   },
  // });

  const { wordsCount } = useEditorState({
    editor,
    selector: (context) => ({
      wordsCount: context.editor.storage.characterCount.words(),
    }),
  });
  useEffect(() => {
    dispatch(setWordsCount(wordsCount));
  }, [wordsCount]);

  const { id } = useParams();
  const { loading, run: getArticle } = useRequest(
    (id) => articleService.getArticles(id),
    {
      manual: true,
      onSuccess: (res) => {
        dispatch(setActiveArticle(res));
        editor.commands.setContent(res.content);
      },
    }
  );
  useEffect(() => {
    setIsInit(true);
    getArticle(id);
  }, [id]);

  const { isMac } = useDevice();

  return (
    <div className="edit-container">
      <HotKeys
        hotKeys={isMac ? macHotKeys : windowHotKeys}
        onHotKey={(e) => {
          e.preventDefault();
          debounceUpdate(activeArticle.id.toString(), {
            ...activeArticle,
            content: editor.getHTML(),
            content_json: JSON.stringify(editor.getJSON()),
          });
        }}
        style={{ display: "none" }}
      ></HotKeys>
      <div className="border-b-gray-200 border-b h-[40px]">
        <EditorTool editor={editor} />
      </div>
      <ScrollArea style={{ height: "calc(100dvh - 110px)" }}>
        <div
          className="content mx-auto my-12 mb-30"
          style={{ maxWidth: "850px" }}
        >
          <EditorTitle debounceUpdate={debounceUpdate} />
          {loading && <LoadingSpinner />}
          <EditorContent
            editor={editor}
            className={`"border-0 outline-0 h-full w-full" ${
              loading ? "hidden" : ""
            }`}
          />
          <DragMenu editor={editor} />
        </div>
      </ScrollArea>
      <TableBubbleMenu editor={editor} />
      <ChatBubble editor={editor} />
      <LinkBubble editor={editor}/>
    </div>
  );
};

export default EditorContainer;
