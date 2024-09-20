<script lang="ts" setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useChat } from './useChat'
import ChatContact from '@/views/apps/chat/ChatContact.vue'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import type { ChatContact as TypeChatContact } from '@db/apps/chat/types'

const props = defineProps<{
  search: string
  isDrawerOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'openChatOfContact', id: TypeChatContact['id']): void
  (e: 'showUserProfile'): void
  (e: 'close'): void
  (e: 'update:search', value: string): void
}>()

const { resolveAvatarBadgeVariant } = useChat()
const search = useVModel(props, 'search', emit)

const store = useChatStore()
</script>

<template>
  <!-- 👉 Chat list header -->
  <div
    v-if="store.profileUser"
    class="chat-list-header"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      :color="resolveAvatarBadgeVariant(store.profileUser.status)"
      bordered
    >
      <VAvatar
        size="40"
        class="cursor-pointer"
        @click="$emit('showUserProfile')"
      >
        <VImg
          :src="store.profileUser.avatar"
          alt="John Doe"
        />
      </VAvatar>
    </VBadge>

    <AppTextField
      v-model="search"
      placeholder="Search..."
      prepend-inner-icon="tabler-search"
      class="ms-4 me-1 chat-list-search"
    />

    <IconBtn
      v-if="$vuetify.display.smAndDown"
      @click="$emit('close')"
    >
      <VIcon
        icon="tabler-x"
        class="text-medium-emphasis"
      />
    </IconBtn>
  </div>
  <VDivider />

  <PerfectScrollbar
    tag="ul"
    class="d-flex flex-column gap-y-1 chat-contacts-list px-3 py-2 list-none"
    :options="{ wheelPropagation: false }"
  >
    <li class="list-none">
      <h5 class="chat-contact-header text-primary text-h5">
        Chats
      </h5>
    </li>

    <ChatContact
      v-for="contact in store.chatsContacts"
      :key="`chat-${contact.id}`"
      :user="contact"
      is-chat-contact
      @click="$emit('openChatOfContact', contact.id)"
    />

    <span
      v-show="!store.chatsContacts.length"
      class="no-chat-items-text text-disabled"
    >No chats found</span>
    <li class="list-none pt-2">
      <h5 class="chat-contact-header text-primary text-h5">
        Contacts
      </h5>
    </li>

    <ChatContact
      v-for="contact in store.contacts"
      :key="`chat-${contact.id}`"
      :user="contact"
      @click="$emit('openChatOfContact', contact.id)"
    />

    <span
      v-show="!store.contacts.length"
      class="no-chat-items-text text-disabled"
    >No contacts found</span>
  </PerfectScrollbar>
</template>

<style lang="scss">
.chat-contacts-list {
  --chat-content-spacing-x: 16px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block: 0.5rem 0.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}

.chat-list-search {
  .v-field--focused {
    box-shadow: none !important;
  }
}
</style>
