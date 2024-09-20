<script lang="ts" setup>
import type { ProfileTab } from '@db/pages/profile/types'

interface Props {
  data: ProfileTab
}
const props = defineProps<Props>()
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <p class="text-sm text-disabled">
        ABOUT
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem
          v-for="item in props.data.about"
          :key="item.property"
        >
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon
                :icon="item.icon"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">{{ item.property }}:</div>
              <div>{{ item.value }}</div>
            </span>
          </VListItemTitle>
        </VListItem>
      </VList>

      <p class="text-sm text-disabled mt-6">
        CONTACTS
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem
          v-for="item in props.data.contacts"
          :key="item.property"
        >
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon
                :icon="item.icon"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">{{ item.property }}:</div>
              <div>{{ item.value }}</div>
            </span>
          </VListItemTitle>
        </VListItem>
      </VList>

      <p class="text-sm text-disabled mt-6">
        TEAMS
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem
          v-for="item in props.data.teams"
          :key="item.property"
        >
          <VListItemTitle>
            <span class="d-flex align-center">
              <div class="text-body-1 font-weight-medium me-2">{{ item.property }}</div>
              <div>{{ item.value }}</div>
            </span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>

  <VCard>
    <VCardText>
      <p class="text-sm text-disabled">
        OVERVIEW
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem
          v-for="item in props.data.overview"
          :key="item.property"
        >
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon
                :icon="item.icon"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">{{ item.property }}:</div>
              <div>{{ item.value }}</div>
            </span>
          </VListItemTitle>
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
