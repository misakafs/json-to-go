import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import externalGlobals from 'rollup-plugin-external-globals'

const base = process.env.NODE_ENV === 'github' ? '/json-to-go/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
    base: base,
    build: {
        rollupOptions: {
            external: ['ace-builds','vue'],
            plugins: [
                externalGlobals({
                    'vue': 'Vue',
                    'ace-builds': 'ace'
                })
            ]
        }
    },
    plugins: [vue()]
})
