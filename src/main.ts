import { createApp } from 'vue'
import App from './App.vue'

// 引入插件
import PrimeVue from 'primevue/config'
// 这个build有点问题
import ToastService from 'primevue/toastservice'

// 引入指令
import Tooltip from 'primevue/tooltip'

// 引入组件
import Panel from 'primevue/panel'
import Menu from 'primevue/menu'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Dialog from 'primevue/dialog'
import Sidebar from 'primevue/sidebar'
import Checkbox from 'primevue/checkbox';
import CascadeSelect from 'primevue/cascadeselect'
import SelectButton from 'primevue/selectbutton'
import InputText from 'primevue/inputtext'
import Chips from 'primevue/chips'

// 样式
import 'primevue/resources/themes/saga-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './styles/index.scss'

const app = createApp(App)
// 插件
app.use(PrimeVue)
app.use(ToastService)

// 指令
app.directive('tooltip', Tooltip)

// 组件
app.component('Panel', Panel)
app.component('Menu', Menu)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Dialog', Dialog)
app.component('Sidebar', Sidebar)
app.component('Checkbox', Checkbox)
app.component('CascadeSelect', CascadeSelect)
app.component('SelectButton', SelectButton)
app.component('InputText', InputText)
app.component('Chips', Chips)
// 不加这个使用Menu会警告️，primevue
app.component('router-link', {})

app.mount('#app')
