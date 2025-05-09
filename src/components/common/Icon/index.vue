<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { IconEntity } from './types.ts'
import _ from 'lodash'
import { ElementIcons } from '@/components/common/Icon/list.ts'

const props = defineProps<{
  icon: IconEntity
}>()

const EpIconNameHandler = (name: any): keyof typeof ElementPlusIconsVue => {
  return (name as string).replace(
    /(^[a-z])|-([a-z])/g,
    (match, p1, p2) => (p1 || p2).toUpperCase()
  ) as keyof typeof ElementPlusIconsVue
}

const isIconify = computed(
  () => _.isString(props.icon)
    && !! (props.icon as string).match(/^[-0-9A-Z_a-z]+:[-0-9A-Z_a-z]+$/))

</script>

<template>
  <template v-if="isIconify">
    <icon :icon="icon as string" />
  </template>
  <template v-else-if="ElementIcons.includes(icon as string)">
    <component
      :is="
        Object.keys(ElementPlusIconsVue).includes(props.icon as string) ?
        ElementPlusIconsVue[EpIconNameHandler(props.icon)] : props.icon" />
  </template>
  <template v-else />
</template>

<style scoped>

</style>
