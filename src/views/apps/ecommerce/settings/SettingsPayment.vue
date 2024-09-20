<script setup lang="ts">
import { ref } from 'vue'
import paypal from '@images/cards/paypal-primary.png'

const isAddPaymentMethodsDialogVisible = ref(false)
const isPaymentProvidersDialogVisible = ref(false)
</script>

<template>
  <div>
    <!-- 👉 Payment Providers  -->
    <VCard
      class="mb-6"
      title="Payment providers"
    >
      <VCardText>
        <div class="text-body-1 mb-5">
          Providers that enable you to accept payment methods at a rate set by the third-party. An additional fee will apply to new orders once you select a plan.
        </div>
        <VBtn
          variant="tonal"
          @click="isPaymentProvidersDialogVisible = !isPaymentProvidersDialogVisible"
        >
          Choose a provider
        </VBtn>
      </VCardText>
    </VCard>

    <!-- 👉 Supported Payment Methods -->
    <VCard
      title="Supported payment methods"
      subtitle="Payment methods that are available with one of Vuexy's approved payment providers."
      class="mb-6"
    >
      <VCardText>
        <h6 class="text-h6 mb-5">
          Default
        </h6>
        <div class="my-class mb-5">
          <div class="d-flex justify-space-between align-center mb-6">
            <VAvatar
              variant="elevated"
              color="#fff"
              rounded
              size="36"
            >
              <img
                :src="paypal"
                height="25"
              >
            </VAvatar>

            <VBtn variant="text">
              Activate PayPal
            </VBtn>
          </div>
          <VDivider />
          <div class="d-flex justify-space-between flex-wrap mt-6 gap-4">
            <div>
              <div
                class="text-body-2 mb-2"
                style="min-inline-size: 220px;"
              >
                Provider
              </div>
              <h6 class="text-h6">
                PayPal
              </h6>
            </div>

            <div>
              <div
                class="text-body-2 mb-2"
                style="min-inline-size: 220px;"
              >
                Status
              </div>
              <VChip
                color="warning"
                size="small"
                label
              >
                Inactive
              </VChip>
            </div>

            <div>
              <div
                class="text-body-2 mb-2"
                style="min-inline-size: 220px;"
              >
                Transaction Fee
              </div>
              <h6 class="text-h6">
                2.99%
              </h6>
            </div>
          </div>
        </div>
        <VBtn
          variant="tonal"
          @click="isAddPaymentMethodsDialogVisible = !isAddPaymentMethodsDialogVisible"
        >
          Add Payment Methods
        </VBtn>
      </VCardText>
    </VCard>

    <!-- 👉 Manual Payment Methods -->
    <VCard
      title="Manual payment methods"
      class="mb-6"
    >
      <VCardText>
        <p>Payments that are made outside your online store. When a customer selects a manual payment method such as cash on delivery, you'll need to approve their order before it can be fulfilled.</p>

        <VBtn
          variant="tonal"
          :append-icon="$vuetify.display.smAndUp ? 'tabler-chevron-down' : ''"
        >
          Add Manual Payment Methods

          <VMenu activator="parent">
            <VList>
              <VListItem
                v-for="(item, index) in ['Create custom payment method', 'Bank Deposit', 'Money Order', 'Cash on Delivery(COD)']"
                :key="index"
                :value="index"
              >
                <VListItemTitle>{{ item }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </VCardText>
    </VCard>

    <div class="d-flex justify-end gap-x-4">
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Discard
      </VBtn>
      <VBtn color="primary">
        save changes
      </VBtn>
    </div>
  </div>

  <AddPaymentMethodDialog v-model:is-dialog-visible="isAddPaymentMethodsDialogVisible" />
  <PaymentProvidersDialog v-model:is-dialog-visible="isPaymentProvidersDialogVisible" />
</template>
