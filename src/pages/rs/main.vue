<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
const menu = ref(false);

const infoSearch = ref();
function getInfoSearch() { }
</script>

<template>
    <div class="main">
        <Splitpanes style="block-size: calc(100vh - 157px);" :rtl="true" class="default-theme">
            <Pane size="30">
                <MCWindow title="درخت خانواده" @open="menu = true" class="family-tree">
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
              title="گردآوری اطلاعات"
              @open="menu = true"
            >
              <template #default>
                <VContainer>
                  <VRow>
                    <VCol
                      cols="12"
                      md="6"
                      class="mx-auto"
                    >
                      <VTextField
                        v-model="infoSearch"
                        placeholder="جستجو"
                        append-inner-icon="mdi-magnify"
                        class="search-bar"
                        single-line
                        @click:append-inner="getInfoSearch"
                      />
                    </VCol>
                  </VRow>
                </VContainer>
                //TODO - تست کامپوننت تب بار، این کد موقتی است
                <MCSearchResultTabBox :dataitems="collectingdataitems" />
              </template>
            </MCWindow>
          </Pane>

          <Pane>
            <MCWindow
              title="قفسه داده"
              @open="menu = true"
            />
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
