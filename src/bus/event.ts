// 事件
import bus from './index'
import { Ref } from 'vue'
import { Ace } from 'ace-builds'

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
export const setLeftEditorCheck = () => {
    bus.emit(LEFT_EDITOR_CHECK)
}
export const setLeftEditorFmt = () => {
    bus.emit(LEFT_EDITOR_FMT)
}
export const setLeftEditorCompress = () => {
    bus.emit(LEFT_EDITOR_COMPRESS)
}
export const setLeftEditorTransform = () => {
    bus.emit(LEFT_EDITOR_TRANSFORM)
}

export const setRightEditorValue = (val: string) => {
    bus.emit(RIGHT_EDITOR_SET, val)
}

export function useLeftEditorEvent(editor: Ref<Ace.Editor>) {
    // 监听值变化
    bus.on(LEFT_EDITOR_SET, val => {
        editor.value.setValue(val)
        setLeftEditorTransform()
    })

    bus.on(LEFT_EDITOR_CHECK, () => {})

    bus.on(LEFT_EDITOR_FMT, () => {})

    bus.on(LEFT_EDITOR_COMPRESS, () => {})

    bus.on(LEFT_EDITOR_TRANSFORM, () => {
        setRightEditorValue(editor.value.getValue())
    })
}

export function useRightEditorEvent(editor: Ref<Ace.Editor>) {
    // 监听值变化
    bus.on(RIGHT_EDITOR_SET, val => {
        editor.value.setValue(val)
    })
}
