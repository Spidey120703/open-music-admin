<script setup lang="ts">
import { OAvatarUploader, OFormDialog, OInputTag } from '@/components/common'
import { computed, ref } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { addSong, getSongById, updateSongById } from '@/api/song.ts'
import _ from 'lodash'
import { type Album, AlbumType, type Song } from '@/types'
import { UploadConfig } from '@/api/file.ts'
import { useMessage } from '@/composables/message.ts'

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
  return props.editId !== undefined ? '编辑曲目信息' : '添加曲目信息'
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
    label: 'CD序号',
    prop: 'discNumber',
    type: 'input-number',
    config: {
      placeholder: 'CD序号',
      min: 0,
    },
  },
  {
    span: 12,
    label: '曲目序号',
    prop: 'trackNumber',
    type: 'input-number',
    config: {
      placeholder: '曲目序号',
      min: 0,
    },
  },
  {
    span: 12,
    label: '曲目标题',
    prop: 'title',
    type: 'input',
    config: {
      placeholder: '请输入曲目标题',
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
    label: '专辑',
    prop: 'albumName',
    type: 'input',
    config: {
      placeholder: '请输入所属专辑',
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
    label: '时长',
    prop: 'duration',
    type: 'input-seconds',
    config: {
      placeholder: '{时长}',
      min: 0,
    },
  },
  {
    span: 24,
    label: '简介',
    prop: 'bio',
    type: 'textarea',
    config: {
      placeholder: '请输入参与人员具体信息',
    },
  },
  {
    span: 24,
    label: '歌词上传',
    prop: 'lyrics',
    type: 'lyrics-uploader',
  },
])

const initialFormData = ref<Partial<Song>>({
  discNumber: 1,
  trackNumber: 1,
  duration: 1,
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
    :add-data="addSong"
    :update-data-by-id="updateSongById"
    :get-data-by-id="getSongById"
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
    <template #lyrics-uploader="{ formData, columnConfig }">
      <el-upload
        class="w-100%"
        drag
        :action="UploadConfig.action"
        :headers="UploadConfig.headers"
        :multiple="false"
        accept=".txt,.json,.xml,.ttml,.lrc,.yrc,.krc,.trc,.qrc"
        :limit="1"
        @success="(res: any) => formData[columnConfig.prop ?? '_'] = res.data"
        @remove="() => formData[columnConfig.prop ?? '_'] = null"
        @exceed="useMessage().warning('请删除现在上传成功的歌词文件之后，再尝试上传。')"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将歌词文件拖入此处，或者<em>点击这里选择上传的文件</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 lrc/ttml/yrc/krc/trc/qrc 歌词文件类型。目前已完美适配了 yrc 格式。
          </div>
        </template>
      </el-upload>
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
