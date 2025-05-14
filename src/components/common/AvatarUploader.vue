<script setup lang="ts">

import { type Component, ref, unref } from 'vue'
import { upload } from '@/api/file.ts'
import type { ApiResponse } from '@/types'
import { useMessage } from '@/composables/message.ts'

withDefaults(defineProps<{
  icon?: string | Component,
  size?: number | 'large' | 'default' | 'small',
  shape?: 'square' | 'circle',
  alt?: string,
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}>(), {
  size: 'default',
  shape: 'circle',
  fit: 'fill'
})

const modelValue = defineModel<string>('modelValue')

const inputRef = ref<HTMLInputElement>()

const handleUpload = () => {
  const file = unref(inputRef)!.files![0]
  if (! file) {
    return
  }

  const formData = new FormData()
  formData.set('file', file)

  upload(formData)
    .then((res: ApiResponse<string>) => {
      modelValue.value = `/api/${res.data.data}`
      useMessage().success('上传成功')
    })
    .catch(() => {})
}

</script>

<template>
  <div
    class="cursor-pointer"
  >
    <el-avatar
      :icon="icon"
      :size="size"
      :shape="shape"
      :src="modelValue"
      :alt="alt"
      :fit="fit"
      @click="inputRef?.click()"
    />
    <input ref="inputRef" type="file" accept="image/*" hidden @change="handleUpload" />
  </div>
</template>

<style scoped>

</style>
