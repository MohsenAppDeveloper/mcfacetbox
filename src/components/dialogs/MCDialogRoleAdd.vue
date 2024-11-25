<script setup lang="ts">
//!SECTION این دیالوگ برای افزودن و یا ویرایش یک نقش میباشد
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue';
import { serviceAdd, serviceUpdate } from '@/services/genericServices';
import { ISimpleTree } from '@/types/baseModels';
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
const roleData = reactive<IRole>(new RoleModel())
const projectList = reactive<ISimpleTree[]>([{ id: 1, title: 'موسوعه یک', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: "درخت 9", children: [{ id: 65, title: "درخت 9", children: [{ id: 21, title: "درخت 9", children: [{ id: 54, title: "درخت 9", children: [{ id: 80, title: "درخت 9", children: [{ id: 90, title: "درخت 9", children: [{ id: 19, title: "درخت 9", children: [{ id: 91, title: "درخت 9", }] }] }] }] }] }] }] }] }] }] }])
const permissionList = reactive<ISimpleTree[]>([{ id: 1, title: 'ماژول درخت', children: [{ id: 2, title: 'افزودن نود' }, { id: 3, title: 'جابجایی نود' }] }, { id: 4, title: 'فیش نگار', children: [{ id: 5, title: 'افزودن فیش' }, { id: 6, title: 'اتصال فیش' }] }])
// const selectionType = ref<SelectStrategyProp>('classic')
const selectedPermissions = ref<Number[]>([])
const selectedProjects = ref<Number[]>([])

watch(selectedPermissions, (newvalue, oldvalue) => {
    roleData.permissions = convertSimpleTreeToSimpleDtoArray(permissionList).filter((item) => selectedPermissions.value.includes(item.id))
})
watch(selectedProjects, (newvalue, oldvalue) => {
    roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => selectedProjects.value.includes(item.id))
})


async function roleAdd() {
    console.log('addroledata', roleData);
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
            isloading.value = false
            if (roleData.id > 0) {
                roleEdit()
            }
            else
                roleAdd()
            return;
        }
    })
}

function onReset() {
    roleData.id = 0;
    roleData.permissions.splice(0);
    roleData.projects.splice(0);
    selectedPermissions.value.splice(0)
    selectedProjects.value.splice(0)
    emit('update:isDialogVisible', false);
    refForm.value?.reset();
    refForm.value?.resetValidation();
}

const updateRole = (roleDataItem: IRole) => {
    objectMap(roleData, useCloned(roleDataItem, { deep: true }))
    selectedPermissions.value = roleData.permissions.map(item => item.id)
    selectedProjects.value = roleData.projects.map(item => item.id)
}


defineExpose({ updateRole })
</script>

<template>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
        @update:model-value="onReset" persistent>
        <!-- 👉 Dialog close btn -->
        <DialogCloseBtn @click="onReset" :disabled="isloading" />
        <VCard flat :title="$t('role.addedit')" :subtitle="$t('role.addeditsubtitle')">
            <VCardText>
                <!-- <VBtn type="reset" variant="tonal" color="error" @click="testvmodel" :disabled="isloading">
                    {{ "تست" }}
                </VBtn> -->
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
                                    <VTreeview :items="projectList" v-model:selected="selectedProjects"
                                        expand-icon="mdi-menu-left" item-value="id" item-title="title"
                                        select-strategy='classic' height="300px" width="100%" selectable lines="one">

                                    </VTreeview>
                                </VCol>
                                <VCol cols="6" sm="6">
                                    <VTreeview :items="permissionList" height="300px" width="100%"
                                        v-model:selected="selectedPermissions" item-value="id" item-title="title"
                                        expand-icon="mdi-menu-left" select-strategy="classic" selectable>
                                        <template v-slot:header="{ props }">
                                            <span>jsrs </span>
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
