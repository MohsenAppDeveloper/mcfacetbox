<script setup lang="ts">
import type { Customer } from '@db/apps/ecommerce/types'
import rocketImg from '@images/eCommerce/rocket.png'

const props = defineProps<Props>()
const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
interface Props {
  customerData: Customer
}

const userData = {
  id: 110,
  firstName: 'Selena',
  lastName: 'Kyle',
  company: 'pixinvent',
  role: 'Web developer',
  username: 'charwomen1940',
  country: 'United States',
  contact: '(829) 537-0057',
  email: 'irena.dubrovna@wayne.com',
  currentPlan: '',
  status: 'Active',
  avatar: '',
  taskDone: null,
  projectDone: null,
  taxId: 'Tax-8894',
  language: 'English',
  fullName: 'Selena Kyle',
}
</script>

<template>
  <VRow>
    <!-- SECTION Customer Details -->
    <VCol cols="12">
      <VCard v-if="props.customerData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            :color="!props.customerData.customer ? 'primary' : undefined"
            :variant="!props.customerData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.customerData.avatar"
              :src="props.customerData.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.customerData.customer) }}
            </span>
          </VAvatar>

          <!-- 👉 Customer fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.customerData.customer }}
          </h5>
          <div class="text-body-1">
            Customer ID #{{ props.customerData.customerId }}
          </div>

          <div class="d-flex justify-space-evenly gap-x-5 mt-6">
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="primary"
                rounded
                class="me-4"
              >
                <VIcon icon="tabler-shopping-cart" />
              </VAvatar>
              <div class="d-flex flex-column align-start">
                <h5 class="text-h5">
                  {{ props.customerData.order }}
                </h5>
                <div class="text-body-1">
                  Order
                </div>
              </div>
            </div>
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="primary"
                rounded
                class="me-3"
              >
                <VIcon icon="tabler-currency-dollar" />
              </VAvatar>
              <div class="d-flex flex-column align-start">
                <h5 class="text-h5">
                  ${{ props.customerData.totalSpent }}
                </h5>
                <div class="text-body-1">
                  Spent
                </div>
              </div>
            </div>
          </div>
        </VCardText>

        <!-- 👉 Customer Details -->
        <VCardText>
          <h5 class="text-h5">
            Details
          </h5>

          <VDivider class="my-4" />

          <VList class="card-list mt-2">
            <VListItem>
              <h6 class="text-h6">
                Username:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.customer }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Billing Email:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.email }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <div class="d-flex gap-x-2 align-center">
                <h6 class="text-h6">
                  Status:
                </h6>
                <VChip
                  label
                  color="success"
                  size="small"
                >
                  {{ props.customerData.status }}
                </VChip>
              </div>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Contact:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.contact }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Country:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.country }}
                </span>
              </h6>
            </VListItem>
          </VList>
        </VCardText>

        <VCardText class="text-center">
          <VBtn
            block
            @click="isUserInfoEditDialogVisible = !isUserInfoEditDialogVisible"
          >
            Edit Details
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION  Upgrade to Premium -->
    <VCol cols="12">
      <VCard
        flat
        class="current-plan"
      >
        <VCardText>
          <div class="d-flex align-center">
            <div>
              <h5 class="text-h5 text-white mb-4">
                Upgrade to premium
              </h5>
              <p class="mb-6 text-wrap">
                Upgrade customer to premium membership to access pro features.
              </p>
            </div>
            <div>
              <VImg
                :src="rocketImg"
                height="108"
                width="108"
              />
            </div>
          </div>
          <VBtn
            color="#fff"
            class="text-primary"
            block
            @click="isUpgradePlanDialogVisible = !isUpgradePlanDialogVisible"
          >
            Upgrade to Premium
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="userData"
  />
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.current-plan {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)) 0%, #9e95f5 100%);
  color: #fff;
}
</style>
