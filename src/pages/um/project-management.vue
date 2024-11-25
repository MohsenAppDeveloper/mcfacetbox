<script setup lang="ts">
//!SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import MCDataTable from '@/components/MCDataTable.vue';
import { useToast } from "vue-toastification";
import { VCol, VDialog } from 'vuetify/lib/components/index.mjs';


const { t } = useI18n({ useScope: 'global' })
const mcdatatableProject = ref(MCDataTable)
const mcdatatableTree = ref(MCDataTable)
const dialogProject = ref(VDialog)
const dialogTree = ref(VDialog)
const isAddNewProjectDialogVisible = ref(false)
const isAddNewTreeDialogVisible = ref(false)
const projectApiUrl = '/apps/Projects'
const treeApiUrl = '/apps/Tree'

const toast = useToast();
// GateHeaders
const projectHeaders = [
    { title: t('project.title'), key: 'title' },
    { title: t('createDate'), key: 'createDate' },
    { title: t('description'), key: 'description' },
    { title: t('status'), key: 'isActive', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false },
]
const treeHeaders = [
    { title: t('tree.title'), key: 'title' },
    { title: t('description'), key: 'description' },
    { title: t('createDate'), key: 'createDate' },
    { title: t('status'), key: 'isActive', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false },
]

const projectEdit = (dataItem: Record<string, any>) => {
    isAddNewProjectDialogVisible.value = true
    dialogProject.value.updateUser({ ...dataItem })
}

const treeEdit = (dataItem: Record<string, any>) => {
    isAddNewTreeDialogVisible.value = true
    dialogTree.value.updateUser({ ...dataItem })
}

const projectDataAdded = (projectDataId: number) => {
    mcdatatableProject.value.refreshData()
}
const treeDataAdded = (treeDataId: number) => {
    mcdatatableTree.value.refreshData()
}

</script>
<template>
    <section>
        <VRow no-gutters justify="space-between" align="center">
            <div class="page-title"> {{ $t('project.pageTitle') }}</div>

            <VBtn @click="isAddNewProjectDialogVisible = true" prepend-icon="tabler-plus">
                {{ $t('project.add') }}
            </VBtn>
        </VRow>
        <VRow>
            <VCol cols="12">
                <VCard>
                    <VDivider />
                    <MCDataTable ref="mcdatatableProject" :headers="projectHeaders" :api-url="projectApiUrl"
                        @edit-item="projectEdit">
                        <template #item.isActive="{ value }">
                            <VChip :color="resolveActiveColor(value.isActive)"
                                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                                class="font-weight-medium">
                                {{ $t(resolveActiveTitle(value.isActive)) }}
                            </VChip>
                        </template>
                    </MCDataTable>
                </VCard>
            </VCol>
        </VRow>

        <VRow no-gutters justify="space-between" align="center" class="mt-6">
            <div class="page-title"> {{ $t('role.pageTitle') }}</div>
            <VBtn @click="isAddNewTreeDialogVisible = true" prepend-icon="tabler-plus">
                {{ $t('role.add') }}
            </VBtn>
        </VRow>
        <VRow>
            <VCol cols="12">

                <VCard>

                    <MCDataTable ref="mcdatatableTree" :headers="treeHeaders" :api-url="treeApiUrl"
                        @edit-item="treeEdit">
                        <template #item.isActive="{ value }">
                            <VChip :color="resolveActiveColor(value.isActive)"
                                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                                class="font-weight-medium">
                                {{ $t(resolveActiveTitle(value.isActive)) }}
                            </VChip>
                        </template>
                    </MCDataTable>
                </VCard>
            </VCol>
        </VRow>
        <!-- 👉 Add New User -->
        <MCDialogProjectAdd ref="dialogProject" v-model:is-dialog-visible="isAddNewProjectDialogVisible"
            @user-data-added="projectDataAdded" :api-url="projectApiUrl" />
        <MCDialogGateAdd ref="dialogTree" v-model:is-dialog-visible="isAddNewTreeDialogVisible"
            @role-data-added="treeDataAdded" :api-url="treeApiUrl" />
    </section>
</template>
