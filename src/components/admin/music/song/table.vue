<script setup lang="ts">
import { reactive } from 'vue'
import { type Album, AlbumType, type Song } from '@/types'
import { OTable } from '@/components/common'
import { getSongsByPage, deleteSongById } from '@/api/song.ts'
import type { Columns } from '@/components/common/Table/types.ts'

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
    width: 80,
  },
  {
    label: '序号',
    prop: '_',
    sortable: true,
    width: 80,
    formatter: (row: Song) =>
      row.discNumber === 0 ? `${row.trackNumber}` : `${row.discNumber}-${row.trackNumber}`
  },
  {
    label: '曲目标题',
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
    label: '专辑',
    prop: 'albumName',
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
    label: '时长',
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
    label: '曲目简介',
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
    :load-data="getSongsByPage"
    :delete-data="deleteSongById"
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
