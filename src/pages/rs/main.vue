<script setup lang="ts">
    import { Pane, Splitpanes } from 'splitpanes';
    import 'splitpanes/dist/splitpanes.css';

    const menu = ref(false)
    const isComponentSwitch = ref(true)
    function changeWindowTitle(status: boolean) {
        return status ? 'گردآوری اطلاعات' : 'قفسه داده'
    }
</script>

<template>
    <div class="main">
        <Splitpanes style="block-size: calc(100vh - 157px);" :rtl="true" class="default-theme">
            <Pane size="30">
                <MCWindow title="درخت خانواده" class="family-tree" @close="menu = true">
                    <MCMainTree />
                </MCWindow>
            </Pane>

            <Pane>
                <Splitpanes horizontal rtl class="default-theme">
                    <Pane>
                        <MCWindow :title="changeWindowTitle(isComponentSwitch)"
                            @move="isComponentSwitch = !isComponentSwitch">
                            <template #default>
                                <MCMainSearchInfo v-show="isComponentSwitch" />
                                <MCMainDataShelf v-show="isComponentSwitch == false" />
                            </template>
                        </MCWindow>
                    </Pane>

                    <Pane>
                        <MCWindow :title="changeWindowTitle(isComponentSwitch == false)"
                            @move="isComponentSwitch = !isComponentSwitch">
                            <template #default>
                                <MCMainSearchInfo v-show="isComponentSwitch == false" />
                                <MCMainDataShelf v-show="isComponentSwitch" />
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
