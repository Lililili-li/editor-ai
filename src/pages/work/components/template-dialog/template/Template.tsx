import React, { type FC } from "react";
import Card from "./Card";

interface TemplateProps {
  title: string;
  thumbnail: string;
  category_id: string;
  recommend: boolean;
  user_id: string;
  used_count: number;
  id: string;
}
interface TemplateItemProps {
  templates: TemplateProps[];
  title: string;
  children?: React.ReactNode;
}

const Template: FC<TemplateItemProps> = ({
  templates,
  title,
  children,
}) => {

  return (
    <div className="flex flex-col">
      <div>
        <div className="label text-[18px] font-bold mb-6">{title}</div>
        <div className="list flex flex-wrap">
          {children}
          {templates.map((item, index) => (
            <Card
              key={index}
              type="document"
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template;
