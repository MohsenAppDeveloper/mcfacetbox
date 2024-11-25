<script setup lang="ts">
//!SECTION این دیالوگ برای افزودن و یا ویرایش یک پروژه میباشد
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue';
import { serviceAdd, serviceUpdate } from '@/services/genericServices';
import { IProject, ProjectModel } from '@/types/project';
import { useToast } from "vue-toastification";
import type { VForm } from 'vuetify/components/VForm';

const { t } = useI18n({ useScope: 'global' })
const toast = useToast();


interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void
    (e: 'projectDataAdded', value: number): void
    (e: 'projectDataUpdated', value: number): void

}


const props = defineProps({
    isDialogVisible: { type: Boolean, default: false },
    apiUrl: String,
})
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const projectData = reactive<IProject>(new ProjectModel())
// const selectedRoles = ref([5, 1])

// watch(() => props.isDialogVisible, (newvalue, oldvalue) => {
//     if (!newvalue) {
//         userData.id = 0;
//     }
// })
async function projectAdd() {

    const { serviceData, serviceError } = await serviceAdd<IProject>(projectData, props.apiUrl == undefined ? '' : props.apiUrl)
    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('projectDataAdded', serviceData.value)
        emit('update:isDialogVisible', false)
        nextTick(() => {
            onReset()
        })
    }
    else if (serviceError.value) {
        toast.error(t("alert.dataActionFailed"));
    }
}

async function projectEdit() {

    const { serviceData, serviceError } = await serviceUpdate<IProject>(projectData, projectData.id, props.apiUrl == undefined ? '' : props.apiUrl)
    console.log('gateedit', serviceData.value, serviceError.value);

    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('projectDataUpdated', serviceData.value)
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
            if (projectData.id > 0) {
                projectEdit()
            }
            else
                projectAdd()
            return;
        }
    })
}
// watch(userData.role, (newdata, olddata) => {
//     console.log('watchuserdata', newdata, olddata);
// })
const onReset = () => {
    projectData.id = 0;
    emit('update:isDialogVisible', false)
    refForm.value?.reset()
    refForm.value?.resetValidation()
}

const updateProject = (projectDataItem: IProject) => {
    objectMap(projectData, useCloned(projectDataItem))
}


defineExpose({ updateProject })
</script>

<template>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
        @update:model-value="onReset" persistent>
        <DialogCloseBtn @click="onReset" :disabled="isloading" />
        <VCard flat :title="$t('project.addedit')" :subtitle="$t('project.addeditsubtitle')">
            <VCardText>
                <!-- 👉 Form -->
                <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                    <VRow>
                        <VCol cols="12">
                            <AppTextField v-model="projectData.title"
                                :rules="[requiredValidator(projectData.title, $t('validatorrequired'))]"
                                :label="$t('project.title')" placeholder="" />
                        </VCol>
                        <VCol cols="12">
                            <VRow>
                                <VCol sm="2" cols="12" align-self="end">
                                    <VSwitch v-model="projectData.isActive" :label="$t('active')" />
                                </VCol>
                            </VRow>
                        </VCol>
                        <VCol cols="12">
                            <AppTextarea v-model="projectData.description" :label="$t('description')"
                                placeholder="Write note here..." :rows="4" />
                        </VCol>
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
        <!-- </PerfectScrollbar> -->
    </VDialog>

</template>
