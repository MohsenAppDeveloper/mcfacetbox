<script lang="ts" setup>
import { useSelectTreeNode } from '@/store/treeStoreV3'
import { SizeType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean

  //   selectedDataBoxId: number
  serviceurl: string
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const loading = ref(false)
const opening = ref(false)
const { t } = useI18n({ useScope: 'global' })
const mainCard = ref()
const { treeNodeIdMustBeSelect } = useSelectTreeNode()

// const apiUrl = ref('')
const { height: tableheight } = useElementSize(mainCard)
const { height: windowheight } = useWindowSize()
const mctreenodestats = ref()
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void

//   (e: 'errorHasOccured', message: string): void
}

const tableHeaders = [
  { title: t('nodetitle'), key: 'fullName', width: '500', nowrap: true, sortable: false },
  { title: t('excerptcount'), key: 'excerptCount.total', sortable: true },
  { title: t('childcount'), key: 'subcategoryCount', nowrap: true, sortable: true },
  { title: t('creatoruser'), key: 'creatorFullName', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
  { title: t('selectintree'), key: 'actions', sortable: false },
]

// watch(tableheight, () => {
//   setTimeout(() => {
//     tableheightFinal.value = tableheight.value - 150
//   }, 5000)
// })
onMounted(async () => {
  nextTick(() => mctreenodestats.value.refreshData())
})
</script>

<template>
  <VDialog v-if="props.isDialogVisible" :model-value="props.isDialogVisible" :width="DialogSizeMD + 30" @update:model-value="emit('update:isDialogVisible', false)">
    <DialogCloseBtn :disabled="loading" @click="emit('update:isDialogVisible', false)" />

    <VCard ref="mainCard" variant="flat" :loading="opening" :height="windowheight - 20" class="pa-1">
      <MCLoading :loadingsize="SizeType.MD" :showloading="opening" />
      <VCardTitle class="primary white--text pa-2">
        {{ $t('tree.stats') }}
        <VSpacer />
      </VCardTitle>
      <VDivider />
      <!-- <div class="mc-data-scrolly-float" style="-block-size-offset: 4px"> -->
      <MCDataTable
        ref="mctreenodestats"
        :active-edit-action="false" :active-delete-action="false" :tableheight="`${tableheight - 150}px`"
        :default-page-size="50" :row-selectable="false" :autostart="false" :headers="tableHeaders" :api-url="props.serviceurl" :gateid="0"
        showsearch
      >
        <template #item.fullName="{ value }">
          <div style="white-space: pre-line;" class="py-1">
            <span v-if="value.fullName.parentTitle && value.fullName.parentTitle.length > 0" class="opacity-60">{{ value.fullName.parentTitle }} / </span>
            <span>{{ value.title }}</span>
          </div>
        </template>

        <template #item.excerptCount.total="{ value }">
          <span>{{ value.excerptCount.total }}</span>
        </template>

        <template #item.creationTime="{ value }">
          <div class="d-flex align-center gap-x-4">
            {{ usePersianDate(value.creationTime) }}
          </div>
        </template>
        <template #item.actions="{ value }">
          <VBtn size="small" variant="plain" @click=" treeNodeIdMustBeSelect = value.id">
            <!--
              <VTooltip
              activator="parent"
              location="top center"
              >
              {{ $t('selectintree') }}
              </VTooltip>
            -->
            <VIcon size="16" icon="tabler-eye-up" />
          </VBtn>
        </template>
      </MCDataTable>
      <!-- </div> -->
    </VCard>
  </VDialog>
</template>
