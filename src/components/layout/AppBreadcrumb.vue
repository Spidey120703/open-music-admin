<script setup lang="ts">

</script>

<template>
  <el-breadcrumb separator="/" class="important-font-size-16px px-14px flex-1">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/public">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
