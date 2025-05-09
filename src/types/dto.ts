import type { ElTagType } from '@/types/el-types.ts'

export interface Role {
  id: number
  name: string
  label: string
  type: ElTagType
  createdAt?: string | Date
}

export type UserStatus = 'active' | 'frozen' | 'deactivated' | 'other'

export interface User {
  id?: number
  username: string
  password: string
  avatar?: string
  nickname?: string
  email?: string
  phone?: string
  status?: UserStatus
  roleId?: number
  role?: Role
  registeredAt?: string | Date
}

export enum MenuType {
  MENU = 'menu',
  OPERATION = 'operation',
}

export interface Menu {
  id?: number;
  name: string;
  route: string;
  icon?: string;
  title?: string;
  hidden?: boolean;
  type?: MenuType;
  parentId?: number;
  parent?: Menu;
  children?: Menu[];
  hasChildren?: boolean;
  createdAt?: string;
  deleted?: boolean;
}

export interface LoginForm { username: string, password: string }
