// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/test.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import headTop from './components/headTop.vue'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.component('headTop',headTop)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
