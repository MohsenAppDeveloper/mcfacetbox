<script setup lang="ts">
//!SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue';
import { serviceAdd, serviceUpdate } from '@/services/genericServices';
import { GateModel, GateProperties } from '@/types/gate';
import { useToast } from "vue-toastification";
import type { VForm } from 'vuetify/components/VForm';

const { t } = useI18n({ useScope: 'global' })
const toast = useToast();


interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void
    (e: 'gateDataAdded', value: number): void
    (e: 'gateDataUpdated', value: number): void

}

const props = defineProps({
    isDialogVisible: Boolean,
    gateApiUrl: String,
})
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isactive = ref(true)
const isloading = ref(false)
let gateData = reactive<GateProperties>(new GateModel())

async function gateAdd() {

    const { serviceData, serviceError } = await serviceAdd<GateProperties>(gateData.value, props.gateApiUrl == undefined ? '' : props.gateApiUrl)
    if (serviceData.value) {
        toast.success(t("dataActionSuccess"));
        emit('gateDataAdded', serviceData.value)
        emit('update:isDialogVisible', false)
        nextTick(() => {
            onReset()
        })
    }
    else if (serviceError.value) {
        toast.error(t("dataActionFailed"));
    }
}

async function gateEdit() {

    const { serviceData, serviceError } = await serviceUpdate<GateProperties>(gateData.value, gateData.value.id, props.gateApiUrl == undefined ? '' : props.gateApiUrl)
    console.log('gateedit', serviceData.value, serviceError.value);

    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('gateDataUpdated', serviceData.value)
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
                if (gateData.value.id > 0) {
                    gateEdit()
                }
                else
                    gateAdd()
            }, 3000);
            return;
        }
    })
}

const onReset = () => {
    gateData.value.id = 0;
    emit('update:isDialogVisible', false)
    refForm.value?.reset()
    refForm.value?.resetValidation()
}

const updateGate = (gateDataItem: GateProperties) => {
    objectMap(gateData, useCloned(gateDataItem))
}


defineExpose({ updateGate })
</script>

<template>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
        @update:model-value="onReset" persistent>
        <!-- 👉 Dialog close btn -->
        <DialogCloseBtn @click="onReset" :disabled="isloading" />
        <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
        <VCard flat :title="$t('gate.addedit')" :subtitle="$t('gate.addeditsubtitle')">
            <VCardText>
                <!-- 👉 Form -->
                <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                    <VRow>
                        <!-- 👉 Gate Title-->
                        <VCol cols="12">
                            <AppTextField v-model="gateData.gateTitle"
                                :rules="[requiredValidator(gateData.gateTitle, $t('validatorrequired'))]"
                                :label="$t('gate.title')" placeholder="" />
                        </VCol>

                        <VCol cols="12">
                            <VRow>
                                <!-- 👉 Contact -->
                                <VCol cols="12" sm="6">
                                    <AppTextField v-model="gateData.contact" type="number"
                                        :rules="[requiredValidator(gateData.contact, $t('validatorrequired'))]"
                                        :label="$t('mobilenumber')" placeholder="09xx-xxx-xx-xx" />
                                </VCol>
                                <!-- 👉 Email -->
                                <VCol cols="12" sm="6">
                                    <AppTextField v-model="gateData.email"
                                        :rules="[requiredValidator(gateData.email, $t('validatorrequired')), emailValidator(gateData.email, $t('validatoremail'))]"
                                        :label="$t('email')" placeholder="ٍE-mail" />
                                </VCol>
                            </VRow>

                        </VCol>
                        <VCol cols="12">
                            <VRow>
                                <!-- 👉 Name -->
                                <VCol sm="6" cols="12">
                                    <AppTextField v-model="gateData.nameFamily"
                                        :rules="[requiredValidator(gateData.nameFamily, $t('validatorrequired'))]"
                                        :label="$t('nameandfamily')" placeholder="" />
                                </VCol>
                                <!-- 👉 UserType -->
                                <VCol sm="4" cols="12">
                                    <AppSelect v-model="gateData.userType" :label="$t('usertype')"
                                        placeholder="Select Role"
                                        :rules="[requiredValidator(gateData.userType, $t('validatorrequired'))]"
                                        :items="['Admin', 'Author', 'Editor', 'Maintainer', 'Subscriber']" />
                                </VCol>
                                <VCol sm="2" cols="12" align-self="end">
                                    <VSwitch v-model="gateData.active" :label="$t('active')" />

                                </VCol>
                            </VRow>
                        </VCol>
                        <VCol cols="12">
                            <AppTextarea v-model="gateData.description" :label="$t('description')"
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
        <!-- </PerfectScrollbar> -->
    </VDialog>

</template>
