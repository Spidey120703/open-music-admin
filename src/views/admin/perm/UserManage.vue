<script setup lang="ts">

import { UserTable, UserForm, UserPasswordForm } from '@/components/admin/perm/user'
import { useEditableTable } from '@/components/common/Table/utils.ts'
import { onMounted, ref } from 'vue'
import { getRolesByPage } from '@/api/role.ts'

const { open, editId, handleAdd, handleEdit, setEditId } = useEditableTable()

const passwordOpen = ref<boolean>(false)

const handlePassword = (id: number) => {
  passwordOpen.value = true
  setEditId(id)
}


const roles = ref([])
onMounted(async () => {
  const { data } = await getRolesByPage({ size: -1 })
  roles.value = data.data.records;
})

</script>

<template>
  <UserTable
    :roles="roles"
    @add="handleAdd"
    @edit="handleEdit"
    @reset-password="handlePassword"
  />
  <UserForm
    :roles="roles"
    v-model:open="open"
    :edit-id="editId"
  />
  <UserPasswordForm
    v-model:open="passwordOpen"
    :edit-id="editId"
  />
</template>

<style scoped>
</style>
