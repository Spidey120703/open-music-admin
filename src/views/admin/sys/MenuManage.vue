<script setup lang="ts">
import { Table } from '@/components/common'
import { getMenusByRootIdLazy, getMenusByParentIdLazy } from '@/api/menu.ts'
import type { ApiError, ApiResponse, Menu } from '@/types'
import { onMounted, reactive, ref } from 'vue'
import type { Columns, Row, Rows } from '@/components/common/Table/types.ts'
import { ElTagX } from '@/tsx'
import { useMessage } from '@/composables/message.ts'

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
  },
  {
    label: '菜单名',
    prop: 'name',
  },
  {
    label: '路由',
    prop: 'route',
  },
  {
    label: '图标',
    prop: 'icon',
  },
  {
    label: '标题',
    prop: 'title',
  },
  {
    label: '隐藏',
    prop: 'hidden',
    formatter: (row: Menu) => row.hidden ? '是' : '否',
    slot: (row: Menu) =>
      ElTagX(row.hidden ? 'danger' : 'success', row.hidden ? '是' : '否'),
  },
  {
    label: '父菜单ID',
    prop: 'parentId',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
  },
])

const data = ref<Rows>()

const loading = ref<boolean>(false)

onMounted(() => {
  getMenusByRootIdLazy()
    .then((res: ApiResponse<Rows>) => {
      data.value = res.data.data
      loading.value = false
    })
    .catch((err: ApiError<Row>) => {
      useMessage().error(err.response?.data?.message || '请求失败')
      loading.value = false
    })
})

</script>

<template>
  <Table
    :data="data"
    :load-data="getMenusByParentIdLazy"
    :columns="columns"
    addition
    modification
    deletion
    tree
    lazy
    v-loading="loading"
  />
</template>

<style scoped>

</style>
