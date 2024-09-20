<script setup lang="ts">
import type { CartItem, CheckoutData } from './types'
import emptyCartImg from '@images/pages/empty-cart.png'

interface Props {
  currentStep?: number
  checkoutData: CheckoutData
}

interface Emit {
  (e: 'update:currentStep', value: number): void
  (e: 'update:checkout-data', value: CheckoutData): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const checkoutCartDataLocal = ref(props.checkoutData)

// remove item from cart
const removeItem = (item: CartItem) => {
  checkoutCartDataLocal.value.cartItems = checkoutCartDataLocal.value.cartItems.filter(i => i.id !== item.id)
}

//  cart total
const totalCost = computed(() => {
  return checkoutCartDataLocal.value.orderAmount = checkoutCartDataLocal.value.cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)
})

const updateCartData = () => {
  emit('update:checkout-data', checkoutCartDataLocal.value)
}

const nextStep = () => {
  updateCartData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

watch(() => props.currentStep, updateCartData)
</script>

<template>
  <VRow v-if="checkoutCartDataLocal">
    <VCol
      cols="12"
      lg="8"
    >
      <!-- 👉 Offers alert -->
      <VAlert
        type="success"
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

      <h5 class="text-h5 my-4">
        My Shopping Bag ({{ checkoutCartDataLocal.cartItems.length }} Items)
      </h5>

      <!-- 👉 Cart items -->
      <div
        v-if="checkoutCartDataLocal.cartItems.length"
        class="border rounded"
      >
        <template
          v-for="(item, index) in checkoutCartDataLocal.cartItems"
          :key="item.name"
        >
          <div
            class="d-flex align-center gap-4 pa-6 position-relative flex-column flex-sm-row"
            :class="index ? 'border-t' : ''"
          >
            <IconBtn
              class="checkout-item-remove-btn"
              @click="removeItem(item)"
            >
              <VIcon
                size="18"
                icon="tabler-x"
                class="text-disabled"
              />
            </IconBtn>

            <div>
              <VImg
                width="140"
                :src="item.image"
              />
            </div>

            <div class="d-flex w-100 flex-column flex-md-row">
              <div class="d-flex flex-column gap-y-2">
                <h6 class="text-h6">
                  {{ item.name }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-4 text-body-1">
                  <div class="text-disabled">
                    Sold by:
                    <span class="d-inline-block text-primary">  {{ item.seller }}</span>
                  </div>
                  <VChip
                    :color="item.inStock ? 'success' : 'error'"
                    label
                    size="small"
                  >
                    {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
                  </VChip>
                </div>

                <VRating
                  density="compact"
                  :model-value="item.rating"
                  size="24"
                  readonly
                />

                <AppTextField
                  v-model="item.quantity"
                  type="number"
                  style="inline-size: 9.375rem;"
                  density="compact"
                />
              </div>

              <VSpacer />

              <div
                class="d-flex flex-column mt-5 text-start text-md-end"
                :class="$vuetify.display.mdAndDown ? 'gap-2' : 'gap-4'"
              >
                <div class="d-flex text-base align-self-md-end">
                  <div class="text-primary">
                    ${{ item.price }}
                  </div>
                  <div>/</div>
                  <div class="text-decoration-line-through">
                    ${{ item.discountPrice }}
                  </div>
                </div>

                <div>
                  <VBtn
                    variant="tonal"
                    size="small"
                  >
                    move to wishlist
                  </VBtn>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 👉 Empty Cart -->
      <div v-else>
        <VImg :src="emptyCartImg" />
      </div>

      <!-- 👉 Add more from wishlist -->
      <div
        class="d-flex align-center justify-space-between rounded py-2 px-5 text-base mt-4"
        style="border: 1px solid rgb(var(--v-theme-primary));"
      >
        <a
          href="#"
          class="font-weight-medium"
        >Add more products from wishlist</a>
        <VIcon
          icon="tabler-arrow-right"
          size="16"
          class="flip-in-rtl text-primary"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <VCard
        flat
        variant="outlined"
      >
        <!-- 👉 payment offer -->
        <VCardText>
          <h6 class="text-h6 mb-4">
            Offer
          </h6>

          <div class="d-flex align-center gap-4 flex-wrap">
            <AppTextField
              v-model="checkoutCartDataLocal.promoCode"
              placeholder="Enter Promo Code"
              style="min-inline-size: 200px;"
            />

            <VBtn
              variant="tonal"
              @click="updateCartData"
            >
              Apply
            </VBtn>
          </div>

          <!-- 👉 Gift wrap banner -->
          <div class="bg-var-theme-background rounded pa-6 mt-4">
            <h6 class="text-h6 mb-2">
              Buying gift for a loved one?
            </h6>
            <p class="mb-2">
              Gift wrap and personalized message on card, Only for $2.
            </p>

            <h6 class="text-h6">
              <a href="#">Add a gift wrap</a>
            </h6>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-h6 mb-4">
            Price Details
          </h6>

          <div class="text-high-emphasis">
            <div class="d-flex justify-space-between mb-2">
              <span>Bag Total</span>
              <span class="text-medium-emphasis">${{ totalCost }}.00</span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Coupon Discount</span>
              <a href="#">Apply Coupon</a>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Order Total</span>
              <span class="text-medium-emphasis">${{ totalCost }}.00</span>
            </div>

            <div class="d-flex justify-space-between">
              <span>Delivery Charges</span>

              <div class="d-flex align-center">
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
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex justify-space-between pa-6">
          <h6 class="text-h6">
            Total
          </h6>
          <h6 class="text-h6">
            ${{ totalCost }}.00
          </h6>
        </VCardText>
      </VCard>

      <VBtn
        block
        class="mt-4"
        @click="nextStep"
      >
        Place Order
      </VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-end: 14px;
}
</style>
