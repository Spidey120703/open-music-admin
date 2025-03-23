import type { ApiParams, Role } from '@/types'
import { request } from '@/utils/request.ts'

export function getRoles(params: ApiParams<Role>) {
  return request.get('/role', {
    params,
  })
}
