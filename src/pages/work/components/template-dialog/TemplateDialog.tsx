import articleService from "@/api/article-service";
import { useWindowSize } from "@/composable/use-windowsize";
import { Modal } from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";
import {
  createContext,
  useImperativeHandle,
  useState,
  type FC,
  type Ref,
} from "react";
import TemplateHeader from "./template/Header";
import PreviewHeader from "./preview/Header";
import TemplateContent from "./template/Content";
import PreviewContent from "./preview/Content";
import { Separator } from "@components/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export interface DialogActions {
  openDialog: (type: "template" | "create", directoryId?: string) => void;
}

export interface TemplateProps {
  title: string;
  thumbnail: string;
  category_id: string;
  recommend: boolean;
  user_id: string;
  used_count: number;
  id: string;
  icon: string;
  content?: string;
  content_json?: string;
  created_at: string;
  updated_at: string;
  user: {
    avatar: string;
    username: string;
  };
}

export interface CategoryProps {
  id: string;
  title: string;
}

interface TemplateDialogProps {
  ref: Ref<DialogActions>;
}

export const TemplateDialogContext = createContext({
  createArticle: () => Promise.resolve(),
  useTemplate: (templateId: string) => Promise.resolve(),
  setPreviewVisible: (preview: boolean, templateId: string) => {},
  setDirectoryId: (directoryId: string) => {},
  directoryId: "",
});

const TemplateDialog: FC<TemplateDialogProps> = ({ ref }) => {
  const [directoryId, setDirectoryId] = useState("my"); //新建到某个文档或文件夹下

  const [preview, setPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateProps>(
    {} as TemplateProps
  );

  const setPreviewVisible = (visible: boolean, templateId: string) => {
    setPreview(visible);
    setPreviewTemplate(
      templates.find((item) => item.id === templateId) || ({} as TemplateProps)
    );
  };

  const { width } = useWindowSize();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [viewType, setViewType] = useState<"template" | "create">("template"); // 判断是新建文档还是，模板库调用
  const openDialog = (type: "template" | "create", directoryId?: string) => {
    setViewType(type);
    setDirectoryId(directoryId || 'my');
    getTemplates();
    setDialogVisible(true);
  };

  useImperativeHandle(ref, () => {
    return {
      openDialog: (type: "template" | "create", directoryId?: string) => openDialog(type, directoryId),
    };
  });

  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const { loading: getTemplatesLoading, run: getTemplates } = useRequest(
    () => articleService.getTemplates(),
    {
      manual: true,
      onSuccess: (res) => {
        setTemplates(res.templates || []);
        setCategories(res.category || []);
      },
    }
  );

  const navigate = useNavigate();
  const { loading: createArticleLoading, run } = useRequest(
    (params) => articleService.createArticle(params),
    {
      manual: true,
      onSuccess: (res) => {
        toast.success("创建成功");
        setDialogVisible(false);
        navigate("/work/" + res.id);
      },
    }
  );

  const createArticle = async () => {
    const requestBody = {
      title: "",
      icon: "\uD83D\uDE03",
      content: "",
      content_json: "",
      parent_id: directoryId === 'my' ? null : directoryId,
    };
    run(requestBody);
  };

  const useTemplate = async (id: string) => {
    const template = templates.find((item) => item.id === id);
    if (!template) {
      toast.error("模板已被删除");
      return;
    }
    const requestBody = {
      title: template.title,
      icon: template.icon,
      content: template.content,
      content_json: template.content_json,
      parent_id: directoryId === 'my' ? null : directoryId,
      template_id: template.id.toString(),
    };
    run(requestBody);
  };

  return (
    <Modal
      visible={dialogVisible}
      footer={null}
      centered={true}
      width={width < 1040 ? 480 : width > 1040 && width <= 1290 ? 930 : 1200}
      bodyStyle={{ borderRadius: "8px" }}
      header={
        <>
          <TemplateDialogContext.Provider
            value={{
              createArticle,
              useTemplate,
              setPreviewVisible,
              setDirectoryId,
              directoryId,
            }}
          >
            {!preview ? (
              <TemplateHeader setDialogVisible={setDialogVisible} />
            ) : (
              <PreviewHeader
                setDialogVisible={setDialogVisible}
                onFallback={() => setPreview(false)}
                template={previewTemplate}
              />
            )}
            <Separator color="#333" />
          </TemplateDialogContext.Provider>
        </>
      }
    >
      <TemplateDialogContext.Provider
        value={{
          createArticle,
          useTemplate,
          setPreviewVisible,
          setDirectoryId,
          directoryId,
        }}
      >
        <div className="rounded-[8px] p-0 h-[80dvh] flex">
          {!preview ? (
            <TemplateContent
              templates={templates}
              categories={categories}
              loading={getTemplatesLoading || createArticleLoading}
              viewType={viewType}
            />
          ) : (
            <PreviewContent template={previewTemplate} loading={createArticleLoading} />
          )}
        </div>
      </TemplateDialogContext.Provider>
    </Modal>
  );
};

export default TemplateDialog;
