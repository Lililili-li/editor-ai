import type { RootState } from "@/store"
import { useSelector } from "react-redux"
import dayjs from 'dayjs'

const EditorFooter = () => {

  const { activeArticle } = useSelector((state: RootState) => state.article)

  return (
    <div className="flex justify-between items-center h-full">
      <div className="update-time flex gap-2 text-sm text-gray-500 dark:text-gray-300">
        <span>创建时间: { activeArticle.createdAt? dayjs(activeArticle.createdAt).format('YYYY-MM-DD HH:mm:ss'): '-' }</span>
        <span>更新时间: { activeArticle.updatedAt? dayjs(activeArticle.updatedAt).format('YYYY-MM-DD HH:mm:ss'): '-' }</span>
      </div>
      <div className="content text-sm text-gray-500 dark:text-gray-300">
        AI 的回答未必正确无误，<span className="text-rose-500">请注意核查</span>
      </div>
    </div>
  )
}

export default EditorFooter