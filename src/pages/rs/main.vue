<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { VTreeview } from 'vuetify/labs/VTreeview';
import { ISimpleTree } from '@/types/baseModels';
const items = [{ title: 'Option 1', value: 'Option 1' }, { title: 'Option 2', value: 'Option 2' }, { title: 'Option 3', value: 'Option 3' }]
const menu = ref(false);
const projectList = reactive<ISimpleTree[]>([{ id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }])
const selectedProjects = ref<Number[]>([])
// watch(selectedProjects, (newvalue, oldvalue) => {
//     roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => selectedProjects.value.includes(item.id))
// })
</script>

<template>
    <div class="main">
        <Splitpanes style="block-size: calc(100vh - 157px);" :rtl="true" class="default-theme">
            <Pane size="30">
                <MCWindow title="درخت خانواده" @open="menu = true" class="family-tree">
                    <VRow no-gutters class="btn-box family-tree-toolbar">
                        <IconBtn @click="" size="small">
                            <VIcon icon="tabler-search" size="22" />
                        </IconBtn>
                        <IconBtn @click="" size="small">
                            <VIcon icon="tabler-select" size="22" />
                        </IconBtn>
                        <IconBtn @click="" size="small">
                            <VIcon icon="tabler-trash-x" size="22" />
                        </IconBtn>

                    </VRow>

                    <VTreeview :items="projectList" v-model:selected="selectedProjects" expand-icon="mdi-menu-left"
                        item-value="id" item-title="title" select-strategy='classic' height="620px" lines="one"
                        selectable>
                        <template v-slot:title="{ item }">
                            <VTooltip :text="item.title">
                                <template v-slot:activator="{ props }">
                                    <span v-bind="props"> {{ item.title }}</span>
                                </template>
                            </VTooltip>
                        </template>
                    </VTreeview>
                </MCWindow>

            </Pane>

            <Pane>
                <Splitpanes horizontal :rtl="true" class="default-theme">
                    <Pane>
                        <MCWindow title="گردآوری اطلاعات" @open="menu = true">
                            <template #default>
                                <VContainer>
                                    <VRow>
                                        <VCol cols="12" md="6" class="mx-auto">
                                            <VTextField v-model="searchQuery" placeholder="جستجو"
                                                append-inner-icon="mdi-magnify" class="search-bar"
                                                @input="performSearch" @click:append-inner="onClick" single-line>
                                            </VTextField>
                                        </VCol>
                                    </VRow>
                                </VContainer>
                                //TODO - تست کامپوننت تب بار، این کد موقتی است
                                <MCSearchResultTabBox></MCSearchResultTabBox>
                            </template>
                        </MCWindow>
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
