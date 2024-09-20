<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import type { HelpCenterArticle } from '@db/pages/help-center/types'

definePage({
  meta: {
    layout: 'blank',
  },
})

const articleData = ref<HelpCenterArticle>()

setTimeout(async () => {
  const { data, error } = await useApi<any>('/pages/help-center/article')

  if (error.value)
    console.log(error.value)
  else
    articleData.value = data.value
}, 1000)
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="bg-surface help-center-article">
    <!-- 👉 Navbar  -->
    <Navbar />

    <!-- 👉 Content -->
    <VContainer>
      <div
        v-if="articleData && articleData?.title"
        class="article-section"
      >
        <VRow>
          <VCol
            cols="12"
            md="8"
          >
            <div>
              <VBreadcrumbs
                class="px-0 pb-2 pt-0 help-center-breadcrumbs"
                :items="[{ title: 'Help Center', to: { name: 'front-pages-help-center' }, class: 'text-primary' }, { title: 'how to add product in cart' }]"
              />
              <h4 class="text-h4 mb-2">
                {{ articleData?.title }}
              </h4>
              <div class="text-body-1">
                {{ articleData?.lastUpdated }}
              </div>
            </div>
            <VDivider class="my-6" />
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="mb-6 text-body-1"
              v-html="articleData?.productContent"
            />
            <VImg
              class="rounded-lg"
              :src="articleData?.productImg"
            />
            <p class="my-6 text-body-1">
              {{ articleData?.checkoutContent }}
            </p>
            <VImg
              class="rounded-lg"
              :src="articleData?.checkoutImg"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              prepend-inner-icon="tabler-search"
              placeholder="Search..."
              class="mb-6"
            />
            <div>
              <!-- 👉 Article List  -->
              <h5
                class="text-h5 px-6 py-2 mb-4 rounded"
                style="background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));"
              >
                Articles in this section
              </h5>
              <VList class="card-list">
                <VListItem
                  v-for="(item, index) in articleData?.articleList"
                  :key="index"
                  link
                  class="text-disabled"
                >
                  <template #append>
                    <VIcon
                      :icon="$vuetify.locale.isRtl ? 'tabler-chevron-left' : 'tabler-chevron-right'"
                      size="20"
                    />
                  </template>
                  <div class="text-body-1 text-high-emphasis">
                    {{ item }}
                  </div>
                </VListItem>
              </VList>
            </div>
          </VCol>
        </VRow>
      </div>
    </VContainer>

    <!-- 👉 Footer  -->
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.article-section {
  margin-block: 10.5rem 5.25rem;
}

@media (max-width: 600px) {
  .article-section {
    margin-block-start: 6rem;
  }
}

.card-list {
  --v-card-list-gap: 1rem;
}
</style>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .help-center-article {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

.help-center-breadcrumbs {
  &.v-breadcrumbs {
    .v-breadcrumbs-item {
      padding: 0 !important;

      &.v-breadcrumbs-item--disabled {
        opacity: 0.9;
      }
    }
  }
}
</style>
