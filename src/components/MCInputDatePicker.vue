<script lang="ts" setup>
import { staticPrimaryColor } from '@/plugins/vuetify/theme';
import { useDate } from 'vuetify/lib/framework.mjs';


interface Emit {
    (e: 'update:selectedDate', value: string): void
}
interface Props {
    selectedDate: string
}
const date = useDate()
const draftDate = ref()
const selectedDate = ref(' ');
const isDialogVisible = ref(false)
// const parsedDate = new Date(dateString);
defineProps<Props>()
const emit = defineEmits<Emit>()
// const formatedDate = (dateInputLabel: string) => {
//     if (selectedDate.value != undefined) {
//         console.log('date1', selectedDate.value);

//         if (typeof selectedDate.value == 'string') {
//             // console.log('datestring', date.parseISO('2023-11-30'));

//             // return date.format(selectedDate.value, 'keyboardDate')
//             return selectedDate.value
//         }
//         else {
//             // console.log('date1', selectedDate.value, selectedDate.value == date.parseISO(selectedDate.value));
//             return date.format(selectedDate.value, 'keyboardDate')
//         }

//         // return selectedDate.value
//         //, "fullDateWithWeekday")
//         // console.log('selectedDate', date.format(selectedDate.value, 'keyboardDate'), date.toISO(selectedDate.value));
//     }
//     console.log('date', new Date());

//     return ''
// }

const acceptDate = () => {
    if (draftDate.value != undefined) {
        // if (typeof selectedDate.value == 'string') {
        //     return selectedDate.value
        // }
        // else {
        selectedDate.value = date.format(draftDate.value, 'keyboardDate')
        // }
        emit('update:selectedDate', selectedDate.value)
        // console.log('selectedDate', date.format(selectedDate.value, 'keyboardDate'), date.toISO(selectedDate.value));
    }
    isDialogVisible.value = false
}
const onReset = () => {

    selectedDate.value = '';
    draftDate.value = null
    isDialogVisible.value = false
    emit('update:selectedDate', selectedDate.value)
    // emit('update:isDialogVisible', false)
}
</script>
<!-- :label="formatedDate($t('$vuetify.datePicker.title'))" -->
<!-- @update:model-value="onReset" -->
<template>
    <VDialog width="auto" v-model="isDialogVisible" persistent>
        <template v-slot:activator="{ props: activatorProps }">
            <VTextField v-bind="activatorProps" :value="selectedDate" width="250px"
                :placeholder='$t("$vuetify.datePicker.title")' required clearable></VTextField>
        </template>
        <VCard>
            <!-- <DialogCloseBtn @click="onReset" /> -->
            <VDatePicker v-model="draftDate" :show-adjacent-months="true" :show-current="true" no-title
                :color="staticPrimaryColor">
            </VDatePicker>

            <template v-slot:actions>
                <div class="d-flex align-end w-100">

                    <VBtn :text="$t('accept')" @click="acceptDate"></VBtn>
                    <VBtn :text="$t('cancel')" @click="() => isDialogVisible = false"></VBtn>
                    <VBtn :text="$t('$vuetify.input.clear')" @click="onReset"></VBtn>

                </div>
            </template>
        </VCard>
    </VDialog>
</template>

<!-- <style lang="scss">

</style> -->
