<script setup lang="ts">

import { UserTable, UserForm } from '@/components/admin/perm/user'
import { useEditableTable } from '@/components/common/Table/utils.ts'

const { open, editId, handleAdd, handleEdit } = useEditableTable()

</script>

<template>
  <UserTable
    @add="handleAdd"
    @edit="handleEdit"
  />
  <UserForm
    v-model:open="open"
    :edit-id="editId"
  />
</template>

<style scoped>
</style>
