<script lang="ts" setup>
import { SelectionType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
  selectedTreeId: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const activeActions = ref(false)
const selectedNodes = ref<number[]>([])
const loading = ref(false)

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void

  //   (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'nodehasbeenselected', nodeid: number): void

}
function dataEntryChanged(phrase: string) {
  if (phrase.length > 0)
    activeActions.value = true
  else
    activeActions.value = false
}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  activeActions.value = false
}

const selectNode = async () => {
  emit('nodehasbeenselected', selectedNodes.value[0])
  emit('update:isDialogVisible', false)

  //   loading.value = true

//   try {
//     await $api('app/excerpt/text', {
//       method: 'POST',
//       body: JSON.stringify(new DataShelfBoxModelNew(0, props.selectedTreeId, selectedNodes.value[0], props.selectedItem.content)),
//       ignoreResponseError: false,
//     })
//     emit('contentToNodeAdded')
//   }
//   catch (error) {
//     if (error instanceof CustomFetchError && error.code !== '0')
//       emit('messageHasOccured', error.message, MessageType.error)
//     else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
//   }
//   loading.value = false
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn @click="onReset(true)" />
    <VCard variant="flat">
      <VCardTitle>{{ $t('tree.selectnode') }}</VCardTitle>
      <MCSearchApiAutoComplete
        v-model:selected-items="selectedNodes"
        auto-focus :max-height="400" :api-url="`app/node/simple?treeid=${props.selectedTreeId}`" :selection-type="SelectionType.Single" class="pt-1"
        @search-phrase-changed="dataEntryChanged"
      />
      <VDivider v-if="selectedNodes.length > 0" />

      <template #actions>
        <div v-if="selectedNodes.length > 0" class="w-100 d-flex justify-center py-2 px-2">
          <VBtn type="submit" class="me-3" :loading="loading" @click="selectNode">
            <span>
              {{ $t('accept') }}
            </span>
          </VBtn>
          <VBtn type="reset" variant="tonal" color="error" :disabled="loading" @click="onReset">
            {{ $t('cancel') }}
          </VBtn>
        </div>
      </template>
    </VCard>
  </VDialog>
</template>
