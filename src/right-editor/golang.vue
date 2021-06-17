<template>
    <div class="p-field-checkbox">
        <Checkbox id="binary" v-model="inline" :binary="true" />
        <label for="binary"> 是否内联类型</label>
    </div>
    <h5>根对象名</h5>
    <InputText type="text" v-model="rootName"></InputText>
    <h5>自定义Tag <a href="https://github.com/misakafs/json-to-go/blob/main/README.md#%E8%87%AA%E5%AE%9A%E4%B9%89tag" target="_blank">使用教程</a></h5>
	<InputText type="text" v-model="tag"></InputText>

</template>

<script lang="ts" setup>
import { watch, ref, onMounted } from 'vue'
import { setCodegenStrategyOption } from '../bus/event'
import cache from '../cache'

// 是否内联类型定义
const inline = ref(false)

// 自定义tag
const tag = ref('json:1:false')

// 根对象名
const rootName = ref('RootObject')

const emit = () => {
    const opt = {
        inline: inline.value,
        tag: tag.value,
        rootName: rootName.value
    }
    cache.set('opt.golang', opt)
    setCodegenStrategyOption(opt)
}

watch([inline, tag, rootName], () => {
    emit()
})

onMounted(() => {
    const opt = cache.get('opt.golang')
    if (opt) {
        inline.value = opt.inline
	    tag.value = opt.tag
        rootName.value = opt.rootName
    }
    emit()
})
</script>
