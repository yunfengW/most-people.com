import Axios, { type AxiosInstance, type AxiosResponse } from 'axios'

const { VITE_Api } = import.meta.env

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

const setInterceptors = (api: AxiosInstance) => {
  // interceptors https://axios-http.com/zh/docs/interceptors
  api.interceptors.request.use(
    function (config) {
      config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token') || ''
      return config
    },
    function (error) {
      return Promise.reject(error)
    },
  )
  api.interceptors.response.use(
    function (response) {
      return initResponse(response)
    },
    function (error) {
      return initResponse(error.response)
    },
  )
}

const api = Axios.create({
  // baseURL: import.meta.env.PROD ? VITE_Api : 'http://localhost:8001',
  baseURL: VITE_Api,
})

setInterceptors(api)

export default api
