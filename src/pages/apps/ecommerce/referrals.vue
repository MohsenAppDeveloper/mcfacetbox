<script setup lang="ts">
import type { Referrals } from '@db/apps/ecommerce/types'
import paperImg from '@images/svg/paper-send.svg?raw'
import rocketImg from '@images/svg/rocket.svg?raw'
import userInfoImg from '@images/svg/user-info.svg?raw'

const rocketIcon = h('div', { innerHTML: rocketImg, style: 'font-size: 2.625rem;color: rgb(var(--v-theme-primary))' })
const userInfoIcon = h('div', { innerHTML: paperImg, style: 'font-size: 2.625rem;color: rgb(var(--v-theme-primary))' })
const paperIcon = h('div', { innerHTML: userInfoImg, style: 'font-size: 2.625rem;color: rgb(var(--v-theme-primary))' })

const widgetData = [
  { title: 'Total Earning', value: '$24,983', icon: 'tabler-currency-dollar', color: 'primary' },
  { title: 'Unpaid Earning', value: '$8,647', icon: 'tabler-gift', color: 'success' },
  { title: 'Signup', value: '2,367', icon: 'tabler-users', color: 'error' },
  { title: 'Conversion Rate', value: '4.5%', icon: 'tabler-infinity', color: 'info' },
]

const stepsData = [
  { icon: rocketIcon, desc: 'Create & validate your referral link and get', value: '$50' },
  { icon: paperIcon, desc: 'For every new signup you get', value: '10%' },
  { icon: userInfoIcon, desc: 'Get other friends to generate link and get', value: '$100' },
]

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Data Table Headers
const headers = [
  { title: 'Users', key: 'users' },
  { title: 'Referred ID', key: 'referred-id' },
  { title: 'Status', key: 'status' },
  { title: 'Value', key: 'value' },
  { title: 'Earnings', key: 'earning' },
]

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Fetching Referral Data
const { data: referralData } = await useApi<any>(createUrl('/apps/ecommerce/referrals', {
  query: {
    page,
    itemsPerPage,
    sortBy,
    orderBy,
  },
}))

const resolveAvatarbg = (status: string) => {
  if (status === 'Rejected')
    return { color: 'error' }
  if (status === 'Unpaid')
    return { color: 'warning' }
  if (status === 'Paid')
    return { color: 'success' }
}

const referrals = computed((): Referrals[] => referralData.value.referrals)
const totalReferrals = computed(() => referralData.value.total)

const resolveStatus = (status: string) => {
  if (status === 'Rejected')
    return { text: 'Rejected', color: 'error' }
  if (status === 'Unpaid')
    return { text: 'Unpaid', color: 'warning' }
  if (status === 'Paid')
    return { text: 'Paid', color: 'success' }
}
</script>

<template>
  <div>
    <!-- 👉 Header -->
    <VRow class="match-height">
      <!-- 👉 Widgets -->
      <VCol
        v-for="(data, index) in widgetData"
        :key="index"
        cols="12"
        md="3"
        sm="6"
      >
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column">
                <h5 class="text-h5 mb-1">
                  {{ data.value }}
                </h5>
                <div class="text-body-2">
                  {{ data.title }}
                </div>
              </div>
              <VAvatar
                size="40"
                variant="tonal"
                :color="data.color"
              >
                <VIcon :icon="data.icon" />
              </VAvatar>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Icon Steps -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardItem>
            <VCardTitle class="mb-1">
              How to use
            </VCardTitle>
            <VCardSubtitle>
              Integrate your referral code in 3 easy steps.
            </VCardSubtitle>
          </VCardItem>
          <VCardText>
            <div class="d-flex flex-column flex-sm-row gap-6 justify-sm-space-between align-center">
              <div
                v-for="(step, index) in stepsData"
                :key="index"
                class="d-flex flex-column align-center gap-y-2"
                style="max-inline-size: 185px;"
              >
                <div class="icon-container">
                  <VIcon
                    :icon="step.icon"
                    color="primary"
                    size="36"
                  />
                </div>
                <div class="text-body-1 text-wrap text-center">
                  {{ step.desc }}
                </div>
                <h6 class="text-primary text-h6">
                  {{ step.value }}
                </h6>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Invite -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardText>
            <div class="mb-5">
              <h5 class="text-h5 mb-5">
                Invite your friends
              </h5>
              <div class="d-flex align-center flex-wrap gap-4 flex-wrap">
                <AppTextField
                  label="Enter friend’s email address and invite them"
                  placeholder="Email Address"
                />
                <VBtn class="align-self-end">
                  Submit
                </VBtn>
              </div>
            </div>

            <div>
              <h5 class="text-h5 mb-5">
                Share the referral link
              </h5>
              <div class="d-flex gap-4 align-center flex-wrap">
                <AppTextField
                  label="Share referral link in social media"
                  placeholder="pixinvent.com/?ref=6478"
                />
                <div class="d-flex align-self-end gap-x-2">
                  <VBtn
                    icon
                    class="rounded"
                    color="#3B5998"
                  >
                    <VIcon
                      color="white"
                      icon="tabler-brand-facebook"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    class="rounded"
                    color="#55ACEE"
                  >
                    <VIcon
                      color="white"
                      icon="tabler-brand-twitter"
                    />
                  </VBtn>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Referral Table -->

      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-center flex-wrap gap-4">
              <h5 class="text-h5">
                Referred Users
              </h5>
              <div class="d-flex flex-wrap gap-4">
                <div class="d-flex gap-4 align-center flex-wrap">
                  <AppSelect
                    v-model="itemsPerPage"
                    :items="[10, 25, 50, 100]"
                    style="inline-size: 100px;"
                  />
                  <VBtn
                    prepend-icon="tabler-upload"
                    color="default"
                    variant="tonal"
                  >
                    Export
                  </VBtn>
                </div>
              </div>
            </div>
          </VCardText>

          <VDivider />

          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :items="referrals"
            :headers="headers"
            :items-length="totalReferrals"
            show-select
            @update:options="updateOptions"
          >
            <template #item.users="{ item }">
              <div class="d-flex align-center gap-x-4">
                <VAvatar
                  size="34"
                  :variant="!item.avatar ? 'tonal' : undefined"
                  :color="!item.avatar ? resolveAvatarbg(item.status)?.color : undefined"
                >
                  <VImg
                    v-if="item.avatar"
                    :src="item.avatar"
                  />
                  <span v-else>{{ avatarText(item.user) }}</span>
                </VAvatar>
                <div>
                  <div class="font-weight-medium text-high-emphasis">
                    <RouterLink
                      :to="{ name: 'apps-ecommerce-customer-details-id', params: { id: 478426 } }"
                      class="text-link"
                    >
                      {{ item.user }}
                    </RouterLink>
                  </div>
                  <div class="text-body-2">
                    {{ item.email }}
                  </div>
                </div>
              </div>
            </template>

            <template #item.referred-id="{ item }">
              {{ item.referredId }}
            </template>

            <template #item.status="{ item }">
              <VChip
                v-bind="resolveStatus(item.status)"
                label
                size="small"
              />
            </template>

            <template #item.earning="{ item }">
              <div class="text-body-1 text-high-emphasis">
                {{ item.earning }}
              </div>
            </template>

            <!-- pagination -->
            <template #bottom>
              <TablePagination
                v-model:page="page"
                :items-per-page="itemsPerPage"
                :total-items="totalReferrals"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 50%;
  block-size: 70px;
  inline-size: 70px;
}

.icon {
  color: #000;
  font-size: 42px;
}
</style>
