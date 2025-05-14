<script setup lang="ts">
import { AlbumTable, AlbumForm } from '@/components/admin/music/album'
import { useEditableTable } from '@/components/common/Table/utils.ts'

const { open, editId, handleAdd, handleEdit } = useEditableTable()

</script>

<template>
  <AlbumTable
    @add="handleAdd"
    @edit="handleEdit"
  />
  <AlbumForm
    v-model:open="open"
    :edit-id="editId"
  />
</template>

<style scoped></style>
