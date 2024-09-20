<script setup lang="ts">
import type { Vehicle } from '@db/apps/logistics/types'

const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const { data: vehiclesData } = await useApi<any>(createUrl('/apps/logistics/vehicles', {
  query: {
    page,
    itemsPerPage,
    sortBy,
    orderBy,
  },
}))

const vehicles = computed((): Vehicle[] => vehiclesData.value.vehicles)
const totalVehicles = computed(() => vehiclesData.value.totalVehicles)

const headers = [
  { title: 'LOCATION', key: 'location' },
  { title: 'STARTING ROUTE', key: 'startRoute' },
  { title: 'ENDING ROUTE', key: 'endRoute' },
  { title: 'WARNINGS', key: 'warnings' },
  { title: 'PROGRESS', key: 'progress' },
]

const resolveChipColor = (warning: string) => {
  if (warning === 'No Warnings')
    return 'success'
  if (warning === 'fuel problems')
    return 'primary'
  if (warning === 'Temperature Not Optimal')
    return 'warning'
  if (warning === 'Ecu Not Responding')
    return 'error'
  if (warning === 'Oil Leakage')
    return 'info'
}
</script>

<template>
  <VCard>
    <VCardItem title="On Route vehicles">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VDivider />
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 20, title: '20' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
      :items-length="totalVehicles"
      :items="vehicles"
      item-value="location"
      :headers="headers"
      show-select
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <template #item.location="{ item }">
        <VAvatar
          variant="tonal"
          color="secondary"
          class="me-4"
          size="40"
        >
          <VIcon
            icon="tabler-car"
            size="28"
          />
        </VAvatar>
        <RouterLink :to="{ name: 'apps-logistics-fleet' }">
          <div class="text-link text-base font-weight-medium d-inline-block">
            VOL-{{ item.location }}
          </div>
        </RouterLink>
      </template>

      <template #item.startRoute="{ item }">
        {{ item.startCity }}, {{ item.startCountry }}
      </template>

      <template #item.endRoute="{ item }">
        {{ item.endCity }}, {{ item.endCountry }}
      </template>

      <template #item.warnings="{ item }">
        <VChip
          :color="resolveChipColor(item.warnings)"
          label
          size="small"
        >
          {{ item.warnings }}
        </VChip>
      </template>

      <template #item.progress="{ item }">
        <div
          class="d-flex align-center gap-x-4"
          style="min-inline-size: 240px;"
        >
          <div class="w-100">
            <VProgressLinear
              :model-value="item.progress"
              rounded
              color="primary"
              :height="8"
            />
          </div>
          <div>
            {{ item.progress }}%
          </div>
        </div>
      </template>

      <!-- pagination -->
      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalVehicles"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
