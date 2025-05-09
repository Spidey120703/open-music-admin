import type { ApiParams, Role } from '@/types'
import { request } from '@/utils/request.ts'

export function getRolesByPage(params: ApiParams<Role>) {
  return request.get('/role', {
    params,
  })
}

export function getRoleById(id: number) {
  return request.get(`/role/${id}`)
}

export function addRole(data: Partial<Role>) {
  return request.post('/role', data)
}

export function updateRoleById(id: number, data: Partial<Role>) {
  return request.put(`/role/${id}`, data)
}

export function deleteRoleById(id: number) {
  return request.delete(`/role/${id}`)
}

export function getAuthoritiesByRoleId(roleId: number) {
  return request.get(`/role/${roleId}/authorities`)
}

export function setAuthoritiesByRoleId(roleId: number, data: number[]) {
  return request.put(`/role/${roleId}/authorities`, data)
}
