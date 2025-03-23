<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  type Ref,
  unref,
  type VNode,
  type Component,
  type Reactive, watch, watchEffect, markRaw
} from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElInput } from 'element-plus'
import { Search, Refresh, Plus, Download, Edit, Delete } from '@element-plus/icons-vue'
import type {
  ElTagType,
  ApiParams,
  Pagination,
  ApiResponse,
  ApiError
} from '@/types'
import _ from 'lodash'
import { useMessage } from '@/composables/message.ts'


type Row = Record<string, unknown>

interface ColumnConfig {
  label: string
  prop: string
  type?: 'default' | 'selection' | 'index' | 'expand'
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filters?: Array<{ text: string; value: string }>
  formatter?: (row: Row, column: unknown, cellValue: unknown, index: number) => VNode | string
  fixed?: 'left' | 'right' | boolean
  slot?: (row: Row) => VNode
}

interface OperationConfig {
  label: string
  type?: ElTagType
  icon?: Component | string
  action: (row: Row) => void
}


const props = defineProps({
  loadData: {
    type: Function,
    required: true,
  },
  exportData: {
    type: Function,
    default: () => Promise.resolve({}),
  },
  importData: {
    type: Function,
    default: () => Promise.resolve({}),
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  exportable: {
    type: Boolean,
    default: false,
  },
  addition: {
    type: Boolean,
    default: false,
  },
  selection: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array<ColumnConfig>,
    required: true,
  },
  operations: {
    type: Array<OperationConfig>,
    default: () => [],
  },
  modification: {
    type: Boolean,
    default: false,
  },
  deletion: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  pageSizes: {
    type: Array<number>,
    default: () => [10, 50, 100, 200, 500],
  },
})

const emit = defineEmits(['edit', 'delete'])

const $operations = ref<OperationConfig[]>(
  _.compact(_.concat(
    props.operations as unknown[],
    props.modification && {
      label: '编辑',
      icon: markRaw(Edit),
      type: 'primary',
      action: (row: Row) => {
        emit('edit', row)
      },
    },
    props.deletion && {
      label: '删除',
      icon: markRaw(Delete),
      type: 'danger',
      action: (row: Row) => {
        emit('delete', row)
      },
    },
  )) as OperationConfig[])


type Params = ApiParams & {
  readonly $reset: (prop: string) => void,
  readonly $addResetAction: (prop: string, action: () => void) => void,
}

const usePaginationParameters = () => {

  const resetActions: Record<string, () => void> = {}

  const params = reactive<Params>({
    $reset: (prop: string) => {
      resetActions[prop]()
    },
    $addResetAction: (prop: string, action: () => void) => {
      resetActions[prop] = action
    }
  })

  return { params }
}

const { params } = usePaginationParameters()


const useSearch = (params: Reactive<Params>) => {
  const searchInput = ref('')

  const searchSubmit = () => {
    params.keyword = searchInput.value
  }

  const searchReset = () => {
    params.keyword = ''
    params.$reset!('current')
  }

  return {
    searchInput,
    searchSubmit,
    searchReset,
  }
}

const { searchInput, searchSubmit, searchReset } = useSearch(params)


const useSorter = (params: Reactive<Params>) => {

  const handleSortChange = (data: { prop: string; order: string | null }) => {
    if (data.order === null) {
      params.sort = undefined
      params.order = undefined
    } else {
      params.sort = data.prop
      params.order = data.order
    }
  }

  return { handleSortChange }
}

const { handleSortChange } = useSorter(params)


const useFilters = (params: Reactive<Params>) => {
  const filters = ref<Record<string, (number | string)[]>>({})

  const handleFilterChange = (filter: Record<string, Ref>) => {
    for (const col of Object.keys(filter)) {
      filters.value[col as keyof ApiParams] = unref(filter[col])
    }
    params.filters = _.clone(unref(filters))
    params.$reset!('current')
  }

  return { handleFilterChange }
}

const { handleFilterChange } = useFilters(params)

const usePagination = (params: Reactive<Params>) => {
  const records = ref<Row[]>([])
  const current = ref(1)
  const size = ref(10)
  const total = ref(0)

  params.$addResetAction('current', () => {
    params.current = 1
  })

  const handlePageChange = (page: number) => {
    current.value = page
  }

  const handleSizeChange = (_size: number) => {
    current.value = 1
    size.value = _size
  }

  watchEffect(() => {
    params.current = current.value;
    params.size = size.value;
  })

  return { records, current, size, total, handlePageChange, handleSizeChange }
}

const { records, current, size, total, handlePageChange, handleSizeChange } = usePagination(params)

const useLoader = () => {
  const loading = ref<boolean>(false)
  const load = (_params?: Reactive<Params> | Params) => {
    loading.value = true
    props.loadData(_params)
      .then((res: ApiResponse<Pagination<Row>>) => {
        const data: Pagination<Row> = res.data!.data
        records.value = data.records
        total.value = data.total
        size.value = data.size
        current.value = data.current
        loading.value = false
      })
      .catch((err: ApiError<Row>) => {
        useMessage().error(err.response?.data?.message || '请求失败')
        loading.value = false
      })
  }
  return { load, loading }
}

const { load, loading } = useLoader()

watch(params, load, { deep: true })

onMounted(() => {
  load()
})

</script>

<template>
  <div class="common-table-container">
    <el-card v-if="searchable || exportable" class="h-72px flex-none">
      <el-input
        v-if="searchable"
        v-model="searchInput"
        placeholder="搜索关键字"
        class="max-w-16em"
        @change="searchSubmit"
      />
      <el-button v-if="searchable" type="primary" :icon="Search" @click="searchSubmit"
        >搜索</el-button
      >
      <el-button v-if="searchable" type="primary" :icon="Refresh" plain @click="searchReset"
        >重置</el-button
      >
      <el-button
        v-if="exportable"
        type="primary"
        :icon="Download"
        @click="exportData"
        class="float-right"
        >导出</el-button
      >
    </el-card>
    <el-card class="flex-1">
      <el-button
        v-if="addition"
        type="primary"
        :icon="Plus"
        style="margin-bottom: var(--el-card-padding)"
        >添加</el-button
      >
      <el-table
        v-loading="loading"
        :data="records"
        :height="`calc(100% - ${2 + (Number(addition) + Number(pagination)) * 50}px)`"
        class="w-100%"
        border
        show-overflow-tooltip
        highlight-current-row
        stripe
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
      >
        <el-table-column v-if="selection" fixed type="selection" width="42px" align="center" />
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :column-key="col.prop"
          :label="col.label"
          :prop="col.prop"
          :type="col.type || 'default'"
          :width="col.width || ''"
          :align="col.align || 'left'"
          :sortable="col.sortable ? 'custom' : false"
          :filters="col.filters || undefined"
          :formatter="col.formatter || undefined"
          :fixed="col.fixed || false"
        >
          <template #default="{ row }">
            <component v-if="col.slot" :is="col.slot(row)" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="columns?.length && $operations.length"
          fixed="right"
          label="操作"
          :min-width="80 * $operations.length"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              v-for="(op, i) in $operations"
              :key="`op-${i}`"
              link
              :type="op.type || 'text'"
              size="small"
              :icon="op.icon || undefined"
              @click="op.action(row)"
              >{{ op.label }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pagination"
        background
        layout="prev, pager, next, jumper, sizes, ->, total"
        v-model:current-page="current"
        v-model:page-size="size"
        :page-sizes="pageSizes"
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: var(--el-card-padding)"
      />
    </el-card>
  </div>
</template>

<style scoped>
.common-table-container {
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
:deep(.el-table-fixed-column--right)::before,
:deep(.el-table-fixed-column--left)::before {
  transition: box-shadow 300ms;
}
</style>
