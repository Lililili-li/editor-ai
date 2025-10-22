import ArticleContainer from "./ArticleContainer";
import ArticleHeader from "./ArticleHeader";
import ArticleFooter from "./ArticleFooter";
const Work = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="border-b-1 border-gray-200 h-[45px] dark:border-gray-700 px-2">
        <ArticleHeader />
      </div>
      <ArticleContainer />
      <div className="border-t-1 border-gray-200 h-[35px] dark:border-gray-700 px-2">
        <ArticleFooter />
      </div>
    </div>
  );
};

export default Work;
