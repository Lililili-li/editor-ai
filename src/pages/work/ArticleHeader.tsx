import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Toggle } from "@components/toggle";
import { Bot, HeartPlus, Share, SquareArrowOutUpRight } from "lucide-react";
import { assistantVisibleToggled } from "@/store/features/editorSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { memo } from "react";
import { Spinner } from "@components/spinner";

const EditorHeader = memo(({ loading }: { loading: boolean }) => {
  const dispatch = useDispatch();
  const editorState = useSelector((state: RootState) => state.editor);
  const articleState = useSelector((state: RootState) => state.article);

  return (
    <div className=" flex justify-between w-full items-center h-full">
      <div className="flex items-center gap-2">
        <Avatar className="w-[28px] h-[28px]">
          <AvatarImage src="https://avatars.githubusercontent.com/u/88611687?v=4" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="online-status">
          <div className="w-[8px] h-[8px] bg-green-500 rounded-full"></div>
        </div>
        <div className="text-number">
          <span className="text-sm text-gray-500 dark:text-gray-300">
            共{articleState.wordsCount}字
          </span>
        </div>
        <div className="text-[12px] text-[#999] flex items-center">
          {loading && <Spinner />}
          { loading?'正在保存中...': '已保存到后台' }
        </div>
      </div>
      <div className="action flex items-center">
        <div className="btn-group flex gap-2 items-center">
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer h-[38px] gap-1"
            onPressedChange={() =>
              dispatch(assistantVisibleToggled(!editorState.assistantVisible))
            }
            pressed={editorState.assistantVisible}
          >
            <Bot />
            AI写作
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer h-[38px] gap-1"
            onPressedChange={(pressed) => console.log(pressed)}
          >
            <HeartPlus />
            收藏
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer h-[38px] gap-1"
            onPressedChange={(pressed) => console.log(pressed)}
          >
            <Share />
            分享
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer h-[38px] gap-1"
            onPressedChange={(pressed) => console.log(pressed)}
          >
            <SquareArrowOutUpRight />
            发布
          </Toggle>
        </div>
      </div>
    </div>
  );
});

export default EditorHeader;
