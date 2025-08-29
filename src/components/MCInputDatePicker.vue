<script lang="ts" setup>
import { useDate } from 'vuetify/lib/framework.mjs'

// import { staticPrimaryColor } from '@/plugins/vuetify/theme'
import jMoment from 'moment-jalaali'

interface Emit {
  (e: 'update:selectedDate', value: string): void
}
interface Props {
  selectedDate: string
}

// const parsedDate = new Date(dateString);
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true })

const date = useDate()
const draftDate = ref()

// const selectedDate = ref(' ')
const isDialogVisible = ref(false)

const getTodayJalaali = () => {
  return jMoment()
}

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
const selectToday = () => {
  draftDate.value = getTodayJalaali()
  emit('update:selectedDate', date.format(draftDate.value, 'keyboardDate'))
}

const acceptDate = () => {
  if (draftDate.value !== undefined) {
    // selectedDate.value = date.format(draftDate.value, 'keyboardDate')
    emit('update:selectedDate', date.format(draftDate.value, 'keyboardDate'))
  }
  isDialogVisible.value = false
}

// watch(draftDate, () => {
//   console.log('draftdate', draftDate.value)
// })

const onReset = () => {
//   selectedDate.value = ''
  draftDate.value = null
  isDialogVisible.value = false
  emit('update:selectedDate', '')

  // emit('update:isDialogVisible', false)
}
</script>

<!-- :label="formatedDate($t('$vuetify.datePicker.title'))" -->
<!-- @update:model-value="onReset" -->
<template>
  <VDialog v-model="isDialogVisible" width="auto" persistent>
    <template #activator="{ props: activatorProps }">
      <VTextField
        v-bind="activatorProps" :value="props.selectedDate" width="250px"
        :placeholder="$t('$vuetify.datePicker.title')" required clearable
      />
    </template>
    <VCard>
      <!-- <DialogCloseBtn @click="onReset" /> -->
      <VDatePicker
        v-model="draftDate" show-adjacent-months show-current no-title
        color="primary"
      />

      <template #actions>
        <div class="d-flex align-end w-100">
          <VBtn :text="$t('accept')" @click="acceptDate" />
          <VBtn :text="$t('cancel')" @click="() => isDialogVisible = false" />
          <VBtn :text="$t('$vuetify.input.clear')" @click="onReset" />
          <VBtn :text="$t('today')" @click="selectToday" />
        </div>
      </template>
    </VCard>
  </VDialog>
</template>

<!--
  <style lang="scss">

  </style>
-->
