import type { ElTagType } from '@/types/el-types.ts'

export interface Role {
  id: number
  name: string
  description: string
  type: ElTagType
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

export interface Menu {
  id?: number;
  name: string;
  route: string;
  icon?: string;
  title?: string;
  hidden?: boolean;
  parentId?: number;
  parent?: Menu;
  children?: Menu[];
  hasChildren?: boolean;
  createdAt?: string;
  deleted?: boolean;
}
