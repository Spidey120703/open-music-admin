<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElInput } from 'element-plus';
import { Search, Refresh, Plus, Download, Edit, Delete } from '@element-plus/icons-vue'

interface User {
  id: number;
  username: string;
  nickname: string;
  birthday: string;
  email: string;
  role: string;
  phone: string;
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '超级管理员',
    birthday: '1990-01-01',
    email: 'admin@example.com',
    role: '管理员',
    phone: '13800138000'
  },
  {
    id: 2,
    username: 'user1',
    nickname: '测试用户1',
    birthday: '1995-05-15',
    email: 'user1@test.com',
    role: '普通用户',
    phone: '13912345678'
  },
  {
    id: 3,
    username: 'developer',
    nickname: '开发人员',
    birthday: '2000-12-31',
    email: 'dev@company.com',
    role: '开发者',
    phone: '18600001111'
  },
  // 可继续添加更多模拟数据...
];

// 使用模拟数据替换原有 fetch 逻辑
const users = ref<User[]>(mockUsers);
const search = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(mockUsers.length)

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.username.includes(search.value) ||
    user.nickname.includes(search.value) ||
    user.email.includes(search.value) ||
    user.phone.includes(search.value)
  );
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="user-manage">
    <el-card>
      <el-input v-model="search" placeholder="搜索关键字" style="max-width: 16em;" />
      <el-button type="primary" :icon="Search">搜索</el-button>
      <el-button type="primary" :icon="Refresh" plain>重置</el-button>
      <el-button type="primary" :icon="Download" class="float-right">导出</el-button>
    </el-card>
    <el-card>
      <el-button
        type="primary"
        :icon="Plus"
        style="margin-bottom: var(--el-card-padding);"
      >添加</el-button>
      <el-table
        :data="filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        border
        show-overflow-tooltip
      >
        <el-table-column
          fixed
          type="selection"
          align="center"
          width="42"
        />
        <el-table-column prop="id" label="编号" sortable width="80" align="right" />
        <el-table-column prop="username" label="用户名" sortable width="180" />
        <el-table-column prop="nickname" label="昵称" sortable width="180" />
        <el-table-column prop="birthday" label="生日" sortable width="120" align="center" />
        <el-table-column prop="email" label="电子邮件" sortable width="180" />
        <el-table-column prop="phone" label="手机号" sortable width="180" />
        <el-table-column prop="role" label="角色" sortable width="180" />
        <el-table-column
          fixed="right"
          label="操作"
          min-width="160"
          align="center"
        >
          <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
          <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper, sizes, ->, total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 50, 100, 200, 500]"
        :total="total"
        @current-change="handlePageChange"
        style="margin-top: var(--el-card-padding);"
      />
    </el-card>
  </div>
</template>

<style scoped>
.el-card+.el-card {
  margin-top: var(--el-card-padding);
}
.el-input+.el-button {
  margin-left: var(--el-card-padding);
}
.el-button+.el-button {
  margin-left: var(--el-card-padding);
}
.el-button:not(.el-button--small):has( .el-icon) {
  padding-left: 12px;
  padding-right: 12px;
}

</style>
