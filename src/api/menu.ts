import type { Menu } from '@/types'
import { request } from '@/utils/request'

export function getMenuById(menuId: number) {
  return request.get(`/menu/${menuId}`)
}

export function getMenuByIdLazy(menuId: number) {
  return request.get(`/menu/${menuId}/lazy`)
}

export function getMenusByRootId() {
  return request.get(`/menu/0/children`)
}

export function getMenusByRootIdLazy() {
  return request.get(`/menu/0/children/lazy`)
}

export function getMenusByParentId(parentMenuId: number) {
  return request.get(`/menu/${parentMenuId}/children`)
}

export function getMenusByParentIdLazy(parentMenuId: number) {
  return request.get(`/menu/${parentMenuId}/children/lazy`)
}

export function addMenu(parentMenuId: number, data: Partial<Menu>) {
  return request.post(`/menu/${parentMenuId}`, data)
}

export function updateMenu(menuId: number, data: Partial<Menu>) {
  return request.put(`/menu/${menuId}`, data)
}

export function deleteMenu(menuId: number) {
  return request.delete(`/menu/${menuId}`)
}
