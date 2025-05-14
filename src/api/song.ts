import { request } from '@/utils/request.ts'
import type { Song } from '@/types/dto.ts'
import type { ApiParams } from '@/types/request.ts'

export function getSongsByPage(params: ApiParams<Song>) {
  return request.get('/song', {
    params,
  })
}

export function getSongById(id: number) {
  return request.get(`/song/${id}`)
}

export function addSong(data: Partial<Song>) {
  return request.post('/song', data)
}

export function updateSongById(id: number, data: Partial<Song>) {
  return request.put(`/song/${id}`, data)
}

export function deleteSongById(id: number) {
  return request.delete(`/song/${id}`)
}