import Axios, { type AxiosResponse } from 'axios'

const apiData = Axios.create({
  baseURL: 'https://data.most-people.cn',
})

// interceptors https://axios-http.com/zh/docs/interceptors
apiData.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

export const apiErrorCode: { [key: string]: string } = {
  404: '请求失败，请检查网络',
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
    return response
  } else {
    showError(status)
    return response
  }
}

apiData.interceptors.response.use(
  function (response) {
    return initResponse(response)
  },
  function (error) {
    return initResponse(error.response)
  },
)

export default apiData
