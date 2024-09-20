<script setup lang="ts">
import type { HelpCenterAllCategoryArticles, HelpCenterArticlesOverview } from '@db/pages/help-center/types'

import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'

import HelpCenterLandingArticlesOverview from '@/views/pages/help-center/HelpCenterLandingArticlesOverview.vue'
import HelpCenterLandingFooter from '@/views/pages/help-center/HelpCenterLandingFooter.vue'
import HelpCenterLandingKnowledgeBase from '@/views/pages/help-center/HelpCenterLandingKnowledgeBase.vue'

definePage({
  meta: {
    layout: 'blank',
  },
})

interface ApiDataType {
  keepLearning: HelpCenterArticlesOverview[]
  popularArticles: HelpCenterArticlesOverview[]
  allArticles: HelpCenterAllCategoryArticles[]
}

// fetching data from fake-api
const apiData = ref<ApiDataType | null>()

setTimeout(async () => {
  const faqData = await $api<ApiDataType>('/pages/help-center')

  apiData.value = faqData
}, 1000)
</script>

<template>
  <div class="help-center-page">
    <Navbar />
    <div v-if="apiData && apiData.allArticles.length">
      <AppSearchHeader
        subtitle="Common troubleshooting topics: eCommerce, Blogging to payment"
        custom-class="rounded-0"
        placeholder="Search"
      >
        <template #title>
          <h4
            class="text-h4 font-weight-medium"
            style="color: rgba(var(--v-theme-primary), 1);"
          >
            Hello, how can we help?
          </h4>
        </template>
      </AppSearchHeader>

      <!-- 👉 Popular Articles -->
      <div class="help-center-section bg-surface">
        <VContainer>
          <h4 class="text-h4 text-center mb-6">
            Popular Articles
          </h4>
          <HelpCenterLandingArticlesOverview :articles="apiData.popularArticles" />
        </VContainer>
      </div>

      <!-- 👉 Knowledge Base -->
      <div class="help-center-section">
        <VContainer>
          <h4 class="text-h4 text-center mb-6">
            Knowledge Base
          </h4>
          <HelpCenterLandingKnowledgeBase :categories="apiData.allArticles" />
        </VContainer>
      </div>

      <!-- 👉 Keep Learning -->
      <div class="help-center-section bg-surface">
        <VContainer>
          <h4 class="text-h4 text-center mb-6">
            Keep Learning
          </h4>
          <HelpCenterLandingArticlesOverview :articles="apiData.keepLearning" />
        </VContainer>
      </div>

      <!-- 👉 Still need help? -->
      <div class="help-center-section">
        <HelpCenterLandingFooter />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.help-center-page {
  .search-header {
    background-size: cover !important;
    padding-block: 9.25rem 4.75rem !important;
  }

  .help-center-section {
    padding-block: 5.25rem;
  }
}

@media (max-width: 960px) and (min-width: 600px) {
  .help-center-page {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

@media (max-width: 599px) {
  .help-center-page {
    .search-header {
      padding-block: 7rem 2rem !important;
      padding-inline: 2rem !important;
    }

    .help-center-section {
      padding-block: 3.5rem;
    }
  }
}
</style>
