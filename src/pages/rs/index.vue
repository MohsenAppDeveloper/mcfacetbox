<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { useToast } from 'vue-toastification'
import MCMainDataCollection from '@/components/MainDataCollection/MCMainDataCollection.vue'
import MCMainDataShelf from '@/components/MainDataShelf/MCMainDataShelf.vue'
import useRouterForGlobalVariables from '@/composables/useRouterVariables'

import 'splitpanes/dist/splitpanes.css'
import { useSelectedTree } from '@/store/treeStore'
import { useNavLinkSelectState } from '@/store/baseStore'
import { useShortcutManager } from '@/composables/useShortcutManager'
import { NavLinkStateName } from '@/@layouts/types'

const menu = ref(false)
const topComponentOrder = ref(2)
const bottomComponentOrder = ref(2)
const dialogSelectTreeVisible = ref(false)
const selectedTreeItem = useSelectedTree()
const dialogTreePreviewVisible = shallowRef(false)
const showgathering = shallowRef(true)
const showtree = shallowRef(true)
const showexcerpt = shallowRef(true)

const {
  routerTreeId,
} = useRouterForGlobalVariables()

const navlinkSelecState = useNavLinkSelectState()
const toast = useToast()
const { registerAllShortcuts } = useShortcutManager()

const resolveTopComponent = (order: number) => {
  if (order === 1)
    return MCMainDataShelf
  else
    return MCMainDataCollection
}

registerAllShortcuts()

watch(navlinkSelecState.selectState, () => {
  switch (navlinkSelecState.selectState.value) {
    case NavLinkStateName.showTreePreview:
      dialogTreePreviewVisible.value = true
      break;
    case NavLinkStateName.showExcerpt:
      showexcerpt.value = !showexcerpt.value
      break;
    case NavLinkStateName.showTree:
      showtree.value = !showtree.value
      break;
    case NavLinkStateName.showGathering:
      showgathering.value = !showgathering.value
      break;
    default:
      break;
  }
  navlinkSelecState.selectState.value = NavLinkStateName.None
})

const resolveBottomComponent = (order: number) => {
  if (order === 1)
    return MCMainDataCollection
  else
    return MCMainDataShelf
}

function changeComponent() {
  topComponentOrder.value = (topComponentOrder.value === 1 ? 2 : 1)
  bottomComponentOrder.value = (bottomComponentOrder.value === 1 ? 2 : 1)
}
function changeWindowTitle(status: boolean) {
  return status ? 'قفسه داده' : 'گردآوری اطلاعات'
}
</script>

<template>
  <div class="main">
    <MCDialogSelectTree v-if="dialogSelectTreeVisible" v-model:is-dialog-visible="dialogSelectTreeVisible" />
    <MCDialogTreePreview v-if="dialogTreePreviewVisible" v-model:is-dialog-visible="dialogTreePreviewVisible" :treeid="routerTreeId" />

    <Splitpanes style="block-size: calc(100vh - 70px);" rtl class="default-theme">
      <Pane v-if="showtree" size="30">
        <MCWindow :title="selectedTreeItem.title" @close="menu = true">
          <MCMainTreeV2 @show-select-tree="dialogSelectTreeVisible = true" />
          <template #actions>
            <VTooltip location="right center">
              <template #activator="{ props }">
                <VIcon icon="tabler-status-change" size="18" v-bind="props" @click="dialogSelectTreeVisible = true" />
              </template>
              {{ $t('tree.changeTree') }}
            </VTooltip>
          </template>
        </MCWindow>
      </Pane>

      <Pane>
        <Splitpanes horizontal rtl class="default-theme">
          <Pane v-if="showgathering">
            <MCWindow :title="$t('gathering')" @move="changeComponent">
              <template #default>
                <MCMainDataCollection />
              </template>
            </MCWindow>
          </Pane>

          <Pane v-if="showexcerpt">
            <MCWindow
              :title="$t('excerpts')"
              @move="changeComponent"
            >
              <template #default>
                <MCMainDataShelf />
              </template>
            </MCWindow>
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>

    <!--
      <VMenu v-model="menu">
      <VList :items="items" />
      </VMenu>
    -->
  </div>
</template>
