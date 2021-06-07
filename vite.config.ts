import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import externalGlobals from 'rollup-plugin-external-globals'

// https://vitejs.dev/config/
export default defineConfig({
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
