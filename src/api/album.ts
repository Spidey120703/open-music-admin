import { request } from '@/utils/request.ts'
import type { Album } from '@/types/dto.ts'
import type { ApiParams } from '@/types/request.ts'

export function getAlbumsByPage(params: ApiParams<Album>) {
  return request.get('/album', {
    params,
  })
}

export function getAlbumById(id: number) {
  return request.get(`/album/${id}`)
}

export function addAlbum(data: Partial<Album>) {
  return request.post('/album', data)
}

export function updateAlbumById(id: number, data: Partial<Album>) {
  return request.put(`/album/${id}`, data)
}

export function deleteAlbumById(id: number) {
  return request.delete(`/album/${id}`)
}