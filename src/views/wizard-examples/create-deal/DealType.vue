<script setup lang="ts">
import type { DealType } from './types'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import type { CustomInputContent } from '@core/types'
import sittingGirlWithLaptop from '@images/illustrations/sitting-girl-with-laptop.png'
import CreateDealBackgroundDark from '@images/pages/DealTypeBackground-dark.png'
import CreateDealBackgroundLight from '@images/pages/DealTypeBackground-light.png'
import card from '@images/svg/Card.svg'
import check from '@images/svg/Check.svg'
import diamond from '@images/svg/Diamond.svg'

const props = defineProps<{
  formData: DealType
}>()

const emit = defineEmits<{
  (e: 'update:formData', value: DealType): void
}>()

const createDealBackground = useGenerateImageVariant(CreateDealBackgroundLight, CreateDealBackgroundDark)

const discountOffers: CustomInputContent[] = [
  {
    icon: { icon: check, size: '28' },
    title: 'Percentage',
    desc: 'Create a deal which offer uses some % off (i.e 5% OFF) on total.',
    value: 'percentage',
  },
  {
    icon: { icon: card, size: '28' },
    title: 'Flat Amount',
    desc: 'Create a deal which offer uses some flat amount (i.e $5 OFF) on total.',
    value: 'flat',
  },
  {
    icon: { icon: diamond, size: '28' },
    title: 'Prime member',
    desc: 'Create prime member only deal to encourage the prime members.',
    value: 'prime',
  },
]

const formData = ref<DealType>(props.formData)

watch(formData, () => {
  emit('update:formData', formData.value)
})
</script>

<template>
  <VForm>
    <VRow>
      <!-- 👉 Shopping girl image -->
      <VCol cols="12">
        <div class="d-flex align-center justify-center w-100 deal-type-image-wrapper border rounded px-5 pt-2 pb-5">
          <VImg :src="sittingGirlWithLaptop" />
          <VImg
            :src="createDealBackground"
            class="position-absolute deal-type-background-img d-md-block d-none"
          />
        </div>
      </VCol>

      <VCol cols="12">
        <CustomRadiosWithIcon
          v-model:selected-radio="formData.Offer"
          :radio-content="discountOffers"
          :grid-column="{ cols: '12', sm: '4' }"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppTextField
          v-model="formData.discount"
          type="number"
          label="Discount"
          placeholder="25"
          hint="Enter the discount percentage. 10 = 10%"
          persistent-hint
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppSelect
          v-model="formData.region"
          label="Region"
          :items="['Asia', 'Europe', 'Africa', 'Australia', 'North America', 'South America']"
          placeholder="Select Region"
          hint="Select applicable regions for the deal."
          persistent-hint
        />
      </VCol>
    </VRow>
  </VForm>
</template>

<style lang="scss">
.deal-type-image-wrapper {
  position: relative;
  block-size: 240px;
  inline-size: 210px;
}

.deal-type-background-img {
  inline-size: 75%;
  inset-block-end: 0;
}
</style>
