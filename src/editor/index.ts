import { onMounted, ref, Ref } from 'vue'
import ace from 'ace-builds'
import type { Ace } from 'ace-builds/ace'

ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-noconflict/')

export enum Mode {
    hjson = 'ace/mode/hjson',
    go = 'ace/mode/golang'
}

export function useEditor(id: string, mode?: Mode) {
    const editor = ref<any>(null)
    onMounted(() => {
        editor.value = ace.edit(id)
        editor.value.setTheme('ace/theme/tomorrow')
        if (mode) {
            editor.value.session.setMode(mode)
        }
        // 禁用语法检查
        // editor.value.getSession().setUseWorker(false)
        // editor.value.on('blur', function (delta) {
        // })
    })
    return {
        editor: editor as Ref<Ace.Editor>
    }
}
