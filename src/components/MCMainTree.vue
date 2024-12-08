<script setup lang="ts">
import { VTreeview } from 'vuetify/labs/VTreeview';
import { ISimpleTree } from '@/types/baseModels';
const items = [{ title: 'Option 1', value: 'Option 1' }, { title: 'Option 2', value: 'Option 2' }, { title: 'Option 3', value: 'Option 3' }]
const projectList = reactive<ISimpleTree[]>([{ id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }])
const selectedProjects = ref<Number[]>([])
// watch(selectedProjects, (newvalue, oldvalue) => {
//     roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => selectedProjects.value.includes(item.id))
// })
const props = defineProps({
    title: { type: String },
})

interface Emit {
    (e: 'close'): void; // ایونت جدید close اضافه شد
    (e: 'open'): void; // ایونت جدید close اضافه شد
}

const emit = defineEmits<Emit>();
</script>

<template>
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

    <VTreeview :items="projectList" v-model:selected="selectedProjects" expand-icon="mdi-menu-left" item-value="id"
        item-title="title" select-strategy='classic' style="block-size: calc(100vh - 267px);" lines="one" selectable>
        <template v-slot:title="{ item }">
            <VTooltip :text="item.title">
                <template v-slot:activator="{ props }">
                    <span v-bind="props"> {{ item.title }}</span>
                </template>
            </VTooltip>
        </template>
    </VTreeview>
</template>

<style lang="scss"></style>
