/**
 * 静态路由
 */
export const staticRoutes = [
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
];
