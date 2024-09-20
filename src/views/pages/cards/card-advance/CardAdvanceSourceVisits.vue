<script setup lang="ts">
const sourceVisits = [
  {
    avatarIcon: 'tabler-shadow',
    title: 'Direct Source',
    subtitle: 'Direct link click',
    stats: '1.2k',
    profitLoss: 4.2,
  },
  {
    avatarIcon: 'tabler-globe',
    title: 'Social Network',
    subtitle: 'Social Channels',
    stats: '31.5k',
    profitLoss: 8.2,
  },
  {
    avatarIcon: 'tabler-mail',
    title: 'Email Newsletter',
    subtitle: 'Mail Campaigns',
    stats: '893',
    profitLoss: 2.4,
  },
  {
    avatarIcon: 'tabler-external-link',
    title: 'Referrals',
    subtitle: 'Impact Radius Visits',
    stats: '342',
    profitLoss: -0.4,
  },
  {
    avatarIcon: 'tabler-discount',
    title: 'ADVT',
    subtitle: 'Google ADVT',
    stats: '2.15k',
    profitLoss: 9.1,
  },
  {
    avatarIcon: 'tabler-star',
    title: 'Other',
    subtitle: 'Many Sources',
    stats: '12.5k',
    profitLoss: 6.2,
  },
]

const moreList = [
  { title: 'Refresh', value: 'refresh' },
  { title: 'Download', value: 'Download' },
  { title: 'View All', value: 'View All' },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Source Visits</VCardTitle>
      <VCardSubtitle>
        38.4k Visitors
      </VCardSubtitle>
      <template #append>
        <div class="mt-n4 me-n2">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="visit in sourceVisits"
          :key="visit.title"
        >
          <template #prepend>
            <VAvatar
              size="38"
              color="secondary"
              variant="tonal"
              class="me-1"
              rounded
            >
              <VIcon
                :icon="visit.avatarIcon"
                size="22"
              />
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium me-4">
            {{ visit.title }}
          </VListItemTitle>
          <VListItemSubtitle class="me-4">
            {{ visit.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center gap-x-4">
              <div class="text-body-1">
                {{ visit.stats }}
              </div>
              <VChip
                label
                size="small"
                :color="visit.profitLoss > 0 ? 'success' : 'error'"
              >
                {{ visit.profitLoss > 0 ? '+' : '' }}
                {{ visit.profitLoss }}%
              </VChip>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
