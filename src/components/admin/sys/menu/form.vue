<script setup lang="ts">

import { OFormDialog } from '@/components/common'
import { computed, reactive, watch } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { MenuType } from '@/types'
import { addMenu, getMenuById, updateMenu } from '@/api/menu.ts'
import { withPathId } from '@/utils/api.ts'
import { matchIcons } from '@/components/common/Icon/list.ts'
import { OIcon } from '@/components/common'

const props = withDefaults(defineProps<{
  editId?: number
  initialFormData?: Record<string, any>
}>(), {
  editId: undefined,
  initialFormData: () => ({})
})

const open = defineModel('open', { default: false });
const formData = defineModel('formData', { default: {} })

const title = computed(() => {
  return props.editId !== undefined ? '编辑菜单' : '添加菜单'
});

const items = reactive<FormItemConfig[]>([
  {
    span: 12,
    label: '编号',
    prop: 'id',
    type: 'input',
    config: {
      disabled: true,
      placeholder: '自动生成',
    }
  },
  {
    span: 12,
    label: '父编号',
    prop: 'parentId',
    type: 'input',
    config: {
      disabled: true,
    }
  },
  {
    span: 12,
    label: '菜单名',
    prop: 'name',
    type: 'input',
  },
  {
    span: 12,
    label: '路由',
    prop: 'route',
    type: 'input',
  },
  {
    span: 12,
    label: '图标',
    prop: 'icon',
    type: 'icon-name-autocomplete',
    config: {
      fetchSuggestions(query: string, cb: any) {
        cb(matchIcons(query).map(value => ({ value })).slice(0, 20))
      }
    }
  },
  {
    span: 12,
    label: '标题',
    prop: 'title',
    type: 'input',
  },
  {
    span: 12,
    label: '是否隐藏',
    prop: 'hidden',
    type: 'segmented',
    config: {
      options: [
        {
          label: '否',
          value: false,
        },
        {
          label: '是',
          value: true,
        },
      ],
    }
  },
  {
    span: 12,
    label: '类型',
    prop: 'type',
    type: 'segmented',
    config: {
      options: [
        {
          label: '菜单',
          value: MenuType.MENU,
        },
        {
          label: '操作',
          value: MenuType.OPERATION,
        },
      ],
    }
  },
]);

</script>

<template>
  <OFormDialog
    v-model:form-data="formData"
    v-model:open="open"
    :items="items"
    :initial-form-data="initialFormData"
    label-width="5em"
    :title="title"
    :edit-id="editId"
    :add-data="withPathId(addMenu, 'parentId')"
    :update-data-by-id="updateMenu"
    :get-data-by-id="getMenuById"
  >
    <template #icon-name-autocomplete="{ formData, columnConfig }">
      <el-autocomplete
        v-model="formData[columnConfig.prop ?? '_']"
        v-bind="columnConfig.config"
        :trigger-on-focus="false"
        highlight-first-item
      >
        <template #default="{ item }">
          <div class="flex items-center gap-20px">
            <el-icon><OIcon :icon="item.value" /></el-icon>
            <div>{{ item.value }}</div>
          </div>
        </template>
        <template #suffix>
          <el-icon><OIcon :icon="formData[columnConfig.prop ?? '_']" /></el-icon>
        </template>
      </el-autocomplete>
    </template>
  </OFormDialog>
</template>

<style scoped>

</style>
