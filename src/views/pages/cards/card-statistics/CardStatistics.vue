<template>
  <VCard>
    <VCardItem class="pb-2">
      <VCardTitle>Statistics</VCardTitle>

      <template #append>
        <div class="me-n3">
          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
          </IconBtn>
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex justify-space-between align-center mb-2">
        <h6 class="text-h6">
          Subscribers Gained
        </h6>
        <VChip
          label
          color="success"
          size="small"
        >
          +92k
        </VChip>
      </div>

      <div class="d-flex justify-space-between align-center mb-1">
        <div class="text-base">
          1.2k new subscriber
        </div>

        <div class="text-disabled text-sm">
          85%
        </div>
      </div>

      <VProgressLinear
        model-value="85"
        color="primary"
        height="8"
        rounded
      />

      <div class="d-flex justify-space-between align-center mb-2 mt-6">
        <h6 class="text-h6">
          Orders Received
        </h6>
        <VChip
          label
          size="small"
          color="success"
        >
          +38k
        </VChip>
      </div>

      <div class="d-flex justify-space-between mb-1">
        <div class="text-base">
          2.4k new orders
        </div>

        <div class="text-disabled text-sm">
          65%
        </div>
      </div>

      <VProgressLinear
        model-value="65"
        color="info"
        height="8"
        rounded
      />
    </VCardText>
  </VCard>
</template>
