import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
import router from './router/routers';
import axios from 'axios'

Vue.use(ElementUI, { locale });
Vue.use(axios);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
