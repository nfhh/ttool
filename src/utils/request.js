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
    reqConfig.method = reqConfig.method.toLowerCase()
    // 参数容错
    if (reqConfig.method === 'get') {
      if (!reqConfig.params) {
        // 防止字段用错
        reqConfig.params = reqConfig.data || {}
      }
    } else if (reqConfig.method === 'post') {
      if (!reqConfig.data) {
        // 防止字段用错
        reqConfig.data = reqConfig.params || {}
      }
      // 检测是否包含文件类型, 若包含则进行 formData 封装
      let hasFile = false
      Object.keys(reqConfig.data).forEach(key => {
        if (typeof reqConfig.data[key] === 'object') {
          const item = reqConfig.data[key]
          if (item instanceof FileList || item instanceof File || item instanceof Blob) {
            hasFile = true
          }
        }
      })
      // 检测到存在文件使用 FormData 提交数据
      if (hasFile) {
        const formData = new FormData()
        Object.keys(reqConfig.data).forEach(key => {
          formData.append(key, reqConfig.data[key])
        })
        reqConfig.data = formData
      }
    } else {
      // TODO: 其他类型请求数据格式处理
      /* eslint-disable-next-line */
      console.warn(`其他请求类型: ${reqConfig.method}, 暂无自动处理`)
    }
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
