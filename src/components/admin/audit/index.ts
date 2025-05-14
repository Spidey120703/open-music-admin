import { defineAsyncComponent } from 'vue'
import AuditTable from './table.vue'

const AuditForm = defineAsyncComponent(() => import('./form.vue'));

export {
  AuditTable,
  AuditForm
}
