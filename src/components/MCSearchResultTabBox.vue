<script setup lang="ts">
import { ISearchResultTabBox } from '@/types/SearchResult';
import { isUndefined } from '@sindresorhus/is';

const props = defineProps({
    title: { type: String },

})

interface Emit {
    (e: 'close'): void; // ایونت جدید close اضافه شد
    (e: 'open'): void; // ایونت جدید close اضافه شد
}

const tabdatamodel = ref()
const dataitems = reactive<ISearchResultTabBox>({
    id: 0, content: [
        { id: 0, title: 'حدیث', content: [{ id: 0, text: 'عَلِيُّ بْنُ مُحَمَّدٍ عَنْ سَهْلِ بْنِ زِيَادٍ عَنْ عَمْرِو بْنِ عُثْمَانَ عَنْ مُفَضَّلِ بْنِ صَالِحٍ عَنْ سَعْدِ بْنِ طَرِيفٍ عَنِ اَلْأَصْبَغِ بْنِ نُبَاتَةَ عَنْ عَلِيٍّ عَلَيْهِ اَلسَّلاَمُ قَالَ: هَبَطَ جَبْرَئِيلُ عَلَى آدَمَ عَلَيْهِ اَلسَّلاَمُ فَقَالَ يَا آدَمُ إِنِّي أُمِرْتُ أَنْ أُخَيِّرَكَ وَاحِدَةً مِنْ ثَلاَثٍ فَاخْتَرْهَا وَ دَعِ اِثْنَتَيْنِ فَقَالَ لَهُ آدَمُ يَا جَبْرَئِيلُ وَ مَا اَلثَّلاَثُ فَقَالَ اَلْعَقْلُ وَ اَلْحَيَاءُ وَ اَلدِّينُ فَقَالَ آدَمُ إِنِّي قَدِ اِخْتَرْتُ اَلْعَقْلَ فَقَالَ جَبْرَئِيلُ لِلْحَيَاءِ وَ اَلدِّينِ اِنْصَرِفَا وَ دَعَاهُ - فَقَالاَ يَا جَبْرَئِيلُ إِنَّا أُمِرْنَا أَنْ نَكُونَ مَعَ اَلْعَقْلِ حَيْثُ كَانَ قَالَ فَشَأْنَكُمَا وَ عَرَجَ .' }, { id: 0, text: 'این یک متن تستی شماره دو حدیث است' }, { id: 0, text: 'این یک متن تستی شماره سه  حدیث است' }] }
        , { id: 1, title: 'قران', content: [{ id: 0, text: 'این یک متن تستی شماره دو +-قران است' }, { id: 0, text: 'این یک متن تستی شماره یک قرآناست' },] }
        , { id: 2, title: 'ترجمه', content: [{ id: 0, text: 'این یک متن تستی  ترجمه است' }] }]
})

const emit = defineEmits<Emit>();
</script>

<template>
    <VCard class="mc-search-result">

        <VTabsWindow v-model="tabdatamodel">
            <VTabsWindowItem v-for="item in dataitems.content" :key="item.id" :value="item.id">
                <VCard>
                    <VCardText class="pa-2 border-sm rounded-lg">
                        <VDataIterator :items="item.content" :items-per-page="1">
                            <template v-slot:default="{ items }">
                                <div v-for="(textData, j) in items" :key="j" class="d-flex justify-start align-start">
                                    <VCheckbox
                                        v-if="(isUndefined(textData.raw.selectable) && item.content.length > 1) || (textData.raw.selectable)"
                                        v-model="textData.raw.selected" />
                                    <p class="pr-5"> {{ textData.raw.text }}
                                    </p>
                                </div>
                            </template>

                            <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                                <VFooter v-if="item.content.length > 1">
                                    <div class="d-flex justify-end w-100">
                                        <span class="ml-2">Page {{ page }} of {{ pageCount }}</span>
                                        <VBtn :disabled="page === 1" class="me-2" icon="tabler-arrow-right"
                                            size="xsmall" @click="prevPage"></VBtn>
                                        <VBtn :disabled="page === pageCount" icon="tabler-arrow-left" size="xsmall"
                                            @click="nextPage"></VBtn>
                                    </div>
                                </VFooter>
                            </template>
                        </VDataIterator>
                    </VCardText>
                </VCard>
            </VTabsWindowItem>
        </VTabsWindow>
        <VTabs v-model="tabdatamodel" align-tabs="start">
            <VTab v-for="item in dataitems.content" :key="item.id" :text="item.title" :value="item.id"></VTab>
        </VTabs>
    </VCard>
</template>
