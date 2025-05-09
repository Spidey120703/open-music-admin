<script setup lang="ts">

import type { ApiError, ApiResponse, Menu } from '@/types'
import { computed, onMounted, ref, unref, watch } from 'vue'
import { getMenusByRootId } from '@/api/menu.ts'
import type { TreeInstance } from 'element-plus'
import { getAuthoritiesByRoleId, setAuthoritiesByRoleId } from '@/api/role.ts'
import _ from 'lodash'
import { useMessage } from '@/composables/message.ts'

const props = withDefaults(defineProps<{
  roleId?: number
}>(), {
  roleId: undefined
})

const open = defineModel('open', { default: false });

const data = ref<Menu[]>([])

const treeRef = ref<TreeInstance>()

const loaded = ref(0)
const loading = computed({
  get() {
    return unref(loaded) < 2
  },
  set(val) {
    if (val) {
      loaded.value = 0;
    } else {
      loaded.value ++;
    }
  }
})

watch(
  open,
  (val) => {
    if (val && props.roleId !== undefined) {
      loading.value = true
      getMenusByRootId()
        .then((res: ApiResponse<Menu[]>) => {
          data.value = res.data.data
        })
        .catch()
        .finally(() => loading.value = false)
      getAuthoritiesByRoleId(props.roleId)
        .then((res: ApiResponse<number[]>) => {
          unref(treeRef)?.setCheckedKeys(res.data.data)
        })
        .catch()
        .finally(() => loading.value = false)
    }
  }
)



const handleCancel = () => {
  open.value = false;
}

/**
 * 请求锁
 */
const requestLock = ref<boolean>(false)
const handleSubmit = () => {
  if (unref(requestLock) || !props.roleId) return
  const checkedKeys = unref(treeRef)?.getCheckedKeys();
  if (checkedKeys && _.isArray(checkedKeys)) {
    requestLock.value = true
    setAuthoritiesByRoleId(props.roleId, checkedKeys.map(item => Number(item)))
      .then((res: ApiResponse) => {
        useMessage().success(res.data.msg || '设置成功')
        open.value = false;
      })
      .catch()
      .finally(() => {
        requestLock.value = false
      })
  }
}

</script>

<template>
  <el-dialog v-model="open" title="授权树" draggable width="600px">
    <el-tree
      ref="treeRef"
      v-loading="loading"
      style="max-width: 600px"
      :data="data"
      show-checkbox
      check-strictly
      node-key="id"
      :props="{
        children: 'children',
        label: 'title',
      }"
      class="b b-[var(--el-border-color)] b-solid rd-4px overflow-hidden"
    />
    <template #footer>
      <el-popconfirm
        class="box-item"
        title="确定不保存吗？"
        placement="bottom-end"
        :hide-after="0"
        @confirm="handleCancel"
      >
        <template #reference>
          <el-button>取消</el-button>
        </template>
      </el-popconfirm>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
