const recommendSearch = ["周报", "规划", "OKR"];

import type { RootState } from "@/store";
import { Button } from "@components/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@components/input-group";
import { Popover, TreeSelect } from "@douyinfe/semi-ui";
import { Search, XIcon } from "lucide-react";
import { memo, useContext, useRef, useState, type FC } from "react";
import { useSelector } from "react-redux";
import { TemplateDialogContext } from "../TemplateDialog";

interface HeaderProps {
  setDialogVisible: (visible: boolean) => void;
}
const Header: FC<HeaderProps> = ({ setDialogVisible }) => {
  const recommendRef = useRef<HTMLInputElement>(null);
  const [recommendVisible, setRecommendVisible] = useState(false);
  const { articles } = useSelector((state: RootState) => state.article);
  const articlesTreeData = [
    {
      label: "我的文档",
      value: "my",
      key: "my",
      icon: null,
      children: articles.map((item) => ({
        ...item,
        label: item.title || "<无标题>",
        value: item.id,
        key: item.id.toString(),
        icon: null,
      })),
    },
  ];
  
  const { directoryId, setDirectoryId } = useContext(TemplateDialogContext)
  
  return (
    <div className="header flex justify-between px-4 py-2 items-center h-[70px] dark:bg-[#27272a] relative">
      <div className="directory">
        <span>新建文档到：</span>
        <TreeSelect
          style={{ width: 200 }}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          treeData={articlesTreeData}
          placeholder="请选择"
          onChange={(value) => setDirectoryId(value as string)}
          value={directoryId}
          defaultExpandedKeys={['my']}
        />
      </div>
      <Popover
        visible={recommendVisible}
        content={
          <div className="w-[300px] mt-1 p-2 z-10 ">
            <div className="tip text-[12px] text-gray-500 my-1 dark:text-gray-300 pl-2">
              大家都在搜
            </div>
            {recommendSearch.map((item, index) => (
              <Button
                variant="ghost"
                key={index}
                className="h-[32px] py-0 flex items-center w-full justify-start px-2 gap-2 rounded-[4px]"
              >
                <span
                  className={`${
                    index === 0 ? "bg-(--R100) text-(--R500)" : ""
                  } px-1 rounded-[2px] text-[12px]`}
                >
                  {index + 1}
                </span>
                <span>{item}</span>
              </Button>
            ))}
          </div>
        }
        trigger="custom"
      >
        <InputGroup className="w-[300px] h-[35px] rounded-[6px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <InputGroupInput
            placeholder="请输入模板名称"
            className="h-[35px]"
            ref={recommendRef}
            onFocusCapture={() => {
              setRecommendVisible(true);
            }}
            onBlur={() => {
              setRecommendVisible(false);
            }}
            onChange={() => {
              setRecommendVisible(false);
            }}
          />
          <InputGroupAddon>
            <Search style={{ width: "16px" }} />
          </InputGroupAddon>
        </InputGroup>
      </Popover>
      <div className="close">
        <Button
          variant="ghost"
          className="px-2 h-[30px]"
          onClick={() => setDialogVisible(false)}
        >
          <XIcon style={{ width: "20px" }} />
        </Button>
      </div>
    </div>
  );
}

export default Header;
