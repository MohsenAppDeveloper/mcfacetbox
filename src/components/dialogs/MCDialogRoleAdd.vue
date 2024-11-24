<script setup lang="ts">
//!SECTION این دیالوگ برای افزودن و یا ویرایش یک نقش میباشد
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue';
import { serviceAdd, serviceUpdate } from '@/services/genericServices';
import { ISimpleDTO, ISimpleTree } from '@/types/baseModels';
import { IRole, RoleModel } from '@/types/rolePermission';
import { useToast } from "vue-toastification";
import type { VForm } from 'vuetify/components/VForm';
import { VTreeview } from 'vuetify/labs/VTreeview';


const { t } = useI18n({ useScope: 'global' })
const toast = useToast();


interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void
    (e: 'roleDataAdded', value: number): void
    (e: 'roleDataUpdated', value: number): void

}


const props = defineProps({
    isDialogVisible: { type: Boolean, default: false },
    apiUrl: String,
})
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const treeprojects = ref<ISimpleDTO[]>([])
const roleData = reactive<IRole>(new RoleModel())
const projectList = reactive<ISimpleTree[]>([{ id: 1, title: 'موسوعه یک', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }])
const permissionList = reactive<ISimpleTree[]>([{ id: 1, title: 'ماژول درخت', children: [{ id: 2, title: 'افزودن نود' }, { id: 3, title: 'جابجایی نود' }] }, { id: 4, title: 'فیش نگار', children: [{ id: 5, title: 'افزودن فیش' }, { id: 6, title: 'اتصال فیش' }] }])
// const selectionType = ref<SelectStrategyProp>('classic')
// const selectedRoles = ref([5, 1])

// watch(() => props.isDialogVisible, (newvalue, oldvalue) => {
//     if (!newvalue) {
//         userData.id = 0;
//     }
// })
async function roleAdd() {

    const { serviceData, serviceError } = await serviceAdd<IRole>(roleData, props.apiUrl == undefined ? '' : props.apiUrl)
    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('roleDataAdded', serviceData.value)
        emit('update:isDialogVisible', false)
        nextTick(() => {
            onReset()
        })
    }
    else if (serviceError.value) {
        toast.error(t("alert.dataActionFailed"));
    }
}

async function roleEdit() {

    const { serviceData, serviceError } = await serviceUpdate<IRole>(roleData, roleData.id, props.apiUrl == undefined ? '' : props.apiUrl)

    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('roleDataUpdated', serviceData.value)
        emit('update:isDialogVisible', false)
        nextTick(() => {
            onReset()
        })
    }
    else if (serviceError.value) {
        toast.error(t("alert.dataActionFailed"));
    }
}
const onSubmit = () => {
    refForm.value?.validate().then(({ valid }) => {
        if (valid) {
            isloading.value = true
            setTimeout(() => {
                isloading.value = false
                if (roleData.id > 0) {
                    roleEdit()
                }
                else
                    roleAdd()
            }, 3000);
            return;
        }
    })
}
watch(roleData, (newdata, olddata) => {
    console.log('watchroledata', newdata, olddata);
})
const onReset = () => {
    roleData.id = 0;
    emit('update:isDialogVisible', false)
    refForm.value?.reset()
    refForm.value?.resetValidation()
}

const updateUser = (roleDataItem: IRole) => {
    objectMap(roleData, roleDataItem)
}


defineExpose({ updateUser })
</script>

<template>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
        @update:model-value="onReset" persistent>
        <!-- 👉 Dialog close btn -->
        <DialogCloseBtn @click="onReset" :disabled="isloading" />
        <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
        <VCard flat :title="$t('role.addedit')" :subtitle="$t('role.addeditsubtitle')">
            <VCardText>
                <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                    <VRow>
                        <VCol cols="12">
                            <AppTextField v-model="roleData.title"
                                :rules="[requiredValidator(roleData.title, $t('validatorrequired'))]"
                                :label="$t('role.title')" placeholder="" />
                        </VCol>

                        <VCol cols="12">
                            <VRow>
                                <VCol cols="6" sm="6" style="overflow-x: auto;">
                                    <VTreeview :items="projectList" dir="rtl" v-model="roleData.projects"
                                        expand-icon="mdi-menu-left" item-value="id" item-title="title"
                                        select-strategy='classic' height="300px" lines="one" return-object selectable>
                                        <template v-slot:title="{ item }">
                                            <VTooltip :text="item.title">
                                                <template v-slot:activator="{ props }">
                                                    <span v-bind="props"> {{ item.title }}</span>
                                                </template>
                                            </VTooltip>
                                        </template>
                                    </VTreeview>
                                </VCol>
                                <VCol cols="6" sm="6">
                                    <VTreeview :items="permissionList" height="300px" v-model="roleData.permissions"
                                        item-value="id" item-title="title" expand-icon="mdi-menu-left"
                                        select-strategy="classic" return-object selectable>
                                        <template v-slot:header="{ props }">
                                            <span>jsrs </span>
                                        </template>
                                        <template v-slot:title="{ item }">
                                            <VTooltip :text="item.title">
                                                <template v-slot:activator="{ props }">
                                                    <span v-bind="props"> {{ item.title }}</span>
                                                </template>
                                            </VTooltip>
                                        </template>
                                    </VTreeview>
                                </VCol>
                            </VRow>

                        </VCol>
                        <VCol cols="12">
                            <VRow>
                                <VCol sm="12" cols="12" align-self="end">
                                    <VSwitch v-model="roleData.isActive" :label="$t('active')" />
                                </VCol>
                            </VRow>
                        </VCol>
                        <VCol cols="12">
                            <AppTextarea v-model="roleData.description" :label="$t('description')"
                                placeholder="Write note here..." :rows="4" />
                        </VCol>


                        <!-- 👉 Submit and Cancel -->
                        <VCol cols="12">
                            <VBtn type="submit" class="me-3">
                                <VProgressCircular size="20" width="3" v-if="isloading" indeterminate>
                                </VProgressCircular>
                                <span v-else>
                                    {{ $t('accept') }}
                                </span>
                            </VBtn>
                            <VBtn type="reset" variant="tonal" color="error" @click="onReset" :disabled="isloading">
                                {{ $t('cancel') }}
                            </VBtn>
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>
        </VCard>
    </VDialog>

</template>
<!-- <style lang="css">
.v-treeview-node__label {
    overflow: initial;
    text-overflow: initial;
}

.v-navigation-drawer__content {
    overflow-x: auto;
}
</style> -->
