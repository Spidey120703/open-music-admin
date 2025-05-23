<script setup lang="ts">
import { ref, reactive, computed, markRaw, type Component, watch } from 'vue'
import type { ElTagConfig, Role, User, UserStatus } from '@/types'
import { OTable } from '@/components/common'
import { getUsersByPage, deleteUserById } from '@/api/user.ts'
import { ElTagX } from '@/tsx'
import type { Columns, Operations } from '@/components/common/Table/types.ts'
import { datetimeFormatter } from '@/components/common/Table/utils.ts'
import { Lock } from '@element-plus/icons-vue'

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

const statusFilters = computed(() => {
  return Object.entries(UserStatusConfig).map(([key, config]) => ({
    text: config.label,
    value: key as UserStatus,
  }))
})

const props = defineProps<{
  roles: Role[]
}>()

const roleFilters = ref<{ text: string, value: any }[]>([])
watch(
  () => props.roles,
  (roles) => {
  roleFilters.value = roles.map((item: Role) => ({
    text: item.label,
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
    slot: (row: User) => ElTagX(row!.role!.type, row!.role!.label),
  },
  {
    label: '注册日期',
    prop: 'registeredAt',
    sortable: true,
    align: 'center',
    width: 160,
    formatter: datetimeFormatter,
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

const emit = defineEmits(['add', 'edit', 'reset-password'])

const handleAddition = () => {
  emit('add')
}

const handleEdition = (row: User) => {
  emit('edit', row.id)
}

const operations: Operations = [
  {
    label: '密码',
    icon: markRaw<Component>(Lock),
    type: 'primary',
    action: (row: User) => {
      emit('reset-password', row.id)
    }
  }
]

</script>

<template>
  <OTable
    :load-data="getUsersByPage"
    :delete-data="deleteUserById"
    :columns="columns"
    :operations="operations"
    searchable
    selection
    addition
    editable
    deletable
    pagination
    default-column-width="120"
    @add="handleAddition"
    @edit="handleEdition"
  />
</template>

<style scoped>
</style>
