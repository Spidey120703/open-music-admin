<script setup lang="ts">

import { computed, unref } from 'vue'
import _ from 'lodash'

const modelValue = defineModel<string>('modelValue')

const modelValueProxy = computed({
  get: () => {
    const value = unref(modelValue);
    if (! value) return [];
    const tags = value.split(';')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length);
    return [ ... new Set(tags)];
  },
  set: (value: string[]) => {
    modelValue.value = value.join(';')
  }
})

</script>

<template>
  <el-input-tag
    v-model="modelValueProxy"
    v-bind="_.omit($props, 'modelValue')"
  />
</template>

<style scoped>

</style>
