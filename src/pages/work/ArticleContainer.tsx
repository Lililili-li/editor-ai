import { useSelector } from "react-redux";
import Assistant from "./assistant/Assistant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import type { RootState } from "@/store";
// import EditorContainer from "./editor/EditorContainer";
import EditorContainer from '@editor-document/view/EditorContainer'
import { useContext } from "react";
import { WorkContext } from "./Work";

const ArticleContainer = () => {
  const state = useSelector((state: RootState) => state.editor);
  const { debounceUpdate } = useContext(WorkContext);
  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80} minSize={75} maxSize={85}>
          <EditorContainer debounceUpdate={debounceUpdate}/>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={25}
          className={`${state.assistantVisible ? "block" : "hidden"}`}
        >
          <div className="h-full w-full">
            <Assistant></Assistant>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ArticleContainer;
