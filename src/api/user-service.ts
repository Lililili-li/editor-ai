import http from "@/shared/request";

const getUserInfo = async (id: string) => http.get<any>('/user/'+id)

const updateUser = async (id: string, data: any) => http.patch<any>('/user/'+id, data)

export default {
  getUserInfo,
  updateUser
}