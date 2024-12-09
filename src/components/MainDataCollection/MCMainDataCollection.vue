<script setup lang="ts">
import type { GridResult } from '@/types/baseModels'
import type { ISearchResultTabBox } from '@/types/SearchResult'

const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const searchQuery = ref('')
const resultdataItems = ref<ISearchResultTabBox[]>([])

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse } = useApi<GridResult<ISearchResultTabBox>>(createUrl('/apps/DC', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}), { immediate: false })

setTimeout(async () => {
  try {
    await fetchData(false)
  }
  catch (error) {
    console.log('fetchthrow', error)
  }
}, 3000)

onFetchResponse(response => {
  response.json().then(value => {
    resultdataItems.value.splice(0)
    console.log('resultdata', value)

    resultData.value?.items.forEach(element => {
      resultdataItems.value.push(element)
    })
    console.log('resultdata2', resultdataItems.value)
  })
})

const infoSearch = ref()
function getInfoSearch() { }
</script>

<template>
  <div>
    <VContainer>
      <VRow>
        <VCol
          cols="12"
          md="6"
          class="mx-auto"
        >
          <VTextField
            v-model="infoSearch"
            placeholder="جستجو"
            append-inner-icon="mdi-magnify"
            class="search-bar"
            single-line
            @click:append-inner="getInfoSearch"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VDataIterator
            v-if="!loadingdata"
            :items="resultdataItems"
            :items-per-page="itemsPerPage"
          >
            <template #default="{ items }">
              <MCSearchResultTabBox
                v-for="(item, i) in items"
                :key="i"
                :dataitems="item.raw"
              />
            </template>

            <!--
              <template #footer="{ page, pageCount, prevPage, nextPage }">
              <VFooter v-if="item.content.length > 1">
              <div class="d-flex justify-end w-100">
              <span class="ml-2">Page {{ page }} of {{ pageCount }}</span>
              <VBtn
              :disabled="page === 1"
              class="me-2"
              icon="tabler-arrow-right"
              size="xsmall"
              @click="prevPage"
              />
              <VBtn
              :disabled="page === pageCount"
              icon="tabler-arrow-left"
              size="xsmall"
              @click="nextPage"
              />
              </div>
              </VFooter>
              </template>
            -->
          </VDataIterator>
          <VProgressCircular
            v-else
            size="20"
            width="5"
            indeterminate
          />
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>
