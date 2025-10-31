import { type FC } from "react";
import { ScrollArea } from "@components/scroll-area";
import { Button } from "@components/button";
import { Separator } from "@components/separator";
import type { CategoryProps } from "../TemplateDialog";

interface CategoriesProps {
  categories: CategoryProps[];
  templateId: string,
  changeTemplates: (id: string) => void
}


const Category: FC<CategoriesProps> = ({ categories, templateId, changeTemplates }) => {

  return (
    <ScrollArea className="h-full w-[200px] py-3 px-2 dark:bg-[#27272a]">
      <Button
        variant={templateId === "myTemplates" ? "secondary" : "ghost"}
        className="h-[32px] w-full justify-start rounded-[4px]"
        onClick={() => changeTemplates("myTemplates")}
      >
        我的模板
      </Button>
      <Separator className="mt-2" />
      <div className="flex flex-col gap-1 mt-2">
        <Button
          variant={templateId === "recommend" ? "secondary" : "ghost"}
          className="h-[32px] w-full justify-start rounded-[4px]"
          onClick={() => changeTemplates("recommend")}
        >
          推荐
        </Button>
        {categories.map((item) => (
          <Button
            variant={templateId === item.id ? "secondary" : "ghost"}
            className="h-[32px] w-full justify-start rounded-[4px]"
            onClick={() => changeTemplates(item.id)}
            key={item.id}
          >
            {item.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Category;
