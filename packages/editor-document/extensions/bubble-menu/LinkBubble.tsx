import { BubbleMenu } from "@tiptap/react/menus";
import { useState, type FC } from "react";
import type { BubbleMenuProps } from ".";
import { Button } from "@components/button";
import { Edit, Unlink } from "lucide-react";
import { Input } from "@components/input";
import { getMarkRange } from "@tiptap/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@components/tooltip";
import { TextSelection } from "@tiptap/pm/state";

const LinkSet: FC<BubbleMenuProps> = ({ editor }) => {
  const [link, setLink] = useState(editor.getAttributes("link").href || "");
  editor.on("selectionUpdate", () => {
    setLink(editor.getAttributes("link").href || "");
  });
  editor.on("transaction", () => {
    setLink(editor.getAttributes("link").href || "");
  });
  return (
    <div className="bg-white border border-[#999] p-2 rounded-md flex items-center dark:bg-[#222] dark:border-[#444] gap-2">
      <Input
        value={link}
        onChange={(e) => {
          // 阻止输入框失焦，避免 BubbleMenu 被隐藏

          setLink(e.target.value);
        }}
        placeholder="修改链接"
        className="h-6 w-[300px]"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              const { state } = editor;
              const { selection } = state;
              const linkType = state.schema.marks.link;
              const range =
                getMarkRange(selection.$from, linkType) ||
                getMarkRange(selection.$to, linkType);

              editor
                .chain()
                .focus()
                .command(({ tr }) => {
                  if (range) {
                    tr.setSelection(
                      TextSelection.create(tr.doc, range.from, range.to)
                    );
                  }
                  return true;
                })
                .extendMarkRange("link")
                .setLink({
                  href: link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                })
                .run(); // 关键：执行命令
            }}
            variant="ghost"
            className="px-1 py-2 h-6"
          >
            <Edit style={{ width: "18px" }} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>修改链接</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() =>
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
            }
            variant="ghost"
            className="px-1 py-2 h-6"
          >
            <Unlink style={{ width: "18px" }} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>移除链接</TooltipContent>
      </Tooltip>
    </div>
  );
};

const LinkBubble: FC<BubbleMenuProps> = ({ editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "bottom", offset: 8, flip: true }}
      shouldShow={({ editor }) => {
        const { state } = editor;
        const { from, to, $from } = state.selection;
        const linkType = state.schema.marks.link;
        // 光标状态：判断光标是否在 link 标记内
        if (from === to) {
          const range = getMarkRange($from, linkType);
          return !!range;
        }
        // 非空选区：判断选区范围内是否包含 link 标记
        return state.doc.rangeHasMark(from, to, linkType);
      }}
    >
      <LinkSet editor={editor} />
    </BubbleMenu>
  );
};

export default LinkBubble;
