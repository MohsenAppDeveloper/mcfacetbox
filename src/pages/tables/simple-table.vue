<script setup lang="ts">
import * as demoCode from '@/views/demos/forms/tables/simple-table/demoCodeSimpleTable'
</script>

<template>
  <VRow>
    <VCol cols="12">
      <AppCardCode
        title="Basic"
        :code="demoCode.basic"
        no-padding
      >
        <DemoSimpleTableBasic />
      </AppCardCode>
    </VCol>

    <VCol cols="12">
      <AppCardCode
        title="Theme"
        :code="demoCode.theme"
        no-padding
      >
        <VCardText>
          use <code>theme</code> prop to switch table to the dark theme.
        </VCardText>
        <DemoSimpleTableTheme />
      </AppCardCode>
    </VCol>

    <VCol cols="12">
      <AppCardCode
        title="Density"
        :code="demoCode.density"
        no-padding
      >
        <VCardText>
          You can show a dense version of the table by using the <code>density</code> prop.
        </VCardText>
        <DemoSimpleTableDensity />
      </AppCardCode>
    </VCol>

    <VCol cols="12">
      <AppCardCode
        title="Height"
        :code="demoCode.height"
        no-padding
      >
        <VCardText>
          You can set the height of the table by using the <code>height</code> prop.
        </VCardText>
        <DemoSimpleTableHeight />
      </AppCardCode>
    </VCol>

    <VCol cols="12">
      <AppCardCode
        title="Fixed Header"
        :code="demoCode.fixedHeader"
        no-padding
      >
        <VCardText>
          You can fix the header of table by using the <code>fixed-header</code> prop.
        </VCardText>
        <DemoSimpleTableFixedHeader />
      </AppCardCode>
    </VCol>
  </VRow>
</template>
