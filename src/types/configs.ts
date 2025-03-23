import type { ElTagType } from '@/types/el-types.ts'

export interface ElTagConfig {
  readonly label: string
  readonly type: ElTagType
  readonly icon: string
}
