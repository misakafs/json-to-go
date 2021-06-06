<template>
    <div class="p-field-checkbox">
        <Checkbox id="binary" v-model="inline" :binary="true" />
        <label for="binary"> 是否内联类型</label>
    </div>
    <h5>根对象名</h5>
    <InputText type="text" v-model="rootName"></InputText>
    <h5>自定义Tag(回车确认)</h5>
    <p>tag后面接序号可以指定命名方式</p>
    <p>eg: json|3, form|2 </p>
    <Chips v-model="tags"></Chips>
    <div>
        <h6>命名方式</h6>
        <p>0. abcDef - 默认</p>
        <p>1. AbcDef</p>
        <p>2. abc_def</p>
        <p>3. Abcdef</p>
        <p>4. abcdef</p>
    </div>
</template>

<script lang='ts' setup>
import { watchEffect, ref, onMounted } from 'vue'
import { setCodegenStrategyOption } from '../bus/event'

// 是否内联类型定义
const inline = ref(false)

// 自定义tag
const tags = ref(['json'])

// 根对象名
const rootName = ref('Root')

const emit = () => {
    setCodegenStrategyOption({
        inline: inline.value,
        tags: tags.value,
        rootName: rootName.value,
    })
}

watchEffect(() => {
    emit()
})

onMounted(() => {
    emit()
})
// - go 添加自定义tag
//      命名方式
//      是否内嵌结构体
//      根对象名
//      json类型对应go类型
</script>

