import { memo, useContext, type FC } from "react";
import documentIcon from "@/pages/home/images/document.svg";
import { Plus } from "lucide-react";
import { CreateArticleContext } from "./CreateArticleDialog";

interface CardProps {
  type: "document" | "table";
  title: string;
  thumbnail: string;
}

const Card: FC<Partial<CardProps> & { isCreate: boolean }> = memo(
  ({ type, title, thumbnail, isCreate }) => {
    const { createArticle } = useContext(CreateArticleContext)

    return (
      <div
        className=" relative z-[1px] rounded-[6px] translate-z-px bg-[white] p-4 py-3 dark:bg-[#434343] cursor-pointer mr-[24px] mb-[24px] transition-all duration-300 hover:-translate-y-2"
        style={{
          width: '22.5%',
          boxShadow:
            "0px 4px 16px 4px rgba(31, 35, 41, 0.05), 0px 4px 8px 0px rgba(31, 35, 41, 0.05), 0px 2px 4px -4px rgba(31, 35, 41, 0.05)",
        }}
      >
        {!isCreate ? (
          <>
            <div className="icon flex mb-4 gap-2">
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
          </>
        ) : (
          <>
            <button className="flex flex-col items-center justify-center h-full w-full" onClick={createArticle}>
              <Plus size={48} color="rgb(76, 136, 255)"></Plus>
              <span>新建文档</span>
            </button>
          </>
        )}
      </div>
    );
  }
);

export default Card;
