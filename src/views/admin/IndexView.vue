<script setup lang="ts">
import { ref } from 'vue';
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppMenubar from '@/components/layout/AppMenubar.vue'
import AppTabs from '@/components/layout/AppTabs.vue'
import AppMain from '@/components/layout/AppMain.vue'

const menubarCollapse = ref(false)
</script>

<template>
  <div class="w-100% h-100%">
    <el-container class="w-100% h-100%">
      <el-aside
        class="w-auto! bg-gray"
      >
        <AppMenubar :collapse="menubarCollapse" />
      </el-aside>
      <el-container>
        <el-header height="auto" class="p-0!">
          <AppNavbar v-model:collapse="menubarCollapse" />
          <AppTabs />
        </el-header>
        <el-main class="p-0!">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.navbar {
  border-bottom: solid 1px var(--el-menu-border-color);
}
</style>
