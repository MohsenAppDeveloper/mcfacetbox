<script setup>
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const items = [{ title: 'Option 1', value: 'Option 1' }, { title: 'Option 2', value: 'Option 2' }, { title: 'Option 3', value: 'Option 3' }]
const menu = ref(false);
</script>

<template>
  <div>
    <Splitpanes style="height: 400px" :rtl="true" class="default-theme">
      <Pane min-size="20" size="30">
        <MCWindow title="درخت خانواده" @open="menu = true" />
      </Pane>

      <Pane>
        <Splitpanes horizontal :rtl="true" class="default-theme">
          <Pane>
            <MCWindow title="گردآوری اطلاعات" @open="menu = true" />
          </Pane>

          <Pane>
            <MCWindow title="قفسه داده" @open="menu = true" />
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>

    <VMenu v-model="menu">
      <VList :items="items" />
    </VMenu>
  </div>
</template>

<style lang="scss"></style>
