<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IFacetBox } from './types'
import { FacetType } from './types'
import defaults from './defaults'
import { isTree } from './isTree'

// زیرکامپوننت‌ها
import MCFacetFlat from './MCFacetFlat.vue'
// import MCFacetRadio from './MCFacetRadio.vue'
// import MCFacetRange from './MCFacetRange.vue'
import MCFacetSwitch from './MCFacetSwitch.vue'
import MCFacetTree from './MCFacetTree.vue'

import { VTextField } from 'vuetify/components/VTextField'
import { VProgressCircular } from 'vuetify/components/VProgressCircular'
// import { searchItems } from './types'


interface Props {
  facettype: FacetType
  facettitle: string
  dataitems: IFacetBox
  searchable?: boolean
  isLoading?: boolean
  selectedItems?: string[]
  istree?: boolean
  direction?: 'ltr' | 'rtl'
  searchDirection?: 'ltr' | 'rtl'
  searchPlaceholder?: string
}

interface Emit {
  (e: 'update:selectedItems', selected: string[]): void,
  (e: 'search', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// dynamic component map
const componentMap = {
  [FacetType.flat]: MCFacetFlat,
  [FacetType.tree]: MCFacetTree,
  [FacetType.switch]: MCFacetSwitch,
  // [FacetType.radio]: FacetRadio,
  // [FacetType.range]: FacetRange,
}


const facetComponent = (item: IFacetBox) => {
  if (isTree(item)) {
    return MCFacetTree
  }

  return componentMap[props.facettype] ?? MCFacetFlat
}


// owner دیتا نیست، فقط prop
const internalValue = computed({
  get: () => props.selectedItems ?? [],
  set: (val: string[]) => emit('update:selectedItems', val)
})

// direction handling
const effectiveDir = computed<'ltr' | 'rtl'>(() => {
  if (props.direction === 'ltr' || props.direction === 'rtl') return props.direction
  const docDir = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('dir') || document.body.getAttribute('dir')
    : 'ltr'
  return docDir === 'rtl' ? 'rtl' : 'ltr'
})

//search handling
const searchText = ref('')
// const filteredItems = ref<IFacetItem[]>(props.dataitems)

// function filterItems() {
//   if (searchText.value.trim() === '')
//     filteredItems.value = props.dataitems

//   else
//     filteredItems.value = searchItems<IFacetItem>(props.dataitems, searchText.value, 'title')
// }

function searchinfacet(e: any) {
  searchText.value = (e === null || e === undefined) ? '' : e
  // filterItems()
  emit('search', searchText.value)
}

</script>

<template>
  <v-defaults-provider :defaults="defaults">

    <div :dir="effectiveDir" class="mc-facet-box">
      <VCardTitle v-if="props.facettype !== FacetType.switch">
        {{ props.facettitle }}
      </VCardTitle>
      <div class="search-container">
        <VTextField v-show="props.searchable" :placeholder="!searchPlaceholder ? 'Search' : searchPlaceholder"
          :append-inner-icon="effectiveDir === 'ltr' ? 'tabler-search' : undefined"
          :prepend-inner-icon="effectiveDir === 'rtl' ? 'tabler-search' : undefined"
          :dir="props.searchDirection ?? effectiveDir" clearable density="compact" @update:model-value="searchinfacet">

          <template #append-inner>
            <VProgressCircular v-if="isLoading" indeterminate size="20" width="2" />
          </template>
        </VTextField>

      </div>

      <component :is="facetComponent(dataitems)" :title="facettitle" :items="dataitems.itemList" v-model="internalValue"
        :searchable="searchable" :istree="istree" :direction="effectiveDir" :searchDirection="searchDirection" />
    </div>
  </v-defaults-provider>

</template>


<style lang="scss">
.mc-facet-box {
  padding: 2px;
  // background-color: rgba(var(--v-theme-primary), 0.1) !important;

  .v-card-title {
    font-size: 1em;
    margin-block: 3px;
    margin-inline: 0;
    padding-block: 0;
    padding-inline: 10px;
  }

  // .v-text-field {
  //   padding-block: 0;
  //   padding-inline: 10px;
  // }

  .v-list {
    border-radius: 0;
    background-color: transparent;
    max-height: 148px; // max-block-size -> max-height
    overflow-y: auto;
    padding-block: 4px; // یا padding-top/bottom
    padding-inline: 0; // یا padding-left/right

    .v-list-item {
      min-height: 28px; // min-block-size -> min-height
      padding-top: 0;
      padding-bottom: 0;

      .v-list-item-title {
        font-size: 0.9em;
      }

      .v-list-item__prepend {
        .v-list-item__spacer {
          width: 0; // inline-size -> width
        }
      }

      // اگر داخل آیتم، چک‌باکس/رادیو دارید
      .v-input {
        .v-selection-control {
          margin-right: 0; // margin-inline-end -> margin-right

          input {
            height: 13px; // block-size -> height
            width: 13px; // inline-size -> width
          }
        }
      }
    }
  }


}

/* .search-container {
  padding-inline: 10px;
} */
</style>
