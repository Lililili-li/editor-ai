import ArticleContainer from "./ArticleContainer";
import ArticleHeader from "./ArticleHeader";
import ArticleFooter from "./ArticleFooter";
import { createContext, useCallback, useEffect } from "react";
import { useRequest } from "ahooks";
import articleService from "@/api/article-service";
import { debounce } from "lodash-es";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setActiveArticle } from "@/store/features/articleSlice";

export const WorkContext = createContext({
  debounceUpdate: (id: string, params: any) => {},
});


const Work = () => {
  const dispatch = useDispatch()

  const { loading, run: updateArticle } = useRequest(
    (id, params) => {
      return articleService.updateArticle(params, id)
    },
    {
      manual: true,
      onSuccess(res) {
        dispatch(setActiveArticle(res))
        toast.success('保存成功')
      },
    }
  );
  const debounceUpdate = useCallback(debounce(updateArticle, 1000 * 1), [])

  return (
    <div className="h-full w-full flex flex-col">
      <WorkContext.Provider value={{debounceUpdate: (id, params) => debounceUpdate(id, params)}}>
        <div className="border-b border-gray-200 h-[45px] dark:border-gray-700 px-2">
          <ArticleHeader loading={loading}/>
        </div>
        <ArticleContainer />
        <div className="border-t border-gray-200 h-[35px] dark:border-gray-700 px-2">
          <ArticleFooter />
        </div>
      </WorkContext.Provider>
    </div>
  );
};

export default Work;
