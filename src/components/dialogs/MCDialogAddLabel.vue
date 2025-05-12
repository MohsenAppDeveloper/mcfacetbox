<script lang="ts" setup>
import type { ISimpleDTO } from '@/types/baseModels'
import { SelectionType, SizeType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
  selectedDataBoxId: number
  locX: number
  locY: number
  treeId: number

}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedLabels = ref<number[]>([])
const searchPhrase = ref('')
const loading = ref(false)
const opening = ref(false)

const { t } = useI18n({ useScope: 'global' })

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void
  (e: 'labelAdded', nodeid: number, labelcount: number): void
}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
}

const loadExcerptLabels = async () => {
  opening.value = true
  try {
    const result = await $api <ISimpleDTO<number>[]>(`app/excerpt/${props.selectedDataBoxId}/labels`, {
      method: 'GET',
    })

    if (result.length > 0) {
      setTimeout(() => {
        selectedLabels.value.push(...result.map(item => item.id))
        console.log('selectedlabels', selectedLabels.value)
      }, 2000)
    }
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code > 0)
      emit('errorHasOccured', error.message)
    else emit('errorHasOccured', t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }
}

const addlabels = async () => {
  loading.value = true
  try {
    await $api(`app/excerpt/${props.selectedDataBoxId}/labels`, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(selectedLabels.value)),
      ignoreResponseError: false,
    })

    emit('labelAdded', props.selectedDataBoxId, selectedLabels.value.length)
    loading.value = false
  }
  catch (error) {
    loading.value = false

    if (error instanceof CustomFetchError && error.code > 0)
      emit('errorHasOccured', error.message)
    else emit('errorHasOccured', t('alert.probleminnodeaddrefreshpage'))
  }
}

onMounted(() => {
  loadExcerptLabels()
})
</script>

<template>
  <VDialog
    :scrim="false"
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeXS" :model-value="props.isDialogVisible"
    :target="[locX, locY]" location-strategy="connected" @update:model-value="onReset(true)"
  >
    <DialogCloseBtn icon-size="16px" :disabled="loading || opening" @click="onReset(true)" />
    <VCard variant="flat" class="v-card-sm" :title="$t('datashelfbox.addlabel')" :height="400" :loading="opening">
      <VCardText class="pa-0">
        <MCSearchApiAutoComplete
          v-model:selected-items="selectedLabels" placeholder="datashelfbox.labeltitle" activeaction api-url-add-data="app/label" :actionedata="{ treeid: treeId }"
          auto-focus :max-height="255" :api-url="`app/label/simple?treeid=${treeId}`" :selection-type="SelectionType.Multiple" class="pt-0"
          :fill-search-phrase-with-selected="false" :list-item-size="SizeType.SM" load-all-list @error-has-occured="emit('errorHasOccured', $event)"
        />
      </VCardText>
      <VDivider />

      <template #actions>
        <div class="w-100 d-flex justify-center py-1 px-1">
          <VBtn type="submit" class="me-3" :loading="loading" :disabled="!(searchPhrase.length > 0 || selectedLabels.length > 0)" @click="addlabels">
            <span>
              {{ $t('add') }}
            </span>
          </VBtn>
        </div>
      </template>
    </VCard>
  </VDialog>
</template>
