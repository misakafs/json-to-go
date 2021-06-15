import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import externalGlobals from 'rollup-plugin-external-globals'

const base = process.env.PROD ? '/json-to-x/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
    base: base,
    build: {
        rollupOptions: {
            external: ['ace-builds'],
            plugins: [
                externalGlobals({
                    'ace-builds': 'ace'
                })
            ]
        }
    },
    plugins: [
        vue()
    ]
})
