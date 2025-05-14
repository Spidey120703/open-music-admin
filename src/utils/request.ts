import axios from 'axios'
import qs from 'qs'
import { useMessage } from '@/composables/message.ts'
import { useAuthorizationStore } from '@/stores/authorization.ts'
import { unref } from 'vue'
import router from '@/router'
import { loadStaticRoutes } from '@/utils/router.ts'

export const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
  paramsSerializer: params => qs.stringify(params, {
    arrayFormat: 'comma'
  })
})

request.interceptors.request.use((config) => {
  if (config.url !== undefined) {
    if (! config.url.startsWith('/auth/')) {
      config.headers.Authorization = `Bearer ${useAuthorizationStore().getToken()}`
    }
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    if (! [200, 201].includes(response.status)) {
      useMessage().warning(response.data?.msg ?? '响应无效！')
      return Promise.reject(response)
    }
    return Promise.resolve(response)
  },
  (error) => {
    useMessage().error(error.response.data?.msg ?? '响应无效！')
    console.warn(error)
    if (error.response.status === 401) {
      useAuthorizationStore().deleteToken()
      if (router.getRoutes().length === 0) {
        loadStaticRoutes();
      }
      router.push({ name: 'login', query: { redirect: unref(router.currentRoute).fullPath } })
        .then()
    }
    return Promise.reject(error)
  },
)
