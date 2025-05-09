<script setup lang="ts">
import { type Ref, ref, computed, watch, nextTick, defineAsyncComponent } from 'vue'
import { ElSelect } from 'element-plus'
import {
  Expand,
  Fold,
  Search,
  Close,
  FullScreen,
  ArrowDown,
  SwitchButton,
  Refresh,
  User,
  Lock,
  Clock,
} from '@element-plus/icons-vue'
import { emitter } from '@/utils/emitter.ts'

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits([
  'update:collapse'
]);

/* 侧边菜单折叠配置 */
/**
 * 控制侧边菜单栏的折叠状态
 *
 * @remarks
 * 该属性用于管理侧边菜单栏的展开/收起状态：
 * - 当设置为 `true` 时，菜单栏将折叠收起（通常显示为图标模式）
 * - 当设置为 `false` 时，菜单栏会完全展开显示完整菜单项
 *
 * @default false
 */
const menubarCollapsed = computed({
  get: () => props.collapse,
  set: (val) => emits('update:collapse', val)
})

/* 导航栏搜索配置 */
/**
 * 控制导航栏搜索框的显示状态
 *
 * @remarks
 * 该属性用于导航栏搜索框的显示/收起状态：
 * - 当设置为 `true` 时，单栏会完全展开显示完整搜索输入框
 * - 当设置为 `false` 时，菜搜索框将折叠收起（通常显示为单个搜索图标模式）
 *
 * @default false
 */
const navbarSearchHidden: Ref<boolean> = ref(false)

const navbarSearch: Ref<typeof ElSelect | null> = ref(null)

watch(navbarSearchHidden, (newVal) => {
  if (newVal) {
    nextTick(() => {
      navbarSearch.value?.focus()
    })
  }
})

const searchInput: Ref<string> = ref('')
const searchOptions = [
  { label: '用户管理', value: '/users' },
  { label: '资源管理', value: '/medias' },
  { label: '音乐管理', value: '/musics' },
  { label: '文章管理', value: '/posts' },
  { label: '评论管理', value: '/comments' },
  { label: '举报审核', value: '/audit/reports' },
]
watch(searchInput, (newVal) => {
  console.log(newVal)
})


/* 导航栏全屏按钮 */
/**
 * 控制网页全屏的状态
 *
 * @remarks
 * 该属性用于导航栏搜索框的显示/收起状态：
 * - 当设置为 `true` 时，管理页面则是全屏状态
 * - 当设置为 `false` 时，管理页面则是窗口状态
 *
 * @default false
 */
const isFullScreen: Ref<boolean> = ref(false)

watch(isFullScreen, (newVal) => {
  nextTick(() => {
    if (newVal) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  })
})


/* 导航栏刷新按钮 */
const isRefreshing = ref<boolean>(false);
function onRefresh() {
  if (isRefreshing.value) return;
  emitter.emit('refresh');
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 300)
}

const AppBreadcrumb = defineAsyncComponent(() => import('@/components/layout/AppBreadcrumb.vue'))
const AppUserCard = defineAsyncComponent(() => import('@/components/layout/AppUserCard.vue'))


</script>

<template>
  <div class="navbar h-50px flex items-center">
    <el-button
      text
      size="large"
      class="px-18px! h-100%!"
      @click="menubarCollapsed = !menubarCollapsed"
    >
      <el-icon size="20px">
        <Expand v-if="menubarCollapsed" />
        <Fold v-else />
      </el-icon>
    </el-button>

    <AppBreadcrumb class="flex-1" />

    <div class="right-menu flex items-center">
      <el-tooltip
        :content="navbarSearchHidden ? '关闭搜索' : '搜索'"
        placement="bottom"
        :hide-after="0"
        :auto-close="1000"
      >
        <el-button text circle size="large" @click="navbarSearchHidden = !navbarSearchHidden">
          <el-icon size="20px"><Search /></el-icon>
        </el-button>
      </el-tooltip>
      <el-select
        v-model="searchInput"
        filterable
        remote
        autocomplete="on"
        placeholder="搜索"
        :loading="false"
        fit-input-width
        ref="navbarSearch"
        class="navbar-search"
        :class="{ show: navbarSearchHidden }"
      >
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-tooltip
      :content="isFullScreen ? '退出全屏' : '全屏'"
      placement="bottom"
      :hide-after="0"
      :auto-close="1000"
    >
      <el-button
        text
        size="large"
        class="px-12px! h-100%!"
        @click="isFullScreen = !isFullScreen"
      >
        <el-icon size="20px">
          <Close v-if="isFullScreen" />
          <FullScreen v-else />
        </el-icon>
      </el-button>
    </el-tooltip>

    <el-tooltip content="刷新" placement="bottom" :hide-after="0" :auto-close="1000">
      <el-button
        text
        size="large"
        class="px-12px! h-100%!"
        @click="onRefresh"
      >
        <el-icon size="20px" :class="{ 'transform-rotate--360 transition-transform transition-duration-300': isRefreshing }"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>

    <AppUserCard />

    <el-tooltip content="退出系统" placement="bottom" :hide-after="0" :auto-close="1000">
      <el-button
        text
        size="large"
        class="px-18px! h-100%! hover:bg-red! hover:color-white!"
        @click="menubarCollapsed = !menubarCollapsed"
      >
        <el-icon size="20px">
          <SwitchButton />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style scoped>

.navbar .el-button:not(.is-circle) {
  border-radius: unset;
}

.navbar button + button {
  margin-left: unset;
}

.right-menu {
  display: flex;
}
.navbar-search {
  --bottom-line-width: 1.5px;
  width: 0;
  transition:
    width 200ms,
    margin 200ms;
}
.navbar-search:deep(.el-select__wrapper) {
  padding: 0;
  width: 0;
  height: 100%;
  overflow: hidden;
  box-shadow: unset;
  border-bottom: var(--bottom-line-width) solid var(--el-border-color);
  border-radius: 0;
}
.navbar-search.show {
  width: 210px;
  margin: 0 8px 0 8px;
}
.navbar-search.show:deep(.el-select__wrapper) {
  width: auto;
}
.navbar-search.show:deep(.el-select__wrapper.is-focused) {
  border-bottom: var(--bottom-line-width) solid var(--el-color-primary);
}
</style>
