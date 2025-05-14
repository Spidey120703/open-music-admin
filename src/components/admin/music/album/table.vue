<script setup lang="ts">
import { reactive } from 'vue'
import { type Album, AlbumType } from '@/types'
import { OTable } from '@/components/common'
import { deleteAlbumById, getAlbumsByPage } from '@/api/album.ts'
import type { Columns } from '@/components/common/Table/types.ts'

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
    width: 80,
  },
  {
    label: '专辑名称',
    prop: 'title',
    sortable: true,
    width: 240,
  },
  {
    label: '参与人员',
    prop: 'artistNames',
    sortable: true,
    width: 240,
  },
  {
    label: '流派',
    prop: 'genre',
    sortable: true,
  },
  {
    label: '发行时间',
    prop: 'releaseDate',
    sortable: true,
    width: 160,
  },
  {
    label: 'CD数',
    prop: 'totalDiscs',
    sortable: true,
  },
  {
    label: '曲目数',
    prop: 'totalTracks',
    sortable: true,
  },
  {
    label: '总时长',
    prop: 'duration',
    sortable: true,
    formatter: (row: Album) => {
      const { duration = 0 } = row
      const res = [];
      if (duration > 3600) {
        res.push(`${Math.trunc(duration / 3600)}时`)
      }
      if (duration > 60) {
        res.push(`${Math.trunc(duration / 60) % 60}分`)
      }
      res.push(`${duration % 60}秒`)
      return res.join('')
    },
  },
  {
    label: '专辑类型',
    prop: 'type',
    sortable: true,
    filters: [
      { text: '专辑', value: AlbumType.Album },
      { text: 'EP', value: AlbumType.EP },
      { text: '单曲', value: AlbumType.Single },
      { text: '合辑', value: AlbumType.Compilation },
      { text: '现场专辑', value: AlbumType.Live },
      { text: '其他', value: AlbumType.Other },
    ],
    formatter: (row: Album) => {
      return {
        [AlbumType.Album]: '专辑',
        [AlbumType.EP]: 'EP',
        [AlbumType.Single]: '单曲',
        [AlbumType.Compilation]: '合辑',
        [AlbumType.Live]: '现场专辑',
        [AlbumType.Other]: '其他',
      }[row.type ?? AlbumType.Other]
    },
  },
  {
    label: '专辑简介',
    prop: 'bio',
    width: 400,
  },
])

const emit = defineEmits(['add', 'edit'])

const handleAddition = () => {
  emit('add')
}

const handleEdition = (row: Album) => {
  emit('edit', row.id)
}
</script>

<template>
  <OTable
    :load-data="getAlbumsByPage"
    :delete-data="deleteAlbumById"
    :columns="columns"
    searchable
    selection
    addition
    editable
    deletable
    pagination
    default-column-width="120"
    @add="handleAddition"
    @edit="handleEdition"
  />
</template>

<style scoped></style>
