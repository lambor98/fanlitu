import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import Mint from 'mint-ui';
import "./style/mintUi/style.css"
import "./style/common/mobile.scss"
import "./style/common/common.scss"
import "./tool/animate.css"
import "./style/vant/index.css"
import Vant from 'vant';
import axios from "axios"
import Share from 'vue-social-share'
import 'vue-social-share/dist/client.css';
Vue.use(Share)
Vue.use(Vant);
Vue.use(Mint);
axios.defaults.withCredentials = true
router.beforeEach((to,from,next)=>{
  sessionStorage.setItem("lastRouter",from.name)
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
