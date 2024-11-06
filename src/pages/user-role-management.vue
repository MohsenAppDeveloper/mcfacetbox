<script setup lang="ts">
//!SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import MCDataTable from '@/components/MCDataTable.vue';
import { useToast } from "vue-toastification";
import { VCol, VDialog } from 'vuetify/lib/components/index.mjs';


const { t } = useI18n({ useScope: 'global' })
const mcdatatable = ref(MCDataTable)
const dialogGate = ref(VDialog)
const isAddNewUserDialogVisible = ref(false)
const isAddNewRoleDialogVisible = ref(false)

const toast = useToast();
// GateHeaders
const gateHeaders = [
    { title: t('gate.title'), key: 'gateTitle' },
    { title: t('mobilenumber'), key: 'contact' },
    { title: t('nameandfamily'), key: 'nameFamily' },
    { title: t('email'), key: 'email' },
    { title: t('expireDate'), key: 'expireDate' },
    { title: t('status'), key: 'active', sortable: false },
    { title: t('users'), key: 'userType', sortable: false },
    { title: '', key: 'actions', sortable: false },
]

const gateApiUrl = '/apps/gates'

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


const gateEdit = (dataItem: Record<string, any>) => {
    isAddNewUserDialogVisible.value = true
    // gateUpdateActive.value = true
    dialogGate.value.updateGate({ ...dataItem })
    // gateEditDataItem.value = { ...dataItem } ass GateModel
    // console.log('gateedititem', gateEditDataItem.value);

}
const userDataAdded = (gateDataId: number) => {
    mcdatatable.value.refreshData()
}
const roleDataAdded = (gateDataId: number) => {
    mcdatatable.value.refreshData()
}

</script>
<template>
    <section>
        <VRow id="apex-chart-wrapper">

            <VCol cols="12">
                <VCard>
                    <VBtn @click="clickbutton" prepend-icon="tabler-plus">
                        {{ $t('user.add') }}
                    </VBtn>
                    <VDivider />

                    <MCDataTable ref="mcdatatable" :headers="gateHeaders" :api-url="gateApiUrl" @edit-item="gateEdit">

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
                        <!-- <template #action="{ item }">
                    <span>{{ item.gateTitle }} </span>
                </template> -->
                    </MCDataTable>
                </VCard>
            </VCol>
        </VRow>

        <!-- 👉 Statistics -->
        <VRow>
            <VCol cols="12">
                <VCard>
                    <VBtn @click="clickbutton" prepend-icon="tabler-plus">
                        {{ $t('role.add') }}
                    </VBtn>
                    <VDivider />

                    <MCDataTable ref="mcdatatable" :headers="gateHeaders" :api-url="gateApiUrl" @edit-item="gateEdit">

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
                        <!-- <template #action="{ item }">
                    <span>{{ item.gateTitle }} </span>
                </template> -->
                    </MCDataTable>
                </VCard>
            </VCol>
        </VRow>
        <!-- 👉 Add New User -->
        <MCDialogGateAdd ref="dialogUser" v-model:is-dialog-visible="isAddNewUserDialogVisible"
            @gate-data-added="userDataAdded" :gate-api-url="gateApiUrl" />
        <MCDialogGateAdd ref="dialogRole" v-model:is-dialog-visible="isAddNewRoleDialogVisible"
            @gate-data-added="roleDataAdded" :gate-api-url="gateApiUrl" />
    </section>
</template>
