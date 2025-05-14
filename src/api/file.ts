import { request } from '@/utils/request.ts'
import { computed } from 'vue'
import { useAuthorizationStore } from '@/stores/authorization.ts'

export const UploadConfig = computed(() => ({
  action: request.defaults.baseURL + '/file/upload',
  headers: {
    Authorization: `Bearer ${useAuthorizationStore().getToken()}`,
  },
}))

export function upload(data: FormData) {
  return request.post('/file/upload', data)
}
