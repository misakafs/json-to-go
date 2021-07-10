import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import externalGlobals from 'rollup-plugin-external-globals'

const base = process.env.MODE === 'gh' ? '/json-to-go/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
    base: base,
    build: {
        target: 'es2015',
        rollupOptions: {
            external: ['ace-builds', 'vue'],
            plugins: [
                externalGlobals({
                    vue: 'Vue',
                    'ace-builds': 'ace'
                })
            ]
        }
    },
    plugins: [vue()]
})
