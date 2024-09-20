<script setup lang="ts">
import girlWithLaptop from '@images/illustrations/laptop-girl.png'
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-center  align-start pb-0 px-3 pt-3 mb-4 bg-light-primary rounded">
        <VImg
          :src="girlWithLaptop"
          width="145"
          height="152"
        />
      </div>
      <div>
        <h5 class="text-h5 mb-2">
          Upcoming Webinar
        </h5>
        <div class="text-body-2">
          Next Generation Frontend Architecture Using Layout Engine And Vue.
        </div>
        <div class="d-flex justify-space-between gap-4 flex-wrap my-4">
          <div
            v-for="{ icon, title, value } in [{ icon: 'tabler-calendar', title: '17 Nov 23', value: 'Date' }, { icon: 'tabler-clock', title: '32 Minutes', value: 'Duration' }]"
            :key="title"
            class="d-flex gap-x-3 align-center"
          >
            <VAvatar
              color="primary"
              variant="tonal"
              rounded
            >
              <VIcon
                :icon="icon"
                size="28"
              />
            </VAvatar>
            <div>
              <h6 class="text-h6">
                {{ title }}
              </h6>
              <div class="text-sm">
                {{ value }}
              </div>
            </div>
          </div>
        </div>
        <VBtn block>
          Join the event
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
