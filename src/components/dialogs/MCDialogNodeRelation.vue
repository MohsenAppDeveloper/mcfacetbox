<script lang="ts" setup>
import { useTree } from '@/store/treeStore'
import type { ISimpleNestedNodeActionable } from '@/types/tree'
import { MessageType, SelectionType } from '@/types/baseModels'
import { NodeRelationType } from '@/types/tree'

interface Prop {
  isDialogVisible: boolean
  selectedNode: ISimpleNestedNodeActionable
  parentNodeTitle: string
  selectedTreeId: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedNodes = ref<number[]>([])
const activeActions = ref(false)
const nodeTitle = ref('')
const loading = ref(false)
const { increaseRelatedNode } = useTree()
const relationtype = ref(NodeRelationType.relation)
const { t } = useI18n({ useScope: 'global' })

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void

  //   (e: 'nodehasrelated', sourceNodeId: number, destinationNodeID: number): void
  (e: 'messageHasOccured', message: string, type: MessageType): void

  //   (e: 'nodeTransferFaild', message: string): void

}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  activeActions.value = false
}

function dataEntryChanged(phrase: string) {
  nodeTitle.value = phrase
  if (phrase.length > 0)
    activeActions.value = true
  else
    activeActions.value = false
}

const transferNodeLocal = async () => {
  loading.value = true

  const relationtypetitle = relationtype.value === NodeRelationType.relation ? 'relations' : 'references'
  try {
    await $api(`app/node/${props.selectedNode.id}/${relationtypetitle}/${selectedNodes.value[0]}`, {
      method: 'POST',
      ignoreResponseError: false,
    })

    increaseRelatedNode(props.selectedNode.id, relationtype.value)

    // setRelatedNode(selectedNodes.value[0], relationtype.value)
    loading.value = false
    emit('update:isDialogVisible', false)

    emit('messageHasOccured', t('alert.dataActionSuccess'), MessageType.success)
  }
  catch (error) {
    loading.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('alert.probleminnodeaddrefreshpage'), MessageType.error)
  }
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn :disabled="loading" @click="onReset(true)" />
    <VCard variant="flat" :title="$t('tree.relation')" class="pa-1">
      <template #subtitle>
        <span>{{ $t('tree.selectednode') }} : </span>

        <span v-if="props.parentNodeTitle.length > 0" class="opacity-70">{{ props.parentNodeTitle }} / </span>
        <span>{{ props.selectedNode.title }}</span>
      </template>
      <MCSearchApiAutoComplete
        v-model:selected-items="selectedNodes"
        auto-focus :max-height="400" :api-url="`app/node/simple?treeid=${props.selectedTreeId}`" :selection-type="SelectionType.Single" class="pt-1"
        @search-phrase-changed="dataEntryChanged"
      />
      <VDivider v-if="activeActions" />

      <template #actions>
        <div v-if="selectedNodes.length > 0" class="w-100 d-flex justify-center py-2 px-2">
          <VRadioGroup v-model="relationtype" inline>
            <VRadio :label="$t('relation')" :value="NodeRelationType.relation" false-icon="tabler-circle" true-icon="tabler-circle-filled" />
            <VRadio :label="$t('reference')" :value="NodeRelationType.reference" false-icon="tabler-circle" true-icon="tabler-circle-filled" />
          </VRadioGroup>

          <VBtn type="submit" class="me-3" :loading="loading" @click="transferNodeLocal">
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
