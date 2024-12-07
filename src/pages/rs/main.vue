<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { VTreeview } from 'vuetify/labs/VTreeview'
import type { ISimpleTree } from '@/types/baseModels'

const items = [{ title: 'Option 1', value: 'Option 1' }, { title: 'Option 2', value: 'Option 2' }, { title: 'Option 3', value: 'Option 3' }]

const collectingdataitems = reactive<SearchResultTabBoxModel>({
  id: 0,
  content: [
    { id: 0, title: 'حدیث', content: [{ id: 0, text: 'عَلِيُّ بْنُ مُحَمَّدٍ عَنْ سَهْلِ بْنِ زِيَادٍ عَنْ عَمْرِو بْنِ عُثْمَانَ عَنْ مُفَضَّلِ بْنِ صَالِحٍ عَنْ سَعْدِ بْنِ طَرِيفٍ عَنِ اَلْأَصْبَغِ بْنِ نُبَاتَةَ عَنْ عَلِيٍّ عَلَيْهِ اَلسَّلاَمُ قَالَ: هَبَطَ جَبْرَئِيلُ عَلَى آدَمَ عَلَيْهِ اَلسَّلاَمُ فَقَالَ يَا آدَمُ إِنِّي أُمِرْتُ أَنْ أُخَيِّرَكَ وَاحِدَةً مِنْ ثَلاَثٍ فَاخْتَرْهَا وَ دَعِ اِثْنَتَيْنِ فَقَالَ لَهُ آدَمُ يَا جَبْرَئِيلُ وَ مَا اَلثَّلاَثُ فَقَالَ اَلْعَقْلُ وَ اَلْحَيَاءُ وَ اَلدِّينُ فَقَالَ آدَمُ إِنِّي قَدِ اِخْتَرْتُ اَلْعَقْلَ فَقَالَ جَبْرَئِيلُ لِلْحَيَاءِ وَ اَلدِّينِ اِنْصَرِفَا وَ دَعَاهُ - فَقَالاَ يَا جَبْرَئِيلُ إِنَّا أُمِرْنَا أَنْ نَكُونَ مَعَ اَلْعَقْلِ حَيْثُ كَانَ قَالَ فَشَأْنَكُمَا وَ عَرَجَ .' }, { id: 0, text: 'این یک متن تستی شماره دو حدیث است' }, { id: 0, text: 'این یک متن تستی شماره سه  حدیث است' }] },
    { id: 1, title: 'قران', content: [{ id: 0, text: 'این یک متن تستی شماره دو +-قران است' }, { id: 0, text: 'این یک متن تستی شماره یک قرآناست' }] },
    { id: 2, title: 'ترجمه', content: [{ id: 0, text: 'این یک متن تستی  ترجمه است' }] },
  ],
})

const menu = ref(false)
const projectList = reactive<ISimpleTree[]>([{ id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }, { id: 1, title: 'خانواده', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }])
const selectedProjects = ref<number[]>([])

// watch(selectedProjects, (newvalue, oldvalue) => {
//     roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => selectedProjects.value.includes(item.id))
// })
const infoSearch = ref()
function getInfoSearch() { }
</script>

<template>
  <div class="main">
    <Splitpanes
      style="block-size: calc(100vh - 157px);"
      rtl
      class="default-theme"
    >
      <Pane size="30">
        <MCWindow
          title="درخت خانواده"
          class="family-tree"
          @open="menu = true"
        >
          <VRow
            no-gutters
            class="btn-box family-tree-toolbar"
          >
            <IconBtn
              size="small"
              @click=""
            >
              <VIcon
                icon="tabler-search"
                size="22"
              />
            </IconBtn>
            <IconBtn
              size="small"
              @click=""
            >
              <VIcon
                icon="tabler-select"
                size="22"
              />
            </IconBtn>
            <IconBtn
              size="small"
              @click=""
            >
              <VIcon
                icon="tabler-trash-x"
                size="22"
              />
            </IconBtn>
          </VRow>

          <VTreeview
            v-model:selected="selectedProjects"
            :items="projectList"
            expand-icon="mdi-menu-left"
            item-value="id"
            item-title="title"
            select-strategy="classic"
            height="620px"
            lines="one"
            selectable
          >
            <template #title="{ item }">
              <VTooltip :text="item.title">
                <template #activator="{ props }">
                  <span v-bind="props"> {{ item.title }}</span>
                </template>
              </VTooltip>
            </template>
          </VTreeview>
        </MCWindow>
      </Pane>

      <Pane>
        <Splitpanes
          horizontal
          rtl
          class="default-theme"
        >
          <Pane>
            <MCWindow
              title="گردآوری اطلاعات"
              @open="menu = true"
            >
              <template #default>
                <VContainer>
                  <VRow>
                    <VCol
                      cols="12"
                      md="6"
                      class="mx-auto"
                    >
                      <VTextField
                        v-model="infoSearch"
                        placeholder="جستجو"
                        append-inner-icon="mdi-magnify"
                        class="search-bar"
                        single-line
                        @click:append-inner="getInfoSearch"
                      />
                    </VCol>
                  </VRow>
                </VContainer>
                //TODO - تست کامپوننت تب بار، این کد موقتی است
                <MCSearchResultTabBox :dataitems="collectingdataitems" />
              </template>
            </MCWindow>
          </Pane>

          <Pane>
            <MCWindow
              title="قفسه داده"
              @open="menu = true"
            />
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>

    <!--
      <VMenu v-model="menu">
      <VList :items="items" />
      </VMenu>
    -->
  </div>
</template>
