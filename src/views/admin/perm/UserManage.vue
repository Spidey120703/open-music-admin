<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { ElTagConfig, Role, User, UserStatus } from '@/types'
import dayjs from 'dayjs'
import { Table } from '@/components/common'
import { getUsersByPage, deleteUserById } from '@/api/user.ts'
import { ElTagX } from '@/tsx'
import type { Columns } from '@/components/common/Table/types.ts'

const UserStatusConfig: Record<UserStatus, ElTagConfig> = {
  active: {
    label: '正常',
    type: 'success',
    icon: 'circle-check',
  },
  frozen: {
    label: '冻结',
    type: 'warning',
    icon: 'warning',
  },
  deactivated: {
    label: '注销',
    type: 'danger',
    icon: 'circle-close',
  },
  other: {
    label: '其他',
    type: 'info',
    icon: 'info-filled',
  },
} as const

function getUserStatus(status: string) {
  return UserStatusConfig[status as UserStatus]
}

const roleFilters = ref([])

const statusFilters = computed(() => {
  return Object.entries(UserStatusConfig).map(([key, config]) => ({
    text: config.label,
    value: key as UserStatus,
  }))
})

onMounted(async () => {
  const { data } = await getUsersByPage({ size: -1 })
  roleFilters.value = data.data.records.map((item: Role) => ({
    text: item.description,
    value: item.id,
  }))
})

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
    width: 80,
  },
  {
    label: '用户名',
    prop: 'username',
    sortable: true,
  },
  {
    label: '昵称',
    prop: 'nickname',
    sortable: true,
  },
  {
    label: '电子邮件',
    prop: 'email',
    sortable: true,
    align: 'right',
    width: 200,
  },
  {
    label: '手机号',
    prop: 'phone',
    sortable: true,
    align: 'right',
    width: 120,
  },
  {
    label: '角色',
    prop: 'roleId',
    sortable: true,
    align: 'center',
    filters: roleFilters,
    slot: (row: User) => ElTagX(row!.role!.type, row!.role!.description),
  },
  {
    label: '注册日期',
    prop: 'registeredAt',
    sortable: true,
    align: 'center',
    width: 160,
    formatter: (row: User, column: unknown, cellValue: unknown, index: number) => {
      return dayjs(cellValue as string).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    label: '账号状态',
    prop: 'status',
    sortable: true,
    align: 'center',
    filters: statusFilters,
    slot: (row: User) =>
      ElTagX(getUserStatus(row!.status as string).type, getUserStatus(row!.status as string).label),
  },
])
</script>

<template>
  <Table
    :load-data="getUsersByPage"
    :delete-data="deleteUserById"
    :columns="columns"
    searchable
    selection
    addition
    modification
    deletion
    pagination
    default-column-width="120"
  />
</template>

<style scoped>
.user-manage {
  --default-padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--default-padding);
}
.el-card:deep(.el-card__body) {
  height: 100%;
}
.el-card {
  --el-card-padding: var(--default-padding);
}
.el-input + .el-button {
  margin-left: var(--el-card-padding);
}
.el-button + .el-button {
  margin-left: var(--el-card-padding);
}
.el-button:not(.el-button--small):has(.el-icon) {
  padding-left: 12px;
  padding-right: 12px;
}
</style>
