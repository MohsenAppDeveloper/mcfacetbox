<script setup lang="ts">
const deliveryData = [
  { title: 'Packages in transit', value: '10k', change: 25.8, icon: 'tabler-box', color: 'primary' },
  { title: 'Packages out for delivery', value: '5k', change: 4.3, icon: 'tabler-truck', color: 'info' },
  { title: 'Packages delivered', value: '15k', change: -12.5, icon: 'tabler-circle-check', color: 'success' },
  { title: 'Delivery success rate', value: '95%', change: 35.6, icon: 'tabler-percentage', color: 'warning' },
  { title: 'Average delivery time', value: '2.5 Days', change: -2.15, icon: 'tabler-clock', color: 'secondary' },
  { title: 'Customer satisfaction', value: '4.5/5', change: 5.7, icon: 'tabler-users', color: 'error' },
]
</script>

<template>
  <VCard>
    <VCardItem title="Delivery performance">
      <VCardSubtitle>
        12% increase in this month
      </VCardSubtitle>
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="(data, index) in deliveryData"
          :key="index"
        >
          <div class="d-flex gap-x-4 align-center">
            <VAvatar
              :color="data.color"
              variant="tonal"
              rounded
              size="38"
              class="me-1"
            >
              <VIcon
                :icon="data.icon"
                size="26"
              />
            </VAvatar>

            <div>
              <VListItemTitle class="text-body-1 text-high-emphasis">
                {{ data.title }}
              </VListItemTitle>
              <VListItemSubtitle>
                <div
                  :class="data.change > 0 ? 'text-success' : 'text-error'"
                  class="d-flex align-center"
                >
                  <VIcon
                    :icon="data.change > 0 ? 'tabler-chevron-up' : 'tabler-chevron-down'"
                    class="me-1"
                    size="20"
                  />
                  <span>{{ data.change }}%</span>
                </div>
              </VListItemSubtitle>
            </div>
          </div>
          <template #append>
            <span class="text-body-1 font-weight-medium">
              {{ data.value }}
            </span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>
