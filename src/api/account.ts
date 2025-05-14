import { request } from '@/utils/request.ts'
import type { ChangePassword, User } from '@/types'

export function getCurrentUserInfo() {
  return request.get('/account/current')
}

export function updateCurrentUserInfo(data: Partial<User>) {
  return request.patch('/account/current', data)
}

export function changePassword(data: Omit<ChangePassword, 'confirmPassword'>) {
  return request.post('/account/password', data)
}
