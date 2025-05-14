import { request } from '@/utils/request.ts'
import { type Audit, type AuditProcess, TargetType, type User } from '@/types/dto.ts'
import type { ApiParams } from '@/types/request.ts'

export function getAuditsByPage(targetType: string | TargetType, params: ApiParams<Audit>) {
  return request.get(`/audit/type/-/${targetType}`, {
    params,
  })
}

export function getAuditById(id: number) {
  return request.get(`/audit/${id}`)
}

export function processAuditById(id: number, data: AuditProcess) {
  return request.patch(`/audit/${id}/process`, data)
}

export function deleteAuditById(id: number) {
  return request.delete(`/audit/${id}`)
}
