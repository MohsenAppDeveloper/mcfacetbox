<script setup lang="ts">
import type { HelpCenterAllCategoryArticles } from '@db/pages/help-center/types'

interface Props {
  categories: HelpCenterAllCategoryArticles[]
}

const props = defineProps<Props>()
</script>

<template>
  <VRow>
    <VCol
      v-for="article in props.categories"
      :key="article.title"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard :title="article.title">
        <template #prepend>
          <VAvatar
            rounded
            color="primary"
            variant="tonal"
            size="32"
            class="me-1"
          >
            <VIcon
              :icon="article.icon"
              size="20"
            />
          </VAvatar>
        </template>

        <VCardText>
          <VList class="card-list">
            <VListItem
              v-for="(item, index) in article.articles"
              :key="index"
              class="text-disabled"
            >
              <RouterLink
                :to="{
                  name: 'front-pages-help-center-article-title',
                  params: {
                    title: 'how-to-add-product-in-cart',
                  },
                }"
                class="text-high-emphasis"
              >
                <div>{{ item.title }}</div>
              </RouterLink>
              <template #append>
                <VIcon
                  icon="tabler-chevron-right"
                  class="flip-in-rtl"
                  size="20"
                />
              </template>
            </VListItem>
          </VList>

          <div class="mt-6">
            <RouterLink
              :to="{
                name: 'front-pages-help-center-article-title',
                params: {
                  title: 'how-to-add-product-in-cart',
                },
              }"
              class="text-base d-flex align-center font-weight-medium d-inline-block"
            >
              <span class="d-inline-block">
                See All Articles
              </span>

              <VIcon
                icon="tabler-arrow-right"
                size="18"
                class="ms-3 flip-in-rtl"
              />
            </RouterLink>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 0.5rem;
}
</style>
