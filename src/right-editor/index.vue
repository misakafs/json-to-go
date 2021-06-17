<template>
    <Panel header="GO">
        <template #icons>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="'关于'" @click="aboutFn">
                <span class="pi pi-question"></span>
            </button>
            <button class="p-panel-header-icon p-link p-mr-4" v-tooltip.bottom="readonlyWord" @click="switchReadonly">
                <span class="pi" :class="readonlyIcon"></span>
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
	        基本功能已完善
        </p>
    </Dialog>

    <!--  右侧栏  -->
    <Sidebar v-model:visible="displayRightSider" :baseZIndex="1000" position="right" class="p-sidebar-lg" :showCloseIcon="false">
        <Panel header="设置">
            <keep-alive>
                <component :is="golang"></component>
            </keep-alive>
        </Panel>
    </Sidebar>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect, ref } from 'vue'
import Clipboard from 'clipboard'
import { useEditor, Mode } from '../editor'
import { useRightEditorEvent, onLeftEditorTransform, setCodegenStrategy } from '../bus/event'

// 引入组件
import golang from './golang.vue'

const { editor } = useEditor('rightEditor', Mode.go)
useRightEditorEvent(editor)

// 关于
const displayAboutDialog = ref(false)
const aboutFn = () => {
    displayAboutDialog.value = true
}

// 只读/编辑
const readonly = ref(false)
const readonlyWord = ref('编辑')
const readonlyIcon = ref('pi-eye-slash')
const switchReadonly = () => {
    readonly.value = !readonly.value
    readonlyWord.value = readonly.value ? '只读' : '编辑'
    readonlyIcon.value = readonly.value ? 'pi-eye' : 'pi-eye-slash'
    editor.value.setReadOnly(readonly.value)
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

// --- 选择开发语言
const devLang = ref({ name: 'Golang', code: 1 })
const change = () => {
    setCodegenStrategy(devLang.value.code)
}
</script>
