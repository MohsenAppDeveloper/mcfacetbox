<script setup lang="ts">
import type { HelpCenterArticlesOverview } from '@db/pages/help-center/types'

interface Props {
  articles: HelpCenterArticlesOverview[]
}

const props = defineProps<Props>()
</script>

<template>
  <VRow v-if="props.articles.length">
    <VCol
      v-for="article in props.articles"
      :key="article.title"
      cols="12"
      md="4"
    >
      <VCard
        flat
        border
      >
        <VCardText class="align-center text-center d-flex flex-column gap-3">
          <img
            :src="article.img"
            alt="svg"
            height="58"
            width="58"
          >

          <h5 class="text-h5">
            {{ article.title }}
          </h5>
          <p class="text-body-1 mb-0">
            {{ article.subtitle }}
          </p>

          <VBtn
            size="small"
            variant="tonal"
            :to="{
              name: 'front-pages-help-center-article-title',
              params: {
                title: 'how-to-add-product-in-cart',
              },
            }"
          >
            Read More
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
