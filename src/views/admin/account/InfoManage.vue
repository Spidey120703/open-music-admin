<script setup lang="ts">

import { onMounted, reactive, ref, unref, watch } from 'vue'
import type { ApiResponse, User, UserStatus } from '@/types'
import { getCurrentUserInfo, updateCurrentUserInfo } from '@/api/account.ts'
import { useMessage } from '@/composables/message.ts'
import {
  type AnchorInstance,
  ElMessageBox,
  ElNotification,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { useUserInfoStore } from '@/stores/user-info.ts'
import { OAvatarUploader } from '@/components/common'

const formData = ref<Partial<User>>({
  id: undefined,
  avatar: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
})

const emailValidator = (rule: any, value: string, callback: any) => {
  if (! value) {
    callback()
  } else {
    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱'))
    }
  }
}

const phoneValidator = (rule: any, value: string, callback: any) => {
  if (! value) {
    callback()
  } else {
    if (/^1[3-9]\d{9}$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的手机号'))
    }
  }
}

const rules = reactive<FormRules<typeof formData>>({
  username: [{ required: true, trigger: ['blur', 'change'], message: '请输入旧密码' }],
  email: [{ validator: emailValidator, trigger: ['blur', 'change'], message: '请输入有效的电子邮箱' }],
  phone: [{ validator: phoneValidator, trigger: ['blur', 'change'], message: '请输入有效的手机号码' }]
})

const { refreshUserInfo } = useUserInfoStore()

onMounted(() => {
  resetForm();
})

const formRef = ref<FormInstance>()

const resetForm = () => {
  getCurrentUserInfo()
    .then((res: ApiResponse<User>) => {
      formRef.value?.resetFields()
      formData.value = res.data.data
    })
    .catch(() => {})
    .finally()
}

const loading = ref<boolean>(false)

const submitForm = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const data = unref(formData)

      loading.value = true
      updateCurrentUserInfo(data)
        .then((res: ApiResponse<boolean>) => {
          if (res.data.data) {
            useMessage().success('修改成功')
            refreshUserInfo()
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

const UserStatusLabel: Record<UserStatus, string> = {
  active: '解冻',
  frozen: '冻结',
  deactivated: '注销',
  other: '其他'
}

const changeStatus = (newStatus: UserStatus) => {
  const data = unref(formData)

  ElMessageBox.confirm(
    `确定要${UserStatusLabel[newStatus]}当前用户吗？`,
    '提示',
    {
      type: newStatus == 'deactivated' ? 'error' : 'warning'
    })
    .then(() => {
      data.status = newStatus

      loading.value = true
      updateCurrentUserInfo(data)
        .then((res: ApiResponse<boolean>) => {
          if (res.data.data) {
            useMessage().success(`${UserStatusLabel[newStatus]}成功`)
            refreshUserInfo()
            resetForm()
          } else {
            useMessage().error(res.data.msg ?? `${UserStatusLabel[newStatus]}失败`)
          }
        })
        .catch(() => {
        })
        .finally(() => loading.value = false)
    })
    .catch(() => {})
}

const changeRole = () => {
  ElNotification.success({
    title: '提示',
    message: '您的申请已经成功提交，请耐心等待后台管理员评估。'
  })
}

const containerRef = ref()
const anchorRef = ref<AnchorInstance>()

watch(
  anchorRef,
  (anchor) => {
    if (! anchor) return
    anchor.scrollTo('#basic-info')
  }
)

const handleAnchorChange = () => {
  resetForm()
}

</script>

<template>
  <div class="ml-auto mr-[calc((100vw-var(--width))/2)] w-[var(--width)]" style="--width: max(480px, 40vw);">
    <el-card class="w-[var(--width)]" shadow="hover">
      <div
        class="w-[calc(100%+2*var(--el-card-padding))] h-168px flex justify-center items-center bg-gray relative ma-[calc(-1*var(--el-card-padding))] mb-64px"
        :style="{
          backgroundImage: `url(/src/assets/imgs/background.jpg)`
        }"
        style="
          background-size: cover;
          background-position: center;
        "
      >
        <OAvatarUploader
          v-model="formData.avatar"
          :size="128"
          fit="cover"
          class="absolute bottom--64px"
        />
      </div>
      <div class="w-100% flex pt-[calc(4px+var(--el-card-padding))]">
        <div ref="containerRef" class="flex-1 max-h-300px overflow-y-auto" style="scrollbar-width: none;" @wheel.prevent.stop>
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="5em"
          >
            <div id="basic-info" class="h-300px">
              <el-form-item label="编号" prop="id">
                <el-input
                  v-model="formData.id"
                  clearable
                  placeholder="自动生成"
                  disabled
                  class="cursor-text!"
                />
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="formData.username"
                  clearable
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item label="昵称" prop="nickname">
                <el-input
                  v-model="formData.nickname"
                  clearable
                  placeholder="请输入昵称"
                />
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  v-model="formData.email"
                  clearable
                  placeholder="请输入电子邮箱"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="formData.phone"
                  clearable
                  placeholder="请输入手机号码"
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
            </div>

            <div id="extend-info" class="h-300px">
              <el-form-item :label="`申请${formData.status === 'frozen' ? '解冻' : '冻结'}账号`" label-width="8em">
                <el-button
                  type="warning"
                  :loading="loading"
                  :tabindex="-1"
                  @click="changeStatus(formData.status === 'frozen' ? 'active' : 'frozen')"
                >{{formData.status === 'frozen' ? '解冻' : '冻结'}}账号</el-button>
              </el-form-item>
              <el-form-item v-show="formData.id !== 1" label="申请注销账号" label-width="8em">
                <el-button
                  type="danger"
                  :loading="loading"
                  :tabindex="-1"
                  @click="changeStatus('deactivated')"
                >注销账号</el-button>
              </el-form-item>
              <el-form-item v-show="formData.role?.name !== 'admin'" label="申请升级权限" label-width="8em">
                <el-button
                  type="primary"
                  :loading="loading"
                  :tabindex="-1"
                  @click="changeRole()"
                >申请成为{{ formData.role?.name == 'user' ? '审核人员' : '管理员' }}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="b-0 b-l-width-1px b-solid b-[var(--el-card-border-color)] ml-[var(--el-card-padding)] mr--2.25px" />
        <el-anchor
          ref="anchorRef"
          :container="containerRef"
          direction="vertical"
          type="default"
          class="w-25% bg-transparent!"
          @click.prevent
          @change="handleAnchorChange"
        >
          <el-anchor-link href="#basic-info" title="基础信息" />
          <el-anchor-link href="#extend-info" title="其他信息" />
        </el-anchor>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>
