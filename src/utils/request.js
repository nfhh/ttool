import axios from 'axios'
import { getLocalAccessToken } from '@/utils/local'
import env from '@/env'

window.APIURL = env.APIURL

// 创建请求实例
const instance = axios.create({
  baseURL: env.baseURL,
  timeout: 600000
})

instance.interceptors.request.use(
  originConfig => {
    const reqConfig = { ...originConfig }
    const accessToken = getLocalAccessToken()
    if (accessToken) {
      reqConfig.headers.Authorization = accessToken
    }
    return reqConfig
  }
)

instance.interceptors.response.use(response => {
  return response.data
})

export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, { params }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}

export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}
