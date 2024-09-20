<script setup lang="ts">
import type { Invoice, PaymentDetails } from '@db/apps/invoice/types'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

// Components
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'

const route = useRoute('apps-invoice-preview-id')

const isAddPaymentSidebarVisible = ref(false)
const isSendPaymentSidebarVisible = ref(false)
const invoice = ref<Invoice>()
const paymentDetails = ref<PaymentDetails>()

const { data: invoiceData } = await useApi<any>(`/apps/invoice/${Number(route.params.id)}`)

if (invoiceData.value) {
  invoice.value = invoiceData.value.invoice
  paymentDetails.value = invoiceData.value.paymentDetails
}

// 👉 Invoice Description
// ℹ️ Your real data will contain this information
const purchasedProducts = [
  {
    name: 'Premium Branding Package',
    description: 'Branding & Promotion',
    qty: 1,
    hours: 15,
    price: 32,
  },
  {
    name: 'SMM',
    description: 'Social media templates',
    qty: 1,
    hours: 14,
    price: 28,
  },
  {
    name: 'Web Design',
    description: 'Web designing package',
    qty: 1,
    hours: 12,
    price: 24,
  },
  {
    name: 'SEO',
    description: 'Search engine optimization',
    qty: 1,
    hours: 5,
    price: 22,
  },
]

// 👉 Print Invoice
const printInvoice = () => {
  window.print()
}
</script>

<template>
  <section v-if="invoice && paymentDetails">
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard class="invoice-preview-wrapper pa-6 pa-sm-12">
          <!-- SECTION Header -->
          <div class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-var-theme-background gap-6 rounded pa-6 mb-6">
            <!-- 👉 Left Content -->
            <div>
              <div class="d-flex align-center app-logo mb-6">
                <!-- 👉 Logo -->
                <VNodeRenderer :nodes="themeConfig.app.logo" />

                <!-- 👉 Title -->
                <h6 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h6>
              </div>

              <!-- 👉 Address -->
              <h6 class="text-h6 font-weight-regular">
                Office 149, 450 South Brand Brooklyn
              </h6>
              <h6 class="text-h6 font-weight-regular">
                San Diego County, CA 91905, USA
              </h6>
              <h6 class="text-h6 font-weight-regular">
                +1 (123) 456 7891, +44 (876) 543 2198
              </h6>
            </div>

            <!-- 👉 Right Content -->
            <div>
              <!-- 👉 Invoice ID -->
              <h6 class="font-weight-medium text-lg mb-6">
                Invoice #{{ invoice.id }}
              </h6>

              <!-- 👉 Issue Date -->
              <h6 class="text-h6 font-weight-regular">
                <span>Date Issued: </span>
                <span>{{ new Date(invoice.issuedDate).toLocaleDateString('en-GB') }}</span>
              </h6>

              <!-- 👉 Due Date -->
              <h6 class="text-h6 font-weight-regular">
                <span>Due Date: </span>
                <span>{{ new Date(invoice.dueDate).toLocaleDateString('en-GB') }}</span>
              </h6>
            </div>
          </div>
          <!-- !SECTION -->

          <!-- 👉 Payment Details -->
          <VRow class="print-row mb-6">
            <VCol class="text-no-wrap">
              <h6 class="text-h6 mb-4">
                Invoice To:
              </h6>

              <p class="mb-0">
                {{ invoice.client.name }}
              </p>
              <p class="mb-0">
                {{ invoice.client.company }}
              </p>
              <p class="mb-0">
                {{ invoice.client.address }}, {{ invoice.client.country }}
              </p>
              <p class="mb-0">
                {{ invoice.client.contact }}
              </p>
              <p class="mb-0">
                {{ invoice.client.companyEmail }}
              </p>
            </VCol>

            <VCol class="text-no-wrap">
              <h6 class="text-h6 mb-4">
                Bill To:
              </h6>
              <table>
                <tbody>
                  <tr>
                    <td class="pe-4">
                      Total Due:
                    </td>
                    <td>
                      {{ paymentDetails.totalDue }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-4">
                      Bank Name:
                    </td>
                    <td>
                      {{ paymentDetails.bankName }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-4">
                      Country:
                    </td>
                    <td>
                      {{ paymentDetails.country }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-4">
                      IBAN:
                    </td>
                    <td>
                      {{ paymentDetails.iban }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-4">
                      SWIFT Code:
                    </td>
                    <td>
                      {{ paymentDetails.swiftCode }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </VCol>
          </VRow>

          <!-- 👉 invoice Table -->
          <VTable class="invoice-preview-table border text-high-emphasis overflow-hidden mb-6">
            <thead>
              <tr>
                <th scope="col">
                  ITEM
                </th>
                <th scope="col">
                  DESCRIPTION
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  HOURS
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  QTY
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  TOTAL
                </th>
              </tr>
            </thead>

            <tbody class="text-base">
              <tr
                v-for="item in purchasedProducts"
                :key="item.name"
              >
                <td class="text-no-wrap">
                  {{ item.name }}
                </td>
                <td class="text-no-wrap">
                  {{ item.description }}
                </td>
                <td class="text-center">
                  {{ item.hours }}
                </td>
                <td class="text-center">
                  {{ item.qty }}
                </td>
                <td class="text-center">
                  ${{ item.price }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- 👉 Total -->
          <div class="d-flex justify-space-between flex-column flex-sm-row print-row">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <h6 class="text-h6 me-2">
                  Salesperson:
                </h6>
                <span>Jenny Parker</span>
              </div>
              <p>Thanks for your business</p>
            </div>

            <div>
              <table class="w-100">
                <tbody>
                  <tr>
                    <td class="pe-16">
                      Subtotal:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        $1800
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-16">
                      Discount:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        $28
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-16">
                      Tax:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        21%
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>

              <VDivider class="my-2" />

              <table class="w-100">
                <tbody>
                  <tr>
                    <td class="pe-16">
                      Total:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        $1690
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <VDivider class="my-6 border-dashed" />

          <p class="mb-0">
            <span class="text-high-emphasis font-weight-medium me-1">
              Note:
            </span>
            <span>It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!</span>
          </p>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <!-- 👉 Send Invoice Trigger button -->
            <VBtn
              block
              prepend-icon="tabler-send"
              class="mb-4"
              @click="isSendPaymentSidebarVisible = true"
            >
              Send Invoice
            </VBtn>

            <VBtn
              block
              color="secondary"
              variant="tonal"
              class="mb-4"
            >
              Download
            </VBtn>

            <div class="d-flex flex-wrap gap-4">
              <VBtn
                variant="tonal"
                color="secondary"
                class="flex-grow-1"
                @click="printInvoice"
              >
                Print
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                class="mb-4 flex-grow-1"
                :to="{ name: 'apps-invoice-edit-id', params: { id: route.params.id } }"
              >
                Edit
              </VBtn>
            </div>

            <!-- 👉  Add Payment trigger button  -->
            <VBtn
              block
              prepend-icon="tabler-currency-dollar"
              color="success"
              @click="isAddPaymentSidebarVisible = true"
            >
              Add Payment
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add Payment Sidebar -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarVisible" />

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
  </section>
  <section v-else>
    <VAlert
      type="error"
      variant="tonal"
    >
      Invoice with ID  {{ route.params.id }} not found!
    </VAlert>
  </section>
</template>

<style lang="scss">
.invoice-preview-table {
  --v-table-header-color: var(--v-theme-surface);

  &.v-table .v-table__wrapper table thead tr th {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
}

@media print {
  .v-theme--dark {
    --v-theme-surface: 255, 255, 255;
    --v-theme-on-surface: 47, 43, 61;
    --v-theme-on-background: 47, 43, 61;
  }

  body {
    background: none !important;
  }

  .invoice-header-preview,
  .invoice-preview-wrapper {
    padding: 0 !important;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  .v-table__wrapper {
    overflow: hidden !important;
  }

  .vue-devtools__anchor {
    display: none;
  }
}
</style>
