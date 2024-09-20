<script setup lang="ts">
import type { Permission } from '@db/apps/permission/types'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Assigned To', key: 'assignedTo', sortable: false },
  { title: 'Created Date', key: 'createdDate', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const search = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')

const colors: any = {
  'support': { color: 'info', text: 'Support' },
  'users': { color: 'success', text: 'Users' },
  'manager': { color: 'warning', text: 'Manager' },
  'administrator': { color: 'primary', text: 'Administrator' },
  'restricted-user': { color: 'error', text: 'Restricted User' },
}

const { data: permissionsData } = await useApi<any>(createUrl('/apps/permissions', {
  query: {
    q: search,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const permissions = computed((): Permission[] => permissionsData.value.permissions)
const totalPermissions = computed(() => permissionsData.value.totalPermissions)

const editPermission = (name: string) => {
  isPermissionDialogVisible.value = true
  permissionName.value = name
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div class="d-flex gap-2 align-center">
            <p class="text-body-1 mb-0">
              Show
            </p>
            <AppSelect
              :model-value="itemsPerPage"
              :items="[
                { value: 5, title: '5' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              style="inline-size: 5.5rem;"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            />
          </div>

          <div class="d-flex align-center gap-4 flex-wrap">
            <AppTextField
              v-model="search"
              placeholder="Search Permission"
              style="inline-size: 15.625rem;"
            />
            <VBtn
              density="default"
              prepend-icon="tabler-plus"
              @click="isAddPermissionDialogVisible = true"
            >
              Add Permission
            </VBtn>
          </div>
        </VCardText>

        <VDivider />

        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :items-length="totalPermissions"
          :items-per-page-options="[
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
          ]"
          :headers="headers"
          :items="permissions"
          item-value="name"
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <!-- Name -->
          <template #item.name="{ item }">
            <div class="text-high-emphasis text-body-1">
              {{ item.name }}
            </div>
          </template>

          <!-- Assigned To -->
          <template #item.assignedTo="{ item }">
            <div class="d-flex gap-4">
              <VChip
                v-for="text in item.assignedTo"
                :key="text"
                label
                size="small"
                :color="colors[text].color"
                class="font-weight-medium"
              >
                {{ colors[text].text }}
              </VChip>
            </div>
          </template>

          <template #bottom>
            <TablePagination
              v-model:page="page"
              :items-per-page="itemsPerPage"
              :total-items="totalPermissions"
            />
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <VBtn
              icon
              size="small"
              color="medium-emphasis"
              variant="text"
              @click="editPermission(item.name)"
            >
              <VIcon
                size="22"
                icon="tabler-edit"
              />
            </VBtn>
            <IconBtn>
              <VIcon
                icon="tabler-dots-vertical"
                size="22"
              />
            </IconBtn>
          </template>
        </VDataTableServer>
      </VCard>

      <AddEditPermissionDialog
        v-model:isDialogVisible="isPermissionDialogVisible"
        v-model:permission-name="permissionName"
      />
      <AddEditPermissionDialog v-model:isDialogVisible="isAddPermissionDialogVisible" />
    </VCol>
  </VRow>
</template>
