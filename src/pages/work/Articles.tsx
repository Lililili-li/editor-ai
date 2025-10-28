import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import Tree from "@/components/ui/Tree";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Copy,
  Ellipsis,
  HeartPlus,
  Plus,
  Trash2,
} from "lucide-react";
import { treeDataToFlatData } from "@/utils";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setActiveArticle, setArticles } from "@/store/features/articleSlice";
import type { RootState } from "@/store";
import { useRequest } from "ahooks";
import articleService from "@/api/article-service";

const Action = (
  data: any,
  createArticle: (parentId: string | null) => void
) => {
  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-5 w-5 hover:bg-black/4 rounded-4xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-20 p-1">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="p-0 text-sm w-full justify-start pl-2.5 rounded-4xl h-8"
            >
              <HeartPlus />
              收藏
            </Button>
            <Button
              variant="ghost"
              className="p-0 text-sm w-full justify-start pl-2.5 rounded-4xl h-8"
            >
              <Copy />
              复制
            </Button>
            <Button
              variant="ghost"
              className="p-0 text-sm w-full justify-start pl-2.5 rounded-4xl text-red-500 hover:text-red-500 h-8"
            >
              <Trash2 />
              删除
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        className="p-0 h-5 w-5 rounded-4xl hover:bg-black/4"
        onClick={(e) => {
          e.stopPropagation();
          createArticle(data.id);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};

const Articles = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { articles, activeArticle } = useSelector(
    (state: RootState) => state.article
  );
  const dispatch = useDispatch();

  const { run } = useRequest(() => articleService.getArticles(), {
    manual: true,
    onSuccess: (res) => {
      const articles = treeDataToFlatData(res);
      dispatch(setArticles(articles));
    },
  });

  const { id } = useParams();
  useEffect(() => {
    if (location.pathname.indexOf("work") > -1) {
      if (articles.every((item) => item.id !== Number(id))) {
        run();
      }
    } else {
      run();
      dispatch(setActiveArticle({}));
    }
  }, [location]);

  const onNodeClick = (data: any) => {
    dispatch(setActiveArticle(data));
    if (location.pathname.indexOf("work") !== -1 && id !== data.id) {
      navigate(`/work/${data.id}`);
    }
  };
  return (
    <section>
      <Collapsible
        defaultOpen={!isCollapsed}
        onOpenChange={(value) => setIsCollapsed(!value)}
      >
        <div className="text-sm text-gray-500 cursor-pointer py-1 rounded-sm flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="p-0 h-5 w-5 hover:bg-black/4 rounded-4xl dark:hover:bg-white/10"
              >
                <ChevronDown
                  style={{ width: "16px" }}
                  className={`duration-300 ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </Button>
              <span className="text-gray-500 font-bold">我的文档</span>
            </div>
          </CollapsibleTrigger>
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-0 h-5 w-5">
                <ArrowDownWideNarrow
                  style={{ width: "16px", height: "16px" }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-20 p-1 flex flex-col">
              <Button variant="ghost" className="p-0">
                默认排序
              </Button>
              <Button variant="ghost" className="p-0">
                创建时间
              </Button>
              <Button variant="ghost" className="p-0">
                更新时间
              </Button>
              <Button variant="ghost" className="p-0">
                点赞数量
              </Button>
              <Button variant="ghost" className="p-0">
                收藏数量
              </Button>
            </PopoverContent>
          </Popover> */}
        </div>
        <CollapsibleContent>
          <Tree
            treeData={articles}
            onNodeClick={(data) => onNodeClick(data)}
            value={activeArticle.id}
            actionSlot={(data) => Action(data, () => {})}
            expandAll={false}
          ></Tree>
        </CollapsibleContent>
      </Collapsible>
      {articles && articles.length === 0 && (
        <Button
          variant="ghost"
          className="p-0 text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 px-2 h-9 w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            () => {};
          }}
        >
          <Plus /> 新建文档
        </Button>
      )}
    </section>
  );
};

export default Articles;
