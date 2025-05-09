<script setup lang="ts">
import { MenuTable, MenuForm } from '@/components/admin/sys/menu'
import { ref } from 'vue'
import { type Menu, MenuType } from '@/types'

const open = ref<boolean>(false)
const initialFormData = ref<Partial<Menu>>({
  parentId: 0,
  hidden: false,
  type: MenuType.MENU,
})
const formData = ref<Partial<Menu>>({
  parentId: 0,
  hidden: false,
  type: MenuType.MENU,
})

const editId = ref<number | undefined>(undefined)

const handleAdd = (id: number = 0) => {
  open.value = true
  editId.value = undefined
  initialFormData.value.parentId = id
}

const handleEdit = (id: number) => {
  open.value = true
  editId.value = id
}
</script>

<template>
  <MenuTable
    @add="handleAdd"
    @edit="handleEdit"
  />
  <MenuForm
    v-model:open="open"
    v-model:form-data="formData"
    :edit-id="editId"
    :initial-form-data="initialFormData"
  />
</template>

<style scoped></style>
