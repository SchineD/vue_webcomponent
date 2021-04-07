import Vue from 'vue'
import App from './App.vue'
import { Autocomplete } from './web-component/auto-complete.js'


Vue.config.productionTip = false

Vue.component('auto-complete', Autocomplete);

new Vue({
  render: h => h(App),
}).$mount('#app')
