import { defineAsyncComponent } from 'vue'
import MenuTable from './table.vue'

const MenuForm = defineAsyncComponent(() => import('./form.vue'));

export {
  MenuTable,
  MenuForm
}
