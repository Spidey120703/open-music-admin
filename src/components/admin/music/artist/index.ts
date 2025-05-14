import { defineAsyncComponent } from 'vue'
import ArtistTable from './table.vue'

const ArtistForm = defineAsyncComponent(() => import('./form.vue'));

export {
  ArtistTable,
  ArtistForm
}
