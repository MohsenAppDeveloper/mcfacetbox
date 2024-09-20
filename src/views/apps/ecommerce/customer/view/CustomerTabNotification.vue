<script lang="ts" setup>
const notifications = ref([
  {
    type: 'New for you',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'Account activity',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'A new browser used to sign in',
    email: true,
    browser: true,
    app: false,
  },
  {
    type: 'A new device is linked',
    email: true,
    browser: false,
    app: false,
  },
])
</script>

<template>
  <VCard class="user-tab-notification">
    <VCardItem>
      <VCardTitle class="mb-1">
        Notifications
      </VCardTitle>
      <VCardSubtitle class="text-body-1 text-wrap">
        You will receive notification for the below selected items.
      </VCardSubtitle>
    </VCardItem>
    <VCardText class="px-0">
      <VDivider />
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">
              TYPE
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              BROWSER
            </th>
            <th scope="col">
              APP
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(notification, index) in notifications"
            :key="notification.type"
            :class="index % 2 === 0 ? 'table-colored-raw' : ''"
          >
            <td class="text-high-emphasis">
              {{ notification.type }}
            </td>
            <td>
              <VCheckbox v-model="notification.email" />
            </td>
            <td>
              <VCheckbox v-model="notification.browser" />
            </td>
            <td>
              <VCheckbox v-model="notification.app" />
            </td>
          </tr>
        </tbody>
      </VTable>
      <VDivider />
    </VCardText>

    <VCardText class="d-flex flex-wrap gap-4">
      <VBtn>Save changes</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Discard
      </VBtn>
    </VCardText>
  </VCard>
</template>
