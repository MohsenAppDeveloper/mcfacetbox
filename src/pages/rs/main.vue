<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import MCMainDataCollection from '@/components/MainDataCollection/MCMainDataCollection.vue'
import MCMainDataShelf from '@/components/MainDataShelf/MCMainDataShelf.vue'

import 'splitpanes/dist/splitpanes.css'

const menu = ref(false)
const isComponentSwitch = ref(false)
const topComponentOrder = ref(2)
const bottomComponentOrder = ref(2)

const resolveTopComponent = (order: number) => {
  if (order === 1)
    return MCMainDataShelf
  else
    return MCMainDataCollection
}

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
  return status ? 'گردآوری اطلاعات' : 'قفسه داده'
}
</script>

<template>
  <div class="main">
    <Splitpanes style="block-size: calc(100vh - 70px);" rtl class="default-theme">
      <Pane size="30">
        <MCWindow title="درخت خانواده" class="family-tree" @close="menu = true">
          <MCMainTree />
        </MCWindow>
      </Pane>

      <Pane>
        <Splitpanes horizontal rtl class="default-theme">
          <Pane>
            <MCWindow :title="changeWindowTitle(isComponentSwitch)" @move="changeComponent">
              <template #default>
                <KeepAlive>
                  <component :is="resolveTopComponent(topComponentOrder)" />
                </KeepAlive>
                <!-- <MCMainDataCollection /> -->
              </template>
            </MCWindow>
          </Pane>

          <Pane>
            <MCWindow
              :title="changeWindowTitle(isComponentSwitch === false)"
              @move="changeComponent"
            >
              <template #default>
                <KeepAlive>
                  <component :is="resolveBottomComponent(bottomComponentOrder)" />
                </KeepAlive>
                <!-- <MCMainDataShelf /> -->
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
