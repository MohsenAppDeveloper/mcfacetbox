<script setup lang="ts">
const isFullfilOnline = ref(true)
</script>

<template>
  <div>
    <VCard
      title="Location Name"
      class="mb-6"
    >
      <VCardText>
        <AppTextField
          label="Location Name"
          placeholder="Empire Hub"
        />
        <div class="my-4">
          <VCheckbox
            v-model="isFullfilOnline"
            label="Fulfil online orders from this location"
          />
        </div>
        <VAlert
          type="info"
          variant="tonal"
        >
          <VAlertTitle class="mb-0">
            This is your default location. To change whether you fulfill online orders from this location, select another default location first.
          </VAlertTitle>
        </VAlert>
      </VCardText>
    </VCard>

    <VCard title="Address">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <AppSelect
              label="Country/religion"
              placeholder="Select Country"
              :items="['United States', 'UK', 'Canada']"
              model-value="United States"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="Address"
              placeholder="123 , New Street"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="Apartment, suite, etc."
              placeholder="Empire Heights"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="Phone"
              placeholder="+1 (234) 456-7890"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="City"
              placeholder="New York"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="State"
              placeholder="NY"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="PIN code"
              type="number"
              placeholder="123897"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <div class="d-flex justify-end gap-x-4 mt-6">
      <VBtn
        variant="tonal"
        color="secondary"
      >
        Discard
      </VBtn>
      <VBtn>Save Changes</VBtn>
    </div>
  </div>
</template>
