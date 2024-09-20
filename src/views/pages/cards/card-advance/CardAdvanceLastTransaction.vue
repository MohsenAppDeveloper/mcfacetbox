<script setup lang="ts">
import aeIcon from '@images/icons/payments/ae-icon.png'
import mastercardIcon from '@images/icons/payments/mastercard-icon.png'
import visaIcon from '@images/icons/payments/visa-icon.png'

interface Status {
  Verified: string
  Rejected: string
  Pending: string
}

interface Transition {
  cardImg: string
  lastDigit: string
  cardType: string
  sentDate: string
  status: keyof Status
  trend: string
}

const lastTransitions: Transition[] = [
  {
    cardImg: visaIcon,
    lastDigit: '*4230',
    cardType: 'Credit',
    sentDate: '17 Mar 2022',
    status: 'Verified',
    trend: '+$1,678',
  },
  {
    cardImg: mastercardIcon,
    lastDigit: '*5578',
    cardType: 'Credit',
    sentDate: '12 Feb 2022',
    status: 'Rejected',
    trend: '-$839',
  },
  {
    cardImg: aeIcon,
    lastDigit: '*4567',
    cardType: 'Credit',
    sentDate: '28 Feb 2022',
    status: 'Verified',
    trend: '+$435',
  },
  {
    cardImg: visaIcon,
    lastDigit: '*5699',
    cardType: 'Credit',
    sentDate: '8 Jan 2022',
    status: 'Pending',
    trend: '+$2,345',
  },
  {
    cardImg: visaIcon,
    lastDigit: '*5699',
    cardType: 'Credit',
    sentDate: '8 Jan 2022',
    status: 'Rejected',
    trend: '-$234',
  },
]

const resolveStatus: Status = {
  Verified: 'success',
  Rejected: 'error',
  Pending: 'secondary',
}

const moreList = [
  { title: 'Refresh', value: 'refresh' },
  { title: 'Download', value: 'Download' },
  { title: 'View All', value: 'View All' },
]

const getPaddingStyle = (index: number) => index ? 'padding-block-end: 1.5rem;' : 'padding-block: 1.5rem;'
</script>

<template>
  <VCard title="Last Transaction">
    <template #append>
      <div class="me-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VDivider />
    <VTable class="text-no-wrap transaction-table">
      <thead>
        <tr>
          <th>CARD</th>
          <th>DATE</th>
          <th>STATUS</th>
          <th>TREND</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(transition, index) in lastTransitions"
          :key="index"
        >
          <td :style="getPaddingStyle(index)">
            <div class="d-flex align-center">
              <div class="me-4">
                <VImg
                  :src="transition.cardImg"
                  width="50"
                />
              </div>
              <div>
                <p class="font-weight-medium text-base mb-0 text-high-emphasis">
                  {{ transition.lastDigit }}
                </p>
                <p class="text-sm mb-0">
                  {{ transition.cardType }}
                </p>
              </div>
            </div>
          </td>
          <td :style="getPaddingStyle(index)">
            <p class="text-high-emphasis text-base mb-0">
              Sent
            </p>
            <span class="text-sm">{{ transition.sentDate }}</span>
          </td>
          <td :style="getPaddingStyle(index)">
            <VChip
              label
              :color="resolveStatus[transition.status]"
              size="small"
            >
              {{ transition.status }}
            </VChip>
          </td>
          <td :style="getPaddingStyle(index)">
            <div class="text-high-emphasis text-base">
              {{ transition.trend }}
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCard>
</template>

<style lang="scss">
.transaction-table {
  &.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td,
  &.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
    border-block-end: none !important;
  }
}
</style>
