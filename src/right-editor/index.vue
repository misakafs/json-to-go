<template>
    <Panel header="GO">
        <template #icons>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'关于'" @click="aboutFn">
                <span class="pi pi-question"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-2" v-tooltip.bottom="'刷新'" @click="refreshFn">
                <span class="pi pi-refresh"></span>
            </button>
            <button class="right-copy p-panel-header-icon p-link p-mr-2" v-tooltip.bottom="'复制'">
                <span class="pi pi-copy"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-2" v-tooltip.bottom="'设置'" @click="settingFn">
                <span class="pi pi-cog"></span>
            </button>
        </template>
        <pre id="rightEditor" class="editor"></pre>
    </Panel>
    <!--  关于的弹框  -->
    <Dialog header="关于" v-model:visible="displayAboutDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
        <p>

        </p>
    </Dialog>

    <!--  右侧栏  -->
    <Sidebar v-model:visible="displayRightSider" :baseZIndex="1000" position="right">
        <h3>Right Sidebar</h3>
    </Sidebar>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Clipboard from 'clipboard'
import { useEditor, Mode } from '../editor'
import { useRightEditorEvent, onLeftEditorTransform } from '../bus/event'

const { editor } = useEditor('rightEditor', Mode.hjson)
useRightEditorEvent(editor)

// 关于
const displayAboutDialog = ref(false)
const aboutFn = () => {
    displayAboutDialog.value = true
}

// 刷新
const refreshFn = () => {
    onLeftEditorTransform()
}

// 复制
onMounted(() => {
    new Clipboard('.right-copy', {
        text: function (trigger) {
            return editor.value.getValue()
        }
    })
})

// 设置
const displayRightSider = ref(false)
const settingFn = () => {
    displayRightSider.value = true
}

// feature:
// 仅读 []
// 复制
// 选择转换语言
// - go 添加自定义tag
//      命名方式
//      是否内嵌结构体
//      根对象名
//      json类型对应go类型
// 关于
</script>
