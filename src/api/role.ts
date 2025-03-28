import type { ApiParams, Role } from '@/types'
import { request } from '@/utils/request.ts'

export function getRolesByPage(params: ApiParams<Role>) {
  return request.get('/role', {
    params,
  })
}
