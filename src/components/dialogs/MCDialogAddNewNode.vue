<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import { useTree } from '@/store/treeStore'
import type { ISimpleTreeActionable } from '@/types/baseModels'
import { SelectionType, SimpleTreeAcionableModel } from '@/types/baseModels'
import { NodeNewModel, NodeType } from '@/types/tree'

interface Prop {
  isDialogVisible: boolean
  selectedNode: ISimpleTreeActionable
  selectedTreeId: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedNodes = ref<number[]>([])
const activeActions = ref(false)
const nodeAddingType = ref('Sibling')
const nodeTitle = ref('')
const loading = ref(false)
const { addNode } = useTree()
const { t } = useI18n({ useScope: 'global' })

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void
  (e: 'nodeAdded', node: ISimpleTreeActionable): void
  (e: 'nodeAddedFailed', message: string): void

}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  activeActions.value = false
}

watch(selectedNodes, () => {
  console.log('selectednode', selectedNodes.value)
})
function dataEntryChanged(phrase: string) {
  nodeTitle.value = phrase
  if (phrase.length > 0)
    activeActions.value = true
  else
    activeActions.value = false
}

const addNewNode = async () => {
  const result = ref(false)

  loading.value = true
  try {
    const resultid = await $api('app/node', {
      method: 'POST',
      body: JSON.parse(JSON.stringify(new NodeNewModel(props.selectedTreeId, props.selectedNode.id, nodeAddingType.value === 'Children' ? NodeType.Children : NodeType.Sibling, nodeTitle.value))),
      ignoreResponseError: false,
    })

    if (nodeAddingType.value === 'Children')
      result.value = addNode({ id: resultid, title: nodeTitle.value, parentId: props.selectedNode.id, tempData: null, priority: 0 })
    else
      result.value = addNode({ id: resultid, title: nodeTitle.value, parentId: props.selectedNode.parentId, tempData: null, priority: 0 })
    emit('nodeAdded', new SimpleTreeAcionableModel(resultid, nodeTitle.value, props.selectedNode.id))
    loading.value = false
  }
  catch (error) {
    loading.value = false
    console.log('erroraddnode', error.message)

    if (error instanceof CustomFetchError && error.code > 0)
      emit('nodeAddedFailed', error.message)
    else emit('nodeAddedFailed', t('alert.probleminnodeaddrefreshpage'))
  }
}

const addRootNode = () => {

}

defineExpose({ addRootNode })
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn :disabled="loading" @click="onReset(true)" />
    <VCard variant="flat" :subtitle="`${$t('tree.selectednode')}: ${props.selectedNode.title}`" :title="$t('tree.addnewnode')">
      <MCSearchApiAutoComplete
        v-model:selected-items="selectedNodes"
        auto-focus :max-height="400" :api-url="`app/node/simple?treeid=${props.selectedTreeId}`" :selection-type="SelectionType.Single" class="pt-1"
        fill-search-phrase-with-selected @search-phrase-changed="dataEntryChanged"
      />
      <VDivider v-if="activeActions" />

      <template #actions>
        <div v-if="activeActions" class="w-100 d-flex justify-center py-2 px-2">
          <VRadioGroup v-model="nodeAddingType" inline>
            <VRadio :label="$t('tree.samelevelnode')" value="Sibling" false-icon="tabler-circle" true-icon="tabler-circle-filled" />
            <VRadio :label="$t('tree.childnode')" value="Children" false-icon="tabler-circle" true-icon="tabler-circle-filled" :disabled="selectedNode.id === -1" />
          </VRadioGroup>
          <VBtn type="submit" class="me-3" :loading="loading" @click="addNewNode">
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
