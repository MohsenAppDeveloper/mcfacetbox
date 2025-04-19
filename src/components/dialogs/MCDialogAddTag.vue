<script lang="ts" setup>
import { SelectionType, SizeType } from '@/types/baseModels'
import { NodeType } from '@/types/tree'

interface Prop {
  isDialogVisible: boolean
  selectedDataBoxId: number
  locX: number
  locY: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const selectedNodes = ref<number[]>([])
const activeActions = ref(false)
const nodeAddingType = ref(NodeType.SiblingAfter)
const searchPhrase = ref('')
const loading = ref(false)

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void

  //   (e: 'nodeAdded', node: ISimpleTreeActionable): void
  //   (e: 'nodeAddedFailed', message: string): void

}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  activeActions.value = false
}

// watch(selectedNodes, () => {
//   console.log('selectednode', selectedNodes.value)
// })
function dataEntryChanged(phrase: string) {
  searchPhrase.value = phrase
  if (phrase.length > 0)
    activeActions.value = true
  else
    activeActions.value = false
}

const addNewNode = async () => {
//   const result = ref(false)

  //   loading.value = true
  //   try {
  //     const resultid = await $api(`app/node/${getNodeTypeNameSpace(nodeAddingType.value)}`, {
  //       method: 'POST',
  //       body: JSON.parse(JSON.stringify(new NodeNewModel(props.selectedTreeId, props.selectedNode.id, searchPhrase.value))),
  //       ignoreResponseError: false,
  //     })

  //     addNode({ id: resultid, title: searchPhrase.value, parentId: props.selectedNode.id, tempData: null, priority: 0 }, props.selectedNode.id, nodeAddingType.value)

  //     // if (nodeAddingType.value === 'Children')
  //     //   result.value = addNode({ id: resultid, title: searchPhrase.value, parentId: props.selectedNode.id, tempData: null, priority: 0 })
  //     // else
  //     //   result.value = addNode({ id: resultid, title: searchPhrase.value, parentId: props.selectedNode.parentId, tempData: null, priority: 0 })
  //     emit('nodeAdded', new SimpleTreeAcionableModel(resultid, searchPhrase.value, props.selectedNode.id))
  //     loading.value = false
  //   }
  //   catch (error) {
  //     loading.value = false

//     if (error instanceof CustomFetchError && error.code > 0)
//       emit('nodeAddedFailed', error.message)
//     else emit('nodeAddedFailed', t('alert.probleminnodeaddrefreshpage'))
//   }
}

const addRootNode = () => {

}
</script>

<template>
  <VDialog
    :scrim="false"
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeXS" :model-value="props.isDialogVisible"
    :target="[locX, locY]" location-strategy="connected" @update:model-value="onReset(true)"
  >
    <DialogCloseBtn icon-size="16px" :disabled="loading" @click="onReset(true)" />
    <VCard variant="flat" class="v-card-sm" :title="$t('datashelfbox.addtag')">
      <MCSearchApiAutoComplete
        v-model:selected-items="selectedNodes"
        auto-focus :max-height="200" api-url="app/node/simple?treeid=9" :selection-type="SelectionType.Multiple" class="pt-0"
        fill-search-phrase-with-selected :list-item-size="SizeType.SM" load-all-list @search-phrase-changed="dataEntryChanged"
      />
      <VDivider />

      <template #actions>
        <div class="w-100 d-flex justify-center py-1 px-1">
          <VBtn type="submit" class="me-3" :loading="loading" :disabled="!(searchPhrase.length > 0 || selectedNodes.length > 0)" @click="addNewNode">
            <span>
              {{ $t('add') }}
            </span>
          </VBtn>
        </div>
      </template>
    </VCard>
  </VDialog>
</template>
