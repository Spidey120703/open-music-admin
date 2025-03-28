<script setup lang="ts">
import { Table } from '@/components/common'
import { ElTagX } from '@/tsx'
import { getRolesByPage } from '@/api/role.ts'
import type { Role } from '@/types'
import { reactive } from 'vue'
import type { Columns } from '@/components/common/Table/types.ts'

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
    label: '描述',
    prop: 'description',
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
])
</script>

<template>
  <Table
    :load-data="getRolesByPage"
    :columns="columns"
    searchable
    selection
    addition
    modification
    deletion
    pagination
  />
</template>

<style scoped></style>
