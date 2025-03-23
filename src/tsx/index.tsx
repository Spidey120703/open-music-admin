import type { ElTagType } from '@/types'
import { ElTag } from 'element-plus'

export const ElTagX = (type: unknown, label: unknown) => (
  <ElTag disable-transitions type={type as ElTagType}>
    {label}
  </ElTag>
)
