<script setup lang="ts">
import { type Ref, ref, computed, watch, nextTick } from 'vue'
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

const searchInput: Ref<String> = ref('')
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
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 300)
}

const isVisible = ref<boolean>(false);

import { Icon } from '@iconify/vue'

const userMenuItems = [
  { icon: User, label: '个人中心' },
  { icon: Lock, label: '密码管理' },
  { icon: Clock, label: '操作记录' },
  { divider: true },
  { icon: Icon, props: { icon: 'mdi:logout' }, label: '退出登录' },
]
</script>

<template>
  <div class="navbar h-50px flex items-center">
    <el-button
      text
      size="large"
      class="important-px-18px important-h-100%"
      @click="menubarCollapsed = !menubarCollapsed"
    >
      <el-icon size="20px">
        <Expand v-if="menubarCollapsed" />
        <Fold v-else />
      </el-icon>
    </el-button>

    <el-breadcrumb separator="/" class="important-font-size-16px px-14px flex-1">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>

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
        class="important-px-12px important-h-100%"
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
        class="important-px-12px important-h-100%"
        @click="onRefresh"
      >
        <el-icon size="20px" :class="{ 'transform-rotate--360 transition-transform transition-duration-300': isRefreshing }"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>

    <el-popover
      placement="top-start"
      :width="206"
      :show-arrow="false"
      trigger="click"
      v-model:visible="isVisible"
      popper-class="important-pa-0 overflow-hidden"
    >
      <template #reference>
        <el-button
          text
          size="large"
          class="important-px-12px important-h-100%"
        >
          <el-avatar />
          <div class="text-align-left px-12px lh-18px w-128px">
            <div>Administrator</div>
            <div class="font-size-.9em">超级管理员</div>
          </div>
          <el-icon class="transition-transform" :class="{ 'rotate-180': isVisible }"><ArrowDown /></el-icon>
        </el-button>
      </template>
      <div class="flex flex-col items-center">
        <div class="bg-gray w-100% h-80px" />
        <el-avatar size="large" style="margin-top: calc(-1 * var(--el-avatar-size) / 2)" />
        <h3>Administrator</h3>
        <div>
          <el-tag type="primary">超级管理员</el-tag>
        </div>
        <el-divider class="important-mb-0 important-mt-10px" />
        <el-menu
          class="w-100%"
          style="--el-menu-item-height: 36px; --el-menu-border-color: transparent;"
        >
          <template v-for="(item, i) in userMenuItems">
            <el-divider v-if="item.divider" :key="`el-divider-${i}`" />
            <el-menu-item v-else :key="`el-menu-item-${i}`">
              <el-icon><Component :is="item.icon" v-bind="item.props || {}" /></el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </el-popover>

    <el-tooltip content="退出系统" placement="bottom" :hide-after="0" :auto-close="1000">
      <el-button
        text
        size="large"
        class="important-px-18px important-h-100% hover:important-bg-red hover:important-color-white"
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
