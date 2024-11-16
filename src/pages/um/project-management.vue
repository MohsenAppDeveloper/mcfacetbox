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
const userApiUrl = '/apps/Project'
const userRoleApiUrl = '/apps/Tree'

const toast = useToast();
// GateHeaders
const projectHeaders = [
    { title: t('nameandfamily'), key: 'fullName' },
    { title: t('mobilenumber'), key: 'contact' },
    { title: t('roles'), key: 'role' },
    { title: t('email'), key: 'email' },
    { title: t('expireDate'), key: 'expireDate' },
    { title: t('description'), key: 'description' },
    { title: t('status'), key: 'isActive', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false },
]
const treeHeaders = [
    { title: t('role.title'), key: 'title' },
    { title: t('permissions'), key: 'permissions' },
    { title: t('createDate'), key: 'createDate' },
    { title: t('status'), key: 'isActive', sortable: false },
    // { title: t('users'), key: 'userType', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false },
]

// 👉 search filters
const roles = [
    { title: 'Admin', value: 'admin' },
    { title: 'Author', value: 'author' },
    { title: 'Editor', value: 'editor' },
    { title: 'Maintainer', value: 'maintainer' },
    { title: 'Subscriber', value: 'subscriber' },
]

const resolveUserRoleVariant = (role: string) => {
    const roleLowerCase = role.toLowerCase()

    if (roleLowerCase === 'subscriber')
        return { color: 'primary', icon: 'tabler-user' }
    if (roleLowerCase === 'author')
        return { color: 'warning', icon: 'tabler-settings' }
    if (roleLowerCase === 'maintainer')
        return { color: 'success', icon: 'tabler-chart-donut' }
    if (roleLowerCase === 'editor')
        return { color: 'info', icon: 'tabler-pencil' }
    if (roleLowerCase === 'admin')
        return { color: 'error', icon: 'tabler-device-laptop' }
    return { color: 'primary', icon: 'tabler-user' }
}


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
const treeDataAdded = (gateDataId: number) => {
    mcdatatableTree.value.refreshData()
}

</script>
<template>
    <section>
        <VRow no-gutters justify="space-between" align="center">
            <div class="page-title"> {{ $t('user.pageTitle') }}</div>

            <VBtn @click="isAddNewProjectDialogVisible = true" prepend-icon="tabler-plus">
                {{ $t('user.add') }}
            </VBtn>
        </VRow>
        <VRow>
            <VCol cols="12">
                <VCard>
                    <VDivider />
                    <MCDataTable ref="mcdatatableProject" :headers="projectHeaders" :api-url="userApiUrl"
                        @edit-item="projectEdit">

                        <template #item.gateTitle="{ value }">
                            <div class="d-flex align-center gap-x-4">
                                <VAvatar size="34" :variant="!value.usersavatar ? 'tonal' : undefined"
                                    :color="!value.usersavatar ? resolveUserRoleVariant(value.userType).color : undefined">
                                    <VImg v-if="value.usersavatar" :src="value.usersavatar" />
                                    <span v-else>{{ avatarText(value.gateTitle) }}</span>
                                </VAvatar>
                                {{ value.gateTitle }}
                            </div>
                            <!-- {{ value + "asdasdasd" }} -->
                        </template>
                        <template #item.isActive="{ value }">
                            <VChip :color="resolveActiveColor(value.isActive)"
                                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                                class="font-weight-medium">
                                {{ $t(resolveActiveTitle(value.isActive)) }}
                            </VChip>
                        </template>
                        <!-- <template #action="{ item }">
                    <span>{{ item.gateTitle }} </span>
                </template> -->
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

                    <MCDataTable ref="mcdatatableTree" :headers="treeHeaders" :api-url="userRoleApiUrl"
                        @edit-item="treeEdit">

                        <template #item.gateTitle="{ value }">
                            <div class="d-flex align-center gap-x-4">
                                <VAvatar size="34" :variant="!value.usersavatar ? 'tonal' : undefined"
                                    :color="!value.usersavatar ? resolveUserRoleVariant(value.userType).color : undefined">
                                    <VImg v-if="value.usersavatar" :src="value.usersavatar" />
                                    <span v-else>{{ avatarText(value.gateTitle) }}</span>
                                </VAvatar>
                                {{ value.gateTitle }}
                            </div>
                            <!-- {{ value + "asdasdasd" }} -->
                        </template>

                        <template #item.isActive="{ value }">
                            <VChip :color="resolveActiveColor(value.isActive)"
                                :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
                                class="font-weight-medium">
                                {{ $t(resolveActiveTitle(value.isActive)) }}
                            </VChip>
                        </template>
                        <!-- <template #action="{ item }">
                    <span>{{ item.gateTitle }} </span>
                </template> -->
                    </MCDataTable>
                </VCard>
            </VCol>
        </VRow>
        <!-- 👉 Add New User -->
        <MCDialogProjectAdd ref="dialogProject" v-model:is-dialog-visible="isAddNewProjectDialogVisible"
            @user-data-added="projectDataAdded" :api-url="userApiUrl" />
        <MCDialogGateAdd ref="dialogTree" v-model:is-dialog-visible="isAddNewTreeDialogVisible"
            @role-data-added="treeDataAdded" :api-url="userRoleApiUrl" />
    </section>
</template>
