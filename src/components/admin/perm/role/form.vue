<script setup lang="ts">

import { OFormDialog } from '@/components/common'
import { computed, reactive, watch } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { addRole, getRoleById, updateRoleById } from '@/api/role.ts'
import { withPathId } from '@/utils/api.ts'
import { OIcon } from '@/components/common'
import _ from 'lodash'

const props = withDefaults(defineProps<{
  editId?: number
  initialFormData?: Record<string, any>
}>(), {
  editId: undefined,
  initialFormData: () => ({})
})

const open = defineModel('open', { default: false });

const title = computed(() => {
  return props.editId !== undefined ? '编辑角色' : '添加角色'
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
    type: 'padding'
  },
  {
    span: 12,
    label: '角色名',
    prop: 'name',
    type: 'input',
  },
  {
    span: 12,
    label: '标签名',
    prop: 'label',
    type: 'input',
  },
  {
    span: 12,
    label: '颜色类型',
    prop: 'type',
    type: 'color-type-select',
    config: {
      options: [
        { label: 'success', value: 'success' },
        { label: 'warning', value: 'warning' },
        { label: 'danger', value: 'danger' },
        { label: 'info', value: 'info' },
        { label: 'primary', value: 'primary' },
      ],
    }
  },
]);

</script>

<template>
  <OFormDialog
    v-model:open="open"
    :items="items"
    :initial-form-data="initialFormData"
    label-width="5em"
    :title="title"
    :edit-id="editId"
    :add-data="addRole"
    :update-data-by-id="updateRoleById"
    :get-data-by-id="getRoleById"
  >
    <template #color-type-select="{ formData, columnConfig }">
      <el-select
        v-model="formData[columnConfig.prop ?? '_']"
        v-bind="_.omit(columnConfig.config, 'options')"
        :trigger-on-focus="false"
        highlight-first-item
      >
        <template #label="{ label, value }">
          <el-tag disable-transitions :type="value">
            {{ label }}
          </el-tag>
        </template>
        <el-option
          v-for="option in columnConfig?.config?.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        >
          <el-tag disable-transitions :type="option.value">
            {{ option.label }}
          </el-tag>
        </el-option>
      </el-select>
    </template>
  </OFormDialog>
</template>

<style scoped>

</style>
