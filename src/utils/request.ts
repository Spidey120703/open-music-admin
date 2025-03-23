import axios from 'axios'
import qs from 'qs'
import { useMessage } from '@/composables/message.ts'

export const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
  paramsSerializer: params => qs.stringify(params, {
    arrayFormat: 'comma'
  })
})

request.interceptors.request.use(value => {
  return value
})

request.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      useMessage().warning(response.data!.msg)
    }
    return Promise.resolve(response)
  },
  (error) => {
    useMessage().error(error.data!.msg)
    console.warn(error)
    return Promise.reject(error)
  },
)
