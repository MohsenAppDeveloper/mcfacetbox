<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import { useTree } from '@/store/treeStore'
import type { ISimpleTreeActionable } from '@/types/baseModels'
import { SelectionType } from '@/types/baseModels'
import { NodeType, getNodeTypeNameSpace } from '@/types/tree'

interface Prop {
  isDialogVisible: boolean
  selectedNode: ISimpleTreeActionable
  parentNodeTitle: string
  selectedTreeId: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedNodes = ref<number[]>([])
const activeActions = ref(false)
const nodeTitle = ref('')
const loading = ref(false)
const { transferNode } = useTree()
const transfertype = ref(NodeType.SiblingAfter)
const { t } = useI18n({ useScope: 'global' })

interface Emit {
  (e: 'errorHasOccured', message: string): void
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'nodeTransfered', sourceNodeId: number, destinationNodeID: number): void
  (e: 'nodeTransferFaild', message: string): void

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
  try {
    await $api(`app/node/${props.selectedNode.id}/move/${getNodeTypeNameSpace(transfertype.value)}/${selectedNodes.value[0]}`, {
      method: 'PUT',
      ignoreResponseError: false,
    })

    transferNode(props.selectedNode.id, selectedNodes.value[0], transfertype.value)
    loading.value = false
    emit('update:isDialogVisible', false)

    emit('nodeTransfered', props.selectedNode.id, selectedNodes.value[0])
  }
  catch (error) {
    loading.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('nodeTransferFaild', error.message)
    else emit('nodeTransferFaild', t('alert.probleminnodeaddrefreshpage'))
  }
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn :disabled="loading" @click="onReset(true)" />
    <VCard variant="flat" :title="$t('tree.transfernode')">
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
          <VRadioGroup v-model="transfertype" inline>
            <VRadio :label="$t('before')" :value="NodeType.SiblingBefore" false-icon="tabler-circle" true-icon="tabler-circle-filled" />
            <VRadio :label="$t('after')" :value="NodeType.SiblingAfter" false-icon="tabler-circle" true-icon="tabler-circle-filled" />

            <VRadio :label="$t('tree.childnode')" :value="NodeType.Children" false-icon="tabler-circle" true-icon="tabler-circle-filled" :disabled="selectedNode.id === -1" />
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
