import { memo, useContext, useState, type FC } from "react";
import Category from "./Category";
import { Separator } from "@components/separator";
import { ScrollArea } from "@components/scroll-area";
import Template from "./Template";
import { Plus } from "lucide-react";
import { TemplateDialogContext, type CategoryProps, type TemplateProps } from "../TemplateDialog";
import ServiceLoading from "@components/service-loading";

interface ContentProps {
  templates: TemplateProps[];
  categories: CategoryProps[];
  loading: boolean;
}

const Content: FC<ContentProps & { viewType: "template" | "create" }> = memo(
  ({ templates, categories, loading, viewType }) => {
    const [templateId, setTemplateId] = useState("recommend");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const { createArticle } = useContext(TemplateDialogContext);

    return (
      <>
        <Category
          categories={categories}
          templateId={templateId}
          changeTemplates={setTemplateId}
        />
        <Separator orientation="vertical" className="h-full" />
        <ScrollArea className="h-full flex-1  dark:bg-[#121212] bg-[#f8f9fa]">
          {loading ? (
            <div className="flex items-center justify-center h-[80dvh] w-full">
              <ServiceLoading className="dark:bg-[#121212] bg-[#f8f9fa]" />
            </div>
          ) : (
            <div className="py-[24px] pl-[24px]">
              {templateId === "recommend" ? (
                <Template
                  templates={templates.filter((item) => item.recommend)}
                  title="推荐模板"
                  children={
                    <>
                      {viewType === "template" ? null : (
                        <div
                          className="relative z-[1px] rounded-[6px] translate-z-px bg-[white] p-4 py-3 dark:bg-[#434343] cursor-pointer mr-[24px] mb-[24px] transition-all duration-300 hover:-translate-y-2 hover:[&_.btn]:opacity-100"
                          style={{
                            width: "22.5%",
                            boxShadow:
                              "0px 4px 16px 4px rgba(31, 35, 41, 0.05), 0px 4px 8px 0px rgba(31, 35, 41, 0.05), 0px 2px 4px -4px rgba(31, 35, 41, 0.05)",
                            minWidth: "210px",
                            minHeight: "260px"
                          }}
                        >
                          <button
                            className="flex flex-col items-center justify-center h-full w-full"
                            onClick={() => createArticle()}
                          >
                            <Plus size={48} color="rgb(76, 136, 255)"></Plus>
                            <span>新建文档</span>
                          </button>
                        </div>
                      )}
                    </>
                  }
                />
              ) : templateId === "myTemplates" ? (
                <Template
                  templates={templates.filter(
                    (item) => item.user_id === userInfo.id
                  )}
                  title="我的模板"
                />
              ) : (
                <Template
                  templates={templates.filter(
                    (item) => item.category_id === templateId
                  )}
                  title={
                    categories.find((item) => item.id === templateId)?.title ||
                    ""
                  }
                />
              )}
            </div>
          )}
        </ScrollArea>
      </>
    );
  }
);

export default Content;
