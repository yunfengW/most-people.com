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

const initResponse = (response: AxiosResponse) => {
  const status = response?.data?.statusCode || response?.status || 404
  if (status >= 200 && status < 300) {
    return response
  } else {
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
