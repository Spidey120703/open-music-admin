import { request } from '@/utils/request.ts'
import type { Artist } from '@/types/dto.ts'
import type { ApiParams } from '@/types/request.ts'

export function getArtistsByPage(params: ApiParams<Artist>) {
  return request.get('/artist', {
    params,
  })
}

export function getArtistById(id: number) {
  return request.get(`/artist/${id}`)
}

export function addArtist(data: Partial<Artist>) {
  return request.post('/artist', data)
}

export function updateArtistById(id: number, data: Partial<Artist>) {
  return request.put(`/artist/${id}`, data)
}

export function deleteArtistById(id: number) {
  return request.delete(`/artist/${id}`)
}