import http from "@/utils/request"

type LoginParamsProps = {
  username: string
  password: string
}

const login = (params: LoginParamsProps) => http.post<any>('/auth/login', params)

export default {
  login
}