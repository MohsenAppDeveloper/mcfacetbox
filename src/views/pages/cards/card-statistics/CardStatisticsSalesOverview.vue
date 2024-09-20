<template>
  <VCard>
    <VCardText>
      <div class="d-flex align-center justify-space-between">
        <div class="text-body-1">
          Sales Overview
        </div>
        <div class="text-success font-weight-medium">
          +18.2%
        </div>
      </div>
      <h4 class="text-h4">
        $42.5k
      </h4>
    </VCardText>

    <VCardText>
      <VRow no-gutters>
        <VCol cols="5">
          <div class="d-flex align-center mb-3">
            <VAvatar
              color="info"
              variant="tonal"
              :size="24"
              rounded
              class="me-2"
            >
              <VIcon
                size="18"
                icon="tabler-shopping-cart"
              />
            </VAvatar>

            <span>Order</span>
          </div>
          <h5 class="text-h5">
            62.2%
          </h5>
          <div class="text-body-2 text-disabled">
            6,440
          </div>
        </VCol>

        <VCol cols="2">
          <div class="d-flex flex-column align-center justify-center h-100">
            <VDivider
              vertical
              class="mx-auto"
            />

            <VAvatar
              size="24"
              color="rgba(var(--v-theme-on-surface), var(--v-hover-opacity))"
              class="my-2"
            >
              <div class="text-overline text-disabled">
                VS
              </div>
            </VAvatar>

            <VDivider
              vertical
              class="mx-auto"
            />
          </div>
        </VCol>

        <VCol
          cols="5"
          class="text-end"
        >
          <div class="d-flex align-center justify-end mb-3">
            <span class="me-2">Visits</span>

            <VAvatar
              color="primary"
              variant="tonal"
              :size="24"
              rounded
            >
              <VIcon
                size="18"
                icon="tabler-link"
              />
            </VAvatar>
          </div>
          <h5 class="text-h5">
            25.5%
          </h5>
          <div class="text-body-2 text-disabled">
            12,749
          </div>
        </VCol>
      </VRow>

      <div class="mt-6">
        <VProgressLinear
          model-value="72"
          color="#00CFE8"
          height="10"
          bg-color="primary"
          :rounded-bar="false"
          rounded
        />
      </div>
    </VCardText>
  </VCard>
</template>
