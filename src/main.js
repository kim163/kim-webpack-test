import("babel-polyfill")
import Vue from 'vue'; //引入vue
import store from './store';	//加载状态管理器
import router from './router';//加载路由器
import i18n from './lang' // 国际化插件
import 'viewerjs/dist/viewer.css'

/*import 'vue-croppa/dist/vue-croppa.css' //上传图片*/
import LoadScript from 'vue-plugin-load-script' //加载文件;
// import Croppa from 'vue-croppa'
import base from './base'
import Viewer from 'v-viewer' // 缩放图片
// import clipboard from 'clipboard' // 复制插件
//组件中引入js //融云
import dom from './util/dom.js';//加载原型方法
import prototype from './util/prototype';//加载原型方法
import components from 'base/index.js';//装载公共模板
import {
  BusPlugin,
  Rongyun
} from './plugins/build'
import 'viewerjs/dist/viewer.css'
import filters from './vue-extend/filters';//装载filters
import directives from './vue-extend/directives';//装载directives
Vue.use(BusPlugin)
Vue.use(Viewer)
Vue.use(LoadScript)
// Vue.use(Croppa)

//在所有组件里可调用函数

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad:1.3,
  error: require('static/images/broken.png'),
  loading:  require('./assets/images/loading.gif'),
})
require("@/assets/scss/base.scss")
require("@/assets/scss/font.scss")
require("@/assets/scss/animate.scss")
require("@/assets/scss/simple-grid.scss")
Vue.config.productionTip = false;
import App from './App.vue';//引入app.vue
Vue.prototype.$loadScript('https://cdn.ronghub.com/RongIMLib-2.3.0.js').then(()=>{
  Vue.prototype.$loadScript('https://cdn.ronghub.com/RongEmoji-2.2.6.min.js').then(()=>{
    RongIMLib.RongIMEmoji.init();
  })
  RongIMLib.RongIMClient.init('x18ywvq85ahuc', null, {navi: 'http://dc-jiuan-im-nav-pro.com'})
  Vue.use(Rongyun)
})
Vue.prototype.$loadScript('//at.alicdn.com/t/font_571184_hnc3vhrrjlk.js')
let vm= new Vue({
  el:"#app",
  router,
  store,
  i18n,
  render:(h)=>h(App)
});




