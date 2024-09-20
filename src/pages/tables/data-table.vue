<script setup lang="ts">
import * as demoCode from '@/views/demos/forms/tables/data-table/demoCodeDataTable'
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Basic -->
      <AppCardCode
        title="Basic"
        :code="demoCode.basic"
        no-padding
      >
        <DemoDataTableBasic />
      </AppCardCode>
    </VCol>

    <VCol>
      <!-- 👉 Dense  -->
      <AppCardCode
        title="Dense"
        :code="demoCode.dense"
        no-padding
      >
        <DemoDataTableDense />
      </AppCardCode>
    </VCol>

    <!-- 👉 Table Cell Slot  -->
    <VCol cols="12">
      <AppCardCode
        title="Cell Slot"
        :code="demoCode.cellSlot"
        no-padding
      >
        <DemoDataTableCellSlot />
      </AppCardCode>
    </VCol>

    <!-- 👉 Table Row selection  -->
    <VCol cols="12">
      <AppCardCode
        title="Row Selection"
        :code="demoCode.rowSelection"
        no-padding
      >
        <DemoDataTableRowSelection />
      </AppCardCode>
    </VCol>

    <!-- 👉 Fixed Header  -->
    <VCol cols="12">
      <AppCardCode
        title="Fixed Header"
        :code="demoCode.fixedHeader"
        no-padding
      >
        <DemoDataTableFixedHeader />
      </AppCardCode>
    </VCol>

    <!-- 👉 Expandable rows -->
    <VCol cols="12">
      <AppCardCode
        title="Expandable Rows"
        :code="demoCode.expandableRows"
        no-padding
      >
        <DemoDataTableExpandableRows />
      </AppCardCode>
    </VCol>
    <!-- 👉 Grouping Rows -->
    <VCol cols="12">
      <AppCardCode
        title="Grouping Rows"
        :code="demoCode.groupingRows"
        no-padding
      >
        <DemoDataTableGroupingRows />
      </AppCardCode>
    </VCol>

    <!-- 👉 Row Editing via Dialog -->
    <VCol cols="12">
      <AppCardCode
        title="Row Editing via Dialog"
        :code="demoCode.rowEditingViaDialog"
        no-padding
      >
        <DemoDataTableRowEditingViaDialog />
      </AppCardCode>
    </VCol>

    <!-- 👉 External Pagination  -->
    <VCol cols="12">
      <AppCardCode
        title="External Pagination"
        :code="demoCode.externalPagination"
        no-padding
      >
        <DemoDataTableExternalPagination />
      </AppCardCode>
    </VCol>

    <!-- 👉 Kitchen Sink  -->
    <VCol cols="12">
      <AppCardCode
        title="Kitchen Sink"
        :code="demoCode.kitchenSink"
        no-padding
      >
        <DemoDataTableKitchenSink />
      </AppCardCode>
    </VCol>
  </VRow>
</template>
