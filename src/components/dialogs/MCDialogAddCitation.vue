<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { BookReferenceModel, type IReference } from '@/utils/refrenceUtils'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
})

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'citationcreated', citation: IReference | null, footnoteid: string): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const bookcitation = ref<IReference>(new BookReferenceModel())
const footNoteId = ref('')

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid)
      emit('citationcreated', bookcitation.value, footNoteId.value)
  })
}

function editCitation(citation: IReference, footnoteid: string) {
  bookcitation.value = citation
  footNoteId.value = footnoteid
}
defineExpose({ editCitation })
onMounted(async () => {
//   try {
//     opening.value = true
//     await loadRoles()
//     opening.value = false
//   }
//   catch (error) {
//     opening.value = false
//     if (error instanceof CustomFetchError && error.code > 1)
//       toast.error(error.message)
//     else toast.error(t('httpstatuscodes.0'))
//     emit('update:isDialogVisible', false)
//   }
})
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="$emit('citationcreated', null, '')"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="emit('citationcreated', null, '')" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('user.addedit')" :subtitle="$t('user.addeditsubtitle')" class="pa-1">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <VRow>
                <!-- 👉 Contact -->
                <VCol cols="8" sm="6">
                  <AppTextField
                    v-model="bookcitation.bookTitle"
                    :rules="[requiredValidator(bookcitation.bookTitle, $t('validatorrequired'))]"
                    :label="$t('book.title')"
                  />
                </VCol>
                <!-- 👉 Email -->
                <VCol cols="2" sm="4">
                  <AppTextField
                    v-model="bookcitation.volumeNumber"

                    :label="$t('book.volumenumber')" placeholder=""
                  />
                </VCol>
                <VCol cols="2" sm="2">
                  <AppTextField
                    v-model="bookcitation.pageNumber"

                    :label="$t('book.pagenumber')" placeholder=""
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VRow>
                <VCol cols="4" sm="6">
                  <AppTextField
                    v-model="bookcitation.author"
                    :label="$t('book.creator')"
                  />
                </VCol>
                <VCol cols="4" sm="6">
                  <AppTextField
                    v-model="bookcitation.publisher"

                    :label="$t('book.publisher')"
                  />
                </VCol>
                <VCol cols="2" sm="6">
                  <AppTextField
                    v-model="bookcitation.year"

                    :label="$t('book.publishYear')" placeholder=""
                  />
                </VCol>
                <VCol cols="2" sm="6">
                  <AppTextField
                    v-model="bookcitation.city"

                    :label="$t('book.publishplace')" placeholder=""
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VBtn type="submit" class="me-3">
                <span>
                  {{ $t('accept') }}
                </span>
              </VBtn>
              <VBtn type="reset" variant="tonal" color="error" @click="emit('citationcreated', null, '')">
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
