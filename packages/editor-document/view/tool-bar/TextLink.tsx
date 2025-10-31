import { Button } from "@components/button";
import { Link } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import type { ToolBarCompProps } from ".";
import { posToDOMRect } from "@tiptap/core";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { Input } from "@components/input";
import { Tooltip, TooltipContent } from "@components/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { TextSelection } from "@tiptap/pm/state";

const TextLink: FC<ToolBarCompProps> = ({ editorState, editor }) => {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [linkVisible, setLinkVisible] = useState(false);
  const [link, setLink] = useState(editor.getAttributes("link").href || "");
  const [content, setContent] = useState(
    editor.getAttributes("link").text || ""
  );
  const setTextLink = useCallback(() => {
    const { from, to } = editor.state.selection;
    // 插入链接 先插入文本
    if (from === to && editor.isActive("paragraph")) {
      const insertText = "链接";
      const start = from;
      const end = start + insertText.length;
      // 插入链接后将光标移动到链接文本末尾
      editor
        .chain()
        .focus()
        .insertContent(insertText)
        .setTextSelection({ from: start, to: end })
        .run();
      setContent(insertText);
    } else {
      const text =
        editor.state.selection instanceof TextSelection
          ? editor.state.doc.textBetween(from, to, "\n")
          : "";
      setContent(text);
    }
    setLinkVisible(!linkVisible);
    updatePosition();
  }, [editor]);

  const onSetTextLink = () => {
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to: from + content.length })
      .run();
    if (content.length === 0) return setLinkVisible(false);

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();
    setLinkVisible(false);
    setContent("");
    setLink("");
  };
  const updatePosition = useCallback(() => {
    if (!editor || !bubbleRef.current) return;
    const el = bubbleRef.current;
    const { from, to } = editor.state.selection;
    const { $from } = editor.state.selection;
    const parentNode = $from.parent;
    const isEmptyBlock =
      parentNode?.isTextblock &&
      parentNode.textContent.trim().length === 0 &&
      parentNode.content.size === 0;
    // 选区为空时可选择隐藏或不定位
    if (from === to && !isEmptyBlock) {
      el.style.display = "none";
      setLinkVisible(false);
      return;
    }
    const virtualElement = {
      getBoundingClientRect: () => posToDOMRect(editor.view, from, to),
    };

    computePosition(virtualElement as any, el, {
      placement: "bottom-start",
      strategy: "absolute",
      middleware: [shift(), flip()],
    }).then(({ x, y, strategy }) => {
      el.style.display = "block";
      el.style.position = strategy;
      el.style.left = `${x}px`;
      el.style.top = `${y + 8}px`;
      el.style.zIndex = "1000";
    });
  }, []);
  useEffect(() => {
    if (!editor || !bubbleRef.current) return;
    // 初始定位 + 监听选区变化
    updatePosition();
    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
    };
  }, [editor]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-6 w-6"
            onClick={setTextLink}
            disabled={editorState.isLink && editor.isActive("paragraph")}
          >
            <Link style={{ width: "16px", height: "16px" }} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">添加链接</TooltipContent>
      </Tooltip>
      <div ref={bubbleRef}>
        {linkVisible && (
          <div className="bg-white border border-[#999] p-4 rounded-md flex flex-col gap-4 items-center dark:bg-[#222] dark:border-[#444]">
            <div className="flex gap-2 w-[400px] items-center">
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="文本内容"
                className="h-7 w-[80%]"
              />
              文本内容
            </div>
            <div className="flex gap-2 w-[400px]">
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="粘贴或者输入链接"
                className="h-7 w-[80%]"
                onKeyUpCapture={(e) => {
                  if (e.key === "Enter") {
                    onSetTextLink();
                  }
                }}
              />
              <Button className="py-0 px-4 h-7" onClick={onSetTextLink}>
                确认
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TextLink;
