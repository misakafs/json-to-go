// 事件
import bus from './index'
import { Ref } from 'vue'
import { Ace } from 'ace-builds'

import { Scanner } from '../core/scanner'
import { Parser } from '../core/parse'
import { CodegenJson } from '../core/codegen_json'

// 设置值事件
const LEFT_EDITOR_SET = 'left.editor.set'
// 校正
const LEFT_EDITOR_CHECK = 'left.editor.check'
// 格式化
const LEFT_EDITOR_FMT = 'left.editor.fmt'
// 压缩
const LEFT_EDITOR_COMPRESS = 'left.editor.compress'
// 转换
const LEFT_EDITOR_TRANSFORM = 'left.editor.transform'

const RIGHT_EDITOR_SET = 'right.editor.set'

// 设置值
export const setLeftEditorValue = (val: string) => {
    bus.emit(LEFT_EDITOR_SET, val)
}
export const onLeftEditorCheck = () => {
    bus.emit(LEFT_EDITOR_CHECK)
}
export const onLeftEditorFmt = () => {
    bus.emit(LEFT_EDITOR_FMT)
}
export const onLeftEditorCompress = () => {
    bus.emit(LEFT_EDITOR_COMPRESS)
}
export const onLeftEditorTransform = () => {
    bus.emit(LEFT_EDITOR_TRANSFORM)
}

export const setRightEditorValue = (val: string) => {
    bus.emit(RIGHT_EDITOR_SET, val)
}

export function useLeftEditorEvent(editor: Ref<Ace.Editor>) {
    // 监听值变化
    bus.on(LEFT_EDITOR_SET, val => {
        editor.value.setValue(val)
        editor.value.execCommand("gotolineend")
        onLeftEditorTransform()
    })

    bus.on(LEFT_EDITOR_CHECK, () => {
        const scan = new Scanner(editor.value.getValue())
        const parser = new Parser(scan.tokens)
        const codegen = new CodegenJson(parser.root)
        setLeftEditorValue(codegen.json)
    })

    bus.on(LEFT_EDITOR_FMT, () => {
        const scan = new Scanner(editor.value.getValue())
        const parser = new Parser(scan.tokens)
        const codegen = new CodegenJson(parser.root)
        setLeftEditorValue(codegen.json)
    })

    bus.on(LEFT_EDITOR_COMPRESS, () => {
        const scan = new Scanner(editor.value.getValue())
        const parser = new Parser(scan.tokens)
        const codegen = new CodegenJson(parser.root)
        setLeftEditorValue(codegen.json)
    })

    bus.on(LEFT_EDITOR_TRANSFORM, () => {
        setRightEditorValue(editor.value.getValue())
    })
}

export function useRightEditorEvent(editor: Ref<Ace.Editor>) {
    // 监听值变化
    bus.on(RIGHT_EDITOR_SET, val => {
        editor.value.setValue(val)
        editor.value.execCommand("gotolineend")
    })
}
