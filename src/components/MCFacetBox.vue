<script setup lang="ts">
import type { ISimpleSelectableDTO } from '@/types/baseModels';
import { isNull, isUndefined } from '@sindresorhus/is';

interface Props {
  dataitems: ISimpleSelectableDTO[]
  searchable: boolean
  facettitle: string
  selectedItems?: number[]
}
interface Emit {
  (e: 'update:selectedItems', selectdItems: number[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const selectedFacetItems = ref<number[]>([])
const searchText = ref('')
const filteredItems = ref<ISimpleSelectableDTO[]>(props.dataitems)

watch((selectedFacetItems), newval => {
  emit('update:selectedItems', newval)
})

// فیلتر کردن آیتم‌ها بر اساس متن جستجو
function filterItems() {
  if (searchText.value.trim() === '') {
    // اگر ورودی خالی است، نمایش همه آیتم‌ها
    filteredItems.value = props.dataitems
  }
  else {
    // در غیر اینصورت، فیلتر کردن آرایه بر اساس متن
    filteredItems.value = searchItems<ISimpleSelectableDTO>(props.dataitems, searchText.value, 'text')
  }
}

function searchinfacet(e: any) {
  searchText.value = (isNull(e) || isUndefined(e)) ? '' : e
  filterItems()
}
</script>

<template>
  <VCard class="mc-facet-box" variant="flat">
    <VCardTitle>{{ props.facettitle }}</VCardTitle>
    <div class="search-container">
      <VTextField v-show="props.searchable" :placeholder="$t('search')" append-inner-icon="tabler-search" clearable
        @update:model-value="searchinfacet" density='compact' />
    </div>

    <VList v-model:selected="selectedFacetItems" lines="one" select-strategy="leaf" :return-object="false">
      <VListItem v-for="item in filteredItems" :key="item.id" :title="item.text" :value="item.id">
        <template #prepend="{ isSelected }">
          <VListItemAction start>
            <VCheckbox :model-value="isSelected" density='compact' />
          </VListItemAction>
        </template>
      </VListItem>
    </VList>
  </VCard>
</template>
