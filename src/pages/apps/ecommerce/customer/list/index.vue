<script setup lang="ts">
import ECommerceAddCustomerDrawer from '@/views/apps/ecommerce/ECommerceAddCustomerDrawer.vue'
import type { Customer } from '@db/apps/ecommerce/types'

const searchQuery = ref('')
const isAddCustomerDrawerOpen = ref(false)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Data table Headers
const headers = [
  { title: 'Customer', key: 'customer' },
  { title: 'Customer Id', key: 'customerId' },
  { title: 'Country', key: 'country' },
  { title: 'Orders', key: 'orders' },
  { title: 'Total Spent', key: 'totalSpent' },
]

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Fetch customers Data
const { data: customerData } = await useApi<any>(createUrl('/apps/ecommerce/customers',
  {
    query: {
      q: searchQuery,
      itemsPerPage,
      page,
      sortBy,
      orderBy,
    },
  }),
)

const customers = computed((): Customer[] => customerData.value.customers)
const totalCustomers = computed(() => customerData.value.total)
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <div class="d-flex justify-space-between flex-wrap gap-y-4">
          <AppTextField
            v-model="searchQuery"
            style="max-inline-size: 280px; min-inline-size: 280px;"
            placeholder="Search Name"
          />
          <div class="d-flex flex-row gap-4 align-center flex-wrap">
            <AppSelect
              v-model="itemsPerPage"
              :items="[5, 10, 20, 50, 100]"
            />

            <VBtn
              prepend-icon="tabler-upload"
              variant="tonal"
              color="secondary"
            >
              Export
            </VBtn>
            <VBtn
              prepend-icon="tabler-plus"
              @click="isAddCustomerDrawerOpen = !isAddCustomerDrawerOpen"
            >
              Add Customer
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="customers"
        item-value="customer"
        :headers="headers"
        :items-length="totalCustomers"
        show-select
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <template #item.customer="{ item }">
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              size="34"
              :variant="!item.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.customer) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <RouterLink
                :to="{ name: 'apps-ecommerce-customer-details-id', params: { id: item.customerId } }"
                class="text-link font-weight-medium d-inline-block"
                style="line-height: 1.375rem;"
              >
                {{ item.customer }}
              </RouterLink>
              <div class="text-body-2">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <template #item.customerId="{ item }">
          <div class="text-body-1 text-high-emphasis">
            #{{ item.customerId }}
          </div>
        </template>

        <template #item.orders="{ item }">
          {{ item.order }}
        </template>

        <template #item.country="{ item }">
          <div class="d-flex gap-x-2">
            <img
              :src="item.countryFlag"
              height="22"
              width="22"
            >
            <span class="text-body-1">{{ item.country }}</span>
          </div>
        </template>

        <template #item.totalSpent="{ item }">
          <h6 class="text-h6">
            ${{ item.totalSpent }}
          </h6>
        </template>

        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalCustomers"
          />
        </template>
      </VDataTableServer>
    </VCard>

    <ECommerceAddCustomerDrawer v-model:is-drawer-open="isAddCustomerDrawerOpen" />
  </div>
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}
</style>
