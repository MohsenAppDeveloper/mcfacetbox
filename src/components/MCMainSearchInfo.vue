<script setup lang="ts">
import { SearchResultTabBoxModel } from '@/types/SearchResult';
const collectingdataitems = reactive<SearchResultTabBoxModel>({
  id: 0,
  content: [
    { id: 0, title: 'حدیث', content: [{ id: 0, text: 'عَلِيُّ بْنُ مُحَمَّدٍ عَنْ سَهْلِ بْنِ زِيَادٍ عَنْ عَمْرِو بْنِ عُثْمَانَ عَنْ مُفَضَّلِ بْنِ صَالِحٍ عَنْ سَعْدِ بْنِ طَرِيفٍ عَنِ اَلْأَصْبَغِ بْنِ نُبَاتَةَ عَنْ عَلِيٍّ عَلَيْهِ اَلسَّلاَمُ قَالَ: هَبَطَ جَبْرَئِيلُ عَلَى آدَمَ عَلَيْهِ اَلسَّلاَمُ فَقَالَ يَا آدَمُ إِنِّي أُمِرْتُ أَنْ أُخَيِّرَكَ وَاحِدَةً مِنْ ثَلاَثٍ فَاخْتَرْهَا وَ دَعِ اِثْنَتَيْنِ فَقَالَ لَهُ آدَمُ يَا جَبْرَئِيلُ وَ مَا اَلثَّلاَثُ فَقَالَ اَلْعَقْلُ وَ اَلْحَيَاءُ وَ اَلدِّينُ فَقَالَ آدَمُ إِنِّي قَدِ اِخْتَرْتُ اَلْعَقْلَ فَقَالَ جَبْرَئِيلُ لِلْحَيَاءِ وَ اَلدِّينِ اِنْصَرِفَا وَ دَعَاهُ - فَقَالاَ يَا جَبْرَئِيلُ إِنَّا أُمِرْنَا أَنْ نَكُونَ مَعَ اَلْعَقْلِ حَيْثُ كَانَ قَالَ فَشَأْنَكُمَا وَ عَرَجَ .' }, { id: 0, text: 'این یک متن تستی شماره دو حدیث است' }, { id: 0, text: 'این یک متن تستی شماره سه  حدیث است' }] },
    { id: 1, title: 'قران', content: [{ id: 0, text: 'این یک متن تستی شماره دو +-قران است' }, { id: 0, text: 'این یک متن تستی شماره یک قرآناست' }] },
    { id: 2, title: 'ترجمه', content: [{ id: 0, text: 'این یک متن تستی  ترجمه است' }] },
  ],
})
const infoSearch = ref();
function getInfoSearch() { }
</script>

<template>
  <div>
    <VContainer>
      <VRow>
        <VCol cols="12" md="6" class="mx-auto">
          <VTextField v-model="infoSearch" placeholder="جستجو" append-inner-icon="mdi-magnify" class="search-bar"
            single-line @click:append-inner="getInfoSearch" />
        </VCol>
      </VRow>
    </VContainer>
    //TODO - تست کامپوننت تب بار، این کد موقتی است
    <MCSearchResultTabBox :dataitems="collectingdataitems" />
  </div>

</template>
