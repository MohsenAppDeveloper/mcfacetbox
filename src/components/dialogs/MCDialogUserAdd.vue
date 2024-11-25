<script setup lang="ts">
//!SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue';
import { serviceAdd, serviceUpdate } from '@/services/genericServices';
import { IUser, UserModel } from '@/types/users';
import { useToast } from "vue-toastification";
import type { VForm } from 'vuetify/components/VForm';

const { t } = useI18n({ useScope: 'global' })
const toast = useToast();


interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void
    (e: 'userDataAdded', value: number): void
    (e: 'userDataUpdated', value: number): void

}


const props = defineProps({
    isDialogVisible: { type: Boolean, default: false },
    apiUrl: String,
})
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const userData = reactive<IUser>(new UserModel())
const rolesList = reactive([{ id: 1, title: 'پژوهشگر' }, { id: 2, title: 'مدیر کل' }, { id: 3, title: 'ناظر' }, { id: 4, title: 'ارزیاب یک' }, { id: 5, title: 'ارزیاب دو' }, { id: 6, title: 'مدیر نظارت' }, { id: 7, title: 'خواندنی' }])
const selectedRoles = ref<Number[]>([])

watch(selectedRoles, (newvalue, oldvalue) => {
    userData.role = rolesList.filter((item) => selectedRoles.value.includes(item.id))
})
async function userAdd() {

    const { serviceData, serviceError } = await serviceAdd<IUser>(userData, props.apiUrl == undefined ? '' : props.apiUrl)
    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('userDataAdded', serviceData.value)
        emit('update:isDialogVisible', false)
        nextTick(() => {
            onReset()
        })
    }
    else if (serviceError.value) {
        toast.error(t("alert.dataActionFailed"));
    }
}

async function userEdit() {

    const { serviceData, serviceError } = await serviceUpdate<IUser>(userData, userData.id, props.apiUrl == undefined ? '' : props.apiUrl)
    console.log('gateedit', serviceData.value, serviceError.value);

    if (serviceData.value) {
        toast.success(t("alert.dataActionSuccess"));
        emit('userDataUpdated', serviceData.value)
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
            if (userData.id > 0) {
                userEdit()
            }
            else
                userAdd()

            return;
        }
    })
}
// watch(userData.role, (newdata, olddata) => {
//     console.log('watchuserdata', newdata, olddata);
// })
const onReset = () => {
    userData.id = 0;
    emit('update:isDialogVisible', false)
    refForm.value?.reset()
    refForm.value?.resetValidation()
}

const updateUser = (userDataItem: IUser) => {
    objectMap(userData, useCloned(userDataItem))
    selectedRoles.value = userData.role.map(item => item.id)

}


defineExpose({ updateUser })
</script>

<template>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
        @update:model-value="onReset" persistent>
        <!-- 👉 Dialog close btn -->
        <DialogCloseBtn @click="onReset" :disabled="isloading" />
        <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
        <VCard flat :title="$t('user.addedit')" :subtitle="$t('user.addeditsubtitle')">
            <VCardText>
                <!-- 👉 Form -->
                <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                    <VRow>
                        <!-- 👉 Gate Title-->
                        <VCol cols="12">
                            <AppTextField v-model="userData.fullName"
                                :rules="[requiredValidator(userData.fullName, $t('validatorrequired'))]"
                                :label="$t('nameandfamily')" placeholder="" />
                        </VCol>

                        <VCol cols="12">
                            <VRow>
                                <!-- 👉 Contact -->
                                <VCol cols="12" sm="6">
                                    <AppTextField v-model="userData.contact" type="number"
                                        :rules="[requiredValidator(userData.contact, $t('validatorrequired'))]"
                                        :label="$t('mobilenumber')" placeholder="09xx-xxx-xx-xx" />
                                </VCol>
                                <!-- 👉 Email -->
                                <VCol cols="12" sm="6">
                                    <AppTextField v-model="userData.email"
                                        :rules="[requiredValidator(userData.email, $t('validatorrequired')), emailValidator(userData.email, $t('validatoremail'))]"
                                        :label="$t('email')" placeholder="ٍE-mail" />
                                </VCol>
                            </VRow>

                        </VCol>
                        <VCol cols="12">
                            <VRow>
                                <!-- 👉 Name -->
                                <VCol sm="10" cols="12">
                                    <AppAutocomplete :items="rolesList" v-model="selectedRoles" item-title="title"
                                        item-value="id" :label="$t('role.select')"
                                        :rules="[requiredValidator(userData.role, $t('validatorrequired'))]" chips
                                        closable-chips multiple>

                                    </AppAutocomplete>
                                    <!-- :rules="[requiredValidator(userData.role, $t('validatorrequired'))]"  -->

                                </VCol>

                                <VCol sm="2" cols="12" align-self="end">
                                    <VSwitch v-model="userData.isActive" :label="$t('active')" />
                                </VCol>
                            </VRow>
                        </VCol>
                        <VCol cols="12">
                            <AppTextarea v-model="userData.description" :label="$t('description')"
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
