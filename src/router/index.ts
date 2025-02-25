import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import IndexView from "@/views/IndexView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/IndexView.vue'),
      children: [
        {
          path: 'sys',
          name: 'sys',
          children: [
            {
              path: 'user',
              name: 'user',
              component: () => import('@/views/admin/perm/UserManage.vue')
            },
            {
              path: 'role',
              name: 'role',
              component: () => import('@/views/admin/perm/RoleManage.vue')
            },
            {
              path: 'log',
              name: 'log',
              component: () => import('@/views/admin/perm/LogManage.vue')
            }
          ]
        }
      ]
    }
  ],
})

export default router
