<script setup lang="ts">

import { onMounted, reactive, ref, unref } from 'vue'
import { Lock, User, Warning } from '@element-plus/icons-vue'
import md5 from 'crypto-js/md5'
import LoginBackground from '@/components/login/LoginBackground.vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ApiResponse, LoginForm } from '@/types'
import { useMessage } from '@/composables/message.ts'
import { signIn } from '@/api/auth.ts'
import { useAuthorizationStore } from '@/stores/authorization.ts'
import { useRoute, useRouter } from 'vue-router'
import { refreshRoutes } from '@/utils/router.ts'
import { useUserInfoStore } from '@/stores/user-info.ts'

const route = useRoute()
const router = useRouter()
const redirect = ref<string>(route.query.redirect as string ?? '/admin/')

onMounted(() => {
  if (useAuthorizationStore().hasToken()) {
    useMessage().warning('您已经登录了，无需再次登录。')
    router.push(unref(redirect))
  }
})

const formData = reactive<LoginForm>({
  username: '',
  password: ''
})

const rules = reactive<FormRules<typeof formData>>({
  username: [{ required: true, trigger: ['blur', 'change'], message: '请输入账号' }],
  password: [{ required: true, trigger: ['blur', 'change'], message: '请输入密码' }],
})


const remember = ref<boolean>(false)
const loading = ref<boolean>(false)
const disabled = ref<boolean>(false)

const formRef = ref<FormInstance>()

const onLogin = async () => {
  if (disabled.value) return
  await formRef.value?.validate?.((valid: boolean, fields: unknown) => {
    if (!valid) {
      for (const rules of Object.values(fields as Record<string, any[]>)) {
        for (const rule of rules) {
          useMessage().error(rule.message)
        }
      }
      return
    }

    loading.value = true
    signIn({
      username: formData.username,
      password: md5(formData.password).toString(),
    }).then(async (res: ApiResponse) => {
      if (res.data?.code === 200) {
        disabled.value = true
        useMessage().success('登录成功')
        useAuthorizationStore().setToken(res.data.data)
        useUserInfoStore().refreshUserInfo()
        await refreshRoutes();
        await router.push(unref(redirect))
      } else {
        useMessage().error(res.data?.msg || '登录失败')
      }
    }).catch(() => {}).finally(() => {
      loading.value = false
    })
  })
}

</script>

<template>
  <div class="fixed inset-0 flex justify-center items-center">
    <LoginBackground />
    <el-card class="rd-0px! w-360px bg-white relative z-1">
      <template #header>
        <div class="flex gap-[var(--el-card-padding)] items-center">
          <img
            src="/src/assets/logo-transparent.svg"
            class="block w-32px h-32px transition-all hover:scale-120"
            alt="OpenMusic 管理后台 LOGO"
          />
          <h1 class="text-18px font-bold ml--4px">OpenMusic Admin</h1>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        status-icon
      >
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            autocomplete="off"
            :prefix-icon="User"
            class="login-input"
            placeholder="请输入账号"
          />
          <template #error="{ error }">
            <div class="el-form-item__error">
              <el-icon class="vertical-mid mb-2px"><Warning /></el-icon>
              <span class="ml-.25em">{{ error }}</span>
            </div>
          </template>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="formData.password"
            autocomplete="off"
            :prefix-icon="Lock"
            show-password
            class="login-input"
            placeholder="请输入密码"
            @keydown.enter="onLogin"
          />
          <template #error="{ error }">
            <div class="el-form-item__error">
              <el-icon class="vertical-mid mb-2px"><Warning /></el-icon>
              <span class="ml-.25em">{{ error }}</span>
            </div>
          </template>
        </el-form-item>
        <el-form-item>
          <div class="w-100% flex justify-between items-center">
            <el-checkbox
              v-model="remember"
              label="记住密码"
              size="small"
              style="
                --el-checkbox-checked-text-color: #ff6900;
                --el-checkbox-checked-input-border-color: #ff6900;
                --el-checkbox-input-border-color-hover: #ff6900;
                --el-checkbox-checked-bg-color: #ff6900;
              "
            />
            <el-button
              text
              size="small"
              class="px-6px! mr--6px"
              style="
                --el-button-text-color: #ff6900;
                --el-button-hover-text-color: #ff6900;
              "
            >忘记密码</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            color="#ff6900"
            class="w-100%"
            style="
              --el-button-text-color: white;
              --el-button-hover-text-color: white;
            "
            :loading="loading"
            :disabled="disabled"
            @click="onLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>

.login-input {
  --el-input-focus-border: #ff6900;
  --el-input-focus-border-color: #ff6900;
}

:deep(.el-checkbox__input) {
  margin-top: 1px;
}
:deep(.el-checkbox__label) {
  margin-bottom: 1px;
}

.el-form-item:last-child {
  margin-bottom: 0;
}

</style>
