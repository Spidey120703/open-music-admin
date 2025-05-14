<script setup lang="ts">
import { ArtistTable, ArtistForm } from '@/components/admin/music/artist'
import { useEditableTable } from '@/components/common/Table/utils.ts'

const { open, editId, handleAdd, handleEdit } = useEditableTable()

</script>

<template>
  <ArtistTable
    @add="handleAdd"
    @edit="handleEdit"
  />
  <ArtistForm
    v-model:open="open"
    :edit-id="editId"
  />
</template>

<style scoped></style>
