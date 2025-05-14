import { defineAsyncComponent } from 'vue'
import RoleTable from './table.vue'

const RoleForm = defineAsyncComponent(() => import('./form.vue'));
const GrantTree = defineAsyncComponent(() => import('./grant.vue'));

export {
  RoleTable,
  RoleForm,
  GrantTree
}
