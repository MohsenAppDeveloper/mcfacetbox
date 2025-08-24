<script lang="ts" setup>
import type { GridResult, ISimpleSelectableDTO, SimpleSelectableDTOModel } from '@/types/baseModels'
import { MessageType, SizeType } from '@/types/baseModels'
import { SearchResultConfigModel } from '@/types/SearchResult'

interface Prop {
  isDialogVisible: boolean
  searchResultConfig: SearchResultConfigModel
  locX: number
  locY: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const actionloading = ref(false)
const locx = shallowRef(0)
const locy = shallowRef(0)
const opening = ref(false)
const { t } = useI18n({ useScope: 'global' })
const searchHistoryItems = ref<ISimpleSelectableDTO<number>[]>([])
const tempSearchConfig = ref<SearchResultConfigModel>(new SearchResultConfigModel())
const dialogVisible = shallowRef(false)
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'settinghasbeenselected', setting: SearchResultConfigModel): void

}
onMounted(async () => {
  locx.value = props.locX
  locy.value = props.locY
  await loadSearchHistoryItems()
})

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
}

watch(dialogVisible, () => {
  if (dialogVisible.value === false)
    emit('update:isDialogVisible', false)
})
async function loadSearchHistoryItems() {
  opening.value = true
  try {
    const result = await $api<GridResult<ISimpleSelectableDTO<number>>>(`app/search/simple?Category=${props.searchResultConfig.category}`, {
      method: 'GET',
    })

    searchHistoryItems.value.splice(0)
    Object.assign(searchHistoryItems.value, result.items)
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
}
async function loadSearchHistoryItem(id: number) {
  opening.value = true
  try {
    const result = await $api<SearchResultConfigModel>(`app/search/${id}`, {
      method: 'GET',
    })

    emit('settinghasbeenselected', result)
    onReset(true)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
  finally {
    opening.value = false
  }
}
async function addSearchHistory() {
  if (tempSearchConfig.value.title.length < 2)
    return
  actionloading.value = true

  tempSearchConfig.value.category = props.searchResultConfig.category
  tempSearchConfig.value.setting = props.searchResultConfig.setting
  try {
    await $api('app/search', {
      method: 'POST',
      body: JSON.stringify(tempSearchConfig.value),
    })

    emit('messageHasOccured', t('alert.dataActionSuccess'), MessageType.error)
    await loadSearchHistoryItems()
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
  finally {
    actionloading.value = false
  }
}
async function deleteSearchHistory(item: SimpleSelectableDTOModel<number>) {
  item.loading = true
  try {
    await $api(`app/search/${item.id}`, {
      method: 'DELETE',
    })

    searchHistoryItems.value.splice(searchHistoryItems.value.indexOf(item), 1)
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :target="[locx, locy + 120]" :scrim="false" :scrollable="false" location-strategy="connected" :width="DialogSizeXS"
    :model-value="props.isDialogVisible" @update:model-value="onReset(true)"
  >
    <DialogCloseBtn btn-size="22" :disabled="actionloading" @click="emit('update:isDialogVisible', false)" />

    <VCard variant="flat" :loading="opening" :max-height="200" class="pa-1">
      <!-- <MCLoading :loadingsize="SizeType.MD" :showloading="opening" /> -->
      <VCardTitle class="primary white--text text-body-1">
        {{ $t('searchhistory') }}
        <VSpacer />
      </VCardTitle>
      <VDivider />
      <div class="mc-data-scrolly-float pt-1" style="--block-size-offset: 4px">
        <VTextField
          v-model:model-value="tempSearchConfig.title" autofocus :placeholder="$t('historytitle')"
          clearable density="compact" :disabled="actionloading" class="pb-2" @click:clear="tempSearchConfig.title = ''"
        >
          <template #append>
            <div class="px-2">
              <VBtn variant="elevated" icon="tabler-plus" size="22" :loading="actionloading" @click="addSearchHistory" />
            </div>
          </template>
        </VTextField>
        <div v-for="item in searchHistoryItems" :key="item.id" class="d-flex flex-row justify-space-between mc-list-item-container" @dblclick="loadSearchHistoryItem(item.id)">
          <span class="item-title no-select">{{ item.title }}</span>
          <VBtn icon size="small" variant="text" :loading="item.loading" @click="deleteSearchHistory(item)">
            <VIcon icon="tabler-trash" size="18" color="error" />
            <!--
              <VTooltip
              activator="parent"
              location="top center"
              >
              {{ $t('allHadith') }}
              </VTooltip>
            -->
          </VBtn>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>
