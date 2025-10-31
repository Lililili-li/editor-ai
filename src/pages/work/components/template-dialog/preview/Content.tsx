import { Button } from "@components/button";
import { Separator } from "@components/separator";
import { memo, useContext, type FC } from "react";
import EditorPreview from "@editor-document/view/EditorPreview";
import { TemplateDialogContext, type TemplateProps } from "../TemplateDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import dayjs from "dayjs";
import { Spinner } from "@components/spinner";

interface PreviewContentProps {
  template: TemplateProps;
  loading: boolean
}

const Content: FC<PreviewContentProps> = memo(({ template, loading }) => {
  const { useTemplate } = useContext(TemplateDialogContext)

  return (
    <div className="flex flex-col h-full w-full dark:bg-[#1a1a1a]">
      <div className="preview-content flex-1 w-[80%] mx-auto ">
        <div className="title text-2xl font-bold my-4 flex gap-3 items-center">
          <div className="emoji text-2xl">{template.icon}</div>
          <div className="name text-3xl dark:text-gray-100">{template.title}</div>
        </div>
        <div className="editor-info flex mb-6 items-center h-[20px]">
          <div className="editor flex items-center">
            <Avatar className="w-[20px] h-[20px]">
              <AvatarImage src={template.user.avatar} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="username text-[16px] ml-2 dark:text-gray-100">{template.user.username}</div>
          </div>
          <Separator orientation="vertical" className="mx-3 dark:bg-gray-100" style={{ height: '12px' }} />
          <div className="updated text-[14px] text-[#333] dark:text-gray-100">
            {dayjs(template.updated_at).format("YYYY-MM-DD")}修改
          </div>
        </div>
        <EditorPreview content={template.content!} />
      </div>
      <Separator className="w-full" />
      <div className="px-4 footer h-[60px] flex justify-end items-center dark:bg-[#292929]">
        <Button className="py-0 h-[40px]" onClick={() => useTemplate(template.id)} disabled={loading}>
          {loading && <Spinner />}
          使用模板
        </Button>
      </div>
    </div>
  );
});

export default Content;
