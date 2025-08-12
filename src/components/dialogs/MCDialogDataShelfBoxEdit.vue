<script setup lang="ts">
import { v4 as uuidV4 } from 'uuid'
import MCDialogAddCitation from './MCDialogAddCitation.vue'
import { DataShelfBoxModelNew, DataShelfBoxModelView } from '@/types/dataShelf'
import type { IDataShelfBoxView, IFootNote } from '@/types/dataShelf'
import { DataBoxType, MessageType, SizeType } from '@/types/baseModels'
import type { IReference } from '@/utils/refrenceUtils'
import { generateFootnoteRefrence } from '@/utils/refrenceUtils'

interface Props {
  isDialogVisible: boolean
  datashelfboxid: number
  treeid?: number
  nodeid?: number
}

const props = defineProps<Props>()

const emits = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const tempdataItem = reactive<IDataShelfBoxView>(new DataShelfBoxModelView())
const footNotes = reactive<IFootNote[]>([])
const opening = shallowRef(false)
const dialogSupervisionHistory = shallowRef(false)
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'updatedataboxItem', databoxItem: IDataShelfBoxView): void
  (e: 'insertdataboxItem'): void

  (e: 'handlemessage', message: string, type: MessageType): void

}

const isloading = shallowRef(false)
const editor = ref<HTMLDivElement>()

// const editableContent = ref('')
// const footNotes = reactive<IFootNote[]>([])

// // const { focused } = useFocus(target)
// watch(footNotes, () => {
//   console.log('footnotechanged', footNotes)
// })
onMounted(() => {
  if (props.datashelfboxid > 0)
    getDataBoxItem()

//   editableContent.value = props.dataItem.text
//   footNotes.push(...props.dataItem.footnote ?? [])
})

async function getDataBoxItem() {
  opening.value = true
  try {
    const result = await $api <IDataShelfBoxView>(`app/excerpt/${props.datashelfboxid}`, {
      method: 'GET',
    })

    Object.assign(tempdataItem, result)
    if (result.footNotes && result.footNotes.length > 0)
      footNotes.push(...result.footNotes)

    opening.value = false
  }
  catch (error) {
    console.log('error', error)

    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    emits('update:isDialogVisible', false)
  }
}

const acceptchanged = async () => {
//   console.log('htmlbefore', editor.value?.innerHTML)
  isloading.value = true

  tempdataItem.content = editor.value?.innerHTML ?? ''
  tempdataItem.footNotes.splice(0)
  tempdataItem.footNotes.push(...footNotes)
  try {
    const result = await $api<IDataShelfBoxView>(`app/excerpt/${DataBoxType[tempdataItem.excerptType.id]}${props.datashelfboxid !== 0 ? `/${tempdataItem.id}` : ''}`, {
      method: props.datashelfboxid === 0 ? 'POST' : 'PUT',
      body: JSON.stringify(new DataShelfBoxModelNew(tempdataItem.id, props.datashelfboxid === 0 ? props.treeid ?? 0 : tempdataItem.treeId, props.datashelfboxid === 0 ? props.nodeid ?? 0 : tempdataItem.node?.id ?? 0, tempdataItem.content, tempdataItem.description, tempdataItem.footNotes, tempdataItem.labels.map(item => item.id))),
    })

    if (result && result.id > 0) {
      emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
      if (props.datashelfboxid === 0)
        emits('insertdataboxItem')

      else
        emits('updatedataboxItem', result)
    }
    isloading.value = false
  }
  catch (error) {
    isloading.value = false

    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
  }
  emits('update:isDialogVisible', false)

  //   console.log('htmlafter', tempdataItem.text)
}

const refreshfootnote = () => {
  if (editor.value) {
    const sups = editor.value.querySelectorAll('sup.footenote-index')

    // NOTE - اندیس های بعد از اندیس حذف شده را منهای یک میکنیم
    for (let footnoteIndex = 0; footnoteIndex < sups.length; footnoteIndex++) {
    //   const footnoteid = Number.parseInt(sups[footnoteIndex].attributes[1].value)
      const footnoteid = sups[footnoteIndex].attributes[1].value
      const footnoteItem = footNotes.find(item => item.id === footnoteid)
      if (footnoteItem)
        footnoteItem.order = footnoteIndex + 1
      sups[footnoteIndex].textContent = (footnoteIndex + 1).toString()
    }
  }
}

const canFootnoteAction = () => {
  const selection = window.getSelection()

  if ((selection?.rangeCount ?? 0) > 0) {
    const range = selection?.getRangeAt(0)
    const selectedText = range?.toString().trim()
    const parent = range?.startContainer.parentNode
    if (selectedText && !(parent?.nodeName === 'SUP'))
      return true
  }

  return false
}

const addFootnote = () => {
  if (canFootnoteAction()) {
    const selection = window.getSelection()
    const sup = document.createElement('sup')
    const uuid = uuidV4()

    sup.innerText = (footNotes.length + 1).toString()
    sup.className = 'footenote-index'
    sup.setAttribute('footnote-id', uuid.toString())

    //   sup.addEventListener('click', (event: MouseEvent) => {})
    const range = selection?.getRangeAt(0)

    range?.collapse(false)
    range?.insertNode(sup) // افزودن <sup> به محتوای div
    footNotes.push({ title: '', id: uuid.toString(), editing: true, order: footNotes.length + 1, isReference: false })
    refreshfootnote()
  }
}

const startInsertBookCitation = () => {
  if (!canFootnoteAction())
    return
  const selection = window.getSelection()
  const sup = document.createElement('sup')
  const uuid = uuidV4()

  sup.innerText = (footNotes.length + 1).toString()
  sup.className = 'footenote-index'
  sup.setAttribute('footnote-id', uuid.toString())

  //   sup.addEventListener('click', (event: MouseEvent) => {})
  const range = selection?.getRangeAt(0)

  range?.collapse(false)
  range?.insertNode(sup) // افزودن <sup> به محتوای div
  footNotes.push({ title: '', id: uuid.toString(), editing: true, order: footNotes.length + 1, isReference: true })
  refreshfootnote()
  dialogSupervisionHistory.value = true
}

const finishInsertBookCitation = (citation: IReference | null) => {
  dialogSupervisionHistory.value = false

  const footnoteindex = footNotes.findIndex(item => item.title === '' && item.isReference)
  if (!citation)
    deletefootnote(footNotes[footnoteindex].id)

  else
    footNotes[footnoteindex] = { id: footNotes[footnoteindex].id, editing: false, isReference: true, order: footNotes[footnoteindex].order, title: generateFootnoteRefrence(citation), reference: citation }

  refreshfootnote()
}

const footnoteSort = computed(() => {
  return footNotes.sort((a, b) => a.order - b.order)
})

const deletefootnote = (footnoteId: string) => {
  if (editor.value) {
    const removedsup = editor.value.querySelector(`sup[footnote-id="${footnoteId}"]`)

    if (removedsup != null) {
      const parent = removedsup.parentNode // والد را پیدا کنید

      parent?.removeChild(removedsup)
    }
    footNotes.splice(footNotes.findIndex(item => item.id === footnoteId), 1)
    refreshfootnote()
  }
}

function handlepasteaction(event: ClipboardEvent) {
  event.preventDefault()

  const text = event.clipboardData?.getData('text/plain') ?? ''

  if (editor.value) {
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)

    range?.deleteContents() // حذف محتویات انتخاب‌شده
    range?.insertNode(document.createTextNode(text)) // درج متن ساده
    setTimeout(() => {
      selection?.removeAllRanges()
    }, 0)
  }
}
function checkForRemovedFootnotes() {
  if (editor.value && footNotes.length > 0) {
    const supElements = editor.value.querySelectorAll('sup')

    // بررسی آیا پاورقی‌ها در لیست موجود هستند
    const currentFootnotes = Array.from(supElements).map(sup => Number.parseInt(sup.innerText))

    footNotes.filter(footnote => !currentFootnotes.includes(footnote.order)).forEach(footnoteisdelete => {
      deletefootnote(footnoteisdelete.id)
    })
  }
}

// defineExpose({ updateGate })
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading || opening" @click="emits('update:isDialogVisible', false)" />
    <VCard flat :title="$t('datashelfbox.addedit')" :loading="opening" class="pa-1">
      <MCLoading :loadingsize="SizeType.MD" :showloading="opening" />

      <VCardText>
        <div
          ref="editor"
          contenteditable="true"
          class="fish-editor"
          @input="checkForRemovedFootnotes"
          @paste="handlepasteaction" v-html="tempdataItem.content"
        />
        <div class="d-flex pb-2 flex-column">
          <MCDataBoxEditableFootnote
            v-for="(footnote, i) in footnoteSort" :id="footnote.id" :key="footnote.id" v-model:editing="footnote.editing"
            v-model:text="footnote.title"
            :index="i + 1" :order="i + 1" @deletefootnote="deletefootnote"
          />
        </div>
        <VDivider />
        <VCardActions>
          <VBtn variant="flat" :loading="isloading" @click="acceptchanged">
            {{ t('accept') }}
          </VBtn>

          <VBtn variant="flat" icon :disabled="isloading" @click="addFootnote">
            <VIcon icon="tabler-superscript" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ t('datashelfbox.adddescfootnote') }}
            </VTooltip>
          </VBtn>
          <VBtn variant="flat" icon :disabled="isloading" @click="startInsertBookCitation">
            <VIcon icon="tabler-book-2" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ t('datashelfbox.addcitationfootnote') }}
            </VTooltip>
          </VBtn>
        </VCardActions>

        <!-- <div v-html="renderedContent" /> -->
      </VCardText>
    </VCard>
    <MCDialogAddCitation
      v-if="dialogSupervisionHistory" v-model:is-dialog-visible="dialogSupervisionHistory"
      @error-has-occured="emits('handlemessage', $event, MessageType.error)" @citationcreated="finishInsertBookCitation"
    />
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>
