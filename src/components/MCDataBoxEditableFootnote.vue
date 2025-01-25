<script setup lang="ts">
import { VTextarea } from 'vuetify/lib/components/index.mjs'

interface Props {
  editing?: boolean
  text: string
  index: number
  id: number
}
interface Emit {
  (e: 'update:text', text: string): void
  (e: 'update:editing', editing: boolean): void
  (e: 'deletefootnote', footnoteId: number): void

}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const iseditMode = ref(true)
const footnoteeditor = ref()
const footnoteText = ref('')

// watch(footnoteText, () => {
//   emit('update:text', footnoteText.value)
// })
watch(iseditMode, () => {
  emit('update:editing', iseditMode.value)
  emit('update:text', footnoteText.value)
})

// watch(() => props.editing, () => {
//   console.log('editing', props)
// })
const deletefootnote = () => {
  emit('deletefootnote', props.id)
}

const acceptfootnote = (event: KeyboardEvent) => {
  iseditMode.value = false
  event.preventDefault()
}

const editfootnote = () => {
  iseditMode.value = true
  setTimeout(() => {
    // console.log('footnodechip', footnoteChips.value[footnoteindex], footnoteindex)
    footnoteeditor.value?.focus()
  }, 1000)
}
</script>

<template>
  <div class="d-flex flex-grow-1 flex-shrink-0 pb-0">
    <!--
      <VChip
      v-if="!(props.editing ?? false)"
      class="me-2"
      :text="`${props.index}  ${props.text}`"
      @dblclick="editfootnote($event)"
      >
      </VChip>
    -->
    <div v-if="!(props.editing ?? false)">
      <span class="footenote-index">{{ props.index }} -</span>
      <span class="no-select foot-note" @dblclick="editfootnote">{{ props.text }}</span>
      <VBtn icon size="small" variant="text" @click.left="deletefootnote">
        <VIcon icon="tabler-trash" color="error" size="16" />
      </VBtn>
    </div>
    <VTextarea
      v-else
      :ref="footnoteeditor" v-model="footnoteText" auto-grow
      :rows="1"
      autofocus
      density="compact"
      width="100%"
      @keydown.enter="
        acceptfootnote($event)"
      @keydown.esc="deletefootnote"
      @blur="iseditMode = false
      "
    />
  </div>
</template>
