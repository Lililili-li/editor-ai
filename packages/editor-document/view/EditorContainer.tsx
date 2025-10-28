import EditorTitle from "./EditorTitle";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorTool from "./EditorTool";
import {
  ChatBubble,
  DragMenu,
  TableBubbleMenu,
} from "@editor-document/extensions/bubble-menu";
import type { RootState } from "@src/store";
import { HotKeys } from "@douyinfe/semi-ui";
import { useDevice } from "@src/composable/use-device";
import { useParams } from "react-router";
import { useRequest } from "ahooks";
import articleService from "@src/api/article-service";
import LoadingSpinner from "@src/components/ui/LoadingSpinner";
import {
  setActiveArticle,
  setWordsCount,
} from "@src/store/features/articleSlice.ts";
import { ScrollArea } from "@src/components/ui/scroll-area";

import { extensions } from "@editor-document/extensions";

const macHotKeys = [HotKeys.Keys.Meta, HotKeys.Keys.S];
const windowHotKeys = [HotKeys.Keys.Control, HotKeys.Keys.S];


const EditorContainer = ({ debounceUpdate }: { debounceUpdate: (id: string, article: any) => void }) => {
  const [isInit, setIsInit] = useState(true);
  const { activeArticle } = useSelector((state: RootState) => state.article);
  const dispatch = useDispatch();
  const editor = useEditor({
    extensions,
    content: "",
    onUpdate: (props) => {
      if (isInit) return;
      debounceUpdate(activeArticle.id.toString(), {
        ...activeArticle,
        content: props.editor.getHTML(),
        content_json: JSON.stringify(props.editor.getJSON()),
      });
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
      <div className="border-b-gray-200 border-b">
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
            className={`"border-0 outline-0 h-full w-full" ${loading?'hidden': ''}`}
          />
          <DragMenu editor={editor} />
        </div>
      </ScrollArea>
      <TableBubbleMenu editor={editor} />
      <ChatBubble editor={editor} />
    </div>
  );
};

export default EditorContainer;
