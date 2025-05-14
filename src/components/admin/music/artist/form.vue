<script setup lang="ts">

import { OAvatarUploader, OFormDialog, OInputTag } from '@/components/common'
import { computed, ref } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { addArtist, getArtistById, updateArtistById } from '@/api/artist.ts'
import _ from 'lodash'

const props = withDefaults(defineProps<{
  editId?: number
}>(), {
  editId: undefined,
})

const open = defineModel('open', { default: false });

const title = computed(() => {
  return props.editId !== undefined ? '编辑歌手信息' : '添加歌手信息'
});

const items = ref<FormItemConfig[]>([
  {
    span: 24,
    prop: 'cover',
    type: 'cover-input'
  },
  {
    span: 12,
    label: '编号',
    prop: 'id',
    type: 'input',
    config: {
      disabled: true,
      placeholder: '自动生成',
    }
  },
  {
    span: 12,
    type: 'padding'
  },
  {
    span: 12,
    label: '艺人',
    prop: 'name',
    type: 'input',
    config: {
      placeholder: '请输入艺人名称',
    }
  },
  {
    span: 12,
    label: '昵称',
    prop: 'nickname',
    type: 'input-tag',
    config: {
      placeholder: '请输入艺人昵称',
      tagType: 'primary'
    }
  },
  {
    span: 12,
    label: '流派',
    prop: 'genre',
    type: 'input-tag',
    config: {
      placeholder: '请输入流派',
      trigger: 'Space'
    }
  },
  {
    span: 24,
    label: '简介',
    prop: 'bio',
    type: 'textarea',
    config: {
      placeholder: '请输入艺人简介信息',
    }
  },
]);

</script>

<template>
  <OFormDialog
    v-model:open="open"
    :items="items"
    label-width="6em"
    :title="title"
    :edit-id="editId"
    :add-data="addArtist"
    :update-data-by-id="updateArtistById"
    :get-data-by-id="getArtistById"
    header-class="relative z-1 immersive-header"
  >
    <template #cover-input="{ formData, columnConfig }">
      <div
        class="w-[calc(100%+32px)] h-168px flex justify-center items-center mx--16px mb-64px mt--80px bg-gray relative"
        :style="{
          backgroundImage: `url(${formData[columnConfig.prop ?? '_']})`
        }"
        style="
          background-size: cover;
          background-position: center;
        "
      >
        <div class="absolute inset-0 bg-[#00000066]" style="backdrop-filter: blur(16px);" />
        <OAvatarUploader
          v-model="formData[columnConfig.prop ?? '_']"
          :size="128"
          fit="cover"
          shape="square"
          class="absolute bottom--40px"
        />
      </div>
    </template>
    <template #input-tag="{ formData, columnConfig }">
      <OInputTag
        v-model="formData[columnConfig.prop ?? '_']"
        v-bind="columnConfig.config"
        draggable
      />
    </template>
  </OFormDialog>
</template>

<style lang="scss" scoped></style>

<style lang="scss">

.immersive-header {
  .el-dialog__headerbtn {
    top: -16px;
    right: -16px;
  }
  .el-dialog__title, .el-dialog__headerbtn > .el-icon {
    color: white;
  }
}

</style>
