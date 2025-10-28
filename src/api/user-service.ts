import http from "@/shared/request";

const getUserInfo = async (id: string) => http.get<any>('/user/'+id)

export default {
  getUserInfo
}