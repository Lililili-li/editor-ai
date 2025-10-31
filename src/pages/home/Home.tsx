import documentIcon from "./images/create-document.svg";
import AiICon from "./images/Ai.svg";
import templateIcon from "./images/template.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import DataTable from "./components/DataTable";
// import CreateArticleDialog from "../work/components/create-article/CreateArticleDialog";
// import TemplateDialog from "../work/components/template-dialog/TemplateDialog";
import { lazy, useRef } from "react";

const TemplateDialog = lazy(() => import("../work/components/template-dialog/TemplateDialog"))

const documents = [
  {
    type: "业务经营周报",
    belong: "Lilililili",
    time: "2025-10-19 22:22:22",
    id: 1,
  },
];

const Home = () => {
  const TemplateDialogRef = useRef<{
    openDialog: (type: "template" | "create") => void;
  }>(null);

  return (
    <section className="home-container h-dvh p-5">
      <div className="font-bold text-[18px]">主页</div>
      <div className="flex gap-2 mt-4">
        <button
          className="py-3 px-4 flex items-center w-[340px] hover:bg-gray-100 rounded-[8px] gap-2 cursor-pointer border-[1px] border-[rgb(222, 224, 227)
] border-solid transition-all duration-300 ease-in-out flex-wrap dark:border-gray-500 dark:hover:bg-white/10"
          onClick={() => TemplateDialogRef.current?.openDialog("create")}
        >
          <img src={documentIcon} alt="" style={{ width: "24px" }} />
          <div className="flex flex-col">
            <div className="font-bold text-[14px] text-left">新建文档</div>
            <div className="text-gray-500 text-[13px] dark:text-gray-300">
              新建文档开始写作
            </div>
          </div>
        </button>
        <button
          className="py-3 px-4 flex items-center w-[340px] hover:bg-gray-100 rounded-[8px] gap-2 cursor-pointer border-[1px] border-[rgb(222, 224, 227)
] border-solid transition-all duration-300 ease-in-out flex-wrap dark:border-gray-500 dark:hover:bg-white/10"
          onClick={() => TemplateDialogRef.current?.openDialog("template")}
        >
          <img src={templateIcon} alt="" style={{ width: "24px" }} />
          <div className="flex flex-col">
            <div className="font-bold text-[14px] text-left">模板中心</div>
            <div className="text-gray-500 text-[13px] dark:text-gray-300">
              选择模板快速搭建文档
            </div>
          </div>
        </button>
        <button
          className="py-3 px-4 flex items-center w-[340px] hover:bg-gray-100 rounded-[8px] gap-2 cursor-pointer border-[1px] border-[rgb(222, 224, 227)
] border-solid transition-all duration-300 ease-in-out flex-wrap dark:border-gray-500 dark:hover:bg-white/10"
        >
          <img src={AiICon} alt="" style={{ width: "24px" }} />
          <div className="flex flex-col">
            <div className="font-bold text-[14px] text-left">AI助手</div>
            <div className="text-gray-500 text-[13px] dark:text-gray-300">
              AI助手帮你一键生成文档
            </div>
          </div>
        </button>
      </div>
      <div className="font-bold text-[18px] mt-5">文档</div>
      <div className="mt-4 relative">
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">编辑过</TabsTrigger>
            <TabsTrigger value="check">浏览过</TabsTrigger>
            <TabsTrigger value="like">我点赞的</TabsTrigger>
            <TabsTrigger value="shared">与我共享</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <DataTable documents={documents} />
          </TabsContent>
          <TabsContent value="check">
            <DataTable documents={documents} />
          </TabsContent>
          <TabsContent value="like">
            <DataTable documents={documents} />
          </TabsContent>
          <TabsContent value="shared">
            <DataTable documents={documents} />
          </TabsContent>
        </Tabs>
      </div>
      <TemplateDialog ref={TemplateDialogRef} />
    </section>
  );
};

export default Home;
