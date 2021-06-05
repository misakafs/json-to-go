<template>
    <main>
        <Splitter style="height: 100vh" :layout="layout">
            <SplitterPanel :minSize="25">
                <LeftEditor></LeftEditor>
            </SplitterPanel>
            <SplitterPanel :minSize="20">
                <RightEditor></RightEditor>
            </SplitterPanel>
        </Splitter>
    </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import bus from './bus'
// 一个防抖的库
import debounce from 'debounce'
import LeftEditor from './left-editor/index.vue'
import RightEditor from './right-editor/index.vue'

const layout = ref('horizontal')

const relayoutFn = () => {
    if (window.innerWidth <= 800) {
        layout.value = 'vertical'
    } else {
        layout.value = 'horizontal'
    }
}

onMounted(() => {
    relayoutFn()
    window.addEventListener('resize', debounce(relayoutFn, 200))
})
</script>
