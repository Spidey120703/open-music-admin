<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
})

const activeIndex = ref<string>('1')
function handleSelect(key: string) {
  console.log(key)
}
</script>

<template>
  <el-menu
    :collapse="collapse"
    :default-active="activeIndex"
    @select="handleSelect"
    style="
      --el-menu-base-level-padding: 16px;
      --el-menu-item-height: 50px;
      --el-menu-bg-color: #304156;
      --el-menu-hover-bg-color: #263445;
      --el-menu-text-color: #bfcbd9;
      --el-menu-active-color: #409eff;
      --el-menu-icon-width: 18px;
    "
    class="important-border-width-0 h-100vh overflow-y-auto"
  >
    <el-scrollbar height="100vh">
      <el-menu-item
        :index="null"
        class="important-sticky top-0 z-9999 logo-menu-item"
      >
        logo
      </el-menu-item>
      <el-divider style="--el-border-color: #1f2d3d" class="important-sticky z-9999" />
      <el-menu-item :index="`${t}`" v-for="(t, i) in 12" :key="t">
        <el-icon size="18px">
          <Icon icon="mdi:user" />
        </el-icon>
        <template #title>
          <span
            :style="{ 'animation-delay': `${i * 20}ms` }"
          >用户中心</span
          >
        </template>
      </el-menu-item>
    </el-scrollbar>
  </el-menu>
</template>

<style scoped>
:deep(.el-scrollbar__thumb) {
  position: relative;
  z-index: 1000000;
}

.el-menu-item.logo-menu-item {
  background: var(--el-menu-bg-color);
}
.el-menu-item.logo-menu-item:hover {
  background: var(--el-menu-hover-bg-color);
}
.el-menu-item.logo-menu-item+.el-divider {
  top: var(--el-menu-item-height);
}

.el-menu:not(.el-menu--collapse) {
  width: 210px;
}

.el-menu-item > span {
  animation: fadeIn 120ms forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-8px);
  }
  to {
    opacity: 1;
    transform: translate(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translate(0);
  }
  to {
    opacity: 0;
    transform: translate(-8px);
  }
}

@media (min-width: 768px) {
  .el-menu:not(.el-menu--collapse) {
    width: 210px;
  }
}

@media (max-width: 768px) {
  .el-menu:not(.el-menu--collapse) {
    width: 100vw;
  }
}
</style>
