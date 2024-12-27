<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu';
import { useSelectedNode } from '@/store/treeStore'
const selectenode = useSelectedNode()

const onContextMenu = (e: MouseEvent) => {
  // prevent the browser's default menu
  e.preventDefault()

  // show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: 'A menu item',
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: 'A submenu',
        children: [
          { label: 'Item1' },
          { label: 'Item2' },
          { label: 'Item3' },
        ],
      },
    ],
  })
}
</script>

<template>
  <VCard class="mc-data-shelf-box">
    <VCardText>

      <VRow no-gutters class="justify-start align-start box" @contextmenu="onContextMenu($event)">
        <VCheckbox density="compact" />
        <VCol class="data-box-content">
          <p class="text">
            2 عَلِيُّ بْنُ مُحَمَّدٍ عَنْ سَهْلِ بْنِ زِيَادٍ عَنْ عَمْرِو بْنِ عُثْمَانَ عَنْ مُفَضَّلِ بْنِ صَالِحٍ
            عَنْ
            سَعْدِ بْنِ طَرِيفٍ عَنِ اَلْأَصْبَغِ بْنِ نُبَاتَةَ عَنْ عَلِيٍّ عَلَيْهِ اَلسَّلاَمُ قَالَ: هَبَطَ
            جَبْرَئِيلُ عَلَى آدَمَ عَلَيْهِ اَلسَّلاَمُ فَقَالَ يَا آدَمُ إِنِّي أُمِرْتُ أَنْ أُخَيِّرَكَ وَاحِدَةً
            مِنْ
            ثَلاَثٍ فَاخْتَرْهَا وَ دَعِ اِثْنَتَيْنِ فَقَالَ لَهُ آدَمُ يَا جَبْرَئِيلُ وَ مَا اَلثَّلاَثُ فَقَالَ
            اَلْعَقْلُ وَ اَلْحَيَاءُ وَ اَلدِّينُ فَقَالَ آدَمُ إِنِّي قَدِ اِخْتَرْتُ اَلْعَقْلَ فَقَالَ جَبْرَئِيلُ
            لِلْحَيَاءِ وَ اَلدِّينِ اِنْصَرِفَا وَ دَعَاهُ - فَقَالاَ يَا جَبْرَئِيلُ إِنَّا أُمِرْنَا أَنْ نَكُونَ
            مَعَ
            اَلْعَقْلِ حَيْثُ كَانَ قَالَ فَشَأْنَكُمَا وَ عَرَجَ .
          </p>
          <div class="foot-note">این قسمت محل پاورقی</div>
        </VCol>

      </VRow>
    </VCardText>

    <VRow no-gutters class="border-t-sm" justify="space-between">
      <div>
        <VRow no-gutters class="btn-box data-box-toolbar">

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-pin" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-info-circle" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-edit" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-box-multiple" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-plug-connected-x" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-trash-x" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-tag" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-square-plus" size="22" />
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-text-plus" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-layers-linked" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-refresh" size="22" />
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-history" size="22" />
          </VBtn>
        </VRow>

      </div>
      <div>
        <VRow no-gutters class="btn-box data-box-toolbar d-flex justify-content-between">

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-plug-connected-x" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-message" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-tag" size="22" />
          </VBtn>
        </VRow>
      </div>
    </VRow>
  </VCard>

</template>

<style lang="css" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
