<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VTreeview } from 'vuetify/labs/VTreeview'
import { VCard, VCardTitle } from 'vuetify/components/VCard'
import { VList, VListItem, VListItemAction } from 'vuetify/components/VList'
import { VCheckbox } from 'vuetify/components/VCheckbox'
import { VTextField } from 'vuetify/components/VTextField'
import { VSwitch } from 'vuetify/components/VSwitch'
import type { IFacetItem } from './types'
import { FacetType, convertFacetItemToFacetTree, isNullOrUndefined, searchItems } from './types'

interface Props {
  dataitems: IFacetItem[]
  searchable: boolean
  facettitle: string
  istree?: boolean
  scrollItemCount?: number
  selectedItems?: string[]
  facettype?: FacetType
  direction?: 'ltr' | 'rtl'
  searchDirection?: 'ltr' | 'rtl'
}
interface Emit {
  (e: 'update:selectedItems', selectdItems: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const treeItems = computed(() => convertFacetItemToFacetTree(props.dataitems))

const effectiveDir = computed<'ltr' | 'rtl'>(() => {
  if (props.direction === 'ltr' || props.direction === 'rtl')
    return props.direction
  const docDir = (typeof document !== 'undefined'
    ? (document.documentElement.getAttribute('dir') || document.body.getAttribute('dir'))
    : '')
  return (docDir === 'rtl' || docDir === 'ltr') ? (docDir as 'ltr' | 'rtl') : 'ltr'
})

const expandIcon = computed(() => effectiveDir.value === 'rtl' ? 'mdi-menu-left' : 'mdi-menu-right')

const selectedTreeFacetItems = ref<string[]>([])
const selectedFacetItems = ref<string[]>([])

const switchState = ref<boolean>((props.dataitems[0]?.key ?? 'false') === 'false')
const searchText = ref('')
const filteredItems = ref<IFacetItem[]>(props.dataitems)

watch(() => props.selectedItems, newVal => {
  if (!newVal || newVal.length === 0)
    return
  if (props.facettype === FacetType.switch) {
    const boolVal = (newVal[0] === 'true')
    if (switchState.value !== boolVal)
      switchState.value = boolVal
  }
  else if (props.facettype === FacetType.tree) {
    if (JSON.stringify(selectedTreeFacetItems.value) !== JSON.stringify(newVal.map(item => item)))
      selectedTreeFacetItems.value = [...newVal].map(item => item)
  }
  else {
    if (JSON.stringify(selectedFacetItems.value) !== JSON.stringify(newVal.map(item => item)))
      selectedFacetItems.value = [...newVal].map(item => item)
  }
}, { immediate: true })

onMounted(() => {
  if (!props.selectedItems || props.selectedItems.length === 0)
    return
  if (props.facettype === FacetType.switch) {
    const boolVal = (props.selectedItems[0] === 'true')
    if (switchState.value !== boolVal)
      switchState.value = boolVal
  }
  else if (props.facettype === FacetType.tree) {
    if (JSON.stringify(selectedTreeFacetItems.value) !== JSON.stringify(props.selectedItems))
      selectedTreeFacetItems.value = [...props.selectedItems].map(item => item)
  }
  else {
    if (JSON.stringify(selectedFacetItems.value) !== JSON.stringify(props.selectedItems))
      selectedFacetItems.value = [...props.selectedItems].map(item => item)
  }
})

watch(filteredItems, () => {
  if ((props.selectedItems?.length ?? 0) > 0) {
    !(props.istree ?? false)
      ? selectedFacetItems.value.push(...(props.selectedItems?.map(item => item.toString()) ?? []))
      : selectedTreeFacetItems.value.push(...(props.selectedItems?.map(item => item.toString()) ?? []))
  }
}, { immediate: true })

watch((selectedTreeFacetItems), newval => {
  emit('update:selectedItems', newval.map(item => item.toString()))
})
watch((selectedFacetItems), newval => {
  emit('update:selectedItems', newval.map(item => item.toString()))
})
watch(switchState, () => {
  emit('update:selectedItems', [String(switchState.value)])
})

function filterItems() {
  if (searchText.value.trim() === '')
    filteredItems.value = props.dataitems

  else
    filteredItems.value = searchItems<IFacetItem>(props.dataitems, searchText.value, 'title')
}
function chagenSwitchValue(_value: boolean | null) {}
function searchinfacet(e: any) {
  searchText.value = (e === null || e === undefined) ? '' : e
  filterItems()
}
</script>

<template>
  <VCard class="mc-facet-box px-1" variant="flat" :dir="effectiveDir">
    <VCardTitle v-if="props.facettype !== FacetType.switch">
      {{ props.facettitle }}
    </VCardTitle>
    <div class="search-container pt-2">
      <VTextField
        v-show="props.searchable"
        placeholder="Search"
        :append-inner-icon="effectiveDir === 'ltr' ? 'tabler-search' : undefined"
        :prepend-inner-icon="effectiveDir === 'rtl' ? 'tabler-search' : undefined"
        :dir="props.searchDirection ?? effectiveDir"
        clearable
        density="compact"
        @update:model-value="searchinfacet"
      />
    </div>

    <VList
      v-if="!(props.istree ?? false) && (isNullOrUndefined(props.facettype) || props.facettype === FacetType.flat)"
      v-model:selected="selectedFacetItems" item-value="key" item-title="title"
      lines="one"
      select-strategy="leaf"
      :return-object="false" :height="(filteredItems.length ?? 10) * 36" :max-height="(props.scrollItemCount ?? 10) * 35"
    >
      <VListItem v-for="item in filteredItems" :key="item.key" :title="item.title" :value="item.key">
        <template #prepend="{ isSelected }">
          <VListItemAction start>
            <VCheckbox :model-value="isSelected" density="compact" />
          </VListItemAction>
        </template>
        <template #append="">
          <span class="px-2">{{ item.count }}</span>
        </template>
      </VListItem>
    </VList>

    <div v-else-if="(props.istree || props.facettype === FacetType.tree)" class="mc-data-scrolly-float" style="--block-size-offset:5px">
      <VTreeview
        v-model:activated="selectedTreeFacetItems" :items="treeItems" :expand-icon="expandIcon" item-value="facetKey"
        item-title="title" min-height="300px" activatable
        density="compact" active-strategy="single-independent"
      />
    </div>
    <div v-else class="d-flex align-center justify-space-between">
      <span class="mx-2">
        {{ `${dataitems[0].title}(${dataitems[0].count})` }}
      </span>
      <VSwitch v-model="switchState" class="pl-2" @update:model-value="chagenSwitchValue" />
    </div>
  </VCard>
</template>

<style lang="scss">
.mc-facet-box
{
   padding: 2px;
   background-color: rgba(var(--v-theme-primary), 0.1) !important;
    .v-card-title {
        font-size: 1em;
        margin-block: 3px;
        margin-inline: 0;
        padding-block: 0;
        padding-inline: 10px;
    }
    .v-text-field {
        padding-block: 0;
        padding-inline: 10px;
    }

    .v-list {
        border-radius: 0;
        background-color: transparent;
        max-block-size: 148px;
        overflow-y: auto;
        padding-block: 4px;
        padding-inline: 0;

        .v-input {
            .v-selection-control {
                margin-inline-end: 0;

                input {
                    block-size: 13px;
                    inline-size: 13px;
                }
            }
        }

        .v-list-item {
            min-block-size: 28px;
            padding: 0;

            .v-list-item-title {
                font-size: 0.9em;
            }

            .v-list-item__prepend {
                .v-list-item__spacer {
                    inline-size: 0;
                }
            }
        }
    }

}

.search-container {
    padding-inline: 10px;
}
</style>
