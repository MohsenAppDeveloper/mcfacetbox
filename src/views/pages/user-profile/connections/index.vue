<script setup lang="ts">
import type { ConnectionsTab } from '@db/pages/profile/types'

const router = useRoute('pages-user-profile-tab')
const connectionData = ref<ConnectionsTab[]>([])

const fetchProjectData = async () => {
  if (router.params.tab === 'connections') {
    const data = await $api('/pages/profile', {
      query: {
        tab: router.params.tab,
      },
    }).catch(err => console.log(err))

    connectionData.value = data
  }
}

watch(router, fetchProjectData, { immediate: true })
</script>

<template>
  <VRow>
    <VCol
      v-for="data in connectionData"
      :key="data.name"
      sm="6"
      lg="4"
      cols="12"
    >
      <VCard>
        <div class="vertical-more">
          <MoreBtn
            :menu-list="[
              { title: 'Share connection', value: 'Share connection' },
              { title: 'Block connection', value: 'Block connection' },
              { type: 'divider', class: 'my-2' },
              { title: 'Delete', value: 'Delete', class: 'text-error' },
            ]"
            item-props
          />
        </div>

        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center gap-y-6">
            <VAvatar
              size="100"
              :image="data.avatar"
              class="mt-5"
            />

            <div class="text-center">
              <h5 class="text-h5">
                {{ data.name }}
              </h5>
              <h6 class="text-body-1">
                {{ data.designation }}
              </h6>
            </div>

            <div class="d-flex align-center flex-wrap gap-4">
              <VChip
                v-for="chip in data.chips"
                :key="chip.title"
                label
                :color="chip.color"
                size="small"
              >
                {{ chip.title }}
              </VChip>
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <div class="d-flex justify-space-around mb-2">
            <div class="text-center">
              <h5 class="text-h5">
                {{ data.projects }}
              </h5>
              <div class="text-body-1">
                Projects
              </div>
            </div>
            <div class="text-center">
              <h5 class="text-h5">
                {{ data.tasks }}
              </h5>
              <div class="text-body-1">
                Tasks
              </div>
            </div>
            <div class="text-center">
              <h5 class="text-h5">
                {{ data.connections }}
              </h5>
              <div class="text-body-1">
                Connections
              </div>
            </div>
          </div>

          <div class="d-flex justify-center gap-4 mt-6">
            <VBtn
              :prepend-icon="data.isConnected ? 'tabler-user-check' : 'tabler-user-plus'"
              :variant="data.isConnected ? 'elevated' : 'tonal'"
            >
              {{ data.isConnected ? 'connected' : 'connect' }}
            </VBtn>

            <IconBtn
              variant="tonal"
              class="rounded"
            >
              <VIcon
                icon="tabler-mail"
                color="secondary"
              />
            </IconBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.vertical-more {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-end: 0.5rem;
}
</style>
