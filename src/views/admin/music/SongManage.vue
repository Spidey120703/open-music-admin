<script setup lang="ts">
import { SongTable, SongForm } from '@/components/admin/music/song'
import { useEditableTable } from '@/components/common/Table/utils.ts'

const { open, editId, handleAdd, handleEdit } = useEditableTable()

</script>

<template>
  <SongTable
    @add="handleAdd"
    @edit="handleEdit"
  />
  <SongForm
    v-model:open="open"
    :edit-id="editId"
  />
</template>

<style scoped></style>
