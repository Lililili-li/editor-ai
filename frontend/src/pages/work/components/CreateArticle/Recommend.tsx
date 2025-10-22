import React, { type FC } from "react";
import type { TemplateProps } from "./CreateArticleDialog";
import Card from "./Card";

interface RecommendProps {
  templates: TemplateProps[];
  categories: {
    name: string;
    description: string;
    top_list: null | string[];
    category_id: string;
  }[];
}

const Recommend: FC<RecommendProps> = ({ templates, categories }) => {
  return (
    <div className="flex flex-col">
      <div>
        <div className="label text-[18px] font-bold mb-6">推荐模板</div>
        <div className="list flex flex-wrap">
          <Card isCreate={true} />
          {templates
            .filter((item) => item.isRecommend)
            .map((item) => (
              <Card
                type={item.type}
                title={item.title}
                thumbnail={item.thumbnail}
                isCreate={false}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Recommend;
