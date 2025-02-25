<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import { rand } from '@vueuse/core'
import { useTree } from '@/store/treeStore'
import type { ISimpleTreeActionable } from '@/types/baseModels'
import { SelectionType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
  selectedNode: ISimpleTreeActionable
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedNodes = ref<number[]>([])
const activeActions = ref(false)
const nodeAddingType = ref('Children')
const nodeTitle = ref('')
const { addNode } = useTree()
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void
  (e: 'nodeAdded', node: ISimpleTreeActionable): void

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

const addNewNode = () => {
  const result = ref(false)
  if (nodeAddingType.value === 'Children')
    result.value = addNode({ id: rand(50, 100), title: nodeTitle.value, parentId: props.selectedNode.id, tempData: null })
  else
    result.value = addNode({ id: rand(100, 150), title: nodeTitle.value, parentId: props.selectedNode.parentId, tempData: null })
  emit('nodeAdded', { id: rand(100, 150), title: nodeTitle.value, parentId: props.selectedNode.parentId, tempData: null })
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn @click="onReset(true)" />
    <VCard variant="flat" :subtitle="`${$t('tree.selectednode')}: ${props.selectedNode.title}`" :title="$t('tree.addnewnode')">
      <MCSearchApiAutoComplete
        v-model:selected-items="selectedNodes" :max-height="400" api-url="/apps/searchsimple" :selection-type="SelectionType.Single" class="pt-1"
        fill-search-phrase-with-selected @search-phrase-changed="dataEntryChanged"
      />
      <VDivider v-if="activeActions" />

      <template #actions>
        <div v-if="activeActions" class="w-100 d-flex justify-center py-2 px-2">
          <VRadioGroup v-model="nodeAddingType" inline>
            <VRadio :label="$t('tree.samelevelnode')" value="Sibling" false-icon="tabler-circle" true-icon="tabler-circle-filled" />
            <VRadio :label="$t('tree.childnode')" value="Children" false-icon="tabler-circle" true-icon="tabler-circle-filled" />
          </VRadioGroup>
          <VBtn type="submit" class="me-3" @click="addNewNode">
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
