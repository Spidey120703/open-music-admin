<script setup lang="ts">
import { OAvatarUploader, OFormDialog, OInputTag } from '@/components/common'
import { computed, ref } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { addAlbum, getAlbumById, updateAlbumById } from '@/api/album.ts'
import _ from 'lodash'
import { type Album, AlbumType } from '@/types'

const props = withDefaults(
  defineProps<{
    editId?: number
  }>(),
  {
    editId: undefined,
  },
)

const open = defineModel('open', { default: false })

const title = computed(() => {
  return props.editId !== undefined ? '编辑专辑信息' : '添加专辑信息'
})

const items = ref<FormItemConfig[]>([
  {
    span: 24,
    prop: 'cover',
    type: 'cover-input',
  },
  {
    span: 12,
    label: '编号',
    prop: 'id',
    type: 'input',
    config: {
      disabled: true,
      placeholder: '自动生成',
    },
  },
  {
    span: 12,
    type: 'padding',
  },
  {
    span: 12,
    label: '专辑名称',
    prop: 'title',
    type: 'input',
    config: {
      placeholder: '请输入专辑名称',
    },
  },
  {
    span: 12,
    label: '创作人员',
    prop: 'artistNames',
    type: 'input-tag',
    config: {
      placeholder: '请输入创作人员',
      tagType: 'primary'
    },
  },
  {
    span: 12,
    label: '发行时间',
    prop: 'releaseDate',
    type: 'date-picker',
    config: {
      placeholder: '请选择发行时间',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    span: 12,
    label: '流派',
    prop: 'genre',
    type: 'input-tag',
    config: {
      placeholder: '请输入流派',
      trigger: 'Space',
    },
  },
  {
    span: 12,
    label: 'CD数目',
    prop: 'totalDiscs',
    type: 'input-number',
    config: {
      placeholder: 'CD数目',
      min: 0,
    },
  },
  {
    span: 12,
    label: '曲目数目',
    prop: 'totalTracks',
    type: 'input-number',
    config: {
      placeholder: '曲目数目',
      min: 0,
    },
  },
  {
    span: 12,
    label: '总时长',
    prop: 'duration',
    type: 'input-seconds',
    config: {
      placeholder: '{总时长}',
      min: 0,
    },
  },
  {
    span: 12,
    label: '专辑类型',
    prop: 'type',
    type: 'select',
    config: {
      placeholder: '选择专辑类型',
      options: [
        { label: '专辑', value: AlbumType.Album },
        { label: 'EP', value: AlbumType.EP },
        { label: '单曲', value: AlbumType.Single },
        { label: '合辑', value: AlbumType.Compilation },
        { label: '现场专辑', value: AlbumType.Live },
        { label: '其他', value: AlbumType.Other },
      ],
    },
  },
  {
    span: 24,
    label: '简介',
    prop: 'bio',
    type: 'textarea',
    config: {
      placeholder: '请输入简介信息',
    },
  },
])

const initialFormData = ref<Partial<Album>>({
  totalDiscs: 1,
  totalTracks: 1,
  duration: 1,
  type: AlbumType.Album,
})

</script>

<template>
  <OFormDialog
    v-model:open="open"
    :initial-form-data="initialFormData"
    :items="items"
    label-width="6em"
    :title="title"
    :edit-id="editId"
    :add-data="addAlbum"
    :update-data-by-id="updateAlbumById"
    :get-data-by-id="getAlbumById"
    header-class="relative z-1 immersive-header"
  >
    <template #cover-input="{ formData, columnConfig }">
      <div
        class="w-[calc(100%+32px)] h-168px flex justify-center items-center mx--16px mb-64px mt--80px bg-gray relative"
        :style="{
          backgroundImage: `url(${formData[columnConfig.prop ?? '_']})`,
        }"
        style="background-size: cover; background-position: center"
      >
        <div class="absolute inset-0 bg-[#00000066]" style="backdrop-filter: blur(16px)" />
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
    <template #input-seconds="{ formData, columnConfig }">
      <el-input-number v-model="formData[columnConfig.prop ?? '_']" v-bind="columnConfig.config">
        <template #suffix> 秒 </template>
      </el-input-number>
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
  .el-dialog__title,
  .el-dialog__headerbtn > .el-icon {
    color: white;
  }
}
</style>
