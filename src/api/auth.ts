import { request } from '@/utils/request'
import type { LoginForm } from '@/types'

export function signIn(data: LoginForm) {
  return request.post('/auth/sign-in', data)
}
