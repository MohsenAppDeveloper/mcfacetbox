<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import type { IDataShelfBoxView } from '@/types/dataShelf'
import { DataShelfBoxModelView } from '@/types/dataShelf'
import { SizeType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
  selectedDataBoxId: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const loading = ref(false)
const opening = ref(false)
const { t } = useI18n({ useScope: 'global' })
const databoxItem = reactive<DataShelfBoxModelView>(new DataShelfBoxModelView())

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void
}
onMounted(async () => {
  await getDataBoxItem()
})
async function getDataBoxItem() {
  opening.value = true
  try {
    const result = await $api <IDataShelfBoxView>(`app/excerpt/${props.selectedDataBoxId}`, {
      method: 'GET',
    })

    Object.assign(databoxItem, result)
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('errorHasOccured', error.message)
    else emit('errorHasOccured', t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent
  >
    <DialogCloseBtn :disabled="loading" @click="emit('update:isDialogVisible', false)" />

    <VCard variant="flat" :loading="opening" :min-height="200">
      <MCLoading :loadingsize="SizeType.MD" :showloading="opening" />
      <VCardTitle class="primary white--text">
        {{ $t('datashelfbox.about') }}
        <VSpacer />
      </VCardTitle>
      <VDivider />
      <VCardText v-if="databoxItem.id > 0" class="pt-4">
        <div class="d-flex flex-column pb-5">
          <div class="pb-2">
            <span class="px-2 font-weight-bold">{{ $t('contenttype') }} :</span><VChip color="primary" text-color="white">
              {{ databoxItem.excerptType.title }}
            </VChip>
          </div>
          <div class="pb-1">
            <span class="px-2 font-weight-bold">{{ $t('datashelfbox.connectednodesimple') }} :</span><VChip color="primary" text-color="white">
              {{ databoxItem.node?.title }}
            </VChip>
          </div>
          <div v-if="databoxItem.labels.length > 0" class="pb-2">
            <span class="px-2 font-weight-bold">{{ $t('labels') }} :</span>  <VChip v-for="item in databoxItem?.labels" :key="item.id" class="mx-1 my-1" outlined>
              {{ item.title }}
            </VChip>
          </div>

          <div v-if="databoxItem.description?.length ?? 0 > 0" class="pb-2">
            <span class="px-2 font-weight-bold">{{ $t('datashelfbox.comment') }} :</span>
            <p class=" pt-1 pr-3 font-weight-bold font-weight-medium">
              {{ databoxItem.description }}
            </p>
          </div>
          <div v-if="databoxItem.footNotes.length > 0">
            <span class="px-2 font-weight-bold">{{ $t('footnotecount') }} :</span> <VChip color="primary" text-color="white">
              {{ databoxItem.footNotes.length }}
            </VChip>
          </div>
        </div>
        <!-- آمار -->
        <div>
          <div class="d-flex align-center justify-start pb-2">
            <div class="pl-2 font-weight-bold">
              <span>{{ $t('createdate') }}</span>
            </div>
            <div class="pl-2 text-primary">
              <span color="primary">
                {{ databoxItem.creationTime }}
              </span>
            </div>
            <div class="pl-3 font-weight-bold">
              <span>{{ $t('creatoruser') }}</span>
            </div>

            <div class="text-primary ">
              <span>
                {{ databoxItem.creatorFullName }}
              </span>
            </div>
          </div>
          <div class="d-flex align-center justify-start pb-2 w-100">
            <div class="pl-2 font-weight-bold">
              <span> {{ $t('modifieddate') }} :</span>
            </div>
            <div class="pl-2 text-primary">
              {{ databoxItem.lastModificationTime }}
            </div>

            <div class="pl-3 font-weight-bold">
              <span>{{ $t('modifieduser') }} :</span>
            </div>
            <div class="text-primary">
              {{ databoxItem.lastModifierFullName }}
            </div>
          </div>
        </div>
        <!-- </VCardText> -->
      </vcardtext>
    </VCard>
  </VDialog>
</template>
