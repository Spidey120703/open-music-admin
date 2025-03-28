<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  type Ref,
  unref,
  type Reactive, watch, watchEffect, markRaw, computed,
  type PropType
} from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElInput, type TreeNode } from 'element-plus'
import { Search, Refresh, Plus, Download, Edit, Delete } from '@element-plus/icons-vue'
import type {
  ApiParams,
  Pagination,
  ApiResponse,
  ApiError
} from '@/types'
import _ from 'lodash'
import { useMessage } from '@/composables/message.ts'
import type {
  Column,
  Row,
  Operation, Rows
} from './types.ts'

interface TreeProps {
  hasChildren?: string
  children?: string
  checkStrictly?: boolean
}

const props = defineProps({
  loadData: {
    type: Function,
    required: true,
  },
  deleteData: {
    type: Function,
    default: undefined
  },
  exportData: {
    type: Function,
    default: undefined
  },
  importData: {
    type: Function,
    default: undefined
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  exportable: {
    type: Boolean,
    default: false,
  },
  importable: {
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
    type: Array<Column>,
    required: true,
  },
  operations: {
    type: Array<Operation>,
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
  defaultColumnWidth: {
    type: [Number, String],
    default: ''
  },
  tree: {
    type: Boolean,
    default: false,
  },
  lazy: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((item: any) => string) | undefined>,
    default: 'id'
  },
  treeProps: {
    type: Object as PropType<TreeProps>,
    default: () => ({
      hasChildren: 'hasChildren',
      children: 'children',
      checkStrictly: false
    })
  },
  data: {
    type: Array<Row>,
    default: () => []
  }
})

const isPaging = computed(() => ! props.tree && props.pagination)

const emit = defineEmits(['edit', 'delete', 'import', 'export'])

const $operations = ref<Operation[]>(
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
      popConfirm: {
        placement: 'bottom-end',
        title: '确定删除吗？',
        confirmText: '删除',
        cancelText: '取消',
        confirmType: 'danger',
        cancelType: 'text',
        icon: markRaw(Delete),
        iconColor: 'red',
        confirm: (row: Row) => {
          emit('delete', row)
          if (props.deleteData === undefined) return
          props.deleteData(row.id).then(() => {
            useMessage().success('删除成功')
            load(params)
          }).catch((err: ApiError<Row>) => {
            useMessage().error(err.response?.data?.message || '删除失败')
          })
        }
      }
    },
  )) as Operation[])


type Params = ApiParams & {
  readonly $reset: (prop: string) => void,
  readonly $addResetAction: (prop: string, action: () => void) => void,
}

const useParameters = () => {

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

const { params } = useParameters()


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
  const records = ref<Rows>([])
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


watch(
  () => props.data,
  (data: Rows) => {
    records.value = _.cloneDeep(data)
  },
  { immediate: true }
)


const useLoader = () => {
  const loading = ref<boolean>(false)
  let load: any;
  if (props.tree) {
    load = (row: Row, treeNode: TreeNode, resolve: (data: Rows) => void) => {
      loading.value = true
      props.loadData(row.id)
        .then((res: ApiResponse<Rows>) => {
          resolve(res.data.data)
          loading.value = false
        })
        .catch((err: ApiError<Row>) => {
          useMessage().error(err.response?.data?.message || '请求失败')
          loading.value = false
        })
    }
  } else {
    load = (_params?: Reactive<Params> | Params) => {
        loading.value = true
        props.loadData(_params)
          .then((res: ApiResponse<Pagination<Row> | Rows>) => {
            if (isPaging.value) {
              const data: Pagination<Row> = res.data!.data as Pagination<Row>
              records.value = data.records
              total.value = data.total
              size.value = data.size
              current.value = data.current
            } else {
              const data: Rows = res.data!.data as Rows
              records.value = _.clone(data)
            }
            loading.value = false
          })
          .catch((err: ApiError<Row>) => {
            useMessage().error(err.response?.data?.message || '请求失败')
            loading.value = false
          })
      }
  }
  return { load, loading }
}

const { load, loading } = useLoader()

watch(params, load, { deep: true })

onMounted(() => {
  if (! props.tree) {
    load()
  }
})

const handleExpandChange = (row: Row, expand: boolean) => {
  console.log(row)
}

const handleImportData = () => {
  emit('import')
  if (props.importData === undefined) return;
  props.importData(params)
    .then((res: ApiResponse<any>) => {
      if (res.data?.code === 200) {
        useMessage().success('导入成功')
        load()
      } else {
        useMessage().error(res.data?.message || '导入失败')
      }
    })
    .catch((err: ApiError<any>) => {
      useMessage().error(err.response?.data?.message || '导入失败')
    })
}

const handleExportData = () => {
  emit('export')
  if (props.exportData === undefined) return;
  props.exportData(params)
    .then((res: ApiResponse<any>) => {
      if (res.data?.code === 200) {
        useMessage().success('导出成功')
        load()
      } else {
        useMessage().error(res.data?.message || '导出失败')
      }
    })
    .catch((err: ApiError<any>) => {
      useMessage().error(err.response?.data?.message || '导出失败')
    })
}

const tableRef = ref<typeof ElTable>();

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
      <el-button-group
        v-if="! (importable || exportable)"
        class="float-right"
      >
        <el-button
          v-if="importable"
          type="primary"
          :icon="Download"
          @click="handleImportData"
        >导入</el-button
        >
        <el-button
          v-if="exportable"
          type="primary"
          :icon="Download"
          @click="handleExportData"
        >导出</el-button
        >
      </el-button-group>
    </el-card>
    <el-card class="flex-1">
      <div style="margin-bottom: var(--el-card-padding)">
        <el-button
          v-if="addition"
          type="primary"
          :icon="Plus"
        >添加</el-button
        >
        <el-button
          v-if="selection && tableRef?.getSelectionRows().length"
          type="danger"
          :icon="Delete"
          class="float-right"
        >批量删除</el-button
        >
      </div>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="records"
        :height="`calc(100% - ${2 + (Number(addition) + Number(isPaging)) * 50}px)`"
        class="w-100%"
        border
        show-overflow-tooltip
        highlight-current-row
        stripe
        :row-key="rowKey"
        :lazy="lazy"
        :load="load"
        :tree-props="treeProps"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @expand-change="handleExpandChange"
      >
        <el-table-column v-if="selection" fixed type="selection" width="42px" align="center" />
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :column-key="col.columnKey || col.prop"
          :label="col.label"
          :prop="col.prop"
          :type="col.type || 'default'"
          :width="col.width || props.defaultColumnWidth"
          :align="col.align || 'left'"
          :sortable="col.sortable ? 'custom' : false"
          :filters="unref(col.filters) || undefined"
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
            <template
              v-for="(op, i) in $operations"
              :key="`op-${i}`"
            >
              <el-popconfirm
                v-if="op.popConfirm"
                :placement="op.popConfirm.placement || null"
                :title="op.popConfirm.title || '确认要操作吗？'"
                :confirm-button-text="op.popConfirm.confirmText || '确定'"
                :cancel-button-text="op.popConfirm.cancelText || '取消'"
                :confirm-button-type="op.popConfirm.confirmType || 'primary'"
                :cancel-button-type="op.popConfirm.cancelType || 'text'"
                :icon="op.popConfirm.icon || undefined"
                :icon-color="op.popConfirm.iconColor || undefined"
                :hide-icon="op.popConfirm.hideIcon"
                :hide-after="op.popConfirm.hideAfter || 200"
                :teleported="op.popConfirm.teleported || true"
                :persistent="op.popConfirm.persistent"
                :width="op.popConfirm.width || 150"
                @confirm="op.popConfirm.confirm?.(row)"
                @cancelel="op.popConfirm.cancel?.(row)"
              >
                <template #reference>
                  <el-button
                    link
                    :type="op.type || 'text'"
                    size="small"
                    :icon="op.icon || undefined"
                    @click="op.action??(row)"
                  >{{ op.label }}</el-button
                  >
                </template>
              </el-popconfirm>
              <el-button
                v-else
                link
                :type="op.type || 'text'"
                size="small"
                :icon="op.icon || undefined"
                @click="op.action??(row)"
              >{{ op.label }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="isPaging"
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
