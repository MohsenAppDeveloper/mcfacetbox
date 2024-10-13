<script setup lang="ts">
//!SECTION این فرم برای مدیریت پنل ها در این سامانه میباشد
import MCInputDatePicker from '@/components/MCInputDatePicker.vue';
import type { UserProperties } from '@db/apps/users/types';

import { FetchError } from 'ofetch';
class GridResult<T> {
    page = 0;
    totalPages = 0;
    totalItems = 0;
    items: Array<T> = [];

}
// 👉 Store
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
// const dealDuration = ref()
// selecteddate.value = new Date()
// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const currentdate = ref('');

// selecteddate.value = new Date().toISOString().substring(0, 10);
// Update data table options
const updateOptions = (options: any) => {
    sortBy.value = options.sortBy[0]?.key
    orderBy.value = options.sortBy[0]?.order
}

// Headers
const headers = [
    { title: 'User', key: 'user' },
    { title: 'Role', key: 'role' },
    { title: 'Plan', key: 'plan' },
    { title: 'Billing', key: 'billing' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
]
// 👉 Fetching users
const { data: resultData, execute: fetchUsers, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi<GridResult<UserProperties>>(createUrl('/apps/users', {
    query: {
        q: searchQuery,
        status: selectedStatus,
        plan: selectedPlan,
        role: selectedRole,
        itemsPerPage,
        page,
        sortBy,
        orderBy,
    },
}), { immediate: false })

try {
    await fetchUsers(false)
} catch (error) {
    console.log('fetchthrow', error);
}

// await useApi<GridResult<UserProperties>>(createUrl('/apps/users'),(
//     options: {
//     immediate: false,
// }
// )
watch(currentdate, async (newdata, olddata) => {
    console.log('newcurrentDate', newdata);
    console.log('oldcurrentDate', olddata);

})
onFetchResponse((response) => {
    console.log('hasresponse', response)
})

onFetchError((error) => {
    console.log('haserror', error)
})
const users = computed((): UserProperties[] => {
    if (resultData.value) {
        return resultData.value.items
    }
    else
        return new Array<UserProperties>();
})
const totalUsers = computed(() => {
    if (resultData.value) {
        return resultData.value.totalItems
    }
    else
        return 0;
})
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

const resolveUserStatusVariant = (stat: string) => {
    const statLowerCase = stat.toLowerCase()
    if (statLowerCase === 'pending')
        return 'warning'
    if (statLowerCase === 'active')
        return 'success'
    if (statLowerCase === 'inactive')
        return 'secondary'

    return 'primary'
}

const isAddNewGateDialogVisible = ref(false)

// 👉 Add new user
const addNewUser = async (userData: UserProperties) => {
    try {
        await $api('/apps/userss', {
            method: 'POST',
            body: userData,
            ignoreResponseError: false
        }).then((responce) => {
            console.log('addsuccess', responce);
        }, (error) => {
            const temp = (error as FetchError)
            // console.log('adderror', temp.statusCode, temp.message, temp.name);
        }).catch((error) => {
            console.log('addusercatch', error.data);
        })
    } catch (error) {
        console.log('catchnewuser', error);
    }
    // .catch((error) => {

    // })

    // refetch User
    // fetchUsers2()
}

// 👉 Delete user
const deleteUser = async (id: number) => {
    await $api(`/apps/users/${id}`, {
        method: 'DELETE',
    })

    // refetch User
    // TODO: Make this async
    // fetchUsers2()
}
</script>
<template>
    <section>
        <VCard>
            <VCardText class="d-flex flex-wrap gap-4">

                <div class="d-flex align-center flex-wrap gap-4 ma-2">
                    <!-- 👉 Search  -->
                    <AppTextField v-model="searchQuery" :placeholder="$t('gatesearchtitle')"
                        style="inline-size: 15.625rem;" />

                    <!-- 👉 Add user button -->
                    <AppSelect v-model="selectedRole" placeholder="Select Role" :items="roles" clearable
                        clear-icon="tabler-x" style="inline-size: 10rem;" />
                    <MCInputDatePicker v-model:selected-date="currentdate"></MCInputDatePicker>

                    <VSpacer />
                </div>

                <div class="d-flex gap-2 align-center ma-2 ms-auto ">
                    <!-- <VBtn @click="clickbutton">
                        TestLoad
                    </VBtn> -->
                    <p class="text-body-1 mb-0">
                        {{ $t('Show') }}
                    </p>
                    <AppSelect :model-value="itemsPerPage" :items="[
                        { value: 10, title: '10' },
                        { value: 25, title: '25' },
                        { value: 50, title: '50' },
                        { value: 100, title: '100' },
                        { value: -1, title: 'All' },
                    ]" style="inline-size: 5.5rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
                </div>
            </VCardText>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items-per-page-options="[
                { value: 10, title: '10' },
                { value: 20, title: '20' },
                { value: 50, title: '50' },
                { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
            ]" :items="users" :items-length="totalUsers" :headers="headers" class="text-no-wrap" show-select
                @update:options="updateOptions" :loading="loadingdata">
                <!-- User -->
                <template #item.user="{ item }">
                    <div class="d-flex align-center gap-x-4">
                        <VAvatar size="34" :variant="!item.avatar ? 'tonal' : undefined"
                            :color="!item.avatar ? resolveUserRoleVariant(item.role).color : undefined">
                            <VImg v-if="item.avatar" :src="item.avatar" />
                            <span v-else>{{ avatarText(item.fullName) }}</span>
                        </VAvatar>
                        <div class="d-flex flex-column">
                            <h6 class="text-base">
                                <RouterLink :to="{ name: 'apps-user-view-id', params: { id: item.id } }"
                                    class="font-weight-medium text-link">
                                    {{ item.fullName }}
                                </RouterLink>
                            </h6>
                            <div class="text-sm">
                                {{ item.email }}
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 👉 Role -->
                <template #item.role="{ item }">
                    <div class="d-flex align-center gap-x-2">
                        <VIcon :size="22" :icon="resolveUserRoleVariant(item.role).icon"
                            :color="resolveUserRoleVariant(item.role).color" />

                        <div class="text-capitalize text-high-emphasis text-body-1">
                            {{ item.role }}
                        </div>
                    </div>
                </template>

                <!-- Plan -->
                <template #item.plan="{ item }">
                    <div class="text-body-1 text-high-emphasis text-capitalize">
                        {{ item.currentPlan }}
                    </div>
                </template>

                <!-- Status -->
                <template #item.status="{ item }">
                    <VChip :color="resolveUserStatusVariant(item.status)" size="small" label class="text-capitalize">
                        {{ item.status }}
                    </VChip>
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">
                    <IconBtn @click="deleteUser(item.id)">
                        <VIcon icon="tabler-trash" />
                    </IconBtn>

                    <IconBtn>
                        <VIcon icon="tabler-eye" />
                    </IconBtn>

                    <VBtn icon variant="text" color="medium-emphasis">
                        <VIcon icon="tabler-dots-vertical" />
                        <VMenu activator="parent">
                            <VList>
                                <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.id } }">
                                    <template #prepend>
                                        <VIcon icon="tabler-eye" />
                                    </template>

                                    <VListItemTitle>View</VListItemTitle>
                                </VListItem>

                                <VListItem link>
                                    <template #prepend>
                                        <VIcon icon="tabler-pencil" />
                                    </template>
                                    <VListItemTitle>Edit</VListItemTitle>
                                </VListItem>

                                <VListItem @click="deleteUser(item.id)">
                                    <template #prepend>
                                        <VIcon icon="tabler-trash" />
                                    </template>
                                    <VListItemTitle>Delete</VListItemTitle>
                                </VListItem>
                            </VList>
                        </VMenu>
                    </VBtn>
                </template>

                <template #bottom>
                    <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalUsers" />
                </template>
            </VDataTableServer>
            <!-- SECTION -->
        </VCard>

        <!-- 👉 Add New User -->
        <MCDialogGateAdd v-model:is-dialog-visible="isAddNewGateDialogVisible" @user-data="addNewUser" />
    </section>
</template>
