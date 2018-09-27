import Vue from 'vue'; //引入vue
import Vuex from 'vuex'; //引入vue
import router from '@/router'; //引入vue
import {show} from 'api';     // 页面刷新获取用户数据
import * as types from './types'; //引入vue
import {$localStorage, $sessionStorage} from '@/util/storage';
import aesutil from '@/util/aesutil';

Vue.use(Vuex);
const stateInit = {
  showFooter: true,
  showLogin: false, //登录弹窗
  userData: {
    name: '',
    nickname: '',
    amount: '',
    userId: '',
    accountChainVos: [],
    nodeId:'0'
  },
  language: $localStorage.get('language-sel') || 'zh',
  tokenInfo: null,
  checkOnline: false,
  connectState:false,
  RongIMEmoji:'',
  timeOver:false,
  unreadCount:0,
  historyState:0,
  isShowCoupon:false,
  withdraw:false, //提现标识
  bankCardInfo:[],
  isShowFastSale:false,  // 是否显示快速买卖弹窗
  noBankCardTip:false
}
export default new Vuex.Store({
  state: stateInit,
  getters: {     // 用来从 store 获取 Vue 组件数据
    language(state, getters) {
      return state.language;
    },
    tokenInfo(state,getters){
      if(!state.tokenInfo){
        if($localStorage.get('tokenInfo')){
          Object.assign(state.tokenInfo,JSON.parse($localStorage.get('tokenInfo')));
        }
      }
      return state.tokenInfo;
    },
    connectState(state, getters) {
      return state.connectState
    },
    checkOnline(state, getters) {
      return state.checkOnline;
    },
    showFooter(state, getters) {
      Vue.nextTick(() => {
        document.querySelector("body").style.paddingBottom = (state.showFooter ? "" : "0");
      })
      return state.showFooter;
    },
    showLogin(state, getters) {
      return state.showLogin;
    },
    userData(state, getters) { //其有可能进行过滤
      if (state.userData.userId === '') {
        if ($localStorage.get('userData')) {
          Object.assign(state.userData, JSON.parse(aesutil.decrypt($localStorage.get('userData'), true)));
        }
      }
      return state.userData;
    },
    userId(state, getters) {
      if (state.userData.userId === '') {
        if ($localStorage.get('userData')) {
          Object.assign(state.userData, JSON.parse(aesutil.decrypt($localStorage.get('userData'), true)));
        }
      }
      return state.userData.userId;
    },
    islogin(state, getters) {  // 根据是否有 tokenVo 并且请求返回值不为 15016
      let tokenInfo = JSON.parse($localStorage.get('tokenInfo'));
      if (tokenInfo) { //先查localStorage
        // if (state.checkOnline) {
          return true;
        // }
      }
      if (state.checkOnline && state.tokenInfo) {
        return true;
      }
      return false;
    },
    timeOver(state, getters) {
      return state.timeOver
    },
    unreadCount(state, getters) {
      return state.unreadCount
    },
    historyState(state,getters){
      return state.historyState
    },
    isShowCoupon(state,getters){
      return state.isShowCoupon
    },
    getWithdraw(state,getters){
      return state.withdraw
    },
    bankCardInfo(state,getters){
      return state.bankCardInfo;
    },
    isShowFastSale(state, getters) {
      return state.isShowFastSale;
    },
    noBankCardTip(state,getters){
      return state.noBankCardTip;
    }
  },
  mutations: {         // 事件处理器用来驱动状态的变化
    [types.SET_LANGUAGE](state, language) {
      state.language = language;
      $localStorage.set('language-sel', language);
    },
    [types.UPDATE_TOKEN_INFO](state, tokenInfo) {
      state.tokenInfo = tokenInfo
    },
    [types.CHECK_ONLINE](state, val) {
      state.checkOnline = val
    },
    [types.SET_FOOTER](state, val) {
      state.showFooter = val
    },
    [types.SET_USERDATA](state, val = {}) {
      if (val != '') {
        if (val.node && val.node.customer) {
          aesutil.updateKey(val.node.customer.aesKey)
        }
        $localStorage.set('userData', aesutil.encrypt(JSON.stringify(val), true))
      }
      Object.assign(state.userData, val || {});
    },
    [types.CHANGE_CONNECTSTATE](state, val) {
      state.connectState = val
    },
    [types.IS_TIMEOVER](state, val) {
      state.timeOver = val
    },
    [types.SHOW_LOGIN](state,val){
      if(_.isMobile() && val){
        if(!_.customize()){
          router.replace({name:'mobileLogin'});
        }else{
          router.replace({name:'mobileCusLogin'});
        }
      }else{
        router.replace({name:'transaction'});
      }
      state.showLogin=val;
    },
    [types.GET_UNREADCOUNT](state, val) {
      state.unreadCount = val
    },
    [types.GET_HISTORYSTATE](state,val){
      state.historyState = val
    },
    [types.GET_ISNEEDCOUPON](state,val){
      state.isShowCoupon = val
    },
    [types.GET_WIDTHDRAW](state,val){
      state.withdraw = val
    },
    [types.GET_BANKCARD](state,val){
      if(_.isEmpty(val)){
        state.noBankCardTip = true
      }else{
        state.noBankCardTip = false
      }
      state.bankCardInfo=val
    },
    [types.SHOW_FASTSALE](state,val){
      state.isShowFastSale=val
    },
    [types.INIT_STATE](state,val){
      Object.assign(state,stateInit)
    }
  },
  actions: {    // 可以给组件使用的函数，以此用来驱动事件处理器 mutations
    [types.SET_LANGUAGE]({commit}, language) {
      commit(types.SET_LANGUAGE, language)
    },
    [types.UPDATE_TOKEN_INFO]({commit}, tokenInfo) {
      commit(types.UPDATE_TOKEN_INFO, tokenInfo)
    },
    [types.CHECK_ONLINE]({commit}, val) {
      commit(types.CHECK_ONLINE, val)
    },
    [types.INIT_INFO]({commit}, val) { //初始化所有信息 相当于退出
      commit(types.SET_USERDATA, {
        name: '',
        nickname: '',
        amount: '',
        userId: '',
        accountChainVos: [],
      })
      // commit(types.INIT_STATE)
    },
    [types.LOGIN_OUT]({commit, dispatch}, val = true) { //退出登录
      let nodeId = ''
      let userData = ''
      let userId = ''
      if ($localStorage.get('userData')) {
        userData = JSON.parse(aesutil.decrypt($localStorage.get('userData'), true))
        nodeId = Number(userData.nodeId)
        userId = userData.userId
      }
      const backURL = JSON.parse($localStorage.get('backURL'))
      $localStorage.remove(`sysb-${userId}`);
      $localStorage.remove('tokenInfo');
      $localStorage.remove('userData');
      $localStorage.remove('backURL');
      $localStorage.remove('menuStyle');
      dispatch(types.INIT_INFO);
      commit(types.INIT_STATE)
      dispatch(types.UPDATE_TOKEN_INFO, null);
      dispatch(types.CHECK_ONLINE, false);
      if (val) {
        if (nodeId > 10000) {
          window.location.href = backURL;
        } else {
          if (_.isMobile()) {
            //  router.replace({name:'mobileLogin'});
            window.location.href = "/m/login";
          } else {
            window.location.href = "/transaction";
          }
        }
      }
    },
    [types.UPDATE_USERDATA]({commit, dispatch}, val) {  //获取 初始化信息
      let tokenInfo = JSON.parse($localStorage.get('tokenInfo'));
      if (tokenInfo) {
        dispatch(types.UPDATE_TOKEN_INFO, tokenInfo);
      } else {
        dispatch(types.CHECK_ONLINE, false);
      }
      return show.implicitLogin({}).then(res => {
        if (res.code == 10000) {
          commit(types.SET_USERDATA, res.data);
          dispatch(types.CHECK_ONLINE, true);
        }
        return Promise.resolve(res);
      });
    },
    [types.GET_BANKCARD]({commit, getters},val){  // 获取用户绑定的银行卡信息
      let requestdata={
        userId: getters.userId
      };
      return show.getBankInfo(requestdata).then((res) => {
        if(res.code === 10000){
          commit(types.GET_BANKCARD,res.data);
        }else{
          toast(res.message);
        }
        return Promise.resolve(res);
      }).catch(err => {
        toast(err);
      });
    }

  }
});
