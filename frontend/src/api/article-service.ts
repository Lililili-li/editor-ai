import http from "@/utils/request"

const createArticle = (params: any) => http.post<any>('/article', params)

const getArticles = (id?: string) => http.get<any>(`/article${id?'/'+ id: ''}`)

const deleteArticle = (id: string) => http.delete<any>(`/article/${id}`)

const updateArticle = (params: any, id: string) => http.put<any>(`/article/${id}`, params)

export default {
  createArticle,
  getArticles,
  deleteArticle,
  updateArticle
}