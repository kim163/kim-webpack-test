<template>
  <div class="origin_box" :class="{'pcContainer':isPc}">
    <div class=" wrapper_box  box box-ver">
      <div class="mainTitle" v-if="isPc">
        <span class="iconfont icon-left-arrow return_back" @click="returnList()">返回列表</span>
        <span class="middle_title">会话详情</span>
        <span class="close_symbol iconfont icon-close" @click="closeChatList"></span>
      </div>
      <header class="mobile-header" v-else>
        <a @click="doClick" class="back-link"> <i class="iconfont icon-left-arrow"></i></a>
        <span>会话详情</span>
      </header>
      <!--付款倒计时-->
      <!--聊天框-->
      <div class="chatbox box-f1 box box-ver"
           :class="{'displayState':!isDisplay,'hiddenState':isDisplay,'pcchatbox':isPc}"
           id="chatMessage">
        <div class="order_info">
          <div class="order_state" :class="{'pcOrder':isPc}">
            <div class="state_b">
              <span class="state_d" v-if="userId!==debit">买入</span>
              <span class="state_n" v-else>卖出</span>
              <span class="order_num">UET订单编号:</span>
            </div>
            <div class="order_c">{{detail}}</div>
          </div>
          <div>
            <!--展开-->
            <div class="display-box" v-if="isDisplay">
              <!---->
              <div class="line" v-if="userId!==debit">
                <span>卖家:</span>
                <span class="fr lineColor">{{debitNickname}}</span>
              </div>
              <div class="line" v-else>
                <span>买家</span>
                <span class="fr lineColor">{{creditNickname}}</span>
              </div>
              <div class="line">
                <span>交易金额:</span>
                <span class="fr lineColor">{{amount*0.01}} CNY</span>
              </div>
              <div class="line">
                <span>交易数量:</span>
                <span class="fr lineColor">{{amount}} UET</span>
              </div>
              <div class="display" @click="showDisplay" :class="{'displayboxPC':isPc}">
                <img src="~images/chatWith/hidden.png" alt="">
              </div>
            </div>
            <!--隐藏-->
            <div class="hidden-box" v-if="!isDisplay">
              <div class="hiddenbox" :class="{'hiddenboxPC':isPc}" @click="showDisplay">
                <img src="~images/chatWith/display.png" alt="">
              </div>
            </div>
          </div>
        </div>
        <p class="countdown" v-if="status==61">
          申诉锁定
        </p>
        <p class="countdown" v-else>
          等待倒计时:
          <count-down :end-time="startTime-endTime<=0?0:startTime-endTime"></count-down>
        </p>
        <b-scroll
          ref="scroll"
          :autoUpdate="true"
          :pullUp="false"
          :pullDown="false"
          :class="{'pcState':isPc}"
        >
          <!--历史消息-->
          <div v-for="list in historyArr" class="msg-item">
            <!--文字消息 和图片消息 区分是否是自己发的-->
            <!--自己发的文本消息-->
            <div class="chat_container"
                 v-show="list.messageType=='TextMessage'&&list.senderUserId==userId">
              <div style="flex:1"></div>
              <div>
                <div class="sendname" style="text-align: right">{{userData.name?userData.name:'null'}}</div>
                <div class="contents">{{symolEmoji.symbolToEmoji(list.content.content)}}</div>
              </div>
              <div class="user_symbol"></div>
            </div>
            <!--别人发的文本消息-->
            <div v-if="list.messageType=='TextMessage'&&list.senderUserId!==userId"
                 class="chat_container">
              <div class="user_symbol_next" :class="{'isSeller':userId!==debit, 'iskefu':JSON.parse(list.content.extra).credit!==list.content.user.id
            &&JSON.parse(list.content.extra).debit!==list.content.user.id}"></div>
              <div>
                <div class="sendname" style="text-align: left">{{list.content.user.name?list.content.user.name:'null'}}
                </div>
                <div class="contents_next" v-html="symolEmoji.symbolToEmoji(list.content.content)"></div>
              </div>
              <div style="flex: 1"></div>
            </div>
            <!--自己发的图片消息-->
            <div class="chat_container"
                 v-if="list.messageType=='ImageMessage'&&list.senderUserId==userId">
              <div style="flex:1;"></div>
              <div class="contents">
                <viewer :images="list.picArr" style="padding: .5rem">
                  <img  class="contents_image" v-lazy="list.content.imageUri">
                </viewer>
              </div>
              <div class="user_symbol"></div>
            </div>
            <!--别人发的图片消息-->
            <div class="chat_container"
                 v-if="list.messageType=='ImageMessage'&&list.senderUserId!==userId">
              <div class="user_symbol_next" :class="{'isSeller':userId!==debit, 'iskefu':JSON.parse(list.content.extra).credit!==list.content.user.id
            &&JSON.parse(list.content.extra).debit!==list.content.user.id}"></div>
              <div>
                <div class="sendname" style="text-align: left">{{userData.name?userData.name:'null'}}</div>
                <div class="contents_img_next">
                  <viewer :images="list.img" style="padding: .5rem">
                    <img class="contents_image" v-lazy="list.content.imageUri">
                  </viewer>
                </div>
              </div>
              <div class="" style="flex: 1"></div>
            </div>
          </div>
          <div v-for="list in chatArr" class="msg-item">
            <!--发送消息-->
            <div v-if="list.user==1" class="chat_container">
              <div class="" style="flex: 1"></div>
              <div>
                <div class="sendname" style="text-align: right">{{userData.name?userData.name:'null'}}</div>
                <div class="contents">{{list.msg}}</div>
              </div>
              <div class="user_symbol"></div>
            </div>
            <!--发送图片消息-->
            <div v-if="list.user==3" class="chat_container">
              <div class="" style="flex: 1"></div>
              <div>
                <div class="sendname" style="text-align: right">{{userData.name?userData.name:'null'}}</div>
                <div class="contents">
                  <viewer :images="list.img" style="padding: .5rem">
                    <img alt="" class="contents_image" v-lazy="list.msg">
                  </viewer>
                </div>
              </div>
              <div class="user_symbol"></div>
            </div>
            <!--接收文字消息-->
            <div v-if="list.user==2" class="chat_container">
              <div class="user_symbol_next" :class="{'isSeller':userId!==list.debit,'isMy':userId==list.userId}"></div>
              <div>
                <div class="sendname" style="text-align: left">{{list.sendName?list.sendName:'null'}}</div>
                <div class="contents_next">{{list.msg}}</div>
              </div>
              <div class="" style="flex: 1"></div>
            </div>
            <!--接收图片消息-->
            <div v-if="list.user==4" class="chat_container">
              <div class="user_symbol_next" :class="{'isSeller':userId!==list.debit}"></div>
              <div>
                <div class="sendname" style="text-align: left">{{list.sendName?list.sendName:'null'}}</div>
                <div class="contents_img_next">
                  <viewer :images="list.img" style="padding: .5rem">
                    <img alt="" class="contents_image" v-lazy="list.msg">
                  </viewer>
                </div>
              </div>
              <div class="" style="flex: 1"></div>
            </div>
          </div>
        </b-scroll>
      </div>
      <!--输入框-->
      <div class="input_chatbox ">
        <div class="chatboxNext">
          <!--PC上加入按回车键也可以发送消息-->
          <input type="text" class="input_message" v-model="messageValue" id="inputMessage" @keydown="sendInfo($event)">
          <div class="smile" @click="sendEmoji" :class="{emoji:isChangeValue,input:!isChangeValue}"></div>
          <div class="more demo1" v-if="!needSend" @click="showMoreFunction"></div>
          <input type="button" value="发送" class="sendMessage" v-if="needSend" @click="sendMessage">
        </div>
        <!--照片 照相机-->
        <div class="photo_area" v-if="isShowMore">
          <div class="take_photo take_box" style="position: relative">
            <img src="~images/chatWith/photo.png" alt="" style="display: block">
            <span>照片</span>
            <input type="file" accept="image/*" value="打开照相机" class="openCamera" @change="upload">
          </div>
        </div>
        <!--表情-->
        <div class="emoji_area">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import CountDown from 'components/countdown'
  import BScroll from 'vue-slim-better-scroll';
  import mHeader from "components/m-header"
  import {chatWith, transaction} from 'api'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        imgSrc: '~images/chatWith/more.png',
        isDisplay: false,
        messageValue: '',
        needSend: false,
        token: '',
        symolEmoji: '',
        dataUrl: {},
        isChangeValue: true,
        chatArr: [],
        picUrl: '',
        founderRoleType: '',
        EmojiList: [],
        isShowMore: false,
        uploadState: '',
        RongIMEmoji: '',
        dataURL: '',
        type: '',
        src: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
        shadowDomList: [],
        base64: '',
        size: '',
        name: '',
        file: '',
        dataURLNext: '',
        sellName: '',
        historyArr: '',
        startTime: '',
        endTime: '',
        debit: '',
        creditNickname: '',
        debitNickname: '',
        amount: '',
        founderId: '',
        portrait: '',
        extraData: '',
        status: '',
        config: {
          size: 24, // 大小, 默认 24, 建议15 - 55
          url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // 所有 emoji 的背景图片
          lang: 'zh', // 选择的语言, 默认 zh
        },
      }
    },
    props: {
      detail: {
        type: String,
        default: ''
      },
      debitNum: {
        type: Number,
        default: 0
      },
      userInfoId: {
        type: String,
        default: ''
      },
      isPc: {
        type: Boolean,
        default: false,
      },
      noTime: {
        type: Boolean,
        default: true
      },

    },
    computed: {
      ...mapGetters([
        'userData',
        'userId',
        'connectState',
        'historyState',
      ]),

    },
    watch: {
      messageValue(newParm, oldParm) {
        if (newParm) {
          this.needSend = true
        } else {
          this.needSend = false
        }
      },
      uploadState(newParm, oldParm) {
        if (newParm) {
          this.sendPic()
        }
      },

    },

    created() {
      /*加载bettorScroll*/
      Vue.$global.bus.$on('textMessage', (message) => {
        this.chatArr.push(message)
        this.symolEmoji = RongIMLib.RongIMEmoji;
        this.clearUnreadCount()
        this.scrollToBot()
      })
      Vue.$global.bus.$on('picMessage', (val) => {
        console.log(val,'收到了就')
        this.chatArr.push(val)
        this.symolEmoji = RongIMLib.RongIMEmoji;
        this.clearUnreadCount()
        this.scrollToBot()
      })
      /*发送开始时间*/
      /*清楚制定会话数*/
      Vue.$global.bus.$on('portrait', (val) => {
        this.portrait = val
      })

    },

    mounted() {
      this.fetchOrder()
      this.historyStateUpdate()
    },
    methods: {
      ...mapMutations(['CHANGE_CONNECTSTATE', 'GET_HISTORYSTATE']),
      doClick() {
        this.$store.commit('GET_HISTORYSTATE', 0)
        this.$emit('chatShow', false)
      },
      sendInfo(ev) {
        if (ev.keyCode === 13) {
          if (!this.messageValue == '') {
            this.sendMessage()
          }
        }
      },
      fetchOrder() {
        if (!this.detail) {
          return
        }
        const requestData = {
          orderId: this.detail
        }
        transaction.getOrderx(requestData).then(res => {
          this.status = res.data.status
          this.startTime = res.data.intervalTime;
          this.endTime = res.data.elapsedTime;

        })
      },
      closeChatList() {
        this.$emit('closeChatroom')
      },
      scrollToBot() {
        this.$nextTick(() => {
          if (this.chatArr.length == 0 && this.historyArr.length == 0) {
            return;
          }
          const imgArr = document.getElementsByClassName('msg-item')
          const len = imgArr.length
          for (let i = 0; i <= len; i++) {
            if (this.scroll) {
              this.scroll.refresh();
              this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[(this.chatArr.length + this.historyArr.length) - 1], 333)
            } else {
            }
          }
        })
      },
      showDisplay() {
        this.isDisplay = !this.isDisplay;
      },
      upload(e) {
        let reader = new FileReader();
        var file = e.target.files[0];
        //区分2个地方 一个是给后台发 一个是给融云发
        if (file.type.indexOf('image') == 0) {
          reader.readAsDataURL(file)
          reader.onload = () => {
            var img = new Image()
            var canvas = document.createElement('canvas');
            var canvasNext = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var ctx = canvas.getContext('2d');
            img.src = reader.result
            this.base64 = reader.result;
            /*如果图片的base64大于100kb 那么久压缩*/
            img.onload = () => {
              var originWidth = img.width;
              var originHeight = img.height;
              // 最大尺寸限制
              if (this.base64.length > 100000) {
                canvasNext.width = 60;
                canvasNext.height = 60;
                ctx.clearRect(0, 0, 60, 60)
                ctx.drawImage(img, 0, 0, 60, 60)
                this.dataURLNext = canvasNext.toDataURL('image/png');
                this.base64 = this.dataURLNext.replace(/^data:.*?;base64,/, '')
              } else {
                this.base64 = this.base64.replace(/^data:.*?;base64,/, '')
              }
              var maxWidth = 400,
                maxHeight = 400;
              // 目标尺寸
              var targetWidth = originWidth,
                targetHeight = originHeight;
              if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                  // 更宽，按照宽度限定尺寸
                  targetWidth = maxWidth;
                  targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
              }
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              // 清除画布
              context.clearRect(0, 0, targetWidth, targetHeight);
              // 图片压缩
              context.drawImage(img, 0, 0, targetWidth, targetHeight);
              // canvas转为blob并上传
              this.dataURL = canvas.toDataURL('image/png');
              var blob = this.dataURItoBlob(this.dataURL);
              const RamdomValue = Math.random();
              var fd = new FormData();
              this.uploadState = '';
              fd.append("file", blob, `${RamdomValue}.png`);
              fd.append('nodeId', this.userData.node && this.userData.node.customer ? `${this.userData.nodeId}_${this.userData.merchantId}` : process.env.NODE_ID)
              chatWith.uploadFile(fd).then(res => {
                if (res.code == 10000) {
                  this.picUrl = res.data.url;
                  this.uploadState = true;
                  this.demoArr.push({img: [this.picUrl]});
                } else {
                  this.uploadState = false
                }
              }).catch(res => {

              })

            }
          }
        }
      },
      getHistoryMessage() {
        let conversationType = RongIMLib.ConversationType.GROUP //eslint-disable-line
        let targetId = this.detail
        let timestrap = 0 // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
        let count = 20 // 范围0-20条 可多次获取
        RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
          onSuccess: ((list, hasMsg) => {
            /*区分图片和消息*/
            console.log(list,'这是历史')
            this.historyArr = list;
            this.$forceUpdate()
            this.scrollToBot()
          }),
          onError: function (error) {
            console.log(error, '失败记录；')
          }
        })
      },
      historyStateUpdate() {
        if (this.historyState == 3) {
          this.symolEmoji = RongIMLib.RongIMEmoji;
          this.getHistoryMessage();
          const conversationType = RongIMLib.ConversationType.GROUP
          const id = this.detail
          RongIMClient.getInstance().clearUnreadCount(conversationType, id, {
            onSuccess: (res) => {
              RongIMClient.getInstance().getTotalUnreadCount({
                onSuccess: (count) => {
                  this.$store.commit('GET_UNREADCOUNT', count)
                },
                onError: (error) => {
                  // error => 获取总未读数错误码。
                }
              });
            },
            onError: () => {
            }
          })
          this.fetchOrder()
          if (!this.detail) {
            return
          }
          let groupId = {'groupId': this.detail}
          chatWith.getOrderxInfo(groupId).then(res => {
            this.amount = res.data.amount
            this.founderId = res.data.founderId
            this.credit = res.data.credit
            this.debit = res.data.debit
            this.creditNickname = res.data.creditNickname
            this.debitNickname = res.data.debitNickname
            this.founderRoleType = res.data.founderRoleType
            this.type = res.data.type
            this.extraData = {
              "credit": res.data.credit, //买方id
              "debit": res.data.debit,  //卖方id
              "amount": res.data.amount, //交易数量
              "assetCode": res.data.assetCode, //资产编码
              "founderNickname": res.data.founderNickname,  //发起人昵称
              "founderRoleType": res.data.founderRoleType,  //发起角色类型
              "founderId": res.data.founderId  //会话发起人id
            }
          })
          this.$nextTick(() => {
            this.scroll = this.$refs.scroll;
            this.scrollToBot()
          })
        }

      },
      returnList() {
        this.$emit('openList', true)
        this.$store.commit('GET_HISTORYSTATE', 0)
      },
      dataURItoBlob(base64Data) {
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(base64Data.split(',')[1]);
        } else {
          byteString = unescape(base64Data.split(',')[1]);
        }
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type: mimeString});
      },
      callBack() {
        /*初始化*/
        RongIMLib.RongIMClient.init('x18ywvq85ahuc', null, {navi: 'http://dc-jiuan-im-nav-pro.com'}) //eslint-disable-line
        /*获取token*/
        this.getToken()
      },
      getDom(html) {
        var span = document.createElement("span");
        span.innerHTML = html;
        return span.childNodes[0];
      },
      sendEmoji() {
        var panel = document.getElementsByClassName('emoji_area')[0];
        this.isChangeValue = !this.isChangeValue;
        this.isShowMore = false;
        if (!this.isChangeValue) {
          panel.style.display = 'block';
          for (let i = 0; i < RongIMLib.RongIMEmoji.list.length; i++) {
            var value = RongIMLib.RongIMEmoji.list[i].emoji;
            /*避免多次创建*/
            if (!panel.hasChildNodes()) {
              this.shadowDomList.push(this.getDom('<span>' + value + '</span>'));
            }
          }
          var emojis = this.shadowDomList;
          for (let i = 0; i < emojis.length; i++) {
            const emojiHtml = emojis[i];
            panel.appendChild(emojiHtml);
            emojiHtml.onclick = this.clickEmoji
          }
        } else {
          document.getElementsByClassName('emoji_area')[0].style.display = 'none'
        }
      },
      clickEmoji(event) {
        var e = event || window.event;
        var targer = e.target || e.srcElement;
        if (document.all && !document.addEventListener === false) {
        }
        var chatbox = document.getElementById('inputMessage');
        this.messageValue = chatbox.value + targer.innerHTML;
      },
      showMoreFunction() {
        this.isShowMore = !this.isShowMore
        document.getElementsByClassName('emoji_area')[0].style.display = 'none'
        this.scrollToBot()
      },
      clearUnreadCount() {
        let conversationType = RongIMLib.ConversationType.GROUP
        RongIMClient.getInstance().clearUnreadCount(conversationType, this.detail, {
          onSuccess: (res) => {
            this.$forceUpdate()
          },
          onError: () => {
          }
        })
      },
      sendMessage() {
        let conversationtype = RongIMLib.ConversationType.GROUP;
        let targetId = this.detail;
        //改变发送messageValue的值因为用户会发送表情
        this.messageValue = RongIMLib.RongIMEmoji.symbolToEmoji(this.messageValue);
        this.userInfo = {
          id: this.userId,
          portrait: this.portrait,
          name: this.userData.name
        }
        let msg = new RongIMLib.TextMessage({
          content: this.messageValue,
          user: this.userInfo,
          extra: JSON.stringify(this.extraData)
        });
        RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
            onSuccess: (message) => {
              //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
              this.chatArr.push({msg: this.messageValue, user: 1, userName: this.userData.name})
              this.messageValue = ''
              this.scrollToBot()
              this.clearUnreadCount()
            },
            onError: function (errorCode, message) {
              var info = '';
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = '超时';
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误';
                  break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = '在黑名单中，无法向对方发送消息';
                  break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = '不在讨论组中';
                  break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = '不在群组中';
                  break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = '不在聊天室中';
                  break;
              }
              console.log('发送失败:' + info);
            }
          }
        );
      },

      sendPic() {
        let conversationtype = RongIMLib.ConversationType.GROUP;
        let targetId = this.detail;
        this.clearUnreadCount()
        this.userInfo = {
          id: this.userId,
          portrait: this.portrait,
          name: this.userData.name
        }
        let msg = new RongIMLib.ImageMessage({
          content: this.base64,
          imageUri: this.picUrl,
          user: this.userInfo,
          extra: JSON.stringify(this.extraData)
        })
        RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
          onSuccess: ((message) => {
            this.chatArr.push({msg: message.content.imageUri, user: 3, img: [message.content.imageUri]})
            this.scrollToBot()
          }),
          onError: ((error) => {
            console.log(error)
          })

        })
      }
    },
    beforeDestroy() {
      Vue.$global.bus.$off('textMessage')
      Vue.$global.bus.$off('picMessage')
    },
    components: {
      mHeader,
      BScroll,
      CountDown
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .box {
    display: flex;

  }

  .box-f1 {
    flex: 1;
  }

  .box-ver {
    flex-direction: column;
  }

  .fr {
    float: right;
  }

  .wrapper_box {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .order_info {
    width: 100%;
    background-color: #fff;

    .order_state {
      padding: r(24) r(10);
      border-bottom: 1px solid #D8D8D8;
      .state_b {
        overflow: hidden;
        .state_d {
          display: inline-block;
          width: r(33);
          height: r(16);
          background-color: #4982FF;
          color: #fff;
          border-radius: r(2);
          font-size: r(12);
          padding: 2px;
          line-height: r(14);
          margin: 0 auto;
          text-align: center;
        }
        .state_n {
          display: inline-block;
          width: r(33);
          height: r(16);
          background-color: #E9BA52;
          color: #fff;
          border-radius: r(2);
          font-size: r(12);
          padding: 2px;
          line-height: r(14);
          margin: 0 auto;
          text-align: center;
        }
        .order_num {
          padding-left: r(8);
          font-size: r(15);
          color: #333333;
          line-height: 15px;
        }
        .order_d {
          font-size: 15px;
          color: #4982FF;
          letter-spacing: 0;
          line-height: 15px;
          float: right;
        }
      }
      .order_c {
        padding-top: r(12);
        font-size: 15px;
        color: #787876;
        letter-spacing: 0;
        line-height: 15px;
      }
    }
  }

  .line {
    height: 44px;
    padding: 0 r(10);
    border-bottom: 1px solid #D8D8D8;
    line-height: 44px;
    font-size: r(15);
    color: #333333;
    overflow: hidden;
  }

  .lineColor {
    font-size: 15px;
    color: #8F8F8F;
    letter-spacing: 0;

  }

  .display {
    background-color: #f5f5f5;
  }

  .display img {
    display: block;
    width: 70px;
    height: 20px;
    margin: 0 auto;
  }

  .hiddenbox {
    background-color: #f5f5f5;
  }

  .hiddenbox img {
    display: block;
    width: 70px;
    height: 20px;
    margin: 0 auto;
  }

  .countdown {
    font-size: r(15);
    color: #F43531;
    letter-spacing: 0;
    line-height: r(44);
    height: r(44);
    width: 100%;
    text-align: center;
    background-color: #fff;
  }

  .chatbox {
    width: 100%;
    overflow: auto;
    margin-bottom: .5rem;
    &.pcchatbox {

    }
    .chat_container {
      display: flex;
      flex-direction: row;
      margin-top: r(10);
    }
    .contents {
      background-color: #84D55A;
      color: #000000;
      border-radius: r(5.8);
      position: relative;
      word-break: break-all;
      padding: r(2.5) r(10) r(0);
      max-width: 15rem;
      min-height: 2rem;
      &::after {
        display: block;
        content: '';
        position: absolute;
        right: r(-20);
        top: r(1);
        border-width: r(14);
        border-style: solid;
        border-color: transparent transparent transparent #84d55a;
      }
    }
    .contents_next {
      background-color: #fff;
      color: #000000;
      border-radius: r(5.8);
      position: relative;
      word-break: break-all;
      padding: r(5) r(10) r(5) r(10);
      max-width: 15rem;
     // max-height: 8rem;
      &::after {
        display: block;
        content: '';
        position: absolute;
        left: r(-20);
        top: r(4);
        border-width: r(14);
        border-style: solid;
        border-color: transparent #fff transparent transparent;
      }
    }
    .contents_img_next{
      background-color: #fff;
      color: #000000;
      border-radius: r(5.8);
      position: relative;
      word-break: break-all;
      max-width: 15rem;
      max-height: 8rem;
      &::after {
        display: block;
        content: '';
        position: absolute;
        left: r(-20);
        top: r(4);
        border-width: r(14);
        border-style: solid;
        border-color: transparent #fff transparent transparent;
      }
    }
    .user_symbol {
      width: r(45);
      height: r(48);
      background: url('~images/chatWith/my.png') no-repeat;
      background-size: 100%;
      margin-left: 1rem;
    }

    .user_symbol_next {
      width: r(45);
      height: r(48);
      background: url('~images/chatWith/buyer.png') no-repeat;
      background-size: 100%;
      margin-right: 1rem;
      &.isSeller {
        width: r(45);
        height: r(48);
        background: url('~images/chatWith/seller.png') no-repeat;
        background-size: 100%;
        margin-right: 1rem;
      }
      &.iskefu {
        width: r(45);
        height: r(48);
        background: url('~images/chatWith/kefu.png') no-repeat;
        background-size: 100%;
      }
      &.isMy {
        width: r(45);
        height: r(45);
        background: url("~images/chatWith/my.png~") no-repeat;
        background-size: 100%;
      }
    }
  }

  .input_chatbox {
    width: 100%;
    border-top: 1px solid #e0e0e2;
    background-color: #f4f4f6;
    .chatboxNext {
      background-color: #F5F5F5;
      display: flex;
      flex-direction: row;

    }
    .more {
      width: r(33);
      height: r(35);
      margin: r(10) r(5) r(8);
    }
    .smile {
      width: r(33);
      height: r(35);
      margin: r(10) r(5) r(8);
    }
  }

  .input_message {
    width: r(312);
    height: r(42);
    border-radius: r(6);
    margin: r(8) r(10);
    background-color: #fdfdfe;
    border: 1px solid #b4b6be;
    flex: 1;
    text-indent: r(5);
    font-size: r(15);
  }

  .sendMessage {
    width: r(43);
    height: r(33);
    margin: r(12) r(5);
    background-color: #4982FF;
    border-radius: r(4);
    color: #fff;
  }

  .photo_area {
    width: 100%;
    height: r(132);
    position: relative;
    display: flex;
    flex-direction: row;
    text-align: center;
    .take_box {
      padding: r(10);
    }
    img {
      width: r(70);
      height: r(70);
    }
    span {
      font-size: r(15);
      color: #888;
    }
  }

  .demo1 {
    background: url("~images/chatWith/more.png") no-repeat;
    background-size: 100%;
  }

  .demo2 {
    background: url("~images/chatWith/input.png") no-repeat;
    background-size: 100%;
  }

  .emoji {
    background: url("~images/chatWith/smile.png") no-repeat;
    background-size: 100%;
  }

  .input {
    background: url("~images/chatWith/input.png") no-repeat;
    background-size: 100%;
  }

  .sendPic {
    display: inline-block;
    position: absolute;
    top: 0;
    left: r(10);
    z-index: 10;
    opacity: 1;
  }

  .openCamera {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: r(70);
    height: r(70);
    z-index: 10;
    opacity: 0;
  }

  .contents_image {
    max-width: r(190);
    max-height: 7rem;
    height: 400px;
  }

  .sendname {
    color: #787876;
    font-size: r(13);
  }

  header.mobile-header {
    position: relative;
    z-index: 99;
    height: r($header-hg);
    line-height: r($header-hg);
    background: $main-color;
    @include f(18px);
    color: $white;
    text-align: center;
    .back-link {
      position: absolute;
      height: 100%;
      left: 0;
      width: r(66);
      top: 50%;
      transform: translateY(-50%);
      text-align: left;
      padding-left: r(8);
    }
    .icon-left-arrow {
      @include f(18px)
    }
  }

  header.mobile-header-fixed {
    position: fixed;
    width: 100%;
    height: r($header-hg);
  }

  .origin_box {
    background-color: #F5F5F5;
  }

  .pcContainer {
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
    top: auto !important;
    width: 350px !important;
    overflow: hidden;
    z-index: 100 !important;
    height: 500px !important;
    border-radius: 10px 10px 0 0;
    background-color: transparent;
    left: auto !important;
    .mainTitle {
      background-color: $main-color;
      border-radius: 10px 10px 0 0;
      line-height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      text-align: center;
      height: 40px;
      .middle_title {
        color: $font-chatroom-color;
        font-size: 18px;
      }
      .return_back {
        color: $font-chatroom-color;
        font-size: 12px;
        float: left;
        cursor: pointer;
      }
      .close_symbol {
        color: $font-chatroom-color;
        font-size: 12px;
        float: right;
        cursor: pointer;
      }
    }
    .order_state {
      padding: r(5) r(10);
    }
    .chatbox {
      border-left: 1px solid #F1F6FF;
      border-right: 1px solid #F1F6FF;
      margin-bottom: 0;
    }
    .pcState {
      background-color: #F1F6FF;
    }
    .hiddenboxPC {
      background-color: #f1f6ff;
    }
    .displayboxPC {
      background-color: #f1f6ff;
    }
  }
</style>
