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
