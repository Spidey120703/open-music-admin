<script setup lang="ts">

import { AuditTable, AuditForm } from '@/components/admin/audit'
import { useEditableTable } from '@/components/common/Table/utils.ts'

const { open, editId: processId, handleEdit: handleProcess } = useEditableTable()

</script>

<template>
  <AuditTable
    type="post"
    @process="handleProcess"
  />
  <AuditForm
    v-model:open="open"
    :edit-id="processId"
  />
</template>

<style scoped>

</style>
