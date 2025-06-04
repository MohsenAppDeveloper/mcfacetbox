<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { useToast } from 'vue-toastification'
import MCMainDataCollection from '@/components/MainDataCollection/MCMainDataCollection.vue'
import MCMainDataShelf from '@/components/MainDataShelf/MCMainDataShelf.vue'

import 'splitpanes/dist/splitpanes.css'
import { useSelectedTree } from '@/store/treeStore'
import { useNavLinkSelectState } from '@/store/baseStore'

const menu = ref(false)
const isComponentSwitch = ref(false)
const topComponentOrder = ref(2)
const bottomComponentOrder = ref(2)
const dialogSelectTreeVisible = ref(false)
const selectedTreeItem = useSelectedTree()
const navlinkSelecState = useNavLinkSelectState()
const toast = useToast()

const resolveTopComponent = (order: number) => {
  if (order === 1)
    return MCMainDataShelf
  else
    return MCMainDataCollection
}

watch(navlinkSelecState.selectState, () => {
  toast.success(navlinkSelecState.selectState.value.toString())
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

    <Splitpanes style="block-size: calc(100vh - 70px);" rtl class="default-theme">
      <Pane size="30">
        <MCWindow :title="selectedTreeItem.title" @close="menu = true">
          <MCMainTree @show-select-tree="dialogSelectTreeVisible = true" />
          <template #actions>
            <VIcon icon="tabler-status-change" size="18" @click="dialogSelectTreeVisible = true">
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('tree.changeTree') }}
              </VTooltip>
            </VIcon>
          </template>
        </MCWindow>
      </Pane>

      <Pane>
        <Splitpanes horizontal rtl class="default-theme">
          <Pane>
            <MCWindow :title="changeWindowTitle(isComponentSwitch)" @move="changeComponent">
              <template #default>
                <MCMainDataCollection />
              </template>
            </MCWindow>
          </Pane>

          <Pane>
            <MCWindow
              :title="changeWindowTitle(isComponentSwitch === false)"
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
