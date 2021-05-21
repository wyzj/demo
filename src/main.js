import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import {screen} from "electron"

Vue.config.productionTip = false
Vue.prototype.$http = axios;

axios.defaults.baseURL = "http://client3.8haodi.com:4080/client";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
console.log(screen)
const vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
export default vm;
