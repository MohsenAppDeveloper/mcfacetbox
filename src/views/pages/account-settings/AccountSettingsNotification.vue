<script lang="ts" setup>
const recentDevices = ref(
  [
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
  ],
)

const selectedNotification = ref('Only when I\'m online')
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Recent Devices</VCardTitle>
      <p class="text-body-1 mb-0">
        We need permission from your browser to show notifications. <span class="text-primary cursor-pointer">Request Permission</span>
      </p>
    </VCardItem>

    <VCardText class="px-0">
      <VDivider />
      <VTable class="text-no-wrap rounded">
        <thead>
          <tr>
            <th scope="col">
              Type
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              BROWSER
            </th>
            <th scope="col">
              App
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="device in recentDevices"
            :key="device.type"
          >
            <td class="text-body-1 text-high-emphasis">
              {{ device.type }}
            </td>
            <td>
              <VCheckbox v-model="device.email" />
            </td>
            <td>
              <VCheckbox v-model="device.browser" />
            </td>
            <td>
              <VCheckbox v-model="device.app" />
            </td>
          </tr>
        </tbody>
      </VTable>
      <VDivider />
    </VCardText>

    <VCardText>
      <VForm @submit.prevent="() => {}">
        <h6 class="text-body-1 font-weight-medium mb-6">
          When should we send you notifications?
        </h6>

        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <AppSelect
              v-model="selectedNotification"
              mandatory
              placeholder="Select an option"
              :items="['Only when I\'m online', 'Anytime']"
            />
          </VCol>
        </VRow>

        <div class="d-flex flex-wrap gap-4 mt-6">
          <VBtn type="submit">
            Save Changes
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            type="reset"
          >
            Discard
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>
