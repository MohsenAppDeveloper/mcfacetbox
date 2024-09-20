<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()

defineEmits<{
  (e: 'toggleComposeDialogVisibility'): void
}>()

interface Props {
  emailsMeta: {
    inbox: number
    draft: number
    spam: number
    star: number
  }
}

interface Folder {
  title: string
  prependIcon: string
  to: any
  badge?: {
    content: string | number
    color: string
  }
}

interface Label {
  title: string
  color: string
  to: any
}

const inboxEmails = ref(0)
const draftEmails = ref(0)
const spamEmails = ref(0)
const starredEmails = ref(0)

watch(() => props.emailsMeta, emailsMeta => {
  if (!emailsMeta)
    return

  inboxEmails.value = emailsMeta.inbox
  draftEmails.value = emailsMeta.draft
  spamEmails.value = emailsMeta.spam
  starredEmails.value = emailsMeta.star
}, { immediate: true, deep: true })

const folders: ComputedRef<Folder[]> = computed(() => [
  {
    title: 'Inbox',
    prependIcon: 'tabler-mail',
    to: { name: 'apps-email' },
    badge: { content: inboxEmails.value, color: 'primary' },
  },
  {
    title: 'Sent',
    prependIcon: 'tabler-send',
    to: {
      name: 'apps-email-filter',
      params: { filter: 'sent' },
    },
  },
  {
    title: 'Draft',
    prependIcon: 'tabler-edit',
    to: {
      name: 'apps-email-filter',
      params: { filter: 'draft' },
    },
    badge: { content: draftEmails.value, color: 'warning' },
  },
  {
    title: 'Starred',
    prependIcon: 'tabler-star',
    to: {
      name: 'apps-email-filter',
      params: { filter: 'starred' },
    },
    badge: { content: starredEmails.value, color: 'success' },
  },
  {
    title: 'Spam',
    prependIcon: 'tabler-alert-circle',
    to: {
      name: 'apps-email-filter',
      params: { filter: 'spam' },
    },
    badge: { content: spamEmails.value, color: 'error' },
  },
  {
    title: 'Trash',
    prependIcon: 'tabler-trash',
    to: {
      name: 'apps-email-filter',
      params: { filter: 'trashed' },
    },
  },
])

const labels: Label[] = [
  {
    title: 'Personal',
    color: 'success',
    to: {
      name: 'apps-email-label',
      params: { label: 'personal' },
    },
  },
  {
    title: 'Company',
    color: 'primary',
    to: {
      name: 'apps-email-label',
      params: { label: 'company' },
    },
  },
  {
    title: 'Important',
    color: 'warning',
    to: {
      name: 'apps-email-label',
      params: { label: 'important' },
    },
  },
  {
    title: 'Private',
    color: 'error',
    to: {
      name: 'apps-email-label',
      params: { label: 'private' },
    },
  },
]
</script>

<template>
  <div class="d-flex flex-column h-100">
    <!-- 👉 Compose -->
    <div class="px-6 pb-5 pt-6">
      <VBtn
        block
        @click="$emit('toggleComposeDialogVisibility')"
      >
        Compose
      </VBtn>
    </div>

    <!-- 👉 Folders -->
    <PerfectScrollbar
      :options="{ wheelPropagation: false }"
      class="h-100"
    >
      <!-- Filters -->
      <ul class="email-filters py-4">
        <RouterLink
          v-for="folder in folders"
          :key="folder.title"
          v-slot="{ isActive, href, navigate }"
          class="d-flex align-center cursor-pointer align-center"
          :to="folder.to"
          custom
        >
          <li
            v-bind="$attrs"
            :href="href"
            :class="isActive && 'email-filter-active text-primary'"
            class="d-flex align-center cursor-pointer"
            @click="navigate"
          >
            <VIcon
              :icon="folder.prependIcon"
              class="me-2"
              size="20"
            />
            <div class="text-base">
              {{ folder.title }}
            </div>

            <VSpacer />

            <VChip
              v-if="folder.badge?.content"
              :color="folder.badge.color"
              label
              size="small"
              class="rounded-xl px-3"
            >
              {{ folder.badge?.content }}
            </VChip>
          </li>
        </RouterLink>
      </ul>

      <ul class="email-labels py-4">
        <!-- 👉 Labels -->
        <div class="text-caption text-disabled mb-4 px-6">
          LABELS
        </div>
        <RouterLink
          v-for="label in labels"
          :key="label.title"
          v-slot="{ isActive, href, navigate }"
          class="d-flex align-center"
          :to="label.to"
          custom
        >
          <li
            v-bind="$attrs"
            :href="href"
            :class="isActive && 'email-label-active text-primary'"
            class="cursor-pointer d-flex align-center"
            @click="navigate"
          >
            <VIcon
              icon="tabler-circle-filled"
              :color="label.color"
              class="me-2"
              size="12"
            />
            <div class="text-body-1 text-high-emphasis">
              {{ label.title }}
            </div>
          </li>
        </RouterLink>
      </ul>
    </PerfectScrollbar>
  </div>
</template>

<style lang="scss">
.email-filters,
.email-labels {
  .email-filter-active,
  .email-label-active {
    &::after {
      position: absolute;
      background: currentcolor;
      block-size: 100%;
      content: "";
      inline-size: 3px;
      inset-block-start: 0;
      inset-inline-start: 0;
    }
  }
}

.email-filters {
  > li {
    position: relative;
    margin-block-end: 4px;
    padding-block: 4px;
    padding-inline: 24px;
  }
}

.email-labels {
  > li {
    position: relative;
    margin-block-end: 0.75rem;
    padding-inline: 24px;
  }
}
</style>
