import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/input-group";
import { Search } from "lucide-react";
import { Popover, Modal } from "@douyinfe/semi-ui";
import {
  createContext,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { XIcon } from "lucide-react";
import { Button } from "@components/button";
import { Separator } from "@components/separator";
import { ScrollArea } from "@components/scroll-area";
import mockData from "./mock.json";
import Recommend from "./Recommend";
import MyTemplates from "./MyTemplates";
import General from "./General";
import TestImage from "./test.png";
import { useRequest } from "ahooks";
import articleService from "@/api/article-service";
import ServiceLoading from "@components/service-loading";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export interface DialogActions {
  openDialog: () => void;
}

export interface TemplateProps {
  type: "document" | "table";
  title: string;
  thumbnail: string;
  category: string;
  isRecommend: boolean;
}

const recommendSearch = ["周报", "规划", "OKR"];
const templatesData: TemplateProps[] = [
  {
    category: "Recommend",
    title: "项目计划与执行",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行2",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行3",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行4",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行2",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行3",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "Recommend",
    title: "项目计划与执行4",
    type: "document",
    thumbnail: TestImage,
    isRecommend: true,
  },
  {
    category: "1352",
    title: "业务经营周报",
    type: "document",
    thumbnail: TestImage,
    isRecommend: false,
  },
];

export const CreateArticleContext = createContext({
  createArticle: () => {},
});

const CreateArticleDialog = ({ ref }: { ref: Ref<DialogActions> }) => {
  const navigate = useNavigate()

  const [visible, setVisible] = useState(false);
  const openDialog = () => {
    setVisible(true);
  };
  useImperativeHandle(ref, () => {
    return {
      openDialog,
    };
  });

  const recommendRef = useRef<HTMLInputElement>(null);
  const [recommendVisible, setRecommendVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("recommend");

  const changeTemplates = (id: string) => {
    setActiveTab(id);
  };

  const { loading, run } = useRequest(
    (params) => articleService.createArticle(params),
    {
      manual: true,
      onSuccess: (res) => {
        toast.success('创建成功')
        setVisible(false)
        navigate('/work/'+ res.id)
      },
    }
  );

  const createArticle = async () => {
    const requestBody = {
      title: "",
      icon: "\uD83D\uDE03",
      content: "",
      content_json: "",
    };
    run(requestBody);
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      header={
        <>
          <div className="header flex justify-between px-4 py-2 items-center h-[70px] dark:bg-[#27272a]">
            <div className="empty"></div>
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
              <InputGroup className="w-[300px] h-[35px] rounded-[6px]">
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
                onClick={() => setVisible(false)}
              >
                <XIcon style={{ width: "20px" }} />
              </Button>
            </div>
          </div>
          <Separator color="#333" />
        </>
      }
      className=""
      centered={true}
      width={1200}
      bodyStyle={{ borderRadius: "8px" }}
    >
      { loading && <ServiceLoading className=" absolute"/>}
      <CreateArticleContext.Provider value={{ createArticle }}>
        <div className={`rounded-[8px] p-0 h-[80dvh] flex pointer-none:`}>
        
          <ScrollArea className="h-full w-[200px] py-3 px-2 dark:bg-[#27272a]">
            <Button
              variant={activeTab === "myTemplates" ? "secondary" : "ghost"}
              className="h-[32px] w-full justify-start rounded-[4px]"
              onClick={() => changeTemplates("myTemplates")}
            >
              我的模板
            </Button>
            <Separator className="mt-2" />
            <div className="flex flex-col gap-1 mt-2">
              <Button
                variant={activeTab === "recommend" ? "secondary" : "ghost"}
                className="h-[32px] w-full justify-start rounded-[4px]"
                onClick={() => changeTemplates("recommend")}
              >
                推荐
              </Button>
              {mockData.data.category.map((item) => (
                <Button
                  variant={
                    activeTab === item.category_id ? "secondary" : "ghost"
                  }
                  className="h-[32px] w-full justify-start rounded-[4px]"
                  onClick={() => changeTemplates(item.category_id)}
                  key={item.category_id}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <Separator orientation="vertical" className="h-full" />
          <ScrollArea className="h-full flex-1  dark:bg-[#121212] bg-[#f8f9fa]">
            <div className="py-[24px] pl-[24px]">
              {activeTab === "recommend" ? (
                <Recommend
                  templates={templatesData}
                  categories={mockData.data.category}
                />
              ) : activeTab != "recommend" && activeTab != "myTemplates" ? (
                <General />
              ) : (
                <MyTemplates />
              )}
            </div>
          </ScrollArea>
        </div>
      </CreateArticleContext.Provider>
    </Modal>
  );
};

export default CreateArticleDialog;
