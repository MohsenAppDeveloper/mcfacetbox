<script setup lang="ts">
// !SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import { useToast } from 'vue-toastification'
import { VCol, VDialog } from 'vuetify/lib/components/index.mjs'
import MCDataTable from '@/components/MCDataTable.vue'
import type { ISimpleDTO } from '@/types/baseModels'

const { t } = useI18n({ useScope: 'global' })
const mcdatatableUser = ref(MCDataTable)
const mcdatatableUserRole = ref(MCDataTable)
const dialogUser = ref(VDialog)
const dialogUserRole = ref(VDialog)
const isAddNewUserDialogVisible = ref(false)
const isAddNewRoleDialogVisible = ref(false)
const userApiUrl = 'app/gate/3/user'
const userRoleApiUrl = '/apps/roles'

const toast = useToast()

// GateHeaders
const userHeaders = [
  { text: '0', value: 'num', sortable: false },
  { title: t('nameandfamily'), key: 'fullName' },
  { title: t('mobilenumber'), key: 'phoneNumber' },
  { title: t('roles'), key: 'role' },
  { title: t('email'), key: 'email' },
  { title: t('createdate'), key: 'creationTime' },
  { title: t('description'), key: 'description' },
  { title: t('status'), key: 'isActive', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },
]

const roleHeaders = [
  { text: '0', value: 'num', sortable: false },
  { title: t('role.title'), key: 'title' },
  { title: t('permissions'), key: 'permissions' },
  { title: t('role.trees'), key: 'projects' },
  { title: t('createdate'), key: 'createDate' },
  { title: t('status'), key: 'isActive', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },
]

const userEdit = (dataItem: Record<string, any>) => {
  isAddNewUserDialogVisible.value = true

  // gateUpdateActive.value = true
  dialogUser.value.updateUser({ ...dataItem })

  // gateEditDataItem.value = { ...dataItem } ass GateModel
  // console.log('gateedititem', gateEditDataItem.value);
}

const roleEdit = (dataItem: Record<string, any>) => {
  isAddNewRoleDialogVisible.value = true

  // gateUpdateActive.value = true
  dialogUserRole.value.updateRole({ ...dataItem })

  // gateEditDataItem.value = { ...dataItem } ass GateModel
  // console.log('gateedititem', gateEditDataItem.value);
}

const userDataAdded = () => {
  mcdatatableUser.value.refreshData()
}

const roleDataAdded = () => {
  mcdatatableUserRole.value.refreshData()
}
</script>

<template>
  <section>
    <VRow no-gutters justify="space-between" align="center">
      <div class="page-title">
        {{ $t('user.pageTitle') }}
      </div>

      <VBtn prepend-icon="tabler-plus" @click="isAddNewUserDialogVisible = true">
        {{ $t('user.add') }}
      </VBtn>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard variant="outlined">
          <MCDataTable
            ref="mcdatatableUser" :headers="userHeaders" :api-url="userApiUrl"
            @edit-item="userEdit"
          >
            <!--
              <template #item.role="{ value }">
              <div class="d-flex align-center gap-x-4">

              {{ value.permissions.map((item: ISimpleDTO) => `${item.title}`).join(' ,') }}
              </div>
              </template>
            -->
            <template #item.role="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.role && value.role.map((item: ISimpleDTO) => `${item.title}`).join(' ,') }}
              </div>
            </template>
            <template #item.isActive="{ value }">
              <VChip
                :color="resolveActiveColor(value.isActive)"
                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                class="font-weight-medium"
              >
                {{ $t(resolveActiveTitle(value.isActive)) }}
              </VChip>
            </template>
            <!--
              <template #action="{ item }">
              <span>{{ item.gateTitle }} </span>
              </template>
            -->
          </MCDataTable>
        </VCard>
      </VCol>
    </VRow>

    <VRow no-gutters justify="space-between" align="center" class="mt-6">
      <div class="page-title">
        {{ $t('role.pageTitle') }}
      </div>
      <VBtn prepend-icon="tabler-plus" @click="isAddNewRoleDialogVisible = true">
        {{ $t('role.add') }}
      </VBtn>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard variant="outlined">
          <MCDataTable
            ref="mcdatatableUserRole" :headers="roleHeaders" :api-url="userRoleApiUrl"
            @edit-item="roleEdit"
          >
            <template #item.permissions="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.permissions && value.permissions.map((item: ISimpleDTO) =>
                  `${item.title}`).join(' ,') }}
              </div>
              <!-- {{ value + "asdasdasd" }} -->
            </template>
            <template #item.projects="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.projects.map((item: ISimpleDTO) => `${item.title}`).join(' ,') }}
              </div>
              <!-- {{ value + "asdasdasd" }} -->
            </template>
            <template #item.isActive="{ value }">
              <VChip
                :color="resolveActiveColor(value.isActive)"
                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                class="font-weight-medium"
              >
                {{ $t(resolveActiveTitle(value.isActive)) }}
              </VChip>
            </template>
            <!--
              <template #action="{ item }">
              <span>{{ item.gateTitle }} </span>
              </template>
            -->
          </MCDataTable>
        </VCard>
      </VCol>
    </VRow>
    <!-- 👉 Add New User -->
    <MCDialogUserAdd
      ref="dialogUser" v-model:is-dialog-visible="isAddNewUserDialogVisible"
      :api-url="userApiUrl" @user-data-added="userDataAdded"
    />
    <MCDialogRoleAdd
      ref="dialogUserRole" v-model:is-dialog-visible="isAddNewRoleDialogVisible"
      :api-url="userRoleApiUrl" @role-data-added="roleDataAdded"
    />
  </section>
</template>
