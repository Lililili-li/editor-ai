import type { BubbleMenuProps } from "@tiptap/react/menus";
import { useCallback, useRef, useState, type FC } from "react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Dropdown } from "@douyinfe/semi-ui";
import type { Editor } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
interface NodeChangeProps {
  node: Node | null;
  editor: Editor;
  pos: number;
}

const DragMenu: FC<BubbleMenuProps> = ({ editor }) => {
  const currentNode = useRef<Node | null>(null);
  const currentNodePos = useRef(-1);

  const handleNodeChange = (data: NodeChangeProps) => {
    // if (data.node) {
    //   setCurrentNode(data.node);
    // }
    currentNode.current = data.node;
    currentNodePos.current = data.pos;
    // setCurrentNodePos(data.pos);
  };
  const onInsertParagraph = () => {
    if (currentNodePos.current === -1) return;
    const currentNodeSize = currentNode.current?.nodeSize || 0;
    const insertPos = currentNodePos.current + currentNodeSize;
    const currentNodeIsEmptyParagraph =
      currentNode.current?.type.name === "paragraph" &&
      currentNode.current?.content?.size === 0;
    const focusPos = currentNodeIsEmptyParagraph
      ? currentNodePos.current + 2
      : insertPos + 2;

    editor
      ?.chain()
      .command(({ dispatch, tr, state }) => {
        if (dispatch) {
          if (currentNodeIsEmptyParagraph) {
            tr.insertText(
              "/",
              currentNodePos.current,
              currentNodePos.current + 1
            );
          } else {
            try {
              tr.insert(
                insertPos,
                state.schema.nodes.paragraph.create(null, [
                  state.schema.text("/"),
                ])
              );
            } catch (error) {
              console.log(error);
            }
          }

          return dispatch(tr);
        }
        return true;
      })
      .focus(focusPos)
      .run();
  };
  return (
    <DragHandle
      editor={editor!}
      onNodeChange={(data) => handleNodeChange(data as NodeChangeProps)}
    >
      {editor?.isEditable && (
        <div className="flex gap-1 pr-2">
          <Button
            variant="ghost"
            className="px-1 py-2 h-5"
            onClick={onInsertParagraph}
          >
            <Plus style={{ width: "15px" }} />
          </Button>

          <Dropdown
            position="bottomLeft"
            render={
              <Dropdown.Menu>
                <Dropdown.Item icon={<Copy style={{ width: "15px" }} />}>
                  复制
                </Dropdown.Item>
                <Dropdown.Item
                  type="danger"
                  icon={<Trash2 style={{ width: "15px" }} />}
                >
                  删除
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <Button variant="ghost" className="px-1 py-2 h-5 cursor-grab">
              <GripVertical style={{ width: "15px" }} />
            </Button>
          </Dropdown>
        </div>
      )}
    </DragHandle>
  );
};

export default DragMenu;
