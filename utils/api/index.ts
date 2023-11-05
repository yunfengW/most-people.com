import Axios, { type AxiosResponse } from 'axios'

const api = Axios.create({
  baseURL: import.meta.env.PROD ? 'https://api.most-people.cn' : 'http://localhost:8001',
  // baseURL: 'https://api.most-people.cn',
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

const showError = (status: number, message?: string) => {
  const code = String(status)
  if (apiErrorCode[code]) {
    mp.error(apiErrorCode[code])
  } else {
    mp.error(message || `未知错误 ${code}`)
  }
}

const initResponse = (response: AxiosResponse) => {
  const status = response?.data?.statusCode || response?.status || 404
  if (status >= 200 && status < 300) {
    return response
  } else {
    showError(status, response?.data?.message)
    return response
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
