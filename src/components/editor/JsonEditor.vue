<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  modelValue: string
  language?: string
  fontSize?: number
  readOnly?: boolean
  height?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const container = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (!container.value) return
  editor = monaco.editor.create(container.value, {
    value: props.modelValue,
    language: props.language ?? 'json',
    theme: 'vs-dark',
    fontSize: props.fontSize ?? 13,
    fontFamily: 'Fira Code, monospace',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    wordWrap: 'on',
    automaticLayout: true,
    readOnly: props.readOnly ?? false,
    padding: { top: 12, bottom: 12 },
    bracketPairColorization: { enabled: true },
    renderLineHighlight: 'gutter',
    scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }
  })

  editor.onDidChangeModelContent(() => {
    const value = editor!.getValue()
    emit('update:modelValue', value)
    emit('change', value)
  })
})

onUnmounted(() => {
  editor?.dispose()
})

// Sync when parent changes the value (e.g., loading a template)
watch(
  () => props.modelValue,
  (val) => {
    if (editor && editor.getValue() !== val) {
      const model = editor.getModel()
      if (model) {
        model.pushEditOperations(
          [],
          [{ range: model.getFullModelRange(), text: val }],
          () => null
        )
      }
    }
  }
)

defineExpose({
  getValue: () => editor?.getValue() ?? '',
  setValue: (val: string) => editor?.setValue(val),
  focus: () => editor?.focus()
})
</script>

<template>
  <div
    ref="container"
    class="json-editor"
    :style="height ? { height } : {}"
  ></div>
</template>

<style scoped>
.json-editor {
  width: 100%;
  height: 100%;
}
</style>
