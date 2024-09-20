<script setup lang="ts">
import usFlag from '@images/icons/countries/us.png'
import americanExpress from '@images/icons/payments/img/american-express.png'
import mastercard from '@images/icons/payments/img/mastercard.png'
import visa from '@images/icons/payments/img/visa-light.png'

interface CardDetails {
  number: string | number
  name: string
  expiry: string
  cvv: string
  isPrimary: boolean
  type: string
}

interface BillingAddress {
  firstName: string
  lastName: string
  selectedCountry: string | null
  addressLine1: string
  addressLine2: string
  landmark: string
  contact: string
  country: string | null
  city: string
  state: string
  zipCode: number | null
}

const currentCardDetails: CardDetails = {
  number: 1234567890123456,
  name: 'John Doe',
  expiry: '12/2028',
  cvv: '123',
  isPrimary: false,
  type: '',
}

const editBillingData: BillingAddress = {
  firstName: 'Gertrude',
  lastName: 'Jennings',
  selectedCountry: 'USA',
  addressLine1: '100 Water Plant Avenue',
  addressLine2: 'Building 1303 Wake Island',
  landmark: 'Near Wake Island',
  contact: '+1(609) 933-44-22',
  country: 'USA',
  state: 'Queensland',
  zipCode: 403114,
  city: 'Brisbane',
}

const show = ref([false, true, false])
const paymentShow = ref([false, true, false])
const isEditAddressDialogVisible = ref(false)
const isCardAddDialogVisible = ref(false)
const isNewEditAddressDialogVisible = ref(false)
const isNewCardAddDialogVisible = ref(false)

const addressData = [
  {
    title: 'Home',
    subtitle: '23 Shatinon Mekalan',
    owner: 'Violet Mendoza',
    defaultAddress: true,
    address: ` 23 Shatinon Mekalan,
    <br>
    Melbourne, VIC 3000,
    <br>
    LondonUK`,
  },
  {
    title: 'Office',
    subtitle: '45 Rocker Terrace',
    owner: 'Violet Mendoza',
    defaultAddress: false,
    address: ` 45 Rocker Terrace,
    <br>
    Latheronwheel,
    <br>
    KW5 8NW, London,
    <br>
    UK`,
  },
  {
    title: 'Family',
    subtitle: '512 Water Plant',
    owner: 'Violet Mendoza',
    defaultAddress: false,
    address: ` 512 Water Plant,
    <br>
    Melbourne, VIC 3000,
    <br>
    LondonUK`,
  },
]

const paymentData = [
  {
    title: 'Mastercard',
    subtitle: 'Expires Apr 2028',
    isDefaultMethod: false,
    image: mastercard,
  },
  {
    title: 'American Express',
    subtitle: 'Expires Apr 2028',
    isDefaultMethod: false,
    image: americanExpress,
  },
  {
    title: 'Visa',
    subtitle: '45 Roker Terrace',
    isDefaultMethod: true,
    image: visa,
  },
]
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <!-- 👉 Address Book -->
  <VCard class="mb-6">
    <VCardText>
      <div class="d-flex justify-space-between mb-6 flex-wrap align-center gap-y-4 gap-x-6">
        <h5 class="text-h5">
          Address Book
        </h5>
        <VBtn
          variant="tonal"
          size="small"
          @click="isNewEditAddressDialogVisible = !isNewEditAddressDialogVisible"
        >
          Add new Address
        </VBtn>
      </div>
      <template
        v-for="(address, index) in addressData"
        :key="index"
      >
        <div>
          <div class="d-flex justify-space-between py-3 gap-y-2 flex-wrap align-center">
            <div class="d-flex align-center gap-x-4">
              <VIcon
                :icon="show[index] ? 'tabler-chevron-down' : 'tabler-chevron-right'"
                class="flip-in-rtl text-high-emphasis"
                size="24"
                @click="show[index] = !show[index]"
              />
              <div>
                <div class="d-flex align-center gap-x-2 mb-1">
                  <h6 class="text-h6">
                    {{ address.title }}
                  </h6>
                  <VChip
                    v-if="address.defaultAddress"
                    color="success"
                    label
                    size="small"
                  >
                    Default Address
                  </VChip>
                </div>
                <div class="text-body-1">
                  {{ address.subtitle }}
                </div>
              </div>
            </div>
            <div class="ms-5">
              <IconBtn @click="isEditAddressDialogVisible = !isEditAddressDialogVisible">
                <VIcon
                  icon="tabler-edit"
                  class="flip-in-rtl"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  icon="tabler-trash"
                  class="flip-in-rtl"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  icon="tabler-dots-vertical"
                  class="flip-in-rtl"
                />
              </IconBtn>
            </div>
          </div>

          <VExpandTransition>
            <div v-show="show[index]">
              <div class="px-10 pb-3">
                <h6 class="mb-1 text-h6">
                  {{ address.owner }}
                </h6>
                <div
                  class="text-body-1"
                  v-html="address.address"
                />
              </div>
            </div>
          </VExpandTransition>

          <VDivider v-if="index !== addressData.length - 1" />
        </div>
      </template>
    </VCardText>
  </VCard>

  <!-- 👉 Payment Methods -->
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between mb-6 flex-wrap align-center gap-y-4 gap-x-6">
        <h5 class="text-h5">
          Payment Methods
        </h5>
        <VBtn
          variant="tonal"
          size="small"
          @click="isNewCardAddDialogVisible = !isNewCardAddDialogVisible"
        >
          Add Payment Methods
        </VBtn>
      </div>
      <template
        v-for="(payment, index) in paymentData"
        :key="index"
      >
        <div>
          <div class="d-flex justify-space-between py-3 gap-y-2 flex-wrap align-center">
            <div class="d-flex align-center gap-x-4">
              <VIcon
                :icon="paymentShow[index] ? 'tabler-chevron-down' : 'tabler-chevron-right'"
                size="24"
                class="flip-in-rtl text-high-emphasis"
                @click="paymentShow[index] = !paymentShow[index]"
              />
              <VImg
                :src="payment.image"
                height="30"
                width="50"
              />
              <div>
                <div class="d-flex gap-x-2 mb-1">
                  <h6 class="text-h6">
                    {{ payment.title }}
                  </h6>
                  <VChip
                    v-if="payment.isDefaultMethod"
                    color="success"
                    label
                    size="small"
                  >
                    Default Method
                  </VChip>
                </div>
                <div class="text-body-1">
                  {{ payment.subtitle }}
                </div>
              </div>
            </div>
            <div class="ms-5">
              <IconBtn @click="isCardAddDialogVisible = !isCardAddDialogVisible">
                <VIcon
                  icon="tabler-edit"
                  class="flip-in-rtl"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  icon="tabler-trash"
                  class="flip-in-rtl"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  icon="tabler-dots-vertical"
                  class="flip-in-rtl"
                />
              </IconBtn>
            </div>
          </div>
          <VExpandTransition>
            <div v-show="paymentShow[index]">
              <div class="px-10 pb-3">
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTable>
                      <tr>
                        <td>Name </td>
                        <td class="font-weight-medium text-high-emphasis">
                          Violet Mendoza
                        </td>
                      </tr>
                      <tr>
                        <td>Number </td>
                        <td class="font-weight-medium text-high-emphasis">
                          **** 4487
                        </td>
                      </tr>
                      <tr>
                        <td>Expires </td>
                        <td class="font-weight-medium text-high-emphasis">
                          08/2028
                        </td>
                      </tr>
                      <tr>
                        <td>Type </td>
                        <td class="font-weight-medium text-high-emphasis">
                          Master Card
                        </td>
                      </tr>
                      <tr>
                        <td>Issuer </td>
                        <td class="font-weight-medium text-high-emphasis">
                          VICBANK
                        </td>
                      </tr>
                      <tr>
                        <td>ID </td>
                        <td class="font-weight-medium text-high-emphasis">
                          DH73DJ8
                        </td>
                      </tr>
                    </VTable>
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTable>
                      <tr>
                        <td>Billing </td>
                        <td class="font-weight-medium text-high-emphasis">
                          United Kingdom
                        </td>
                      </tr>
                      <tr>
                        <td>Number</td>
                        <td class="font-weight-medium text-high-emphasis">
                          +7634 983 637
                        </td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td class="font-weight-medium text-high-emphasis">
                          vafgot@vultukir.org
                        </td>
                      </tr>
                      <tr>
                        <td>Origin</td>
                        <td class="d-flex">
                          <div class="me-2 font-weight-medium text-high-emphasis">
                            United States
                          </div>
                          <img
                            :src="usFlag"
                            height="20"
                            width="20"
                          >
                        </td>
                      </tr>
                      <tr>
                        <td>CVC Check</td>
                        <td class="d-flex">
                          <div class="me-2 font-weight-medium text-high-emphasis">
                            Passed
                          </div>
                          <VAvatar
                            variant="tonal"
                            color="success"
                            size="20"
                            inline
                          >
                            <VIcon
                              icon="tabler-check"
                              color="success"
                              size="12"
                            />
                          </VAvatar>
                        </td>
                      </tr>
                    </VTable>
                  </VCol>
                </VRow>
              </div>
            </div>
          </VExpandTransition>
          <VDivider v-if="index !== paymentData.length - 1" />
        </div>
      </template>
    </VCardText>
  </VCard>
  <AddEditAddressDialog
    v-model:isDialogVisible="isEditAddressDialogVisible"
    :billing-address="editBillingData"
  />
  <AddEditAddressDialog v-model:isDialogVisible="isNewEditAddressDialogVisible" />
  <CardAddEditDialog
    v-model:isDialogVisible="isCardAddDialogVisible"
    :card-details="currentCardDetails"
  />
  <CardAddEditDialog v-model:isDialogVisible="isNewCardAddDialogVisible" />
</template>
