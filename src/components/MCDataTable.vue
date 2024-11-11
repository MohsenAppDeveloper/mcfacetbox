<script lang="ts" setup>
import { serviceDelete } from '@/services/genericServices';
import { baseDataTableModel } from '@/types/baseDataTable';
import Swal from 'sweetalert2';
import { useToast } from "vue-toastification";
import { VDataTableServer } from 'vuetify/lib/components/index.mjs';


const toast = useToast();
// const currentdate = ref('');


const props = defineProps({
    headers: Array<any>,
    apiUrl: { type: String, required: true },
    searchLabel: { type: String, default: '' },
    activeDeleteAction: { type: Boolean, default: true },
    activeEditAction: { type: Boolean, default: true },
})
interface Emit {
    (e: 'deletedItem', value: boolean): void
    (e: 'editItem', value: Record<string, any>): void
}
const emit = defineEmits<Emit>()
// import {useTemplateRef} from vue

class GridResult<T extends baseDataTableModel> {
    page = 0
    totalPages = 0
    totalItems = 0
    items: Array<T> = []
}


const { t } = useI18n({ useScope: 'global' })
const searchQuery = ref('')
const selectedItem = ref<Array<number>>([])
const selectedPlan = ref()
const selectedStatus = ref()
const highlightedItemIndex = ref(0)
const loadingItemIndex = ref(-1)
const datatableItems = ref<Array<baseDataTableModel>>([])

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = (options: any) => {
    sortBy.value = options.sortBy[0]?.key
    orderBy.value = options.sortBy[0]?.order
}

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi<GridResult<baseDataTableModel>>(createUrl(props.apiUrl, {
    query: {
        q: searchQuery,
        status: selectedStatus,
        plan: selectedPlan,
        itemsPerPage,
        page,
        sortBy,
        orderBy,
    },
}), { immediate: false })

setTimeout(async () => {
    try {
        await fetchData(false)
    }
    catch (error) {
        console.log('fetchthrow', error)
    }
}, 1000)

const datatable = ref(VDataTableServer)


onFetchResponse(response => {
    response.json().then(value => {
        datatableItems.value.splice(0)
        resultData.value?.items.forEach((element) => {
            element.disabled = false
            element.isLoading = false
            element.isSelected = false
            element.selectable = true
            datatableItems.value.push(element)
        })
    })
})

onFetchError(error => {
    // console.log('haserror', error)
})


const searchLabelDefault = computed(() => {
    if (props.searchLabel.length > 0)
        return props.searchLabel

    else
        return t('search')
})

const refreshData = () => fetchData(false)
const updateAction = (dataModel: Record<string, any>) => {
    emit("editItem", dataModel)
}

const deleteAction = async (item: baseDataTableModel, index: number) => {

    selectedItem.value.push(item.id);
    Swal.fire({
        titleText: t('alert.deleteSelectedItem?'), confirmButtonText: t('$vuetify.confirmEdit.ok'), cancelButtonText: t('$vuetify.confirmEdit.cancel'), showConfirmButton: true, showCancelButton: true, showLoaderOnConfirm: true, showCloseButton: true,
        preConfirm: async () => {
            const { serviceData, serviceError } = await serviceDelete(item.id, props.apiUrl); console.log('insidemethod', serviceData.value, serviceError.value);
            return { serviceData, serviceError }
        },
        allowOutsideClick: false
    }).then((value) => {
        if (value.isConfirmed) {
            console.log('deletevalue', value);

            if (value.value?.serviceError.value) {
                toast.error(t('alert.deleteDataFailed'));
                emit("deletedItem", false)

            }
            if (value.value?.serviceData.value) {
                refreshData()
                toast.success(t('alert.deleteDataSuccess'));
                emit("deletedItem", true)
            }
            selectedItem.value.splice(index, 1)
        }
    })
    return

}
const updateHighlightedItem = (index: number) => {
    highlightedItemIndex.value = index; // به‌روزرسانی ایندکس هایلایت شده  
};
defineExpose({ refreshData })

</script>

<template>
    <section>
        <VCard>
            <VCardTitle class="d-flex flex-wrap gap-1">
                <div class="d-flex align-center flex-wrap gap-4 ma-2">
                    <!-- 👉 Search  -->
                    <AppTextField v-model="searchQuery" :placeholder="searchLabelDefault"
                        style="inline-size: 15.625rem;" />

                    <!-- 👉 Add user button -->
                    <!--
            <AppSelect v-model="selectedRole" placeholder="Select Role" :items="roles" clearable
            clear-icon="tabler-x" style="inline-size: 10rem;" />
            <MCInputDatePicker v-model:selected-date="currentdate"></MCInputDatePicker>
          -->

                    <VSpacer />
                </div>

                <div class="d-flex gap-2 align-center ma-2 ms-auto ">
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
            </VCardTitle>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer ref="datatable" v-model="selectedItem" item-selectable="selectable"
                v-model:items-per-page="itemsPerPage" v-model:page="page" :items-per-page-options="[
                    { value: 10, title: '10' },
                    { value: 20, title: '20' },
                    { value: 50, title: '50' },
                    { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
                ]" :items="datatableItems" item-value="id"
                :items-length="resultData?.totalItems == undefined ? 0 : resultData.totalItems" :headers="props.headers"
                class="text-no-wrap" height="300" density="compact" :fixed-header="true" show-select
                :loading="loadingdata" @update:options="updateOptions" select-strategy="single">

                <!-- <template v-for="slotName in Object.keys($slots)" #[slotName]="slotScope">
                    <slot :name="slotName" :item="slotScope" />
                </template> -->
                <template v-for="header in props.headers" v-slot:[`item.${header.key}`]="{ item, index }">
                    <slot :name="`item.${header.key}`" :value="item">
                        <div v-if="header.key === 'actions' && (props.activeDeleteAction || props.activeEditAction)">
                            <IconBtn v-show="props.activeDeleteAction" @click="deleteAction(item, index)">
                                <VIcon v-if="!item.isLoading" icon="tabler-trash" />
                                <VProgressCircular size="20" width="3" v-else indeterminate>
                                </VProgressCircular>
                            </IconBtn>
                            <IconBtn v-show="props.activeEditAction" @click="updateAction(item)">
                                <VIcon icon="tabler-eye" />
                            </IconBtn>
                            <slot name="action" :item="item"></slot>
                        </div>
                        <span v-else>{{ item[header.key] }}</span>

                    </slot>
                </template>
                <template #bottom>
                    <TablePagination v-model:page="page" :items-per-page="itemsPerPage"
                        :total-items="resultData?.totalItems == undefined ? 0 : resultData?.totalItems" />
                </template>
            </VDataTableServer>
            <!-- SECTION -->
        </VCard>

        <!-- 👉 Add New User -->
        <!-- <MCDialogGateAdd v-model:is-dialog-visible="isAddNewGateDialogVisible" @user-data="addNewUser" /> -->
    </section>
</template>

<style lang="scss">
.v-card-title {
    padding: 0;
}

.v-data-table__tr:has(td:first-child input[type='checkbox']:checked) {
    background-color: #f2f2f2;

}
</style>
