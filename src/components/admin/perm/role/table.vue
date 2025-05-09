<script setup lang="ts">
import { OTable } from '@/components/common'
import { ElTagX } from '@/tsx'
import { getRolesByPage, deleteRoleById } from '@/api/role.ts'
import type { Role } from '@/types'
import { type Component, markRaw, reactive } from 'vue'
import type { Columns, Operations } from '@/components/common/Table/types.ts'
import { Key } from '@element-plus/icons-vue'
import { datetimeFormatter } from '@/components/common/Table/utils.ts'

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
  },
  {
    label: '角色名',
    prop: 'name',
    sortable: true,
  },
  {
    label: '标签名',
    prop: 'label',
    sortable: true,
  },
  {
    label: '颜色类型',
    prop: 'type',
    sortable: true,
    filters: [
      { text: 'success', value: 'success' },
      { text: 'warning', value: 'warning' },
      { text: 'danger', value: 'danger' },
      { text: 'info', value: 'info' },
      { text: 'primary', value: 'primary' },
    ],
    slot: (row: Role) => ElTagX(row.type, row.type),
  },
  {
    label: '创建日期',
    prop: 'createdAt',
    sortable: true,
    align: 'center',
    width: 160,
    formatter: datetimeFormatter,
  },
])

const emit = defineEmits(['add', 'edit', 'grant'])

const handleAddition = () => {
  emit('add')
}

const handleEdition = (row: Role) => {
  emit('edit', row.id)
}

const operations: Operations = [
  {
    label: '授权',
    icon: markRaw<Component>(Key),
    type: 'primary',
    action: (row: Role) => {
      emit('grant', row.id)
    }
  }
]
</script>

<template>
  <OTable
    :load-data="getRolesByPage"
    :delete-data="deleteRoleById"
    :columns="columns"
    searchable
    selection
    addition
    editable
    deletable
    pagination
    :operations="operations"
    @add="handleAddition"
    @edit="handleEdition"
  />
</template>

<style scoped></style>
