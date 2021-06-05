import { ref } from 'vue'
import { setLeftEditorValue, onLeftEditorCheck, onLeftEditorFmt, onLeftEditorCompress } from '../bus/event'

const demo1 = `{"a":1}`
const demo2 = `{
    b:1,
    c:dad}`
const demo3 = `[a,1,true,false,f]`

export function useMenu() {
    const items = ref([
        {
            label: '例子',
            items: [
                {
                    label: '第一个🌰',
                    command: () => {
                        setLeftEditorValue(demo1)
                    }
                },
                {
                    label: '第二个🌰',
                    command: () => {
                        setLeftEditorValue(demo2)
                    }
                },
                {
                    label: '第三个🌰',
                    command: () => {
                        setLeftEditorValue(demo3)
                    }
                }
            ]
        },
        {
            label: '操作',
            items: [
                {
                    label: 'JSON纠正',
                    command: () => {
                        onLeftEditorCheck()
                    }
                },
                {
                    label: 'JSON格式化',
                    command: () => {
                        onLeftEditorFmt()
                    }
                },
                {
                    label: 'JSON压缩',
                    command: () => {
                        onLeftEditorCompress()
                    }
                }
            ]
        }
    ])

    const menu = ref<any>({})
    const toggleFn = (event: any) => {
        menu.value.toggle(event)
    }

    return {
        items,
        menu,
        toggleFn
    }
}
