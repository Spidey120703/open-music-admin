import { defineAsyncComponent } from 'vue'
import AlbumTable from './table.vue'

const AlbumForm = defineAsyncComponent(() => import('./form.vue'));

export {
  AlbumTable,
  AlbumForm
}
