import {
  createRouter,
  createWebHashHistory,
  isNavigationFailure,
  type LocationQuery
} from 'vue-router'
import qs from 'qs'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/admin',
      meta: { title: '首页' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登录入口' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/IndexView.vue'),
      redirect: '/admin/index',
      children: [
        {
          path: 'index',
          name: 'admin-index',
          component: () => import('@/views/IndexView.vue'),
          meta: { title: '首页', hidden: true },
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: { icon: 'mdi:view-dashboard', title: '仪表盘' },
        },
        {
          path: 'perm',
          name: 'perm',
          meta: { icon: 'mdi:lock', title: '权限管理' },
          children: [
            {
              path: 'user',
              name: 'perm-user',
              component: () => import('@/views/admin/perm/UserManage.vue'),
              meta: { icon: 'mdi:account-group', title: '用户管理' }
            },
            {
              path: 'role',
              name: 'perm-role',
              component: () => import('@/views/admin/perm/RoleManage.vue'),
              meta: { icon: 'mdi:key', title: '角色管理' }
            },
          ],
        },
        {
          path: 'sys',
          name: 'sys',
          meta: { icon: 'mdi:cog', title: '系统管理' },
          children: [
            {
              path: 'menu',
              name: 'sys-menu',
              component: () => import('@/views/admin/sys/MenuManage.vue'),
              meta: { icon: 'mdi:menu', title: '菜单配置' }
            },
            {
              path: 'home',
              name: 'sys-home',
              component: () => import('@/views/admin/sys/HomePageManage.vue'),
              meta: { icon: 'mdi:home', title: '首页配置' }
            },
            {
              path: 'log',
              name: 'perm-log',
              component: () => import('@/views/admin/sys/LogManage.vue'),
              meta: { icon: 'mdi:text-box', title: '日志管理' }
            },
          ],
        },
        {
          path: 'user',
          name: 'user',
          meta: { icon: 'mdi:account', title: '用户中心' },
          children: [
            {
              path: 'info',
              name: 'user-info',
              component: () => import('@/views/admin/user/UserInfo.vue'),
              meta: { icon: 'mdi:account', title: '账户信息' }
            },
            {
              path: 'password',
              name: 'user-password',
              component: () => import('@/views/admin/user/UserPassword.vue'),
              meta: { icon: 'mdi:shield-lock', title: '密码管理' }
            },
            {
              path: 'device',
              name: 'user-device',
              component: () => import('@/views/admin/user/UserDevice.vue'),
              meta: { icon: 'mdi:desktop-mac', title: '设备管理' }
            },
          ],
        },
        {
          path: 'music',
          name: 'music',
          meta: { icon: 'mdi:music', title: '音乐管理' },
          children: [
            {
              path: 'song',
              name: 'music-song',
              component: () => import('@/views/admin/music/SongManage.vue'),
              meta: { icon: 'mdi:playlist-music', title: '歌曲管理' }
            },
            {
              path: 'artist',
              name: 'music-artist',
              component: () => import('@/views/admin/music/ArtistManage.vue'),
              meta: { icon: 'mdi:microphone', title: '艺人管理' }
            },
            {
              path: 'album',
              name: 'music-album',
              component: () => import('@/views/admin/music/AlbumManage.vue'),
              meta: { icon: 'mdi:album', title: '专辑管理' }
            },
          ],
        },
        {
          path: 'post',
          name: 'post',
          meta: { icon: 'mdi:book-open', title: '内容管理' },
          children: [
            {
              path: 'article',
              name: 'post-article',
              component: () => import('@/views/admin/post/ArticleManage.vue'),
              meta: { icon: 'mdi:book-open', title: '文章管理' }
            },
            {
              path: 'comment',
              name: 'post-comment',
              component: () => import('@/views/admin/post/CommentManage.vue'),
              meta: { icon: 'mdi:comment-text', title: '评论管理' }
            },
          ],
        },
        {
          path: 'cloud',
          name: 'cloud',
          meta: { icon: 'mdi:cloud', title: '云存储' },
          children: [
            {
              path: 'file',
              name: 'cloud-file',
              component: () => import('@/views/admin/cloud/FileManage.vue'),
              meta: { icon: 'mdi:folder', title: '文件管理' }
            },
          ],
        },
        {
          path: ':pathMatch(.*)*',
          name: 'admin-empty',
          component: () => import('@/views/EmptyView.vue'),
          meta: { hidden: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'empty',
      component: () => import('@/views/EmptyView.vue'),
      meta: { hidden: true },
    },
  ],
  parseQuery: qs.parse as (search: string) => LocationQuery,
  stringifyQuery: qs.stringify,
})

router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure)) {
    console.warn('from: ', from, ', to: ', to, ', failed navigation: ', failure)
  }
})

// TODO: 登录校验
function isAuthenticated() {
  return true
}

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin') && ! isAuthenticated()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
