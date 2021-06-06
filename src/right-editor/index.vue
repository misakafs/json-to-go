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
        <p></p>
    </Dialog>

    <!--  右侧栏  -->
    <Sidebar v-model:visible="displayRightSider" :baseZIndex="1000" position="right">
        <Panel header="设置">
            <div class="p-field-checkbox">
                <Checkbox id="binary" v-model="readonly" :binary="true" />
                <label for="binary"> 是否只读</label>
            </div>
            <br>
            <CascadeSelect
                @change='change'
                v-model="devLang"
               :options="devLangs"
               :optionGroupChildren='[]'
               optionLabel="name"
               placeholder="选择一门开发语言" />
            <br>
            <br>
            <golang></golang>
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

// 右侧栏
// --- 只读
const readonly = ref(false)
watchEffect(() => {
    if (editor?.value) {
        editor.value.setReadOnly(readonly.value)
    }
})

// --- 选择开发语言
const devLang = ref({name: "Golang", code: 1})
const devLangs = ref([
    {
        name: 'Golang',
        code: 1
    },
    {
        name: 'Yaml',
        code: 2
    }
])
const change = () => {
    setCodegenStrategy(devLang.value.code)
}
</script>
