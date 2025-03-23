<script setup lang="ts">

import BaseTable from '@/components/common/BaseTable.vue'
import { ElTagX } from '@/tsx'
import { getRoles } from '@/apis/role.ts'


const columns = [
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
    slot: (row: Record<string, unknown>) => ElTagX(row.type, row.type)
  },
]

</script>

<template>
  <base-table
    :load-data="getRoles"
    :columns="columns"
    searchable
    selection
    addition
    modification
    deletion
    pagination
  />
</template>

<style scoped>

</style>
