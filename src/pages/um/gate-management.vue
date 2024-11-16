<script setup lang="ts">
//!SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import MCDataTable from '@/components/MCDataTable.vue';
import { GateModel } from '@/types/gate';
import ApexChartAreaChart from '@/views/charts/apex-chart/ApexChartAreaChart.vue';
import ApexChartStatistics from '@/views/charts/apex-chart/ApexChartStatistics.vue';
import { VDialog } from 'vuetify/lib/components/index.mjs';


const { t } = useI18n({ useScope: 'global' })
const mcdatatable = ref(MCDataTable)
let gateEditDataItem = ref<Record<string, any>>(new GateModel())
const dialogGate = ref(VDialog)
const isAddNewGateDialogVisible = ref(false)

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
    isAddNewGateDialogVisible.value = true;
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
    isAddNewGateDialogVisible.value = true
    dialogGate.value.updateGate({ ...dataItem })


}
const gateDataAdded = (gateDataId: number) => {
    mcdatatable.value.refreshData()
}


</script>
<template>
    <section>
        <VRow no-gutters justify="space-between" align="center">
            <div class="page-title"> {{ $t('gate.pageTitle') }}</div>

            <VBtn @click="clickbutton" prepend-icon="tabler-plus">
                {{ $t('gate.add') }}
            </VBtn>
        </VRow>

        <VRow id="apex-chart-wrapper">

            <VCol cols="12" md="4">
                <VCard title="Statistics">
                    <VCardText>
                        <ApexChartStatistics />
                    </VCardText>
                </VCard>
            </VCol>
            <!-- 👉  Area chart -->
            <VCol cols="12" md="8">
                <VCard>
                    <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
                        <VCardTitle>Area Chart</VCardTitle>
                        <VCardSubtitle>Commercial networks</VCardSubtitle>

                        <template #append>
                            <div class="date-picker-wrapper">
                                <AppDateTimePicker model-value="2022-06-09" prepend-inner-icon="tabler-calendar"
                                    placeholder="Select Date"
                                    :config="$vuetify.display.smAndDown ? { position: 'auto center' } : { position: 'auto right' }" />
                            </div>
                        </template>
                    </VCardItem>

                    <VCardText>
                        <ApexChartAreaChart />
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>

        <!-- 👉 Statistics -->
        <VRow>
            <VCol cols="12">
                <VCard>

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
        <MCDialogGateAdd ref="dialogGate" v-model:is-dialog-visible="isAddNewGateDialogVisible"
            @gate-data-added="gateDataAdded" :gate-data="gateEditDataItem" :is-update-mode="false"
            :gate-api-url="gateApiUrl" />
    </section>
</template>
