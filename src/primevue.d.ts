import Vue from 'vue'
declare module 'vue' {
    export type PluginFunction<T> = (app: Vue.App, ...options: any[]) => any
}
