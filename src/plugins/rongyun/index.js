import {aesutil} from '@/util';
import {chatWith} from 'api'
import {$localStorage, $sessionStorage} from '@/util/storage'
import store from '../../store';	//加载状态管理器
export default {
  install(Vue) {
    if(store.getters.islogin){
          this.getToken()
        }
    else{
      Vue.$global.bus.$on('initRongyun',()=>{
        this.install(Vue)
      })
    }
  },
   getToken() {
      const userData = JSON.parse(aesutil.decrypt($localStorage.get('userData'),true))
      let params = {
        userId: userData.userId,
        nickName: userData.nickname
      }
       chatWith.getToken(params).then(res => {
         if(res.code==10000){
           this.token = res.data.token;
           this.connect();
           this.setConnectStatusListener();
           this.setOnReceiveMessageListener();
           Vue.$global.bus.$emit('portrait',res.data.portrait)
         }
      })

  },
  connect() {
    RongIMClient.connect(this.token, {
      onSuccess: () => {
        console.log('加载成功')
      },
      OnTokenIncorrect: function () {
        console.log('token无效')
      },
      OnError: function (error) {
        console.log(error)
      }
    })

  },

  setConnectStatusListener() {
    RongIMClient.setConnectionStatusListener({  //eslint-disable-line
      onChanged:(status) => {
        let info = null
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:  //eslint-disable-line
            info = '链接成功'
            store.commit('CHANGE_CONNECTSTATE',true)
            break;
          case RongIMLib.ConnectionStatus.CONNECTING:  //eslint-disable-line
            info = '正在链接'
            break
          case RongIMLib.ConnectionStatus.DISCONNECTED:  //eslint-disable-line
            info = '断开连接'
            toast(info)
            break
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:  //eslint-disable-line
            info = '其他设备登录'
            toast(info)
            setTimeout(()=>{
              store.dispatch('LOGIN_OUT')
            },1500)

            break
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:  //eslint-disable-line
            info = '域名不正确'
            toast(info)
            break
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:  //eslint-disable-line
            info = '网络不可用'
            toast(info)
            break
        }
      }
    })
  },
  setOnReceiveMessageListener() {
    RongIMClient.setOnReceiveMessageListener({  //eslint-disable-line
      onReceived: (message) => {
        switch (message.messageType) {
          case RongIMClient.MessageType.TextMessage: //eslint-disable-line
           /*因为有可能APP和h5或者PC同时发*/
              Vue.$global.bus.$emit('textMessage', {msg: RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content), user: 2,
                sendName:message.content.user.name,userId:message.content.user.id,debit:JSON.parse(message.content.extra).debit})
            this.getConversationList()
            break
          case RongIMClient.MessageType.VoiceMessage: //eslint-disable-line
            // 对声音进行预加载
            // message.content.content 格式为 AMR 格式的 base64 码
            break
          case RongIMClient.MessageType.ImageMessage: //eslint-disable-line
              Vue.$global.bus.$emit('picMessage', {msg: message.content.imageUri, user: 4, img: [message.content.imageUri],sendName:message.content.user.name,
                userId:message.content.user.id,debit:JSON.parse(message.content.extra).debit})
            this.getConversationList()
            break
          case RongIMClient.MessageType.DiscussionNotificationMessage: //eslint-disable-line
            // message.content.extension => 讨论组中的人员。
            break
          case RongIMClient.MessageType.LocationMessage: //eslint-disable-line
            // message.content.latiude => 纬度。
            // message.content.longitude => 经度。
            // message.content.content => 位置图片 base64。
            break
          case RongIMClient.MessageType.RichContentMessage: //eslint-disable-line
            // message.content.content => 文本消息内容。
            // message.content.imageUri => 图片 base64。
            // message.content.url => 原图 URL。

            break
          case RongIMClient.MessageType.InformationNotificationMessage: //eslint-disable-line
            // do something...
            break
          case RongIMClient.MessageType.ContactNotificationMessage: //eslint-disable-line
            // do something...
            break
          case RongIMClient.MessageType.ProfileNotificationMessage: //eslint-disable-line
            // do something...
            break
          case RongIMClient.MessageType.CommandNotificationMessage: //eslint-disable-line
            // do something...
            break
          case RongIMClient.MessageType.CommandMessage: //eslint-disable-line
            // do something...
            break
          case RongIMClient.MessageType.UnknownMessage: //eslint-disable-line
            // do something...
            break
          default:
          // do something...
        }
      }
    })
  },
    getConversationList() {
      RongIMClient.getInstance().getConversationList({
        onSuccess: () => {
           this.getUnreadTotalCount()
        },
        onError: function (error) {
          // do something...
        }
      }, null);
    },

  getUnreadTotalCount() {
    RongIMClient.getInstance().getTotalUnreadCount({
      onSuccess:(count)=>{
        // count => 多个会话的总未读数。
      store.commit('GET_UNREADCOUNT',count)

      },
      onError: (error)=> {
        // error => 获取多个会话未读数错误码。
      }
    });
  },
}

