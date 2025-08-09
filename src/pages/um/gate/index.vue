<script setup lang="ts">
// !SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCDataTable from '@/components/MCDataTable.vue'
import { GateModel } from '@/types/gate'
import { router } from '@/plugins/1.router'

import ApexChartAreaChart from '@/views/charts/apex-chart/ApexChartAreaChart.vue'
import ApexChartStatistics from '@/views/charts/apex-chart/ApexChartStatistics.vue'
import { useSelectedGate } from '@/store/gateStore'

const { t } = useI18n({ useScope: 'global' })
const mcdatatable = ref(MCDataTable)
const gateEditDataItem = ref<Record<string, any>>(new GateModel())
const dialogGate = ref(VDialog)
const isAddNewGateDialogVisible = ref(false)
const currentGate = useSelectedGate()

// const route = useRoute('ums-id')

// GateHeaders
const gateHeaders = [
  { text: '0', value: 'num', sortable: false },
  { title: t('gate.title'), key: 'title' },
  { title: t('nameandfamily'), value: 'manager.fullName' },
  { title: t('mobilenumber'), value: 'manager.phoneNumber' },
  { title: t('email'), value: 'manager.email' },
  { title: t('projectcount'), key: 'projectsCount' },

  { title: t('users'), value: 'gateType.title', sortable: false },
  { title: t('description'), key: 'description', sortable: false },
  { title: t('status'), value: 'isActive', key: 'isActive', sortable: false },

  { title: '', value: 'actions', key: 'actions', sortable: false },
]

const gateApiUrl = 'app/gate'

// watch(() => route.params.id, () => {
//   console.log('routelog', route.params)
// })
function gateAdd() {
  isAddNewGateDialogVisible.value = true
}

const gateEdit = (dataItem: Record<string, any>) => {
  isAddNewGateDialogVisible.value = true
  nextTick(() => dialogGate.value.updateGate(dataItem.id))
}

const gateDataAdded = () => {
  mcdatatable.value.refreshData()
}

const updateCharts = (gateid: number) => {

}

const routeWithGateId = (page: string, gateid: number, gatetitle: string) => {
  currentGate.value.id = gateid
  currentGate.value.title = gatetitle
  nextTick(() => {
    router.replace(`gate/${gateid}/${page}`)
  })
}

const gateDataUpdated = () => {
  mcdatatable.value.refreshData()
}
</script>

<template>
  <section>
    <VRow no-gutters justify="space-between" align="center">
      <div class="page-title">
        {{ $t('gate.pageTitle') }}
      </div>

      <VBtn prepend-icon="tabler-plus" @click="gateAdd">
        {{ $t('gate.add') }}
      </VBtn>
    </VRow>

    <VRow id="apex-chart-wrapper">
      <VCol cols="12" md="4">
        <VCard title="کاربران فعال / سال" variant="flat">
          <VDivider />

          <VCardText>
            <ApexChartStatistics />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="8">
        <VCard variant="flat">
          <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
            <VCardTitle>کاربران فعال / سال / ماه</VCardTitle>

            <template #append>
              <div class="date-picker-wrapper">
                <AppDateTimePicker
                  model-value="2022-06-09" prepend-inner-icon="tabler-calendar"
                  placeholder="Select Date"
                  :config="$vuetify.display.smAndDown ? { position: 'auto center' } : { position: 'auto right' }"
                />
              </div>
            </template>
          </VCardItem>
          <VDivider />

          <VCardText>
            <ApexChartAreaChart />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Statistics -->
    <VRow>
      <VCol cols="12">
        <VCard variant="outlined">
          <MCDataTable ref="mcdatatable" :headers="gateHeaders" :api-url="gateApiUrl" @edit-item="gateEdit">
            <template #item.title="{ value }">
              <div class="d-flex align-center gap-x-4">
                <VAvatar size="34" :variant="!value.manager.avatarUrl ? 'tonal' : undefined">
                  <VImg v-if="value.manager.avatarUrl" :src="value.manager.avatarUrl.replace('xxx', 'small')" />
                  <span v-else>{{ avatarText(value.title) }}</span>
                </VAvatar>
                {{ value.title }}
              </div>
              <!-- {{ value + "asdasdasd" }} -->
            </template>
            <template #item.isActive="{ value }">
              <VChip
                :color="resolveActiveColor(value.isActive)"
                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                class="font-weight-medium"
              >
                {{ $t(resolveActiveTitle(value.isActive)) }}
              </VChip>
            </template>

            <template #action="{ value }">
              <IconBtn @click="routeWithGateId('user', value.id, value.title)">
                <VIcon icon="mdi-account-outline" />
              </IconBtn>
              <IconBtn @click="routeWithGateId('project', value.id, value.title)">
                <VIcon icon="mdi-file-tree-outline" />
              </IconBtn>
              <IconBtn @click="updateCharts(value.id)">
                <VIcon icon="tabler-chart-bar" />
              </IconBtn>
            </template>
          </MCDataTable>
        </VCard>
      </VCol>
    </VRow>
    <!-- 👉 Add New User -->
    <MCDialogGateAdd
      v-if="isAddNewGateDialogVisible" ref="dialogGate" v-model:is-dialog-visible="isAddNewGateDialogVisible"
      :gate-data="gateEditDataItem" :is-update-mode="false" :gate-api-url="gateApiUrl"
      @gate-data-added="gateDataAdded" @gate-data-updated="gateDataUpdated"
    />
  </section>
</template>
