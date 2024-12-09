<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import MCMainDataCollection from '@/components/MainDataCollection/MCMainDataCollection.vue'
import MCMainDataShelf from '@/components/MainDataShelf/MCMainDataShelf.vue'

import 'splitpanes/dist/splitpanes.css'

const menu = ref(false)
const isComponentSwitch = ref(true)
const MainDataCollection = ref(MCMainDataCollection)
const mainDataShelf = ref(MCMainDataShelf)

function changeWindowTitle(status: boolean) {
  return status ? 'گردآوری اطلاعات' : 'قفسه داده'
}
</script>

<template>
  <div class="main">
    <Splitpanes
      style="block-size: calc(100vh - 157px);"
      rtl
      class="default-theme"
    >
      <Pane size="30">
        <MCWindow
          title="درخت خانواده"
          class="family-tree"
          @close="menu = true"
        >
          <MCMainTree />
        </MCWindow>
      </Pane>

      <Pane>
        <Splitpanes
          horizontal
          rtl
          class="default-theme"
        >
          <Pane>
            <MCWindow
              :title="changeWindowTitle(isComponentSwitch)"
              @move="isComponentSwitch = !isComponentSwitch"
            >
              <template #default>
                <!-- <component :is="MCMainDataCollection" /> -->
                <MCMainDataCollection style="block-size: 100;" />
              </template>
            </MCWindow>
          </Pane>

          <Pane>
            <MCWindow
              :title="changeWindowTitle(isComponentSwitch === false)"
              @move="isComponentSwitch = !isComponentSwitch"
            >
              <template #default>
                <!-- <component :is="MCMainDataShelf" /> -->
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
