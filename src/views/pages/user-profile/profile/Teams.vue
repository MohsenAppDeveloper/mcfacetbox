<script lang="ts" setup>
import type { ProfileTeamsTech } from '@db/pages/profile/types'

interface Props {
  teamsData: ProfileTeamsTech[]
}

const props = defineProps<Props>()

const moreList = [
  { title: 'Share connections', value: 'Share connections' },
  { title: 'Suggest edits', value: 'Suggest edits' },
  { title: 'Report Bug', value: 'Report Bug' },
]
</script>

<template>
  <VCard title="Teams">
    <template #append>
      <div>
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="data in props.teamsData"
          :key="data.title"
        >
          <template #prepend>
            <VAvatar
              size="38"
              :image="data.avatar"
            />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ data.title }}
          </VListItemTitle>
          <VListItemSubtitle>{{ data.members }} Members</VListItemSubtitle>

          <template #append>
            <VChip
              label
              :color="data.ChipColor"
              size="small"
              class="font-weight-medium"
            >
              {{ data.chipText }}
            </VChip>
          </template>
        </VListItem>

        <VListItem>
          <VListItemTitle class="pt-2 text-center">
            <RouterLink :to="{ name: 'pages-user-profile-tab', params: { tab: 'teams' } }">
              <p class="mb-0">
                View all Teams
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
