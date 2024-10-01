<script setup lang="ts">
//!SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm';

import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue';
import type { UserProperties } from '@db/apps/users/types';

interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void
    (e: 'userData', value: UserProperties): void
}

interface Props {
    isDialogVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isactive = ref(true)
const fullName = ref('')
const description = ref('')
const email = ref('')
const gateTitle = ref('')
const country = ref()
const contact = ref('')
const userType = ref()
const plan = ref()
const status = ref()


const onSubmit = () => {
    refForm.value?.validate().then(({ valid }) => {
        if (valid) {
            emit('userData', {
                id: 0,
                fullName: fullName.value,
                company: gateTitle.value,
                role: userType.value,
                country: country.value,
                contact: contact.value,
                email: email.value,
                currentPlan: plan.value,
                status: status.value,
                avatar: '',
                billing: 'Auto Debit',
            })
            emit('update:isDialogVisible', false)
            nextTick(() => {
                refForm.value?.reset()
                refForm.value?.resetValidation()
            })
        }
    })
}

const onReset = () => {
    emit('update:isDialogVisible', false)
    // isSelectAll.value = false
    refForm.value?.reset()
}
</script>

<template>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
        @update:model-value="onReset">
        <!-- 👉 Dialog close btn -->
        <DialogCloseBtn @click="onReset" />
        <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
        <VCard flat :title="$t('gateaddedit')" :subtitle="$t('gateaddeditsubtitle')">
            <VCardText>
                <!-- 👉 Form -->
                <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                    <VRow>
                        <!-- 👉 Gate Title-->
                        <VCol cols="12">
                            <AppTextField v-model="gateTitle"
                                :rules="[requiredValidator(gateTitle, $t('validatorrequired'))]"
                                :label="$t('gatetitle')" placeholder="" />
                        </VCol>

                        <VCol cols="12">
                            <VRow>
                                <!-- 👉 Contact -->
                                <VCol cols="12" sm="6">
                                    <AppTextField v-model="contact" type="number"
                                        :rules="[requiredValidator(contact, $t('validatorrequired'))]"
                                        :label="$t('mobilenumber')" placeholder="09xx-xxx-xx-xx" />
                                </VCol>
                                <!-- 👉 Email -->
                                <VCol cols="12" sm="6">
                                    <AppTextField v-model="email"
                                        :rules="[requiredValidator(email, $t('validatorrequired')), emailValidator(email, $t('validatoremail'))]"
                                        :label="$t('email')" placeholder="ٍE-mail" />
                                </VCol>
                            </VRow>

                        </VCol>
                        <VCol cols="12">
                            <VRow>
                                <!-- 👉 Name -->
                                <VCol sm="6" cols="12">
                                    <AppTextField v-model="fullName"
                                        :rules="[requiredValidator(fullName, $t('validatorrequired'))]"
                                        :label="$t('nameandfamily')" placeholder="" />
                                </VCol>
                                <!-- 👉 UserType -->
                                <VCol sm="4" cols="12">
                                    <AppSelect v-model="userType" :label="$t('usertype')" placeholder="Select Role"
                                        :rules="[requiredValidator(userType, $t('validatorrequired'))]"
                                        :items="['Admin', 'Author', 'Editor', 'Maintainer', 'Subscriber']" />
                                </VCol>
                                <VCol sm="2" cols="12" align-self="end">
                                    <VSwitch v-model="isactive" :label="$t('active')" />

                                </VCol>
                            </VRow>
                        </VCol>
                        <VCol cols="12">
                            <AppTextarea v-model="description" :label="$t('description')"
                                placeholder="Write note here..." :rows="4" />
                        </VCol>


                        <!-- 👉 Submit and Cancel -->
                        <VCol cols="12">
                            <VBtn type="submit" class="me-3">
                                {{ $t('accept') }}
                            </VBtn>
                            <VBtn type="reset" variant="tonal" color="error" @click="onReset">
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
