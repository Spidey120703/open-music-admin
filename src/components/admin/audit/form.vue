<script setup lang="ts">
import { OFormDialog } from '@/components/common'
import { ref, watch } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { getAuditById, processAuditById } from '@/api/audit.ts'
import { type ApiResponse, type Audit, FeedbackStatus } from '@/types'
import { useMessage } from '@/composables/message.ts'
import { emitter } from '@/utils/emitter.ts'

const props = withDefaults(
  defineProps<{
    editId?: number
  }>(),
  {
    editId: undefined,
  },
)

const open = defineModel('open', { default: false })

const title = '处理反馈审核'

const items = ref<FormItemConfig[]>([
  {
    span: 24,
    prop: 'cover',
    type: 'cover-input',
  },
  {
    span: 12,
    label: '编号',
    prop: 'id',
    type: 'input',
    config: {
      disabled: true,
      placeholder: '自动生成',
    },
  },
  {
    span: 12,
    type: 'padding',
  },
  {
    span: 12,
    label: '反馈人员昵称',
    prop: 'submitterNickname',
    type: 'input',
    config: {
      placeholder: '反馈人员昵称暂无昵称',
      readonly: true,
    },
  },
  {
    span: 12,
    label: '反馈人员账号',
    prop: 'submitterUsername',
    type: 'input',
    config: {
      readonly: true,
    },
  },
  {
    span: 24,
    label: '反馈原因',
    prop: 'reason',
    type: 'textarea',
    config: {
      placeholder: '暂无反馈原因',
      readonly: true,
    },
  },
  {
    span: 12,
    label: '反馈目标昵称',
    prop: 'targetNickname',
    type: 'input',
    config: {
      placeholder: '反馈人员昵称暂无昵称',
      readonly: true,
    },
  },
  {
    span: 12,
    label: '反馈目标账号',
    prop: 'targetUsername',
    type: 'input',
    config: {
      readonly: true,
    },
  },
  {
    span: 24,
    label: '反馈目标内容',
    prop: 'targetContent',
    type: 'textarea',
    config: {
      placeholder: '暂无目标内容',
      readonly: true,
    },
  },
])

const initialFormData = ref<Record<string, any>>({})

watch(open, (val) => {
  if (!val || props.editId === undefined) return

  getAuditById(props.editId).then((res: ApiResponse<Audit>) => {
    const data = res.data.data

    initialFormData.value = {
      id: data.id,
      targetContent: data.target?.content,
      targetNickname: data.target?.author?.nickname,
      targetUsername: data.target?.author?.username,
      submitterNickname: data.submitter?.nickname,
      submitterUsername: data.submitter?.username,
      reason: data.reason,
      status: data.status,
    }
  })
})

const handleProcess = (status: FeedbackStatus) => {
  processAuditById(props.editId!, { newStatus: status }).then((res: ApiResponse<boolean>) => {
    if (res.data.data) {
      useMessage().success('处理成功')
      open.value = false
      emitter.emit('refresh')
    }
  })
}
</script>

<template>
  <OFormDialog
    v-model:open="open"
    :items="items"
    label-width="8em"
    :title="title"
    :initial-form-data="initialFormData"
    header-class="relative z-1 immersive-header"
  >
    <template #footer>
      <el-button @click="open = false">关闭</el-button>
      <template v-if="[FeedbackStatus.Pending, FeedbackStatus.Processing].includes(initialFormData.status)">
        <el-button type="warning" @click="handleProcess(FeedbackStatus.Pending)">取消处理</el-button>
        <el-button type="primary" @click="handleProcess(FeedbackStatus.Resolved)">删除内容</el-button>
        <el-button type="info" @click="handleProcess(FeedbackStatus.Rejected)">不做处理</el-button>
        <el-button type="danger" @click="handleProcess(FeedbackStatus.Closed)">关闭处理</el-button>
      </template>
    </template>
  </OFormDialog>
</template>

<style lang="scss" scoped></style>

<style lang="scss"></style>
