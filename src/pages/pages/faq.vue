<script setup lang="ts">
import type { FaqCategory } from '@db/pages/faq/types'

import sittingGirlWithLaptop from '@images/illustrations/sitting-girl-with-laptop.png'

const faqSearchQuery = ref('')

const faqs = ref<FaqCategory[]>([])

const fetchFaqs = async () => {
  const data = await $api('/pages/faq', {
    query: {
      q: faqSearchQuery.value,
    },
  }).catch(err => console.log(err))

  faqs.value = data
}

const activeTab = ref('Payment')
const activeQuestion = ref(0)

watch(activeTab, () => activeQuestion.value = 0)
watch(faqSearchQuery, fetchFaqs, { immediate: true })

const contactUs = [
  {
    icon: 'tabler-phone',
    via: '+ (810) 2548 2568',
    tagLine: 'We are always happy to help!',
  },
  {
    icon: 'tabler-mail',
    via: 'hello@help.com',
    tagLine: 'Best way to get answer faster!',
  },
]
</script>

<template>
  <section>
    <!-- 👉 Search -->
    <AppSearchHeader
      title="Hello, how can we help?"
      subtitle="or choose a category to quickly find the help you need"
      custom-class="mb-6"
      placeholder="Search Articles..."
      density="comfortable"
      is-reverse
    />

    <!-- 👉 Faq sections and questions -->
    <VRow>
      <VCol
        v-show="faqs.length"
        cols="12"
        sm="4"
        lg="3"
        class="position-relative"
      >
        <!-- 👉 Tabs -->
        <VTabs
          v-model="activeTab"
          direction="vertical"
          class="v-tabs-pill"
          grow
        >
          <VTab
            v-for="faq in faqs"
            :key="faq.faqTitle"
            :value="faq.faqTitle"
          >
            <VIcon
              :icon="faq.faqIcon"
              :size="20"
              start
            />
            {{ faq.faqTitle }}
          </VTab>
        </VTabs>
        <VImg
          :width="245"
          :src="sittingGirlWithLaptop"
          class="d-none d-sm-block mt-4 mx-auto"
        />
      </VCol>

      <VCol
        cols="12"
        sm="8"
        lg="9"
      >
        <!-- 👉 Windows -->
        <VWindow
          v-model="activeTab"
          class="faq-v-window disable-tab-transition"
        >
          <VWindowItem
            v-for="faq in faqs"
            :key="faq.faqTitle"
            :value="faq.faqTitle"
          >
            <div class="d-flex align-center mb-4">
              <VAvatar
                rounded
                color="primary"
                variant="tonal"
                class="me-4"
                size="50"
              >
                <VIcon
                  :size="30"
                  :icon="faq.faqIcon"
                />
              </VAvatar>

              <div>
                <h5 class="text-h5">
                  {{ faq.faqTitle }}
                </h5>
                <div class="text-body-1">
                  {{ faq.faqSubtitle }}
                </div>
              </div>
            </div>

            <VExpansionPanels
              v-model="activeQuestion"
              multiple
            >
              <VExpansionPanel
                v-for="item in faq.faqs"
                :key="item.question"
                :title="item.question"
                :text="item.answer"
              />
            </VExpansionPanels>
          </VWindowItem>
        </VWindow>
      </VCol>

      <VCol
        v-show="!faqs.length"
        cols="12"
        :class="!faqs.length ? 'd-flex justify-center align-center' : ''"
      >
        <VIcon
          icon="tabler-help"
          start
          size="20"
        />
        <span class="text-base font-weight-medium">
          No Results Found!!
        </span>
      </VCol>
    </VRow>

    <!-- 👉 You still have a question? -->
    <div class="text-center pt-16">
      <VChip
        label
        color="primary"
        size="small"
        class="mb-2"
      >
        Question
      </VChip>

      <h4 class="text-h4 mb-2">
        You still have a question?
      </h4>
      <p class="text-body-1 mb-6">
        If you can't find question in our FAQ, you can contact us. We'll answer you shortly!
      </p>

      <!-- contacts -->
      <VRow class="mt-9">
        <VCol
          v-for="contact in contactUs"
          :key="contact.icon"
          sm="6"
          cols="12"
        >
          <VCard
            flat
            style="background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));"
          >
            <VCardText class="pb-4">
              <VAvatar
                rounded
                color="primary"
                variant="tonal"
                size="46"
              >
                <VIcon
                  :icon="contact.icon"
                  size="26"
                />
              </VAvatar>
            </VCardText>
            <VCardText>
              <h5 class="text-h5 mb-1">
                {{ contact.via }}
              </h5>
              <div>{{ contact.tagLine }}</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </section>
</template>

<style lang="scss">
.faq-v-window {
  .v-window__container {
    z-index: 0;
  }
}
</style>
