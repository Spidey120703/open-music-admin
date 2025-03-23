<script setup lang="ts">
import { ref, onMounted, computed, type Ref, unref } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElInput } from 'element-plus'
import { Search, Refresh, Plus, Download, Edit, Delete } from '@element-plus/icons-vue'
import type { ElTagConfig, ElTagType, Pagination } from '@/types'
import { type User, type UserStatus } from '@/apis/user.ts'
import { request } from '@/utils/request.ts'
import dayjs from 'dayjs'

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
} as const;

function getUserStatus(status: string) {
  return UserStatusConfig[status as UserStatus]
}



const users = ref<User[]>([])
const searchInput = ref('')
const search = ref('')
const current = ref(1)
const size = ref(10)
const total = ref(0)
const sort = ref<string | undefined>(undefined)
const order = ref()
const filters = ref<Record<string, number[] | string[]>>({})

const loading = ref<boolean>(false)
function loadData() {
  const params = {
    keyword: search.value,
    current: current.value,
    size: size.value,
    ... filters.value,
  };
  if (sort.value !== undefined) {
    Object.assign(params, {
      sort: sort.value,
      order: order.value || 'asc',
    })
  }
  loading.value = true
  request.get('/user', {
    params
  }).then((res) => {
    const data: Pagination<User> = res.data!.data;
    users.value = data.records;
    total.value = data.total;
    size.value = data.size;
    current.value = data.current;
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadData()
})

const searchSubmit = () => {
  search.value = searchInput.value
  current.value = 1
  loadData()
}

const searchReset = () => {
  search.value = ''
  current.value = 1
  loadData()
}

const handleFilterChange = (filter: Record<string, Ref>) => {
  console.log(filter)
  filters.value = {}
  for(const col of Object.getOwnPropertyNames(filter)) {
    filters.value[col] = unref(filter[col]).join(',')
  }
  current.value = 1
  loadData()
}

const handleSortChange = (data: { prop: string; order: string }) => {
  if (data.order === null) {
    sort.value = undefined
    order.value = undefined
  } else {
    sort.value = data.prop
    order.value = data.order === 'descending' ? 'desc' : 'asc'
  }
  loadData()
}

const handlePageChange = (page: number) => {
  current.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  current.value = 1
  current.value = size
  loadData()
}

const dateFormatter = (row: User, column: unknown, cellValue: string, index: number) => {
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

const statusFilters = computed(() => {
  return Object.entries(UserStatusConfig).map(([key, config]) => ({
    text: config.label,
    value: key as UserStatus
  }))
})

</script>

<template>
  <div class="user-manage">
    <el-card class="h-72px flex-none">
      <el-input v-model="searchInput" placeholder="搜索关键字" class="max-w-16em" />
      <el-button type="primary" :icon="Search" @click="searchSubmit">搜索</el-button>
      <el-button type="primary" :icon="Refresh" plain @@click="searchReset">重置</el-button>
      <el-button type="primary" :icon="Download" class="float-right">导出</el-button>
    </el-card>
    <el-card class="flex-1">
      <el-button type="primary" :icon="Plus" style="margin-bottom: var(--el-card-padding)"
        >添加</el-button
      >
      <el-table
        v-loading="loading"
        :data="users"
        height="calc(100% - 102px)"
        class="w-100%"
        border
        show-overflow-tooltip
        highlight-current-row
        stripe
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
      >
        <el-table-column fixed type="selection" width="42px" align="center" />
        <el-table-column prop="id" label="编号" sortable="custom" width="80" align="right" />
        <el-table-column prop="username" label="用户名" sortable="custom" width="180" />
        <el-table-column prop="nickname" label="昵称" sortable="custom" width="180" />
        <el-table-column prop="email" label="电子邮件" sortable="custom" width="180" align="right" />
        <el-table-column prop="phone" label="手机号" sortable="custom" width="140" align="right" />
        <el-table-column prop="role" label="角色" sortable="custom" width="180" align="center" column-key="role" :filters="statusFilters">
          <template #default="{ row }">
            <el-tag
              disable-transitions
              :type="row.role.type"
            >{{ row.role.description }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registeredAt" label="注册日期" sortable="custom" width="160" align="center" :formatter="dateFormatter" />
        <el-table-column
          prop="status"
          label="账号状态"
          sortable="custom"
          width="120"
          align="center"
          column-key="status"
          :filters="statusFilters"
          filter-placement="bottom-end"
        >
          <template #default="{ row }">
            <el-tag
              disable-transitions
              :type="getUserStatus(row.status).type"
            >{{ getUserStatus(row.status).label }}</el-tag>
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
        v-model:current-page="current"
        v-model:page-size="size"
        :page-sizes="[1, 10, 50, 100, 200, 500]"
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
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
