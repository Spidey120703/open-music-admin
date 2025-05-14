<script setup lang="ts">

import { reactive, ref, unref } from 'vue'
import type { ApiResponse, ChangePassword } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import type {
  InternalRuleItem,
  Value,
} from 'async-validator/dist-types/interface'
import _ from 'lodash'
import { useMessage } from '@/composables/message.ts'
import { changePassword } from '@/api/account.ts'
import md5 from 'crypto-js/md5'

const formData = ref<ChangePassword>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function validateConfirmPassword(
  rule: InternalRuleItem,
  value: Value,
  callback: (error?: string | Error) => void
) {
  if (value === unref(formData).newPassword) {
    callback()
  } else {
    callback(new Error(_.isString(rule.message) ? rule.message : '两次输入的密码不一致'))
  }
}

const rules = reactive<FormRules<typeof formData>>({
  oldPassword: [{ required: true, trigger: ['blur', 'change'], message: '请输入旧密码' }],
  newPassword: [{ required: true, trigger: ['blur', 'change'], message: '请输入新密码' }],
  confirmPassword: [
    { required: true, trigger: ['blur', 'change'], message: '请再次输入新密码' },
    { validator: validateConfirmPassword, trigger: ['blur', 'change'], message: '两次输入的密码不一致' }
  ],
})

const formRef = ref<FormInstance>()

const resetForm = () => {
  formRef.value?.resetFields()
}

const loading = ref<boolean>(false)

const submitForm = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const data = _.pick(unref(formData), ['oldPassword', 'newPassword'])
      data.oldPassword = md5(data.oldPassword).toString()
      data.newPassword = md5(data.newPassword).toString()

      loading.value = true
      changePassword(data)
        .then((res: ApiResponse<boolean>) => {
          if (res.data.data) {
            useMessage().success('修改成功')
            resetForm()
          } else {
            useMessage().error(res.data.msg ?? '修改失败')
          }
        })
        .catch(() => {})
        .finally(() => loading.value = false)
    }
  })
}

</script>

<template>
  <div class="ml-auto mr-[calc((100vw-var(--width))/2)] w-[var(--width)]" style="--width: max(360px, 30vw);">
    <el-card class="w-[var(--width)] mx-auto" shadow="never">
      <h3 class="c-[var(--el-text-color-primary)] text-[var(--el-font-size-large)] lh-[var(--el-font-line-height-primary)] mb-20px">修改密码</h3>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="8em"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="formData.oldPassword"
            type="password"
            show-password
            clearable
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            type="password"
            show-password
            clearable
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            show-password
            clearable
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForm()"
          >修改</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>

.el-form-item:last-child {
  margin-bottom: 0;
}

</style>
