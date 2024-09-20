<script setup lang="ts">
import type { Invoice } from '@db/apps/invoice/types'

const searchQuery = ref('')
const selectedStatus = ref()
const selectedRows = ref<string[]>([])

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

// 👉 headers
const headers = [
  { title: '#', key: 'id' },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Client', key: 'client' },
  { title: 'Total', key: 'total' },
  { title: 'Issued Date', key: 'date' },
  { title: 'Balance', key: 'balance' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// 👉 Fetch Invoices
const { data: invoiceData, execute: fetchInvoices } = await useApi<any>(createUrl('/apps/invoice', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const invoices = computed((): Invoice[] => invoiceData.value?.invoices)
const totalInvoices = computed(() => invoiceData.value?.totalInvoices)

// 👉 Invoice balance variant resolver
const resolveInvoiceBalanceVariant = (balance: string | number, total: number) => {
  if (balance === total)
    return { status: 'Unpaid', chip: { color: 'error' } }

  if (balance === 0)
    return { status: 'Paid', chip: { color: 'success' } }

  return { status: balance, chip: { variant: 'text' } }
}

// 👉 Invoice status variant resolver
const resolveInvoiceStatusVariantAndIcon = (status: string) => {
  if (status === 'Partial Payment')
    return { variant: 'warning', icon: 'tabler-chart-pie' }
  if (status === 'Paid')
    return { variant: 'success', icon: 'tabler-check' }
  if (status === 'Downloaded')
    return { variant: 'info', icon: 'tabler-arrow-down' }
  if (status === 'Draft')
    return { variant: 'primary', icon: 'tabler-folder' }
  if (status === 'Sent')
    return { variant: 'secondary', icon: 'tabler-mail' }
  if (status === 'Past Due')
    return { variant: 'error', icon: 'tabler-alert-circle' }

  return { variant: 'secondary', icon: 'tabler-x' }
}

// 👉 Delete Invoice
const deleteInvoice = async (id: number) => {
  await $api(`/apps/invoice/${id}`, { method: 'DELETE' })
  fetchInvoices()
}
</script>

<template>
  <VCard
    v-if="invoices"
    id="invoice-list"
    title="Billing History"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <!-- 👉 Create invoice -->

      <div class="d-flex gap-2">
        <VLabel>Show</VLabel>
        <AppSelect
          v-model="itemsPerPage"
          :items="[5, 10, 20, 25, 50]"
        />
      </div>

      <VBtn
        prepend-icon="tabler-plus"
        :to="{ name: 'apps-invoice-add' }"
      >
        Create invoice
      </VBtn>

      <VSpacer />

      <div class="d-flex align-end flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="invoice-list-search">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Invoice"
          />
        </div>
        <div class="invoice-list-status">
          <AppSelect
            v-model="selectedStatus"
            placeholder="Invoice Status"
            clearable
            clear-icon="tabler-x"
            :items="['Downloaded', 'Draft', 'Sent', 'Paid', 'Partial Payment', 'Past Due']"
            style="inline-size: 12rem;"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- SECTION DataTable -->
    <VDataTableServer
      v-model="selectedRows"
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      show-select
      :items-length="totalInvoices"
      :headers="headers"
      :items="invoices"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- id -->
      <template #item.id="{ item }">
        <div class="text-body-1">
          <RouterLink :to="{ name: 'apps-invoice-preview-id', params: { id: item.id } }">
            #{{ item.id }}
          </RouterLink>
        </div>
      </template>

      <!-- status -->
      <template #item.status="{ item }">
        <VTooltip>
          <template #activator="{ props }">
            <VAvatar
              :size="28"
              v-bind="props"
              :color="resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).variant"
              variant="tonal"
            >
              <VIcon
                size="16"
                :icon="resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).icon"
              />
            </VAvatar>
          </template>
          <p class="mb-0">
            {{ item.invoiceStatus }}
          </p>
          <p class="mb-0">
            Balance: {{ item.balance }}
          </p>
          <p class="mb-0">
            Due date: {{ item.dueDate }}
          </p>
        </VTooltip>
      </template>

      <!-- client -->
      <template #item.client="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="34"
            :color="!item.avatar.length ? resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).variant : undefined"
            :variant="!item.avatar.length ? 'tonal' : undefined"
            class="me-3"
          >
            <VImg
              v-if="item.avatar.length"
              :src="item.avatar"
            />
            <span v-else>{{ avatarText(item.client.name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column">
            <RouterLink
              class="font-weight-medium text-body-1 text-high-emphasis mb-0 text-link"
              :to="{ name: 'pages-user-profile-tab', params: { tab: 'profile' } }"
            >
              {{ item.client.name }}
            </RouterLink>
            <span class="text-body-2">{{ item.client.companyEmail }}</span>
          </div>
        </div>
      </template>

      <!-- Total -->
      <template #item.total="{ item }">
        ${{ item.total }}
      </template>

      <!-- Issued Date -->
      <template #item.date="{ item }">
        {{ item.issuedDate }}
      </template>

      <!-- Balance -->
      <template #item.balance="{ item }">
        <VChip
          v-if="typeof ((resolveInvoiceBalanceVariant(item.balance, item.total)).status) === 'string'"
          :color="resolveInvoiceBalanceVariant(item.balance, item.total).chip.color"
          size="small"
          label
        >
          {{ (resolveInvoiceBalanceVariant(item.balance, item.total)).status }}
        </VChip>
        <div
          v-else
          class="text-body-1 text-high-emphasis"
        >
          {{ Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status) > 0 ? `$${(resolveInvoiceBalanceVariant(item.balance, item.total)).status}` : `-$${Math.abs(Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status))}` }}
        </div>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn @click="deleteInvoice(item.id)">
          <VIcon
            icon="tabler-trash"
            size="20"
          />
        </IconBtn>

        <IconBtn :to="{ name: 'apps-invoice-preview-id', params: { id: item.id } }">
          <VIcon
            icon="tabler-eye"
            size="20"
          />
        </IconBtn>
        <IconBtn>
          <VIcon
            icon="tabler-dots-vertical"
            size="20"
          />
        </IconBtn>
      </template>

      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalInvoices"
        />
      </template>
    </VDataTableServer>
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-search {
    inline-size: 12rem;
  }
}
</style>
