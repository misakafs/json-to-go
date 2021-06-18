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
        <p>基本功能已完善</p>
    </Dialog>

    <!--  右侧栏  -->
    <Sidebar v-model:visible="displayRightSider" :baseZIndex="1000" position="right" class="p-sidebar-lg" :showCloseIcon="false">
        <Panel header="设置">
            <div class="p-field-checkbox">
                <Checkbox id="binary" v-model="inline" :binary="true" />
                <label for="binary"> 是否内联类型</label>
            </div>
            <h5>根对象名</h5>
            <InputText type="text" v-model="rootName"></InputText>
            <h5>自定义Tag <a href="https://github.com/misakafs/json-to-go/blob/main/README.md#%E8%87%AA%E5%AE%9A%E4%B9%89tag" target="_blank">使用教程</a></h5>
            <InputText type="text" v-model="tag"></InputText>
        </Panel>
    </Sidebar>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import Clipboard from 'clipboard'
import { useEditor, Mode } from '../editor'
import { useRightEditorEvent, setCodegenStrategyOption } from '../bus/event'

const { editor } = useEditor('rightEditor', Mode.go)
useRightEditorEvent(editor)

// 关于
const displayAboutDialog = ref(false)
const aboutFn = () => {
    displayAboutDialog.value = true
}

// 只读/编辑
const readonly = ref(false)
const readonlyWord = ref('只读')
const readonlyIcon = ref('pi-eye')
const switchReadonly = () => {
    readonly.value = !readonly.value
    readonlyWord.value = readonly.value ? '编辑' : '只读'
    readonlyIcon.value = readonly.value ? 'pi-pencil' : 'pi-eye'
    editor.value.setReadOnly(readonly.value)
}

// 刷新
const refreshFn = () => {
    transform()
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

// 是否内联类型定义
const inline = ref(false)

// 自定义tag
const tag = ref('json:1:false')

// 根对象名
const rootName = ref('RootObject')

// 转换
const transform = () => {
    setCodegenStrategyOption({
        inline: inline.value,
        tag: tag.value.trim(),
        rootName: rootName.value
    })
}

watch([inline, tag, rootName], () => {
    transform()
})
onMounted(() => {
    transform()
})
</script>
