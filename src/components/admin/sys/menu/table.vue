<script setup lang="ts">
import { OTable, OFormDialog } from '@/components/common'
import {
  getMenusByRootIdLazy,
  getMenusByParentIdLazy,
  getMenusByRootId,
  deleteMenu
} from '@/api/menu.ts'
import { type Menu } from '@/types'
import { MenuType } from '@/types'
import { type Component, markRaw, reactive, ref } from 'vue'
import type { Columns, Operations } from '@/components/common/Table/types.ts'
import { ElTagX } from '@/tsx'
import { Plus } from '@element-plus/icons-vue'
import { OIcon } from '@/components/common'

const columns = reactive<Columns>([
  {
    label: '名称',
    prop: 'name',
    width: '240px'
  },
  {
    label: '路由',
    prop: 'route',
    width: '240px'
  },
  {
    label: '图标',
    prop: 'icon',
    type: 'icon',
    align: 'center'
  },
  {
    label: '标识',
    prop: 'title',
    width: '240px'
  },
  {
    label: '隐藏',
    prop: 'hidden',
    formatter: (row: Menu) => row.hidden ? '是' : '否',
    slot: (row: Menu) =>
      ElTagX(row.hidden ? 'info' : 'primary', row.hidden ? '是' : '否'),
  },
  {
    label: '类型',
    prop: 'type',
    formatter: (row: Menu) => row.type === MenuType.OPERATION ? '操作' : '菜单',
    slot: (row: Menu) =>
      ElTagX(row.type === MenuType.OPERATION ? 'success' : 'primary', row.type === MenuType.OPERATION ? '操作' : '菜单'),
  },
])

const emit = defineEmits(['add', 'edit'])

const handleAddition = () => {
  // console.log('添加菜单操作')
  emit('add')
}

const handleEdition = (row: Menu) => {
  // console.log('修改菜单操作')
  emit('edit', row.id)
}

const operations: Operations = [
  {
    label: '新增',
    icon: markRaw<Component>(Plus),
    type: 'primary',
    action: (row: Menu) => {
      // console.log('添加子菜单')
      emit('add', row.id)
    }
  }
]

</script>

<template>
  <OTable
    :load-data="getMenusByRootId"
    :load-tree-node-data="getMenusByParentIdLazy"
    :delete-data="deleteMenu"
    :columns="columns"
    addition
    editable
    deletable
    tree
    :operations="operations"
    @add="handleAddition"
    @edit="handleEdition"
  >
    <template #icon="{ row }">
      <el-icon v-if="row.icon">
        <OIcon :icon="row.icon" />
      </el-icon>
    </template>
  </OTable>
</template>

<style scoped>

</style>
