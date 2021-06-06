<template>
    <Panel header="JSON">
        <template #icons>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'关于'" @click="aboutFn">
                <span class="pi pi-question"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'清空'" @click="cleanFn">
                <span class="pi pi-trash"></span>
            </button>
            <button class="left-copy p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'复制'">
                <span class="pi pi-copy"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'转换'" @click="transformFn">
                <span class="pi pi-forward"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" @click="toggleFn" v-tooltip.bottom="'更多'">
                <span class="pi pi-bars"></span>
            </button>
            <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
        </template>
        <pre id="leftEditor" class="editor"></pre>
    </Panel>
    <!--  关于的弹框  -->
    <Dialog header="关于" v-model:visible="displayAboutDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
    </Dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Clipboard from 'clipboard'
import debounce from 'debounce'
import { useEditor, Mode } from '../editor'
import { useMenu } from './menu'
import { useLeftEditorEvent, setLeftEditorValue, onLeftEditorTransform } from '../bus/event'

const { editor } = useEditor('leftEditor', Mode.hjson)
const { items, menu, toggleFn } = useMenu()
useLeftEditorEvent(editor)

onMounted(() => {
    editor.value.setOption("wrap", "free")
    editor.value.on('blur', function () {
        onLeftEditorTransform()
    })
    editor.value.on(
        'change',
        debounce(function () {
            onLeftEditorTransform()
        }, 500)
    )
})

// 关于
const displayAboutDialog = ref(false)
const aboutFn = () => {
    displayAboutDialog.value = true
}

// 清空
const cleanFn = () => {
    setLeftEditorValue('')
    onLeftEditorTransform()
}

// 复制
onMounted(() => {
    new Clipboard('.left-copy', {
        text: function (trigger) {
            return editor.value.getValue()
        }
    })
})

// 转换
const transformFn = () => {
    onLeftEditorTransform()
}
</script>
