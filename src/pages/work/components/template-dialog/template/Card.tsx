import { memo, useContext, type FC } from "react";
import documentIcon from "@/pages/home/images/document.svg";
import { Button } from "@components/button";
import { TemplateDialogContext } from "../TemplateDialog";

interface CardProps {
  type: "document" | "table";
  title: string;
  thumbnail: string;
  id: string;
  used_count?: number;
}

const Card: FC<CardProps> = memo(
  ({
    id,
    type,
    title,
    thumbnail,
    used_count,
  }) => {
  const { setPreviewVisible, useTemplate  } = useContext(TemplateDialogContext);


    return (
      <div
        className="relative z-[1px] rounded-[6px] translate-z-px bg-[white] p-4 py-3 dark:bg-[#434343] cursor-pointer mr-[24px] mb-[24px] transition-all duration-300 hover:-translate-y-2 hover:[&_.btn]:opacity-100"
        style={{
          width: "22.5%",
          boxShadow:
            "0px 4px 16px 4px rgba(31, 35, 41, 0.05), 0px 4px 8px 0px rgba(31, 35, 41, 0.05), 0px 2px 4px -4px rgba(31, 35, 41, 0.05)",
          minWidth: "210px",
        }}
      >
        <div className="icon flex mb-2 gap-2">
          <img
            src={type === "document" ? documentIcon : ""}
            alt=""
            style={{ width: "20px" }}
          />
          <div className="name text-[15px] font-bold">{title}</div>
        </div>
        <div className="img">
          <img
            src={thumbnail}
            alt=""
            style={{ width: "230px" }}
            className="rounded-[4px]"
          />
        </div>
        <div className="text-[12px] text-[#666] mt-2 dark:text-gray-100">{used_count} 人使用</div>
        <div className="flex justify-between absolute bottom-2 left-0 w-full opacity-0 transition-all duration-300 btn bg-white dark:bg-[#434343] px-4">
          <Button
            className="py-0 px-2 w-[80px] h-6"
            variant="outline"
            onClick={() => setPreviewVisible(true, id)}
          >
            预览
          </Button>
          <Button
            className="py-0 px-2 w-[80px] h-6"
            onClick={() => useTemplate(id)}
          >
            使用
          </Button>
        </div>
      </div>
    );
  }
);

export default Card;
