import type { Component, Raw, Ref, VNode } from 'vue'
import type { ElButtonType, ElPopPlacement, ElTagType } from '@/types'
import type { IconEntity } from '@/components/common/Icon/types.ts'

export type Row = Record<string, unknown> | unknown | any

export type Rows = Row[]

export interface Filter {
  text: string
  value: string
}

export type Filters = Filter[]

export interface Column {
  label: string
  prop: string
  columnKey?: string
  type?: 'default' | 'selection' | string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filters?: Filters | Ref<Filters>
  formatter?: (row: Row, column: unknown, cellValue: unknown, index: number) => VNode | string
  fixed?: 'left' | 'right' | boolean
  slot?: (row: Row) => VNode
}

export type Columns = Column[]

export interface PopConfirm {
  placement?: ElPopPlacement
  title?: string
  confirmText?: string
  cancelText?: string
  confirmType?: ElButtonType
  cancelType?: ElButtonType
  icon?: IconEntity | Raw<IconEntity>
  iconColor?: string
  hideIcon?: boolean
  hideAfter?: number
  teleported?: boolean
  persistent?: boolean
  confirm?: (row?: Row) => void
  cancel?: (row?: Row) => void
  width?: string | number
}

export interface Operation {
  label: string
  type?: ElTagType
  icon?: Component | string
  condition?: (row?: Row) => boolean
  action?: (row?: Row) => void
  popConfirm?: PopConfirm
}

export type Operations = Operation[]
