<script setup lang="ts">
import { reactive } from 'vue'
import type { Artist } from '@/types'
import { OTable } from '@/components/common'
import { getArtistsByPage, deleteArtistById } from '@/api/artist.ts'
import type { Columns } from '@/components/common/Table/types.ts'

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
    width: 80,
  },
  {
    label: '艺人',
    prop: 'name',
    sortable: true,
  },
  {
    label: '艺人昵称',
    prop: 'nickname',
    sortable: true,
  },
  {
    label: '艺人简介',
    prop: 'bio',
    width: 600,
  },
  {
    label: '流派',
    prop: 'genre',
    sortable: true,
  },
])

const emit = defineEmits(['add', 'edit'])

const handleAddition = () => {
  emit('add')
}

const handleEdition = (row: Artist) => {
  emit('edit', row.id)
}

</script>

<template>
  <OTable
    :load-data="getArtistsByPage"
    :delete-data="deleteArtistById"
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

<style scoped>
</style>
