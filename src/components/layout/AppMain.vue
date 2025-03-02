<script setup lang="ts">

</script>

<template>
  <section class="w-100% h-100% overflow-hidden">
    <transition name="fade-transform" mode="out-in">
      <div :key="$route.fullPath" class="pa-20px">
        <router-view v-slot="{ Component }">
          <keep-alive :max="10">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter-active {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
