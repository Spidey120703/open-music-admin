import { defineAsyncComponent } from 'vue'
import UserTable from './table.vue'

const UserForm = defineAsyncComponent(() => import('./form.vue'));
const UserPasswordForm = defineAsyncComponent(() => import('./password.vue'));

export {
  UserTable,
  UserForm,
  UserPasswordForm
}
