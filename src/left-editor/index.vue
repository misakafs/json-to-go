<template>
    <Panel header="JSON">
        <template #icons>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'github/源码'" @click="repoFn">
                <span class="pi pi-github"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'clear/清空'" @click="cleanFn">
                <span class="pi pi-trash"></span>
            </button>
            <button class="left-copy p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'copy/复制'">
                <span class="pi pi-copy"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'transform/转换'" @click="transformFn">
                <span class="pi pi-forward"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" @click="toggleFn" v-tooltip.bottom="'more/更多'">
                <span class="pi pi-bars"></span>
            </button>
            <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
        </template>
        <pre id="leftEditor" class="editor"></pre>
    </Panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Clipboard from 'clipboard'
import debounce from 'debounce'
import { useEditor, Mode } from '../editor'
import { useMenu } from './menu'
import { useLeftEditorEvent, setLeftEditorValue, onLeftEditorTransform, setCodegenStrategyOption } from '../bus/event'

const { editor } = useEditor('leftEditor', Mode.hjson)
const { items, menu, toggleFn } = useMenu()
useLeftEditorEvent(editor)

onMounted(() => {
    editor.value.setOption('wrap', 'free')
    editor.value.on('blur', function () {
        transformFn()
    })
    editor.value.on(
        'change',
        debounce(function () {
            transformFn()
        }, 300)
    )
})

// 源码
const repoFn = () => {
    window.open('https://github.com/misakafs/json-to-go', '_blank')
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
