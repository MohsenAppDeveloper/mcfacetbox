<script setup lang="ts">
import brave from '@images/logos/brave.png'
import chrome from '@images/logos/chrome.png'
import firefox from '@images/logos/firefox.png'
import internetExplorer from '@images/logos/internet-explorer.png'
import operaMini from '@images/logos/opera-mini.png'
import safari from '@images/logos/safari.png'

const browserStates = [
  {
    avatarImg: chrome,
    title: 'Google Chrome',
    stats: '90.4',
    progress: 'secondary',
  },
  {
    avatarImg: safari,
    title: 'Apple Safari',
    stats: '70.6',
    progress: 'success',
  },
  {
    avatarImg: firefox,
    title: 'Mozilla Firefox',
    stats: '35.5',
    progress: 'primary',
  },
  {
    avatarImg: operaMini,
    title: 'Opera Mini',
    stats: '80.0',
    progress: 'error',
  },
  {
    avatarImg: internetExplorer,
    title: 'Internet Explorer',
    stats: '62.2',
    progress: 'info',
  },
  {
    avatarImg: brave,
    title: 'Brave',
    stats: '46.3',
    progress: 'warning',
  },
]

const moreList = [
  { title: 'Refresh', value: 'refresh' },
  { title: 'Download', value: 'Download' },
  { title: 'View All', value: 'View All' },
]
</script>

<template>
  <VCard
    title="Browser States"
    subtitle="Counter April 2022"
  >
    <template #append>
      <div class="mt-n4 me-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="state in browserStates"
          :key="state.title"
        >
          <template #prepend>
            <img
              :src="state.avatarImg"
              height="28"
              width="28"
              class="me-4"
            >
          </template>

          <VListItemTitle class="font-weight-medium me-4">
            {{ state.title }}
          </VListItemTitle>

          <template #append>
            <div class="text-body-1 me-4">
              {{ state.stats }}%
            </div>
            <VProgressCircular
              :model-value="state.stats"
              :color="state.progress"
              width="3"
              size="28"
            />
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 2rem;
}
</style>
