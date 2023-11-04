import Axios, { type AxiosResponse } from 'axios'

const api = Axios.create({
  // baseURL: import.meta.env.PROD ? 'https://api.most-people.cn' : 'http://localhost:8001',
  baseURL: 'https://api.most-people.cn',
})

// interceptors https://axios-http.com/zh/docs/interceptors
api.interceptors.request.use(
  function (config) {
    config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token') || ''
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

export const apiErrorCode: { [key: string]: string } = {
  404: '请求失败，请检查网络',
  1001: '用户名已存在',
}

const showError = (status: number) => {
  const code = String(status)
  if (apiErrorCode[code]) {
    mp.error(apiErrorCode[code])
  } else {
    mp.error(`未知错误 error code：${code}`)
  }
}

const initResponse = (response: AxiosResponse) => {
  const status = response?.data?.statusCode || response?.status || 404
  if (status >= 200 && status < 300) {
    return response.data
  } else {
    showError(status)
    return null
  }
}

api.interceptors.response.use(
  function (response) {
    return initResponse(response)
  },
  function (error) {
    return initResponse(error.response)
  },
)

export default api

export interface User {
  id: number
  name: string
  password_hash: string
  sign_time: string
  address: string
  tools?: string[]
  // tool: string
}
export interface FileGet {
  files: string[]
  isTruncated: boolean
  nextMarker: null
}
