import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Menu } from '@/types'

export const useMenuItemsStore = defineStore('menu-items', () => {

  const menuItems = ref<Menu[]>([])

  const setMenuItems = (newMenu: Menu[]) => {
    menuItems.value = newMenu
  }

  const getMenuItems = () => {
    return menuItems.value
  }

  return { menuItems, setMenuItems, getMenuItems }
})
