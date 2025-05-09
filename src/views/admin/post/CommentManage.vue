<script setup lang="ts">
import { OTable } from '@/components/common'
import type { Columns, Operations, Row, Rows } from '@/components/common/Table/types.ts'
import { computed, markRaw, onMounted, reactive, ref } from 'vue'
import { useMessage } from '@/composables/message.ts'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import type { ElTagConfig, User } from '@/types'
import { ElTagX } from '@/tsx'


const StatusConfig: Record<any, ElTagConfig> = {
  done: {
    label: '处理完成',
    type: 'success',
    icon: 'circle-check',
  },
  undone: {
    label: '未处理',
    type: 'warning',
    icon: 'warning',
  },
} as const

function getStatus(status: string) {
  return StatusConfig[status]
}

const statusFilters = computed(() => {
  return Object.entries(StatusConfig).map(([key, config]) => ({
    text: config.label,
    value: key,
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
    label: '昵称（用户名）',
    prop: 'username',
  },
  {
    label: '评论内容',
    prop: 'comment',
  },
  {
    label: '举报的原因',
    prop: 'content',
  },
  {
    label: '处理状态',
    prop: 'status',
    sortable: true,
    align: 'center',
    filters: statusFilters,
    slot: (row: Record<string, string>) =>
      ElTagX(getStatus(row!.status).type, getStatus(row!.status).label),
  },
])

const data = ref<Rows>()
const loading = ref<boolean>(false)
const current = ref(1)
const size = ref(10)
const total = ref(0)

function getCommentsByPage(params: any): Promise<any> {
  // 模拟的评论数据
  const comments = [
    // {
    //   id: 1,
    //   username: 'Peter （peter_parker）',
    //   comment: '什么垃圾。',
    //   content: '存在侮辱性词汇',
    //   status: 'done',
    // },
    {
      id: 2,
      username: 'Peter （peter_parker）',
      comment: '这个软件太烂了，快来使用我的，加群 1323423091 获取。',
      content: '发广告不管管吗',
      status: 'undone',
    },
    {
      id: 3,
      username: 'Peter （peter_parker）',
      comment: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊。',
      content: '这人刷屏',
      status: 'undone',
    },
  ];

  // 计算分页信息
  const currentPage = 1;
  const pageSize = 10;
  const totalRecords = comments.length;
  const pages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const records = comments.slice(startIndex, endIndex);

  // 返回分页结果，并包装在 { code: 200, msg: 'ok', data: xxx } 中
  return Promise.resolve({
    data: {
      code: 200,
      msg: 'ok',
      data: {
        current: currentPage,
        size: pageSize,
        records,
        pages,
        total: totalRecords,
      },
    }
  });
}

onMounted(() => {
  getCommentsByPage({ current: current.value, size: size.value })
    .then((res: any) => {
      data.value = res.data.data.records
      total.value = res.data.data.total
      loading.value = false
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
})

const dialogVisible = ref(false);

function handleView(row: Row) {
  // 自定义查看按钮的逻辑
  console.log('查看:', row)
}

const handleComment = (row: Row) => {
  dialogVisible.value = true;
}

const handleDeleteComment = () => {
  // 删除评论的逻辑
  useMessage().success('评论已删除');
  getCommentsByPage({ current: current.value, size: size.value })
    .then((res: any) => {
      data.value = res.data.data.records;
    });
  dialogVisible.value = false;
}

const handleNoAction = () => {
  // 不做处理的逻辑
  useMessage().info('评论未处理');
  dialogVisible.value = false;
}

const handleCancel = () => {
  // 取消操作的逻辑
  useMessage().info('操作已取消');
  dialogVisible.value = false;
}

// 在 operations 中添加处理按钮
const operations: Operations = [
  {
    label: '处理',
    icon: markRaw(Search),
    type: 'primary',
    action: (row: Row) => {
      console.log(row)
      formData.comment = row.comment
      formData.content = row.content
      handleComment(row)
    },
  },
]

function handlePageChange(page: number) {
  current.value = page
  getCommentsByPage({ current: page, size: size.value })
    .then((res: any) => {
      data.value = res.data.data.records
    })
}

function handleSizeChange(_size: number) {
  size.value = _size
  getCommentsByPage({ current: current.value, size: _size })
    .then((res: any) => {
      data.value = res.data.data.records
    })
}

const formData = reactive({
  comment: '',
  content: '',
})
</script>

<template>
  <OTable
    :data="data"
    :load-data="getCommentsByPage"
    :columns="columns"
    deletable
    addition
    searchable
    :operations="operations"
    v-loading="loading"
    pagination
    :current="current"
    :size="size"
    :total="total"
    @current-change="handlePageChange"
    @size-change="handleSizeChange"
  />

  <el-dialog v-model="dialogVisible" title="处理评论">
    <el-form :model="formData" label-width="120px">
      <el-form-item label="评论内容">
        <el-input v-model="formData.comment" type="textarea" :rows="4" readonly />
      </el-form-item>
      <el-form-item label="反馈原因">
        <el-input v-model="formData.content" type="textarea" :rows="4" readonly />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleDeleteComment">删除评论</el-button>
      <el-button type="info" @click="handleNoAction">不做处理</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
