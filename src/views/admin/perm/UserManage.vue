<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElInput } from 'element-plus'
import { Search, Refresh, Plus, Download, Edit, Delete } from '@element-plus/icons-vue'

const AccountStatusConfig = {
  Active: {
    label: '正常',
    tagType: 'success',
    icon: 'circle-check',
  },
  Frozen: {
    label: '冻结',
    tagType: 'warning',
    icon: 'warning',
  },
  Deactivated: {
    label: '注销',
    tagType: 'danger',
    icon: 'circle-close',
  },
  Other: {
    label: '其他',
    tagType: 'info',
    icon: 'info-filled',
  },
} as const;

// 生成类型
type AccountStatus = keyof typeof AccountStatusConfig;
type AccountStatusLabel = typeof AccountStatusConfig[AccountStatus]['label'];
type AccountStatusTagType = typeof AccountStatusConfig[AccountStatus]['tagType'];

// 辅助函数
const getStatusTagConfig = (status: AccountStatus) => AccountStatusConfig[status];


interface User {
  id: number
  avatar: string
  username: string
  nickname: string
  createTime: Date
  email: string
  role: string
  status: AccountStatus
  phone: string
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 1,
    avatar: '/default/avatar/admin.png',
    username: 'admin',
    nickname: '超级管理员',
    createTime: new Date('1990-01-01'),
    email: 'admin@example.com',
    role: '管理员',
    phone: '13800138000', // 确保11位数字
    status: 'Active'
  },
  ...Array.from({ length: 27 }, (_, i) => {
    const baseId = i + 2
    const roles = ['普通用户', '管理员', '开发者', '审计员', '游客'] as const
    const domains = ['example.com', 'test.org', 'company.net', 'sample.cn']

    return {
      id: baseId,
      avatar: `/default/avatar/user${baseId}.png`,
      username: `user${baseId}`,
      nickname: `测试用户${baseId}`,
      createTime: new Date(`${1985 + (i % 20)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`),
      email: `user${baseId}@${domains[i % domains.length]}`,
      role: roles[i % roles.length],
      phone: `1${3 + (i % 7)}${String(Math.random()).slice(2, 11).padEnd(9, '0').slice(0,10)}`,
      status: [
        'Active',
        'Frozen',
        'Deactivated'
      ][i % 3] as AccountStatus // 添加状态字段
    }
  })
  // 可继续添加更多模拟数据...
]

// 使用模拟数据替换原有 fetch 逻辑
const users = ref<User[]>(mockUsers)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(mockUsers.length)

const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.username.includes(search.value) ||
      user.nickname.includes(search.value) ||
      user.email.includes(search.value) ||
      user.phone.includes(search.value),
  )
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}

function dateFormatter(row: User, column: unknown, cellValue: Date, index: number) {
  return cellValue.toISOString().substring(0, 19).replace('T', ' ')
}

const statusFilters = computed(() => {
  return Object.entries(AccountStatusConfig).map(([key, config]) => ({
    text: config.label,
    value: key as AccountStatus
  }))
})
const statusFilterMethod = (value: string, row: User) => {
  return row.status === value
}
</script>

<template>
  <div class="user-manage">
    <el-card class="h-72px flex-none">
      <el-input v-model="search" placeholder="搜索关键字" style="max-width: 16em" />
      <el-button type="primary" :icon="Search">搜索</el-button>
      <el-button type="primary" :icon="Refresh" plain>重置</el-button>
      <el-button type="primary" :icon="Download" class="float-right">导出</el-button>
    </el-card>
    <el-card class="flex-1">
      <el-button type="primary" :icon="Plus" style="margin-bottom: var(--el-card-padding)"
        >添加</el-button
      >
      <el-table
        :data="filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        height="calc(100% - 102px)"
        style="width: 100%"
        border
        show-overflow-tooltip
        highlight-current-row
      >
        <el-table-column fixed type="selection" width="42" align="center" />
        <el-table-column prop="id" label="编号" sortable width="80" align="right" />
        <el-table-column prop="username" label="用户名" sortable width="180" />
        <el-table-column prop="nickname" label="昵称" sortable width="180" />
        <el-table-column prop="email" label="电子邮件" sortable width="180" align="right" />
        <el-table-column prop="phone" label="手机号" sortable width="140" align="right" />
        <el-table-column prop="role" label="角色" sortable width="180" align="center">
          <template #default="{ row }">
            <el-tag disable-transitions>{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册日期" sortable width="160" align="center" :formatter="dateFormatter" />
        <el-table-column
          prop="status"
          label="账号状态"
          sortable
          width="120"
          align="center"
          :filters="statusFilters"
          :filter-method="statusFilterMethod"
          filter-placement="bottom-end"
        >
          <template #default="{ row }">
            <el-tag
              disable-transitions
              :type="getStatusTagConfig(row.status).tagType"
            >{{ getStatusTagConfig(row.status).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="160" align="center">
          <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
          <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper, sizes, ->, total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[1, 10, 50, 100, 200, 500]"
        :total="total"
        @current-change="handlePageChange"
        style="margin-top: var(--el-card-padding)"
      />
    </el-card>
  </div>
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
