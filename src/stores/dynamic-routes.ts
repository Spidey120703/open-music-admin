import { ref, unref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecord } from 'vue-router'
import router from '@/router'
import { staticRoutes } from '@/router/static-routes.ts'

export const useDynamicRoutesStore = defineStore('dynamic-routes', () => {
  const dynamicRoutes = ref<RouteRecord[]>([]);

  const loadStaticRoutes = () => {
    router.clearRoutes();
    for (const routes of staticRoutes) {
      router.addRoute(routes)
    }
  }

  const applyAdminRoutesList = (newRoutesList: Record<string, any>[]) => {
    loadStaticRoutes();
    dynamicRoutes.value = newRoutesList as RouteRecord[]
    for (const routes of unref(dynamicRoutes)) {
      router.addRoute('admin', routes)
    }
  }

  const isPathValid = (path: string) => {
    return unref(dynamicRoutes).some(route => route.path === path)
  }

  return { dynamicRoutes, loadStaticRoutes, applyAdminRoutesList, isPathValid }

}, {
  persist: {
    storage: localStorage,
    pick: [ 'dynamicRoutes' ]
  }
})
