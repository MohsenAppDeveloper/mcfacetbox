<script setup lang="ts">
import type { CheckoutData } from './types'

const prop = defineProps<{
  currentStep?: number
  checkoutData: CheckoutData
}>()

const emit = defineEmits<{
  (e: 'update:currentStep', value: number): void
  (e: 'update:checkout-data', value: CheckoutData): void
}>()

const checkoutPaymentDataLocal = ref(prop.checkoutData)

const selectedPaymentMethod = ref('card')

const cardFormData = ref({
  cardNumber: null,
  cardName: '',
  cardExpiry: '',
  cardCvv: null,
  isCardSave: true,
})

const giftCardFormData = ref({
  giftCardNumber: null,
  giftCardPin: null,
})

const selectedDeliveryAddress = computed(() => {
  return checkoutPaymentDataLocal.value.addresses.filter(address => {
    return address.value === checkoutPaymentDataLocal.value.deliveryAddress
  })
})

const updateCartData = () => {
  emit('update:checkout-data', checkoutPaymentDataLocal.value)
}

const nextStep = () => {
  updateCartData()
  emit('update:currentStep', prop.currentStep ? prop.currentStep + 1 : 1)
}

watch(() => prop.currentStep, updateCartData)
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="8"
    >
      <!-- 👉 Offers alert -->
      <VAlert
        type="success"
        class="mb-6"
        variant="tonal"
        icon="tabler-percentage"
        title="Available Offer"
        closable
      >
        <template #text>
          <p class="mb-0">
            - 0% Instant Discount on Bank of America Corp Bank Debit and Credit cards
            <br>
            - 50% Cashback Voucher of up to $60 on first ever PayPal transaction. TCA
          </p>
        </template>
      </VAlert>

      <VTabs
        v-model="selectedPaymentMethod"
        class="v-tabs-pill"
        density="comfortable"
      >
        <VTab value="card">
          Card
        </VTab>
        <VTab value="cash-on-delivery">
          Cash on Delivery
        </VTab>
        <VTab value="gift-card">
          Gift Card
        </VTab>
      </VTabs>

      <VWindow
        v-model="selectedPaymentMethod"
        style="max-inline-size: 600px;"
        :touch="false"
      >
        <VWindowItem
          value="card"
          class="ms-n3"
        >
          <VForm class="mt-3">
            <VRow class="ma-0 pa-n2">
              <VCol cols="12">
                <AppTextField
                  v-model="cardFormData.cardNumber"
                  type="number"
                  label="Card Number"
                  placeholder="1356 3215 6548 7898"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="cardFormData.cardName"
                  label="Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="6"
                md="4"
              >
                <AppTextField
                  v-model="cardFormData.cardExpiry"
                  label="Expiry"
                  placeholder="MM/YY"
                />
              </VCol>

              <VCol
                cols="6"
                md="4"
              >
                <AppTextField
                  v-model="cardFormData.cardCvv"
                  label="CVV"
                  placeholder="123"
                  type="number"
                >
                  <template #append-inner>
                    <VTooltip
                      text="Card Verification Value"
                      location="bottom"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VIcon
                          v-bind="tooltipProps"
                          size="20"
                          icon="tabler-help"
                        />
                      </template>
                    </VTooltip>
                  </template>
                </AppTextField>
              </VCol>

              <VCol
                cols="12"
                class="pt-1"
              >
                <VSwitch
                  v-model="cardFormData.isCardSave"
                  label="Save Card for future billing?"
                />

                <div class="mt-4">
                  <VBtn
                    class="me-4"
                    @click="nextStep"
                  >
                    Save Changes
                  </VBtn>
                  <VBtn
                    variant="tonal"
                    color="secondary"
                  >
                    Reset
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="cash-on-delivery">
          <p class="text-base text-high-emphasis my-6">
            Cash on Delivery is a type of payment method where the recipient make payment for the order at the time of delivery rather than in advance.
          </p>

          <VBtn @click="nextStep">
            Pay on delivery
          </VBtn>
        </VWindowItem>

        <VWindowItem value="gift-card">
          <h6 class="text-base font-weight-medium mt-6">
            Enter Gift Card Details
          </h6>
          <VForm class="ms-n3">
            <VRow class="ma-0">
              <VCol cols="12">
                <AppTextField
                  v-model="giftCardFormData.giftCardNumber"
                  label="Gift Card Number"
                  placeholder="1234 5678 9012 3456"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="giftCardFormData.giftCardPin"
                  label="Gift Card Pin"
                  placeholder="1234"
                />
              </VCol>

              <VCol cols="12">
                <VBtn @click="nextStep">
                  Redeem Gift Card
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VCard
        flat
        variant="outlined"
      >
        <VCardText>
          <h6 class="text-h6 mb-4">
            Price Details
          </h6>

          <div class="d-flex justify-space-between text-base mb-2">
            <span class="text-high-emphasis">Order Total</span>
            <span>${{ checkoutPaymentDataLocal.orderAmount }}.00</span>
          </div>

          <div class="d-flex justify-space-between text-base">
            <span class="text-high-emphasis">Delivery Charges</span>
            <div
              v-if="checkoutPaymentDataLocal.deliverySpeed === 'free'"
              class="d-flex align-center"
            >
              <div class="text-decoration-line-through text-disabled me-2">
                $5.00
              </div>
              <VChip
                size="small"
                color="success"
              >
                FREE
              </VChip>
            </div>
            <div v-else>
              <span>${{ checkoutPaymentDataLocal.deliveryCharges }}</span>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText>
          <div class="d-flex justify-space-between text-base mb-2">
            <span class="text-high-emphasis font-weight-medium">Total</span>
            <span class="font-weight-medium">${{ checkoutPaymentDataLocal.orderAmount + checkoutPaymentDataLocal.deliveryCharges }}.00</span>
          </div>

          <div class="d-flex justify-space-between text-base mb-4">
            <span class="text-high-emphasis font-weight-medium">Deliver to:</span>
            <VChip
              color="primary"
              class="text-capitalize"
              label
              size="small"
            >
              {{ checkoutPaymentDataLocal.deliveryAddress }}
            </VChip>
          </div>

          <template
            v-for="item in selectedDeliveryAddress"
            :key="item.value"
          >
            <h6 class="text-base font-weight-medium">
              {{ item.title }}
            </h6>
            <p class="text-base text-wrap mb-0">
              {{ item.desc }}
            </p>
            <p class="text-base mb-4">
              Mobile : {{ item.subtitle }}
            </p>
          </template>

          <h6 class="text-h6">
            <a href="#">Change address</a>
          </h6>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
