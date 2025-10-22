import { memo, type FC } from "react";
import documentIcon from "@/pages/home/images/document.svg";
import { Plus } from "lucide-react";

interface CardProps {
  type: "document" | "table";
  title: string;
  thumbnail: string;
}

const Card: FC<Partial<CardProps> & { isCreate: boolean }> = memo(
  ({ type, title, thumbnail, isCreate }) => {
    return (
      <div
        className=" relative z-[1px] rounded-[6px] translate-z-[1px] bg-[white] p-4 py-3 dark:bg-[#434343] cursor-pointer mr-[24px] mb-[24px] transition-all duration-300 hover:-translate-y-2"
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
            <div className="flex flex-col items-center justify-center h-full">
              <Plus size={48} color="rgb(76, 136, 255)"></Plus>
              <span>新建文档</span>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default Card;
