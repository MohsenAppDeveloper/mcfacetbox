<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { useToast } from 'vue-toastification'
import type { ISimpleDTO } from '@/types/baseModels'
import type { GateProperties } from '@/types/gate'

const props = defineProps({
  isDialogVisible: Boolean,
  gateApiUrl: String,
})

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'gateDataAdded', value: number): void
  (e: 'gateDataUpdated', value: number): void

}

const isloading = ref(false)

const editableContent = ref('<p>این یک متن نمونه است. کلمات را انتخاب کنید.</p>')
const footnotes = reactive<ISimpleDTO[]>([])
const highlightedWord = ref('')

const renderedContent = computed(() => {
  let content = editableContent.value
  footnotes.forEach((footnote, index) => {
    if (footnote.word.length != 0) {
      const regex = new RegExp(`${footnote.word}`, 'g')

      content = content.replace(
        regex,
        `<span class="footnote" data-footnote-index="${index}">${footnote.word}[${index + 1}]</span>`,
      )
    }
  })

  //   console.log('content', content)

  return content
})

const handleMouseUp = (event: MouseEvent) => {
  const selectedText = window.getSelection()?.toString().trim()

  highlightedWord.value = selectedText ?? ''
}

const addFootnote = () => {
  const selection = window.getSelection()
  if ((selection?.rangeCount ?? 0) > 0) {
    const range = selection?.getRangeAt(0)

    // const span = document.createElement('span')
    // span.className = 'footnote'
    // span.setAttribute('data-footnote-index', (footnotes.length + 1).toString())
    // const newHighlight = {
    //   start: range?.startOffset,
    //   end: range?.endOffset,
    //   node: range?.startContainer,
    //   parentNode: range?.startContainer.parentNode,
    // } as highlightRange

    const selectedText = range?.toString().trim()
    const parent = range?.startContainer.parentNode
    if (selectedText && !(parent?.nodeName === 'SUP')) {
      // ایجاد تگ <sup> برای افزودن شماره پاورقی
      const sup = document.createElement('sup')

      sup.innerText = (footnotes.length + 1).toString()
      sup.className = 'footnote'
      sup.addEventListener('click', (event: MouseEvent) => {})

      // افزودن شماره پاورقی بعد از متن انتخاب شده
      //   range?.deleteContents() // حذف متن انتخاب شده
      range?.collapse(false)
      range?.insertNode(sup) // افزودن <sup> به محتوای div
      footnotes.push({ title: (selectedText ?? ''), id: footnotes.length + 1 })
    }

    // const overlap = highlights.some(highlight => {
    //   return isOverlapping(highlight, newHighlight)
    // })

    // if (overlap) {
    //   alert('نمی‌توانید این ناحیه را هایلایت کنید چون با هایلایت قبلی تداخل دارد.')

    //   return
    // }
    // range?.surroundContents(span)

    // // بدست آوردن مختصات
    // const rect = span.getBoundingClientRect()

    // span.textContent = `${span.textContent}[${footnotes.length + 1}]`

    // }
    // else {
    //   range?.extractContents()
    //   console.log('problem in range')
    // }
  }
}

const updateContent = () => {
  const editor = document.querySelector('.editor')

  editableContent.value = editor?.textContent ?? '' // به روز رسانی محتوای ویرایشگر
}

const onReset = () => {
  isloading.value = false

  emit('update:isDialogVisible', false)
}

const updateGate = (gateDataItem: GateProperties) => {
}

defineExpose({ updateGate })
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('gate.addedit')" :subtitle="$t('gate.addeditsubtitle')">
      <VCardText>
        <div
          ref="editor"
          contenteditable="true"
          class="editor"
          @mouseup="handleMouseUp"
          v-html="editableContent"
        />
        <div v-if="footnotes.length > 0" class="py-3 px-4">
          <VChip
            v-for="(footnote, i) in footnotes"
            :key="i"
            class="me-2"
          />
        </div>
        <VBtn @click="addFootnote">
          Add Footnote
        </VBtn>
        <!-- <div v-html="renderedContent" /> -->
      </VCardText>
    </VCard>
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>

<style lang="css">
.editor {
  padding: 10px;
  border: 1px solid #ccc;
  margin-block-end: 20px;
  min-block-size: 200px;
}

.output {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  min-block-size: 200px;
}

.footnote {
  color: blue;
  cursor: pointer;
  transition: color 0.3s;
}
</style>
