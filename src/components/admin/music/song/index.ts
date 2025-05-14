import { defineAsyncComponent } from 'vue'
import SongTable from './table.vue'

const SongForm = defineAsyncComponent(() => import('./form.vue'));

export {
  SongTable,
  SongForm
}
