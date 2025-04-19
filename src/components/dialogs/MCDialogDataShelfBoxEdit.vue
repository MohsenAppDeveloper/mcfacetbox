<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { v4 as uuidV4 } from 'uuid'
import { useToast } from 'vue-toastification'
import { DataShelfBoxModel, type IDataShelfBox, type IFootNote } from '@/types/dataShelf'

interface Props {
  isDialogVisible: boolean
  databoxItem?: IDataShelfBox
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const tempdataItem = reactive<IDataShelfBox>(new DataShelfBoxModel())
const footnotes = reactive<IFootNote[]>([])

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:databoxItem', databoxItem: IDataShelfBox): void
}

const isloading = ref(false)
const editor = ref<HTMLDivElement>()

// const editableContent = ref('')
// const footnotes = reactive<IFootNote[]>([])

// // const { focused } = useFocus(target)
// watch(footnotes, () => {
//   console.log('footnotechanged', footnotes)
// })
onMounted(() => {
  Object.assign(tempdataItem, props.databoxItem)
  footnotes.push(...tempdataItem.footnotes)

//   editableContent.value = props.dataItem.text
//   footnotes.push(...props.dataItem.footnote ?? [])
})

const onReset = () => {
  isloading.value = false
  emit('update:isDialogVisible', false)
}

const acceptchanged = () => {
//   console.log('htmlbefore', editor.value?.innerHTML)
  isloading.value = true
  setTimeout(() => {
    tempdataItem.text = editor.value?.innerHTML ?? ''
    tempdataItem.footnotes.splice(0)
    tempdataItem.footnotes.push(...footnotes)

    //   console.log('htmlafter', tempdataItem.text)

    emit('update:databoxItem', tempdataItem)
    onReset()
  }, 3000)
}

const refreshfootnote = () => {
  if (editor.value) {
    const sups = editor.value.querySelectorAll('sup.footenote-index')

    // NOTE - اندیس های بعد از اندیس حذف شده را منهای یک میکنیم
    for (let footnoteIndex = 0; footnoteIndex < sups.length; footnoteIndex++) {
    //   const footnoteid = Number.parseInt(sups[footnoteIndex].attributes[1].value)
      const footnoteid = sups[footnoteIndex].attributes[1].value
      const footnoteItem = footnotes.find(item => item.id === footnoteid)
      if (footnoteItem)
        footnoteItem.index = footnoteIndex + 1
      sups[footnoteIndex].textContent = (footnoteIndex + 1).toString()
    }
  }
}

const addFootnote = () => {
  // NOTE - بدلیل نیاز به نمایش شماره پاورقی ها از یک همه جا اندیس پاورقی بعلاوه یک شده است، برای همین هرجا بخواهیم به یک رکورد از آرایه پاورقی دسترسی داشته باشیم، اندیس نمایش را منهای یک می کنیم
  const selection = window.getSelection()
  if ((selection?.rangeCount ?? 0) > 0) {
    const range = selection?.getRangeAt(0)
    const selectedText = range?.toString().trim()
    const parent = range?.startContainer.parentNode
    if (selectedText && !(parent?.nodeName === 'SUP')) {
      const sup = document.createElement('sup')
      const uuid = uuidV4()

      sup.innerText = (footnotes.length + 1).toString()
      sup.className = 'footenote-index'
      sup.setAttribute('footnote-id', uuid.toString())

      //   sup.addEventListener('click', (event: MouseEvent) => {})
      range?.collapse(false)
      range?.insertNode(sup) // افزودن <sup> به محتوای div
      footnotes.push({ title: '', id: uuid.toString(), editing: true, index: footnotes.length + 1 })
      refreshfootnote()
    }
  }
}

const footnoteSort = computed(() => {
  return footnotes.sort((a, b) => a.index - b.index)
})

const deletefootnote = (footnoteId: string) => {
  if (editor.value) {
    const removedsup = editor.value.querySelector(`sup[footnote-id="${footnoteId}"]`)

    if (removedsup != null) {
      const parent = removedsup.parentNode // والد را پیدا کنید

      parent?.removeChild(removedsup)
    }
    footnotes.splice(footnotes.findIndex(item => item.id === footnoteId), 1)
    refreshfootnote()
  }
}

function checkForRemovedFootnotes() {
  if (editor.value && footnotes.length > 0) {
    const supElements = editor.value.querySelectorAll('sup')

    // بررسی آیا پاورقی‌ها در لیست موجود هستند
    const currentFootnotes = Array.from(supElements).map(sup => Number.parseInt(sup.innerText))

    footnotes.filter(footnote => !currentFootnotes.includes(footnote.index)).forEach(footnoteisdelete => {
      console.log('filter', footnotes, currentFootnotes, footnoteisdelete)

      deletefootnote(footnoteisdelete.id)
    })
  }
}

// defineExpose({ updateGate })
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <VCard flat :title="$t('datashelfbox.addedit')">
      <VCardText>
        <div
          ref="editor"
          contenteditable="true"
          class="fish-editor"
          @input="checkForRemovedFootnotes"
          v-html="tempdataItem.text"
        />
        <div class="d-flex pb-2 flex-column">
          <MCDataBoxEditableFootnote
            v-for="(footnote, i) in footnoteSort" :id="footnote.id" :key="footnote.id" v-model:editing="footnote.editing"
            v-model:text="footnote.title"
            :index="i + 1" @deletefootnote="deletefootnote"
          />
        </div>
        <VDivider />
        <VCardActions>
          <VBtn variant="plain" :loading="isloading" @click="acceptchanged">
            {{ t('accept') }}
          </VBtn>

          <VBtn variant="plain" icon :disabled="isloading" @click="addFootnote">
            <VIcon icon="tabler-superscript" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ t('datashelfbox.addfootnote') }}
            </VTooltip>
          </VBtn>
        </VCardActions>

        <!-- <div v-html="renderedContent" /> -->
      </VCardText>
    </VCard>
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>
