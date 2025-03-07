export interface BreadcrumbItemInfo {
  title: string;
  parent: string;
  path: string;
}

export const breadcrumbItemInfoList = [
  {
    title: '仪表盘',
    parent: null,
    path: '/admin/dashboard'
  },
  {
    title: '用户管理',
    parent: '权限管理',
    path: '/admin/perm/user'
  },
  {
    title: '角色管理',
    parent: '权限管理',
    path: '/admin/perm/role'
  },
  {
    title: '日志管理',
    parent: '权限管理',
    path: '/admin/perm/log'
  },
  {
    title: '菜单配置',
    parent: '系统管理',
    path: '/admin/sys/menu'
  },
  {
    title: '首页配置',
    parent: '系统管理',
    path: '/admin/sys/home'
  },
  {
    title: '账户信息',
    parent: '用户中心',
    path: '/admin/user/info'
  },
  {
    title: '密码管理',
    parent: '用户中心',
    path: '/admin/user/password'
  },
  {
    title: '设备管理',
    parent: '用户中心',
    path: '/admin/user/device'
  },
  {
    title: '歌曲管理',
    parent: '音乐管理',
    path: '/admin/music/song'
  },
  {
    title: '艺人管理',
    parent: '音乐管理',
    path: '/admin/music/artist'
  },
  {
    title: '专辑管理',
    parent: '音乐管理',
    path: '/admin/music/album'
  },
  {
    title: '文章管理',
    parent: '内容管理',
    path: '/admin/post/article'
  },
  {
    title: '评论管理',
    parent: '内容管理',
    path: '/admin/post/comment'
  },
  {
    title: '文件管理',
    parent: '云存储',
    path: '/admin/cloud/file'
  }
];
