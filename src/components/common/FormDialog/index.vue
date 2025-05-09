<script setup lang="ts">

import { computed, ref, unref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormConfig, FormItemConfig } from './types.ts'
import type { ValidateFieldsError } from 'async-validator'
import type { ApiResponse } from '@/types'
import { useMessage } from '@/composables/message.ts'
import { emitter } from '@/utils/emitter.ts'
import _ from 'lodash'

const formRef = ref<FormInstance>()

const open = defineModel<boolean>('open', { default: false })
// const formData = defineModel<Record<string, any>>('formData', { default: () => ({}) })

const formData = ref<Record<string, any>>({})

const props = withDefaults(defineProps<
  Omit<FormConfig, 'model'> & {
    title?: string
    items: FormItemConfig[],
    editId?: number,
    addData: (formData: Record<string, any>) => Promise<ApiResponse>,
    updateDataById?: (id: number, formData: Record<string, any>) => Promise<ApiResponse>,
    getDataById?: (id: number) => Promise<ApiResponse>,
    initialFormData?: Record<string, any>,

    headerClass?: string,
    bodyClass?: string,
    footerClass?: string
}>(), {
  rules: () => ({}),
  labelPosition: 'right',
  labelWidth: '',
  labelSuffix: '',
  requireAsteriskPosition: 'left',
  showMessage: true,
  inlineMessage: false,
  statusIcon: false,
  size: '',
  disabled: false,
  scrollToError: false,
  title: '填写信息',
  initialFormData: () => ({}),

  headerClass: '',
  bodyClass: '',
  footerClass: ''
})

const $items = computed(() => props.items
  .map((item: FormItemConfig) => Object.assign({
    labelPosition: props.labelPosition,
    labelWidth: props.labelWidth,
    required: false,
    rules: [],
    error: '',
    showMessage: props.showMessage,
    inlineMessage: props.inlineMessage,
    size: props.size,
    for: '',
    validateStatus: '',
    span: 24,
    type: 'input',
    config: () => ({})
  }, item)))

const emit = defineEmits<{
  'cancel': [],
  'submit': [formData: Record<string, any>],
  'invalid-submit': [formData: Record<string, any>, invalidFields?: ValidateFieldsError]
}>()

const slots = defineSlots<{
  [key: string]: (
    props: {
      formData: Record<string, any>,
      columnConfig: FormItemConfig
    }
  ) => void
}>()

const resetForm = () => {
  unref(formRef)?.resetFields()
  formData.value = Object.assign({}, props.initialFormData)
}

const handleCancel = () => {
  open.value = false;
  resetForm();
}

/**
 * 请求锁
 */
const requestLock = ref<boolean>(false)

const handleSubmit = () => {
  // 若请求锁已锁，则不执行提交操作
  if (unref(requestLock)) return
  formRef.value?.validate((valid: boolean, invalidFields?: ValidateFieldsError) => {
    if (valid) {
      const data = unref(formData)
      // 请求锁加锁
      requestLock.value = true
      if (_.isNumber(props.editId)) {
        props?.updateDataById?.(props.editId, data)
          .then((res: ApiResponse) => {
            emitter.emit('refresh')
            useMessage().success(res.data.msg || '修改成功')
            resetForm()
            open.value = false
          })
          .catch()
          .finally(() => {
            // 解锁请求锁
            requestLock.value = false
          })
      } else {
        props.addData(data)
          .then((res: ApiResponse) => {
            emitter.emit('refresh')
            useMessage().success(res.data.msg || '添加成功')
            resetForm()
            open.value = false
          })
          .catch()
          .finally(() => {
            // 解锁请求锁
            requestLock.value = false
          })
      }

      emit('submit', data)
    } else {
      emit('invalid-submit', unref(formData), invalidFields)
    }
  })
}

watch(
  open,
  () => {
    resetForm();
    if (_.isNumber(props.editId) && _.isFunction(props.getDataById)) {
      props.getDataById(props.editId)
        .then((res: ApiResponse) => {
          formData.value = res.data.data
        })
        .catch(() => {})
    }
})

</script>

<template>
  <el-dialog
    v-model="open"
    :title="title"
    draggable
    :header-class="headerClass"
    :body-class="bodyClass"
    :footer-class="footerClass"
    class="overflow-hidden"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-position="labelPosition"
      :label-width="labelWidth"
      :label-suffix="labelSuffix"
      :require-asterisk-position="requireAsteriskPosition"
      :show-message="showMessage"
      :inline-message="inlineMessage"
      :status-icon="statusIcon"
      :size="size"
      :disabled="disabled"
      :scroll-to-error="scrollToError"
    >
      <el-row>
        <el-col
          v-for="(item, index) in $items"
          :key="`form-item-${index}`"
          :span="item.span"
        >
          <el-form-item
            v-if="item.type !== 'padding' && item.label"
            :prop="item.prop"
            :label="item.label"
            :label-position="item.labelPosition"
            :label-width="item.labelWidth"
            :required="item.required"
            :rules="item.rules"
            :error="item.error"
            :show-message="item.showMessage"
            :inline-message="item.inlineMessage"
            :size="item.size"
            :for="item.for"
            :validate-status="item.validateStatus"
          >
            <slot
              v-if="item.type in slots"
              :name="item.type"
              :form-data="formData"
              :column-config="item"
            />
            <el-input
              v-else-if="item.type === 'input'"
              v-model="formData[item.prop ?? '_']"
              v-bind="item.config"
            />
            <el-input
              v-else-if="item.type === 'textarea'"
              v-model="formData[item.prop ?? '_']"
              type="textarea"
              :rows="4"
              v-bind="item.config"
            />
            <el-select
              v-else-if="item.type === 'select'"
              v-model="formData[item.prop ?? '_']"
              v-bind="_.omit(item.config, 'options')"
            >
              <el-option
                v-for="option in item.config.options"
                :key="option.key ?? option.value as string"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-mention
              v-else-if="item.type === 'mention'"
              v-model="formData[item.prop ?? '_']"
              v-bind="item.config"
            />
            <el-segmented
              v-else-if="item.type === 'segmented'"
              v-model="formData[item.prop ?? '_']"
              v-bind="item.config"
            />
            <el-autocomplete
              v-else-if="item.type === 'autocomplete'"
              v-model="formData[item.prop ?? '_']"
              v-bind="item.config"
            />
          </el-form-item>
          <slot
            v-else
            :name="item.type"
            :form-data="formData"
            :column-config="item"
          />
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-popconfirm
        class="box-item"
        title="确定不保存吗？"
        placement="bottom-end"
        :hide-after="0"
        @confirm="handleCancel"
      >
        <template #reference>
          <el-button>取消</el-button>
        </template>
      </el-popconfirm>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
