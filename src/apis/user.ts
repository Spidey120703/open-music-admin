import { request } from '@/utils/request.ts'
import type { User } from '@/types/dto.ts'
import type { ApiParams } from '@/types/request.ts'

export function getUsers(params: ApiParams<User>) {
  return request.get('/user', {
    params,
  })
}

export function getUserById(id: number) {
  return request.get(`/user/${id}`)
}

export function createUser(data: User) {
  return request.post('/user', {
    data
  })
}

export function updateUserById(id: number, data: User) {
  return request.put(`/user/${id}`, data)
}

export function deleteUserById(id: number) {
  return request.delete(`/user/${id}`)
}
