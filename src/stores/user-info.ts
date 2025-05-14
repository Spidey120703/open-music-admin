import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ApiResponse, User } from '@/types'
import { getCurrentUserInfo } from '@/api/account.ts'
import { useAuthorizationStore } from '@/stores/authorization.ts'

export const useUserInfoStore = defineStore('user-info', () => {

  const userInfo = ref<User>()

  const refreshUserInfo = () => {
    if (! useAuthorizationStore().hasToken()) return;

    getCurrentUserInfo()
      .then((res: ApiResponse<User>) => {
        userInfo.value = res.data.data;
      })
      .catch(() => {})
  }

  const updateUserInfo = (data: User) => {
    userInfo.value = data;
  }

  onMounted(() => {
    refreshUserInfo();
  })

  return { userInfo, refreshUserInfo, updateUserInfo }
}, {
  persist: {
    storage: localStorage,
    pick: ['userInfo'],
    afterHydrate: (ctx) => {
      if (ctx.store.userInfo === undefined) {
        ctx.store.refreshUserInfo()
      }
    }
  }
})
