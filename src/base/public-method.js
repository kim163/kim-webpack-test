import aesutil from '@/util/aesutil';
import Stomp from 'webstomp-client'
import {$localStorage} from '@/util/storage'
import store from '../store'

import {
  getSharedConfigList,
  bindMerchantLoginRelation
} from 'api/cashier'

var browser={
  versions:function(){
    var u = navigator.userAgent, app = navigator.appVersion;
    return {//移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weChat: u.indexOf('micromessenger') > -1, //是否是微信浏览器
      mobileQQ: /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(u) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(u), //是否是qq浏览器
    };
  }(),
  language:(navigator.browserLanguage || navigator.language).toLowerCase()
}

_.mixin(
  {
    getUrlParam(name, href) { //获取get传参参数
      const params = {}
      const match = (href || window.location.href).match(/#?.*\?(.*)/)

      if (!match) {
        return match
      }

      match[1].split('&').forEach((arg) => {
        arg = arg.split('=')
        params[arg[0]] = decodeURI(arg[1])
      })

      if (name) {
        return params[name]
      }
      return params
    },

    isMobile(){
      if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||
        browser.versions.iPhone || browser.versions.iPad){
        return true
      }else{
        return false
      }
    },

    isAndroid(){
      if(browser.versions.android){
        return true
      }else{
        return false
      }
    },

    isIos(){
      if( browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
        return true
      }else{
        return false
      }
    },

    isWeChat(){
      return browser.versions.weChat
    },

    merchantOrderidWs(orderid){  //收银台 消息订阅
      let client = null
      let connectMsg = [];
      let connectUrl='' ;
      let connectUser= '';
      let connectPsw= '';
      let subscription = null

      let stompSuccessCallback = (frame) => {
        console.log('STOMP: Connection successful')
        subscription = client.subscribe('/exchange/walletCustomOperation/'+orderid, function (data) {
            let msgData=JSON.parse(aesutil.decrypt(data.body,true));
            if(msgData.type == 21){  //收银台 支付中  用于二维码显示
              Vue.$global.bus.$emit('update:paying');
            }else if(msgData.type == 22){  //收银台 支付完成
              Vue.$global.bus.$emit('update:paySuccess');
            }else if(msgData.type == 23){  //商户提款
              Vue.$global.bus.$emit('update:withdrawSuccess');
            }
          })
      }

      var stompFailureCallback = function (error) {
        console.log('STOMP: ' , error)
        if (client && client.ws.readyState === client.ws.CONNECTING) {
          return
        }
        if (client.ws.readyState === client.ws.OPEN) {
          return
        }
        setTimeout(stompConnect, 10000)
        console.log('STOMP: Reconecting in 10 seconds')
      }
      function stompConnect () {
        console.log('STOMP: Attempting connection')
        let ws = new WebSocket(connectUrl);
        client = Stomp.over(ws,{debug:process.env.NODE_ENV != 'production'});
        client.heartbeat.outgoing = 30000;
        client.heartbeat.incoming = 30000;
        client.connect(connectUser, connectPsw, stompSuccessCallback, stompFailureCallback)
      }
      getSharedConfigList({}).then(res => {
        console.log('getSharedConfigList',res)
        if(res.code === 10000){
          _.forEach(res.data, function(value, key) {
            if(value.type == 1002){
              connectMsg = value.value.split(',');
              connectUrl= connectMsg[0];
              connectUser= connectMsg[1];
              connectPsw= connectMsg[2];
            }
          });
          stompConnect()
        }
      })
      Vue.$global.bus.$on('merchantOrderidUnsubscribe',() => {
        subscription.unsubscribe()
      })
    },
    checkUserBind(data){ //校验已绑定用户是否需要更换授权token
      const needBind = $localStorage.get('needBind')
      if(!_.isUndefined(needBind) && !_.isNull(needBind)){
        const needData = JSON.parse(aesutil.decrypt(needBind,true))
        const requestData = Object.assign(needData,data)
        bindMerchantLoginRelation(requestData).finally(() => {
          $localStorage.remove('needBind')
        })
      }
    },
    initRongyun(){
      // window.location.reload()
      Vue.$global.bus.$emit('initRongyun')
    },
    b64DecodeUnicode(str){  //base64转码
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },
    loadCssCode(code){  //添加自定义css样式要head
      var style = document.createElement('style');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      try{
        //for Chrome Firefox Opera Safari
        style .appendChild(document.createTextNode(code));
      }catch(ex){
        //for IE
        style.styleSheet.cssText = code;
      }
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
    },
    customize(){ //久安定制版域名判断
      const host = window.location.host
      if(host.indexOf('9anwallet') > -1 || store.getters.userData.nodeId > 10000){
        return true
      }
      return false
    }
  }
)

