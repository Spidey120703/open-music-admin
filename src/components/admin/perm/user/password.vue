<script setup lang="ts">

import { OFormDialog } from '@/components/common'
import { computed, ref, watch } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { resetPassword } from '@/api/auth.ts'
import { getUserById } from '@/api/user.ts'
import type { ApiResponse, LoginForm, User } from '@/types'
import md5 from 'crypto-js/md5'


const props = withDefaults(defineProps<{
  editId?: number
}>(), {
  editId: undefined,
})

const initialFormData = ref<Record<string, any>>({});

const open = defineModel('open', { default: false });

const title = '重置密码';

const items = ref<FormItemConfig[]>([
  {
    span: 24,
    label: '用户名',
    prop: 'username',
    type: 'input',
    config: {
      disabled: true
    }
  },
  {
    span: 24,
    label: '密码',
    prop: 'password',
    type: 'input',
    config: {
      type: 'password',
      placeholder: '请输入密码',
    }
  }
]);
watch(
  open,
  async (val) => {
    if (! val || props.editId === undefined) return;

    getUserById(props.editId)
      .then((res: ApiResponse<User>) => {
        initialFormData.value.username = res.data.data.username
      })
      .catch(() => {})
  }
)

const resetPasswordEncoded = (data: Record<string, any>) => {
  return resetPassword({
    username: data.username,
    password: md5(data.password).toString()
  })
}

</script>

<template>
  <OFormDialog
    v-model:open="open"
    :initial-form-data="initialFormData"
    :items="items"
    label-width="6em"
    :title="title"
    :add-data="resetPasswordEncoded"
    style="--el-dialog-width: 30%;"
  />
</template>

<style lang="scss" scoped></style>

<style lang="scss">

</style>
