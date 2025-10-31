import http from "@/shared/request"

const createArticle = (params: any) => http.post<any>('/article', params)

const getArticles = (id?: string) => http.get<any>(`/article${id?'/'+ id: ''}`)

const deleteArticle = (id: string) => http.delete<any>(`/article/${id}`)

const updateArticle = (params: any, id: string) => http.patch<any>(`/article/${id}`, params)

const getTemplates = () => http.get<any>('/template')

export default {
  createArticle,
  getArticles,
  deleteArticle,
  updateArticle,
  getTemplates
}