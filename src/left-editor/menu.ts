import { ref } from 'vue'
import { setLeftEditorValue, setLeftEditorCheck, setLeftEditorFmt, setLeftEditorCompress } from '../bus/event'

const demo1 = `{"a":1}`
const demo2 = `{"b":2}`
const demo3 = `{"b":3}`

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
                        setLeftEditorCheck()
                    }
                },
                {
                    label: 'JSON格式化',
                    command: () => {
                        setLeftEditorFmt()
                    }
                },
                {
                    label: 'JSON压缩',
                    command: () => {
                        setLeftEditorCompress()
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
