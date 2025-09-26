<script setup lang="ts">
import { VTextarea } from 'vuetify/lib/components/index.mjs'

interface Props {
  editing?: boolean
  text: string
  index: number
  id: string
  order: number
  isrefrence: boolean
}
interface Emit {
  (e: 'update:text', text: string): void
  (e: 'update:editing', editing: boolean): void
  (e: 'deletefootnote', footnoteId: string): void

}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const iseditMode = ref(props.editing)
const footnoteeditor = ref()
const footnoteText = ref('')

// watch(footnoteText, () => {
//   emit('update:text', footnoteText.value)
// })
watch(iseditMode, () => {
  emit('update:editing', iseditMode.value)
  if (footnoteText.value.length > 0)
    emit('update:text', footnoteText.value)
})

// watch(() => props.editing, () => {
//   console.log('editing', props)
// })
onMounted(() => {
  footnoteText.value = props.text
})

const deletefootnote = () => {
  emit('deletefootnote', props.id)
}

const acceptfootnote = (event: KeyboardEvent) => {
  iseditMode.value = false
  event.preventDefault()
}

const cancelAction = () => {
  if (footnoteText.value.length > 0 && props.text.length > 0) {
    iseditMode.value = false
    footnoteText.value = props.text
  }
  else { deletefootnote() }
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
  <div class="d-flex flex-grow-1 pb-0">
    <!--
      <VChip
      v-if="!(props.editing ?? false)"
      class="me-2"
      :text="`${props.index}  ${props.text}`"
      @dblclick="editfootnote($event)"
      >
      </VChip>
    -->
    <VTextarea
      v-if="props.editing && !props.isrefrence"
      :ref="footnoteeditor" v-model="footnoteText" auto-grow
      :rows="1"
      autofocus
      density="compact"
      width="100%"
      @keydown.enter="
        acceptfootnote($event)"
      @keydown.esc="cancelAction"
      @blur="iseditMode = false
      "
    />
    <div v-else class="d-flex align-center w-100">
      <div class="px-1">
        <span class="footenote-index">{{ props.order }} -</span>
        <span class="no-select foot-note" @dblclick="editfootnote">{{ props.text }}</span>
      </div>
      <VBtn icon size="small" variant="text" @click.left="editfootnote">
        <VIcon icon="tabler-edit" size="16" />
      </VBtn>
      <VBtn icon size="small" variant="text" @click.left="deletefootnote">
        <VIcon icon="tabler-trash" color="error" size="16" />
      </VBtn>
    </div>
  </div>
</template>
