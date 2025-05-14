<script setup lang="ts">
import { type Component, markRaw, reactive } from 'vue'
import { type ApiParams, type ApiResponse, type Audit, FeedbackStatus, TargetType } from '@/types'
import { OTable } from '@/components/common'
import { deleteAuditById, getAuditsByPage, processAuditById } from '@/api/audit.ts'
import type { Columns, Operations } from '@/components/common/Table/types.ts'
import { ElTagX } from '@/tsx'
import { Search } from '@element-plus/icons-vue'
import { useMessage } from '@/composables/message.ts'
import { emitter } from '@/utils/emitter.ts'

const props = defineProps<{
  type: string | TargetType
}>()

const FeedbackStatusTag = {
  [FeedbackStatus.Pending]: ['warning', '待处理'],
  [FeedbackStatus.Processing]: ['primary', '处理中'],
  [FeedbackStatus.Resolved]: ['success', '已处理'],
  [FeedbackStatus.Rejected]: ['danger', '被拒绝'],
  [FeedbackStatus.Closed]: ['info', '已关闭'],
}

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
    width: 80,
  },
  {
    label: '提交反馈的人员',
    prop: '_',
    sortable: true,
    width: 240,
    formatter: (row: Audit) => `${row.submitter?.nickname}（${row.submitter?.username}）`,
  },
  {
    label: '反馈理由',
    prop: 'reason',
    sortable: true,
    width: 480,
  },
  {
    label: '反馈状态',
    prop: 'status',
    sortable: true,
    width: 120,
    filters: [
      { text: '待处理', value: FeedbackStatus.Pending },
      { text: '处理中', value: FeedbackStatus.Processing },
      { text: '已处理', value: FeedbackStatus.Resolved },
      { text: '被拒绝', value: FeedbackStatus.Rejected },
      { text: '已关闭', value: FeedbackStatus.Closed },
    ],
    slot: (row: Audit) =>
      ElTagX(
        FeedbackStatusTag[row.status ?? FeedbackStatus.Pending][0] ?? 'info',
        FeedbackStatusTag[row.status ?? FeedbackStatus.Pending][1] ?? row.status
      ),
  },
  {
    label: '反馈时间',
    prop: 'submittedAt',
    sortable: true,
    width: 160,
  },
])

const handleProcess = (editId: number, status: FeedbackStatus, callback: () => void) => {
  processAuditById(editId, { newStatus: status }).then((res: ApiResponse<boolean>) => {
    if (res.data.data) {
      useMessage().success('开始处理')
      emitter.emit('refresh')
    }
  })
}

const emit = defineEmits(['process'])

const operations: Operations = [
  {
    label: '处理',
    icon: markRaw<Component>(Search),
    type: 'primary',
    action: (row: Audit) => {
      if (row.status === FeedbackStatus.Pending) {
        handleProcess(row.id!, FeedbackStatus.Processing)
      }
      emit('process', row.id)
    },
  },
]
</script>

<template>
  <OTable
    :load-data="(params: ApiParams<Audit>) => getAuditsByPage(type, params)"
    :delete-data="deleteAuditById"
    :columns="columns"
    searchable
    deletable
    pagination
    default-column-width="120"
    :operations="operations"
  />
</template>

<style scoped></style>
