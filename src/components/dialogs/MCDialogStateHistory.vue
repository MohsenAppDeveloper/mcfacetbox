<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import { DataShelfBoxModelView } from '@/types/dataShelf'
import type { ISimpleDTO } from '@/types/baseModels'
import { SizeType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
  selectedDataBoxId: number
  serviceurl: string
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const loading = ref(false)
const opening = ref(false)
const { t } = useI18n({ useScope: 'global' })
const databoxItem = reactive<DataShelfBoxModelView>(new DataShelfBoxModelView())

// const apiUrl = ref('')
const mcstatehistory = ref()
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void
}

const tableHeaders = [
  { title: t('description'), key: 'description', maxWidth: 700, width: 700, nowrap: true, sortable: false },
  { title: t('supervision.state'), key: 'title', sortable: false },
  { title: t('creatoruser'), key: 'creatorFullName', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
]

onMounted(async () => {
  nextTick(() => mcstatehistory.value.refreshData())
})
</script>

<template>
  <VDialog v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeMD" :model-value="props.isDialogVisible">
    <DialogCloseBtn :disabled="loading" @click="emit('update:isDialogVisible', false)" />

    <VCard variant="flat" :loading="opening" :min-height="400" class="pa-1">
      <MCLoading :loadingsize="SizeType.MD" :showloading="opening" />
      <VCardTitle class="primary white--text pa-2">
        {{ $t('supervision.history') }}
        <VSpacer />
      </VCardTitle>
      <MCDataTable
        ref="mcstatehistory" :row-selectable="false" :headers="tableHeaders" :api-url="props.serviceurl" :gateid="0" :autostart="false"
        :showsearch="false"
      >
        <template #item.content="{ value }">
          <div style="white-space: pre-line;">
            {{ value.content }}
          </div>
        </template>
        <template #item.labels="{ value }">
          <div class="d-flex align-center gap-x-4">
            {{ value.labels && value.labels.map((item: ISimpleDTO<number>) => `${item.title}`).join(' ,') }}
          </div>
        </template>
        <template #item.node="{ value }">
          <div class="d-flex align-center gap-x-4">
            {{ value.node.title }}
          </div>
        </template>
        <template #item.creationTime="{ value }">
          <div class="d-flex align-center gap-x-4">
            {{ usePersianDate(value.creationTime) }}
          </div>
        </template>
      </MCDataTable>
    </VCard>
  </VDialog>
</template>
