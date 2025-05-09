<script setup lang="ts">
import { RoleTable, RoleForm, GrantTree } from '@/components/admin/perm/role'
import { ref } from 'vue'
import { useEditableTable } from '@/components/common/Table/utils.ts'

const { open, editId, handleAdd, handleEdit, setEditId } = useEditableTable();

const grantOpen = ref<boolean>(false)

const handleGrant = (id: number) => {
  grantOpen.value = true
  setEditId(id)
}

</script>

<template>
  <RoleTable
    @add="handleAdd"
    @edit="handleEdit"
    @grant="handleGrant"
  />
  <RoleForm
    v-model:open="open"
    :edit-id="editId"
  />
  <GrantTree
    v-model:open="grantOpen"
    :role-id="editId"
  />
</template>

<style scoped></style>
