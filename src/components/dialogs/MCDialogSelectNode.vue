<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import { useTree } from '@/store/treeStore'
import { SelectionType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedNodes = ref<number[]>([])
const activeActions = ref(false)

const { t } = useI18n({ useScope: 'global' })
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void

}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  activeActions.value = false
}

watch(selectedNodes, () => {
  console.log('selectednode', selectedNodes)
})
function loadingTreeStateChanged(loadingstate: boolean, resultCount: number) {
  console.log('statechange', loadingstate, resultCount)

  activeActions.value = (!loadingstate && resultCount > 0)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn @click="onReset(true)" />
    <VCard variant="flat">
      <VCardTitle>{{ $t('tree.selectnode') }}</VCardTitle>
      <MCSearchApiAutoComplete v-model:selected-items="selectedNodes" :max-height="400" api-url="/apps/searchsimple" :selection-type="SelectionType.Single" @loading-state-changed="loadingTreeStateChanged" />
      <VDivider v-if="activeActions" />
      <template #actions>
        <div v-if="activeActions" class="w-100 d-flex justify-center py-2">
          <VBtn type="submit" class="me-3">
            <span>
              {{ $t('accept') }}
            </span>
          </VBtn>
          <VBtn type="reset" variant="tonal" color="error" @click="onReset">
            {{ $t('cancel') }}
          </VBtn>
        </div>
      </template>
    </VCard>
  </VDialog>
</template>
