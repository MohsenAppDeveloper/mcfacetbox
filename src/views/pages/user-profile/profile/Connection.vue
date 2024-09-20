<script lang="ts" setup>
import type { ProfileConnections } from '@db/pages/profile/types'

interface Props {
  connectionsData: ProfileConnections[]
}

const props = defineProps<Props>()

const moreList = [
  { title: 'Share connections', value: 'Share connections' },
  { title: 'Suggest edits', value: 'Suggest edits' },
  { title: 'Report Bug', value: 'Report Bug' },
]
</script>

<template>
  <VCard title="Connection">
    <template #append>
      <div>
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="data in props.connectionsData"
          :key="data.name"
        >
          <template #prepend>
            <VAvatar
              size="38"
              :image="data.avatar"
            />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ data.name }}
          </VListItemTitle>
          <VListItemSubtitle>{{ data.connections }} Connections</VListItemSubtitle>

          <template #append>
            <VBtn
              icon
              size="38"
              class="rounded"
              :variant="data.isFriend ? 'elevated' : 'tonal' "
            >
              <VIcon
                size="22"
                :icon="data.isFriend ? 'tabler-user-x' : 'tabler-user-check'"
              />
            </VBtn>
          </template>
        </VListItem>

        <VListItem>
          <VListItemTitle class="pt-2 text-center">
            <RouterLink :to="{ name: 'pages-user-profile-tab', params: { tab: 'connections' } }">
              <p class="mb-0">
                View all connections
              </p>
            </RouterLink>
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
