import {
  createRouter,
  createWebHashHistory,
  type LocationQuery
} from 'vue-router'
import qs from 'qs'
import { useAuthorizationStore } from '@/stores/authorization.ts'
import { useMessage } from '@/composables/message.ts'
import NProgress from 'nprogress'
import { refreshRoutes } from '@/utils/router.ts'
import { staticRoutes } from '@/router/static-routes.ts'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [],
  parseQuery: qs.parse as (search: string) => LocationQuery,
  stringifyQuery: qs.stringify,
})

router.afterEach((to, from, failure) => {
  NProgress.done()
})

function isAuthenticated() {
  return useAuthorizationStore().hasToken()
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (to.path.startsWith('/admin')) {
    if (isAuthenticated()) {
      if (router.getRoutes().length === 0) {
        await refreshRoutes();
        next({ path: to.path, query: to.query, replace: true })
      } else {
        next()
      }
    } else {
      useMessage().warning('请先登录账户后再尝试访问！')
      if (router.getRoutes().length === 0) {
        staticRoutes.forEach(route => router.addRoute(route))
      }
      next({ name: 'login', query: { redirect: to.fullPath }, replace: true })
    }
  } else {
    if (router.getRoutes().length === 0) {
      staticRoutes.forEach(route => router.addRoute(route))
      next({ ... to, replace: true })
    } else {
      next()
    }
  }
})

export default router
