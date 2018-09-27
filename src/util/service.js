import axios from 'axios';
import aesutil from './aesutil';
import store from '@/store';	//加载状态管理器
import {$localStorage, $sessionStorage} from './storage';
import router from '@/router';

// var promiseArr = {}
// let cancel
const service = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  timeout: 50000,
  // cancelToken: new axios.CancelToken(function (c) {
  //   cancel = c  // 记录当前请求的取消方法
  // })
});

// request拦截器
service.interceptors.request.use(config => {
  const showLoading = _(config.loading).isUndefined() ? true : config.loading
  if (config.data && config.data.multipart) {
    config.headers['content-type'] = 'multipart/form-data'
  } else {
    const userData = store.getters.userData
    const nodeId = userData.node && userData.node.customer ? `${userData.nodeId}_${userData.merchantId}` : userData.nodeId
    config.data = {
      nodeId,
      requestData: aesutil.encrypt(JSON.stringify(config.data),config.encryptDef ? true : false)
    }
  }
  config.headers['Authorization'] = `Bearer ${store.getters.tokenInfo ? store.getters.tokenInfo.accessToken : ''}`

  showLoading ? $load.open("loading...") : '';

  // if (promiseArr[config.url]) {
  //   promiseArr[config.url]('操作取消')
  //   promiseArr[config.url] = cancel
  // } else {
  //   promiseArr[config.url] = cancel
  // }

  return config
}, error => {
  // Do something with request error
  $load.close();
  console.log(error)
  Promise.reject(error)
});

// respone拦截器
service.interceptors.response.use(
  response => {
    $load.close();
    if (response && response.data && response.data.code) {
      if (response.data.code === 15016) {    // 没有在线
        store.dispatch('INIT_INFO');
        $localStorage.remove('tokenInfo');
        $localStorage.remove('userData');
        store.dispatch('UPDATE_TOKEN_INFO', null);
        store.dispatch('CHECK_ONLINE',false);
        let noNeedLogin = false
        if(_.isNull(router.currentRoute.name)){
          if(!_.isNull(router.history.pending)){
            noNeedLogin = _.isUndefined(router.history.pending.meta.noLogin) ? false : router.history.pending.meta.noLogin
          }
        }else{
          noNeedLogin = _.isUndefined(router.currentRoute.meta.noLogin) ? false : router.currentRoute.meta.noLogin
        }
        if(!noNeedLogin){
          store.commit("SHOW_LOGIN",true);
        }
      }
      if (response.data.data) {
        response.data.data = JSON.parse(aesutil.decrypt(response.data.data, response.config.encryptDef ? true : false))
      }
      return response.data
    } else{
      return Promise.reject(response.data.message)
    }
  },
  error => {
    console.log('err' + error);
    $load.close();
    if (error && error.response && error.response.data && error.response.data.message) {
      return Promise.reject(error.response.data.message)
    } else if (error && error.message) {
      return Promise.reject(error.message)
    } else {
      return Promise.reject(error)
    }
  }
);

export default service
