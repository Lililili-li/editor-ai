import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/collapsible";
import { useEffect, useRef, useState } from "react";
import Tree from "@components/Tree";
import { Button } from "@components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/dropdown-menu";
import {
  ChevronDown,
  CopyIcon,
  Ellipsis,
  Link,
  Plus,
  Share,
  Star,
  Trash2,
  StarOff
} from "lucide-react";
import { treeDataToFlatData } from "@/shared";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setActiveArticle, setArticles } from "@/store/features/articleSlice";
import type { RootState } from "@/store";
import { useRequest } from "ahooks";
import articleService from "@/api/article-service";
import TemplateDialog from "./components/template-dialog/TemplateDialog";
import StaticIcon from "@/components/icon/StaticIcon";
import TransportIcon from "@/components/icon/TransportIcon";
import StaticOffIcon from "@/components/icon/StaticOffIcon";

const Action = (
  data: any,
  createArticle: (parentId: string | null) => void
) => {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        className="p-0 h-5 w-5 hover:bg-black/4"
        onClick={(e) => {
          e.stopPropagation();
          createArticle(data.id);
        }}
      >
        <Plus style={{ width: "15px" }} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-5 w-5 hover:bg-black/4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Ellipsis style={{ width: "15px" }}/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Share style={{ width: "15px" }} /> 分享
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link style={{ width: "15px" }} /> 复制链接
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {/* <StarOff style={{ width: "15px" }} /> */}
              <Star style={{ width: "15px" }} /> 收藏
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon style={{ width: "15px" }} /> 创建备份
            </DropdownMenuItem>
            <DropdownMenuItem>
              {/* <StaticOffIcon style={{ width: "15px" }} />  */}
              <StaticIcon style={{ width: "15px" }} /> 添加置顶
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TransportIcon style={{ width: "15px" }} /> 转让权限
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 style={{ width: "15px" }} /> 删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

  const { run, loading } = useRequest(() => articleService.getArticles(), {
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
    if (location.pathname.indexOf("work") === -1) {
      navigate(`/work/${data.id}`);
    } else {
      if (id !== data.id) {
        navigate(`/work/${data.id}`);
      }
    }
  };

  const TemplateDialogRef = useRef<{
    openDialog: (type: "template" | "create", directoryId?: string) => void;
  }>(null);

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
          <Button
            variant="ghost"
            className="p-0 h-5 w-5 hover:bg-black/4"
            onClick={(e) => {
              e.stopPropagation();
              TemplateDialogRef.current?.openDialog("create");
            }}
          >
            <Plus />
          </Button>
        </div>
        <CollapsibleContent>
          <Tree
            treeData={articles}
            onNodeClick={(data) => onNodeClick(data)}
            value={activeArticle.id}
            actionSlot={(data) =>
              Action(data, (parentId) =>
                TemplateDialogRef.current?.openDialog("create", parentId!)
              )
            }
            expandAll={false}
          ></Tree>
        </CollapsibleContent>
      </Collapsible>
      {articles && articles.length === 0 && !loading && (
        <Button
          variant="ghost"
          className="p-0 text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 px-2 h-9 w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            TemplateDialogRef.current?.openDialog("create");
          }}
        >
          <Plus /> 新建文档
        </Button>
      )}
      <TemplateDialog ref={TemplateDialogRef} />
    </section>
  );
};

export default Articles;
