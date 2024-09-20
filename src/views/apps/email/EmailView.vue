<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import type { MoveEmailToAction } from '@/views/apps/email/useEmail'
import { useEmail } from '@/views/apps/email/useEmail'
import type { Email } from '@db/apps/email/types'

interface Props {
  email: Email | null
  emailMeta: {
    hasPreviousEmail: boolean
    hasNextEmail: boolean
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'navigated', direction: 'previous' | 'next'): void
  (e: 'close'): void
  (e: 'trash'): void
  (e: 'unread'): void
  (e: 'read'): void
  (e: 'star'): void
  (e: 'unstar'): void
}>()

const emailReply = ref('')
const showReplyBox = ref(false)
const showReplyCard = ref(true)
const { updateEmailLabels } = useEmail()

const { labels, resolveLabelColor, emailMoveToFolderActions, shallShowMoveToActionFor, moveSelectedEmailTo } = useEmail()

const handleMoveMailsTo = (action: MoveEmailToAction) => {
  moveSelectedEmailTo(action, [(props.email as Email).id])
  emit('refresh')
  emit('close')
}

const updateMailLabel = async (label: Email['labels'][number]) => {
  await updateEmailLabels([(props.email as Email).id], label)

  emit('refresh')
}
</script>

<template>
  <!-- ℹ️ calc(100% - 256px) => 265px is left sidebar width -->
  <VNavigationDrawer
    temporary
    :model-value="!!props.email"
    location="right"
    :scrim="false"
    floating
    class="email-view"
  >
    <template v-if="props.email">
      <!-- 👉 header -->

      <div class="email-view-header d-flex align-center px-5 py-3">
        <IconBtn
          class="me-2"
          @click="$emit('close')"
        >
          <VIcon
            size="22"
            icon="tabler-chevron-left"
            class="flip-in-rtl"
          />
        </IconBtn>

        <div class="d-flex align-center flex-wrap flex-grow-1 overflow-hidden gap-2">
          <div class="text-body-1 text-high-emphasis text-truncate">
            {{ props.email.subject }}
          </div>

          <div class="d-flex flex-wrap gap-2">
            <VChip
              v-for="label in props.email.labels"
              :key="label"
              :color="resolveLabelColor(label)"
              class="text-capitalize flex-shrink-0"
              size="small"
              :label="false"
            >
              {{ label }}
            </VChip>
          </div>
        </div>

        <div>
          <div class="d-flex align-center">
            <IconBtn
              :disabled="!props.emailMeta.hasPreviousEmail"
              @click="$emit('navigated', 'previous')"
            >
              <VIcon
                icon="tabler-chevron-left"
                class="flip-in-rtl"
              />
            </IconBtn>

            <IconBtn
              :disabled="!props.emailMeta.hasNextEmail"
              @click="$emit('navigated', 'next')"
            >
              <VIcon
                icon="tabler-chevron-right"
                class="flip-in-rtl"
              />
            </IconBtn>
          </div>
        </div>
      </div>

      <VDivider />

      <!-- 👉 Action bar -->
      <div class="email-view-action-bar d-flex align-center text-medium-emphasis px-6 gap-x-1">
        <!-- Trash -->
        <IconBtn
          v-show="!props.email.isDeleted"
          @click="$emit('trash'); $emit('close')"
        >
          <VIcon
            icon="tabler-trash"
            size="22"
          />
          <VTooltip
            activator="parent"
            location="top"
          >
            Delete Mail
          </VTooltip>
        </IconBtn>

        <!-- Read/Unread -->
        <IconBtn @click.stop="$emit('unread'); $emit('close')">
          <VIcon
            icon="tabler-mail"
            size="22"
          />
          <VTooltip
            activator="parent"
            location="top"
          >
            Mark as Unread
          </VTooltip>
        </IconBtn>

        <!-- Move to folder -->
        <IconBtn>
          <VIcon
            icon="tabler-folder"
            size="22"
          />
          <VTooltip
            activator="parent"
            location="top"
          >
            Move to
          </VTooltip>

          <VMenu activator="parent">
            <VList density="compact">
              <template
                v-for="moveTo in emailMoveToFolderActions"
                :key="moveTo.title"
              >
                <VListItem
                  :class="shallShowMoveToActionFor(moveTo.action) ? 'd-flex' : 'd-none'"
                  class="align-center"
                  href="#"
                  @click="handleMoveMailsTo(moveTo.action)"
                >
                  <template #prepend>
                    <VIcon
                      :icon="moveTo.icon"
                      class="me-2"
                      size="20"
                    />
                  </template>
                  <VListItemTitle class="text-capitalize">
                    {{ moveTo.action }}
                  </VListItemTitle>
                </VListItem>
              </template>
            </VList>
          </VMenu>
        </IconBtn>

        <!-- Update labels -->
        <IconBtn>
          <VIcon
            icon="tabler-tag"
            size="22"
          />
          <VTooltip
            activator="parent"
            location="top"
          >
            Label
          </VTooltip>

          <VMenu activator="parent">
            <VList density="compact">
              <VListItem
                v-for="label in labels"
                :key="label.title"
                href="#"
                @click.stop="updateMailLabel(label.title)"
              >
                <template #prepend>
                  <VBadge
                    inline
                    :color="resolveLabelColor(label.title)"
                    dot
                  />
                </template>
                <VListItemTitle class="ms-2 text-capitalize">
                  {{ label.title }}
                </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </IconBtn>

        <VSpacer />

        <div class="d-flex align-center gap-x-1">
          <IconBtn>
            <VIcon
              icon="tabler-dots-vertical"
              size="22"
            />
          </IconBtn>
        </div>
      </div>

      <VDivider />

      <!-- 👉 Mail Content -->
      <PerfectScrollbar
        tag="div"
        class="mail-content-container flex-grow-1 pa-sm-12 pa-6"
        :options="{ wheelPropagation: false }"
      >
        <VCard class="mb-4">
          <div class="d-flex align-start align-sm-center pa-6 gap-x-4">
            <VAvatar size="38">
              <VImg
                :src="props.email.from.avatar"
                :alt="props.email.from.name"
              />
            </VAvatar>

            <div class="d-flex flex-wrap flex-grow-1 overflow-hidden">
              <div class="text-truncate">
                <div class="text-body-1 text-high-emphasis text-truncate">
                  {{ props.email.from.name }}
                </div>
                <div class="text-sm">
                  {{ props.email.from.email }}
                </div>
              </div>

              <VSpacer />

              <div class="d-flex align-center gap-x-4">
                <div class="text-disabled text-base">
                  {{ new Date(props.email.time).toDateString() }}
                </div>
                <div>
                  <IconBtn v-show="props.email.attachments.length">
                    <VIcon
                      icon="tabler-paperclip"
                      size="22"
                    />
                  </IconBtn>
                  <!-- Star/Unstar -->
                  <IconBtn
                    :color="props.email.isStarred ? 'warning' : 'default'"
                    @click="props.email?.isStarred ? $emit('unstar') : $emit('star'); $emit('refresh')"
                  >
                    <VIcon
                      :icon="props.email.isStarred ? 'tabler-star-filled' : 'tabler-star' "
                      size="22"
                    />
                  </IconBtn>
                  <IconBtn>
                    <VIcon
                      icon="tabler-dots-vertical"
                      size="22"
                    />
                  </IconBtn>
                </div>
              </div>
            </div>
          </div>

          <VDivider />

          <VCardText>
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="text-base"
              v-html="props.email.message"
            />
            <!-- eslint-enable -->
          </VCardText>

          <template v-if="props.email.attachments.length">
            <VDivider />

            <VCardText class="d-flex flex-column gap-y-4 pt-4">
              <span>2 Attachments</span>
              <div
                v-for="attachment in props.email.attachments"
                :key="attachment.fileName"
                class="d-flex align-center"
              >
                <VImg
                  :src="attachment.thumbnail"
                  :alt="attachment.fileName"
                  aspect-ratio="1"
                  max-height="24"
                  max-width="24"
                  class="me-2"
                />
                <span>{{ attachment.fileName }}</span>
              </div>
            </VCardText>
          </template>
        </VCard>

        <!-- Reply or Forward -->
        <VCard v-show="showReplyCard">
          <VCardText class="font-weight-medium text-high-emphasis">
            <div class="text-base">
              Click here to <span
                class="text-primary cursor-pointer"
                @click="showReplyBox = !showReplyBox; showReplyCard = !showReplyCard"
              >
                Reply
              </span> or <span class="text-primary cursor-pointer">
                Forward
              </span>
            </div>
          </VCardText>
        </VCard>

        <VCard v-if="showReplyBox">
          <VCardText>
            <h6 class="text-h6 mb-6">
              Reply to {{ email?.from.name }}
            </h6>
            <TiptapEditor
              v-model="emailReply"
              placeholder="Write your message..."
            />
            <div class="d-flex justify-end gap-4 pt-2 flex-wrap">
              <VBtn

                variant="text"
                color="secondary"
              >
                <template #prepend>
                  <VIcon
                    icon="tabler-paperclip"
                    class="text-high-emphasis"
                    size="16"
                  />
                </template>
                Attachments
              </VBtn>
              <VBtn append-icon="tabler-send">
                Send
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </template>
  </VNavigationDrawer>
</template>

<style lang="scss">
.email-view {
  inline-size: 100% !important;

  @media only screen and (min-width: 1280px) {
    inline-size: calc(100% - 256px) !important;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }

  .editor {
    padding-block-start: 0 !important;
    padding-inline: 0 !important;
  }

  .ProseMirror {
    padding: 0.5rem;
    block-size: 100px;
    overflow-y: auto;
    padding-block: 0.5rem;
  }
}

.email-view-action-bar {
  min-block-size: 56px;
}

.mail-content-container {
  background-color: rgb(var(--v-theme-on-surface), var(--v-hover-opacity));

  .mail-header {
    margin-block: 12px;
    margin-inline: 24px;
  }
}
</style>
