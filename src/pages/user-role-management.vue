<script setup lang="ts">
//!SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import MCDataTable from '@/components/MCDataTable.vue';
import { useToast } from "vue-toastification";
import { VCol, VDialog } from 'vuetify/lib/components/index.mjs';


const { t } = useI18n({ useScope: 'global' })
const mcdatatableUser = ref(MCDataTable)
const mcdatatableUserRole = ref(MCDataTable)
const dialogUser = ref(VDialog)
const dialogUserRole = ref(VDialog)
const isAddNewUserDialogVisible = ref(false)
const isAddNewRoleDialogVisible = ref(false)
const userApiUrl = '/apps/users'
const userRoleApiUrl = '/apps/gates'

const toast = useToast();
// GateHeaders
const userHeaders = [
    { title: t('nameandfamily'), key: 'fullName' },
    { title: t('mobilenumber'), key: 'contact' },
    { title: t('roles'), key: 'role' },
    { title: t('email'), key: 'email' },
    { title: t('expireDate'), key: 'expireDate' },
    { title: t('description'), key: 'description' },
    { title: t('status'), key: 'isActive', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false },
]
const gateHeaders = [
    { title: t('gate.title'), key: 'gateTitle' },
    { title: t('mobilenumber'), key: 'contact' },
    { title: t('nameandfamily'), key: 'nameFamily' },
    { title: t('email'), key: 'email' },
    { title: t('expireDate'), key: 'expireDate' },
    { title: t('status'), key: 'active', sortable: false },
    { title: t('users'), key: 'userType', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false },
]


function clickbutton() {
    isAddNewUserDialogVisible.value = true;
}

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


const userEdit = (dataItem: Record<string, any>) => {
    isAddNewUserDialogVisible.value = true
    // gateUpdateActive.value = true
    dialogUser.value.updateUser({ ...dataItem })
    // gateEditDataItem.value = { ...dataItem } ass GateModel
    // console.log('gateedititem', gateEditDataItem.value);

}
const userDataAdded = (gateDataId: number) => {
    mcdatatableUser.value.refreshData()
}
const roleDataAdded = (gateDataId: number) => {
    mcdatatableUserRole.value.refreshData()
}

</script>
<template>
    <section>
        <VRow no-gutters justify="space-between" align="center">
            <div class="page-title"> {{ $t('user.pageTitle') }}</div>

            <VBtn @click="clickbutton" prepend-icon="tabler-plus">
                {{ $t('user.add') }}
            </VBtn>
        </VRow>
        <VRow id="apex-chart-wrapper">

            <VCol cols="12">
                <VCard>

                    <VDivider />

                    <MCDataTable ref="mcdatatableUser" :headers="userHeaders" :api-url="userApiUrl"
                        @edit-item="userEdit">

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

        <!-- 👉 Statistics -->
        <VRow no-gutters justify="space-between" align="center" class="mt-6">
            <div class="page-title"> {{ $t('role.pageTitle') }}</div>
            <VBtn @click="clickbutton" prepend-icon="tabler-plus">
                {{ $t('role.add') }}
            </VBtn>
        </VRow>
        <VRow>
            <VCol cols="12">

                <VCard>

                    <MCDataTable ref="mcdatatableUserRole" :headers="userHeaders" :api-url="userRoleApiUrl"
                        @edit-item="userEdit">

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

                        <template #item.active="{ value }">
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
        <MCDialogUserAdd ref="dialogUser" v-model:is-dialog-visible="isAddNewUserDialogVisible"
            @user-data-added="userDataAdded" :api-url="userApiUrl" />
        <MCDialogGateAdd ref="dialogRole" v-model:is-dialog-visible="isAddNewRoleDialogVisible"
            @role-data-added="roleDataAdded" :api-url="userRoleApiUrl" />
    </section>
</template>
