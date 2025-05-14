<script setup lang="ts">

import { OAvatarUploader, OFormDialog } from '@/components/common'
import { computed, onMounted, ref, watch } from 'vue'
import type { FormItemConfig } from '@/components/common/FormDialog/types.ts'
import { addUser, getUserById, updateUserById } from '@/api/user.ts'
import _ from 'lodash'
import type { Role, User } from '@/types'

const props = withDefaults(defineProps<{
  roles: Role[],
  editId?: number
}>(), {
  editId: undefined,
})

const initialFormData = ref<Partial<User>>({
  status: 'active'
});

const open = defineModel('open', { default: false });

const title = computed(() => {
  return props.editId !== undefined ? '编辑用户' : '添加用户'
});

const items = ref<FormItemConfig[]>([]);
watch(
  open,
  async (val) => {
    if (! val) return;
    items.value = [
      {
        span: 24,
        prop: 'avatar',
        type: 'avatar-input'
      },
      {
        span: 12,
        label: '编号',
        prop: 'id',
        type: 'input',
        config: {
          disabled: true,
          placeholder: '自动生成',
        }
      },
      {
        span: 12,
        type: 'padding'
      },
      {
        span: 12,
        label: '用户名',
        prop: 'username',
        type: 'input',
        config: {
          placeholder: '请输入用户名',
        }
      },
      {
        span: 12,
        label: '昵称',
        prop: 'nickname',
        type: 'input',
        config: {
          placeholder: '请输入昵称',
        }
      },
      ...(props.editId !== undefined ? [] : [
        {
          span: 12,
          label: '密码',
          prop: 'password',
          type: 'input',
          config: {
            type: 'password',
            placeholder: '请输入密码',
          }
        },
        {
          span: 12,
          type: 'padding'
        }
      ]),
      {
        span: 12,
        label: '电子邮箱',
        prop: 'email',
        type: 'input',
        config: {
          placeholder: '请输入电子邮箱',
        }
      },
      {
        span: 12,
        label: '手机号码',
        prop: 'phone',
        type: 'input',
        config: {
          placeholder: '请输入手机号码',
        }
      },
      {
        span: 12,
        label: '账号状态',
        prop: 'status',
        type: 'segmented',
        config: {
          options: [
            {
              label: '正常',
              value: 'active',
            },
            {
              label: '冻结',
              value: 'frozen',
            },
            {
              label: '注销',
              value: 'deactivated',
            },
            {
              label: '其他',
              value: 'other',
            },
          ],
        }
      },
      {
        span: 12,
        label: '角色',
        prop: 'role',
        type: 'role-select',
      },
    ]
  }
)

watch(
  () => props.roles,
  async () => {
    initialFormData.value.role = props.roles.find((role: Role) => role.id === 2)
  })

</script>

<template>
  <OFormDialog
    v-model:open="open"
    :items="items"
    :initial-form-data="initialFormData"
    label-width="6em"
    :title="title"
    :edit-id="editId"
    :add-data="addUser"
    :update-data-by-id="updateUserById"
    :get-data-by-id="getUserById"
    header-class="relative z-1 immersive-header"
  >
    <template #avatar-input="{ formData, columnConfig }">
      <div
        class="w-[calc(100%+32px)] h-128px flex justify-center items-center mx--16px mb-72px mt--80px bg-gray relative"
        :style="{
          backgroundImage: `url(/src/assets/imgs/background.jpg)`
        }"
        style="
          background-size: cover;
          background-position: center;
        "
      >
        <OAvatarUploader
          v-model="formData[columnConfig.prop ?? '_']"
          :size="100"
          fit="cover"
          class="absolute bottom--50px"
        />
      </div>
    </template>
    <template #role-select="{ formData, columnConfig }">
      <el-select
        v-model="formData[columnConfig.prop ?? '_']"
        v-bind="_.omit(columnConfig.config, 'options')"
        :trigger-on-focus="false"
        highlight-first-item
      >
        <template #label="{ value }">
          <el-tag disable-transitions :type="value.type">
            {{ value.label }}
          </el-tag>
        </template>
        <el-option
          v-for="role in roles"
          :key="role.name"
          :label="role.label"
          :value="role"
        >
          <el-tag disable-transitions :type="role.type">
            {{ role.label }}
          </el-tag>
        </el-option>
      </el-select>
    </template>
  </OFormDialog>
</template>

<style lang="scss" scoped></style>

<style lang="scss">

.immersive-header {
  .el-dialog__headerbtn {
    top: -16px;
    right: -16px;
  }
  .el-dialog__title, .el-dialog__headerbtn > .el-icon {
    color: white;
  }
}

</style>
