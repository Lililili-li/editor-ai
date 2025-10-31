import { EditorContent, useEditor } from "@tiptap/react";
import { getExtensions } from "@editor-document/extensions";

const EditorPreview = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: getExtensions({ editable: false }),
    editable: false,
    content,
  });
  return (
    <div>
      <EditorContent
        editor={editor}
        className={`"border-0 outline-0 h-full w-full"`}
      />
    </div>
  );
};

export default EditorPreview;
