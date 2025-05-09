import type { User } from '@/types'
import dayjs from 'dayjs'
import type { Row } from '@/components/common/Table/types.ts'
import { ref, type Ref } from 'vue'
import { set } from 'lodash'

export const datetimeFormatter = (row: Row, column: unknown, cellValue: unknown, index: number) => {
  return dayjs(cellValue as string).format('YYYY-MM-DD HH:mm:ss')
}

export const useEditableTable = () => {

  const open = ref<boolean>(false)

  const editId = ref<number | undefined>(undefined)

  const setEditId = (id: number) => {
    editId.value = id
  }

  const resetEditId = () => {
    editId.value = undefined
  }

  const handleAdd = () => {
    open.value = true
    resetEditId()
  }

  const handleEdit = (id: number) => {
    open.value = true
    setEditId(id)
  }

  return {
    open,
    editId,
    handleAdd,
    handleEdit,
    setEditId,
    resetEditId
  }
}
