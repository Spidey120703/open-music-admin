<script setup lang="ts">
import { ref } from 'vue';
import AppNavbar from "@/components/AppNavbar.vue";
import AppMenubar from '@/components/AppMenubar.vue'
import AppTabs from '@/components/AppTabs.vue'

const menubarCollapse = ref(false)
</script>

<template>
  <div class="w-100% h-100%">
    <el-container class="w-100% h-100%">
      <el-aside
        style="width: auto;"
        class="bg-gray"
      >
        <AppMenubar :collapse="menubarCollapse" />
      </el-aside>
      <el-container>
        <el-header height="auto" class="important-p-0">
          <AppNavbar v-model:collapse="menubarCollapse" />
          <AppTabs />
        </el-header>
        <el-main>
          <router-view />
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
