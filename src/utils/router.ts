import { getMenus, getRoutes } from '@/api/menu.ts'
import type { ApiResponse, Menu, RouteRecordEntity } from '@/types'
import { useDynamicRoutesStore } from '@/stores/dynamic-routes.ts'
import { useMenuItemsStore } from '@/stores/menu.ts'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 批量导入管理模块
 */
const viewsModules = import.meta.glob(`../views/admin/**/*.vue`);

/**
 * 加载静态路由
 */
export const loadStaticRoutes = () => {
  useDynamicRoutesStore().loadStaticRoutes();
}


/**
 * 刷新路由
 */
export const refreshRoutes = () => {
  return new Promise((resolve) => {
    getRoutes()
      .then((res: ApiResponse<RouteRecordEntity[]>) => {
        const { applyAdminRoutesList } = useDynamicRoutesStore()
        applyAdminRoutesList(
          res.data.data.map((route: RouteRecordEntity) => ({
            ...route,
            path: `/admin${route.path}`,
            component: viewsModules[`../views/admin${route.component}`],
          })),
        );
        getMenus()
          .then((res: ApiResponse<Menu[]>) => {
            const completeMenuItemsPath = (menuItems: Menu[]) => {
              for (const menuItem of menuItems) {
                menuItem.route = `/admin${menuItem.route}`;
                if (menuItem.children) {
                  completeMenuItemsPath(menuItem.children);
                }
              }
            };
            const { setMenuItems } = useMenuItemsStore();

            const raw = res.data.data;
            completeMenuItemsPath(raw);
            setMenuItems(raw);
            resolve(true);
          })
          .catch(() => {})
      })
      .catch(() => {})
  });
}

/**
 * 统计路由数量
 * @param routeRecordRaw 路由
 */
export const countRouteRecordRaw = (routeRecordRaw: RouteRecordRaw[]) => {
  let count = 0;
  for (const routeRecord of routeRecordRaw) {
    if (routeRecord.children) {
      count += countRouteRecordRaw(routeRecord.children);
    }
    count++;
  }
  return count;
}
