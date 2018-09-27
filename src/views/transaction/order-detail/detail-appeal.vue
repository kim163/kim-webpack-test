<template>
  <div class="transell-main header-padding" ref="detailBox">
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <div class="section detail-content">
      <div class="container min-width" v-if="DetailList">
        <div class="detailapp-navtabs cfx">
          <span v-for="(item,i) in detailType" @click="detailTypeItem=item.value"
                :class="{active:detailTypeItem==item.value}" :key="item.value">
              {{generateTitle(item.name)}}
          </span>
        </div>
        <div class="row00 detail-box_scoped" v-if="detailTypeItem=='orderDetails'">
          <div class="detail-title cfx">
            <span v-if="isCredit" class="title-btn btn-primary">买入</span>
            <span v-else-if="isDebit" class="title-btn btn-sell">卖出</span>
            <span class="order-num">
              订单号：   {{orderId}}
            </span>
          </div>
          <div class="detail-in cfx">
            <div class="col-33">
              <h3 v-if="isCredit" class="h3">卖方 : {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})</h3>
              <h3 v-else-if="isDebit" class="h3">买方 : {{DetailList.creditName}}
                ({{DetailList.creditAccountNameTwin}})</h3>
              <ul class="details-data">
                <li>
                  <p>交易金额:</p>
                  <input type="text" class="red" readonly :value="DetailList.debitAmountTwin+' CNY'">
                </li>
                <li>
                  <p>交易数量:</p>
                  <input type="text" readonly :value="DetailList.debitAmount+' UET'">
                </li>
                <li>
                  <p>交易单价:</p>
                  <input type="text" readonly value="0.01 CNY">
                </li>
                <li>
                  <p>订单时间:</p>
                  <input type="text" readonly :value="DetailList.createtime | Date('yyyy-MM-dd hh:mm:ss')">
                </li>
              </ul>
            </div>
            <div v-if="isCredit" class="col-33">
              <h4 class="bank-title">卖家收款方式 : </h4>

              <div class="alipay-box"
                   v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'">
                <p class="alipay-box-title">
                  <i class="i-alipay" v-if="DetailList.debitAccountMerchantTwin == '支付宝'"></i>
                  <i class="i-wechat" v-else-if="DetailList.debitAccountMerchantTwin == '微信'"></i>
                  {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})<br> {{DetailList.debitAccountTwin}}
                </p>
                <div class="alipay-qrcode">
                  <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img"/>
                  <p>打开 {{DetailList.debitAccountMerchantTwin}} [扫一扫] </p>
                </div>
              </div>

              <div class="alipay-box" v-else>
                <p class="alipay-box-title text-center bank-title">
                  <i class="i-bank" :class="DetailList.debitAccountMerchantTwin | bankIcon"></i>{{DetailList.debitAccountMerchantTwin}}
                </p>
                <div class="alipay-qrcode text-left bank-txt-box">
                  <div class="bank-list-p">
                    <h3>银行卡号:</h3>
                    {{DetailList.debitAccountTwin}}
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.debitAccountTwin)">复制卡号</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>开户姓名：</h3>
                    {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.debitAccountNameTwin)">复制姓名</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>银行类别：</h3>
                    {{DetailList.debitAccountMerchantTwin}} (储蓄卡)<br>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="isDebit" class="col-33">
              <h4 class="bank-title">买家付款方式 : </h4>

              <div class="alipay-box"
                   v-if="DetailList.creditAccountMerchantTwin == '支付宝' || DetailList.creditAccountMerchantTwin == '微信'">
                <p class="alipay-box-title">
                  <i class="i-alipay" v-if="DetailList.creditAccountMerchantTwin == '支付宝'"></i>
                  <i class="i-wechat" v-else-if="DetailList.creditAccountMerchantTwin == '微信'"></i>
                  {{DetailList.creditName}}（{{DetailList.creditAccountNameTwin}}）<br>{{DetailList.creditAccountTwin}}
                </p>
                <div class="alipay-qrcode">
                  <img src="~images/qrcode.jpg" :src="DetailList.creditAccountQrCodeUrlTwin" class="qrcode-img"/>
                  <p>打开 {{DetailList.creditAccountMerchantTwin}} [扫一扫] </p>
                </div>
              </div>

              <div class="alipay-box" v-else>
                <p class="alipay-box-title text-center bank-title">
                  <i class="i-bank" :class="DetailList.creditAccountMerchantTwin | bankIcon"></i>{{DetailList.creditAccountMerchantTwin}}
                </p>
                <div class="alipay-qrcode text-left bank-txt-box">
                  <div class="bank-list-p">
                    <h3>银行卡号:</h3>
                    {{DetailList.creditAccountTwin}}
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.creditAccountTwin)">复制卡号</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>开户姓名：</h3>
                    {{DetailList.creditName}}（{{DetailList.creditAccountNameTwin}}）
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.creditAccountNameTwin)">复制姓名</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>银行类别：</h3>
                    {{DetailList.creditAccountMerchantTwin}} (储蓄卡)<br>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-33">
              <div class="order-time">
                <p class="red order-status-title">
                  <span> 申诉锁定中</span>
                </p>
                <input type="button" v-if="isCredit" class="btn btn-normal " @click="detailTypeItem='appealArbitrat'"
                       value="提出反证">
                <div class="btn-group" v-else-if="isDebit">
                  <input type="button" class="btn btn-block btn-normal" @click="showConfirmPayment=true" value="释放UET">
                  <input type="button" class="btn btn-block btn-orange" @click="detailTypeItem='appealArbitrat'"
                         value="继续留言">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--申诉与仲裁 加入_scoped 为了防止全局污染 -->
        <div class="row00 detail-box_scoped" v-else-if="detailTypeItem=='appealArbitrat'">
          <div class="appeal-content">
            <div class="content-title">
              <span class="title-state">发起申诉中....</span>
              <span class="title-blank"></span>
              <span class="title-refresh" @click="refreshContent">刷新会话</span>
            </div>
            <ul class="appeal-list-ul" v-if="reverseAppealList.length>0">
              <li v-for="(item,i) in reverseAppealList">
                <!-- 我是买家 DetailList.credit == userId-->
                <div v-if="item.sourceTypeText=='卖家'" class="content_list">
                  <div style="flex: 1;"></div>
                  <div class="user_content">
                    <p class="time">{{item.modifytime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
                    <p class="text_content">{{item.content}}</p>
                    <div v-if="item.attachmentUrls&&item.attachmentUrls!==null" style="display: inline-block">
                      <viewer :images="item.attachmentUrls.split(',')"
                              v-for="(listNext,value) in item.attachmentUrls.split(',')" :key="value"
                              style="text-align: right;display: inline-block">
                        <img :src="listNext" class="pic">
                      </viewer>
                    </div>
                  </div>
                  <div class="user_symbol"></div>
                </div>
                <!-- 我是卖家 DetailList.debit == userId-->
                <div v-if="item.sourceTypeText=='买家'" class="content_list_buyer">
                  <div class="user_symbol"></div>
                  <div class="user_content">
                    <div class="mes-box-in">
                      <p class="time">{{item.modifytime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
                      <p class="text_content">{{item.content }}</p>
                      <div v-if="item.attachmentUrls&&item.attachmentUrls!==null" style="display: inline-block">
                        <viewer :images="item.attachmentUrls.split(',')"
                                v-for="(listNext,value) in item.attachmentUrls.split(',')" :key="value"
                                style="text-align: right;display: inline-block">
                          <img :src="listNext" class="pic" v-lazy="listNext">
                        </viewer>
                      </div>
                    </div>
                  </div>
                  <div style="flex: 1"></div>
                </div>
                <!--我是客服-->
                <div v-if="item.sourceTypeText=='钱包客服'" class="content_list_kefu">
                  <div class="user_symbol"></div>
                  <div class="user_content">
                    <p class="time">{{item.modifytime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
                    <p class="text_content"> {{item.content}}</p>
                    <div v-if="item.attachmentUrls&&item.attachmentUrls!==null" style="display: inline-block">
                      <viewer :images="item.attachmentUrls.split(',')"
                              v-for="(listNext,value) in item.attachmentUrls.split(',')" :key="value"
                              style="text-align: right;display: inline-block">
                        <img :src="listNext" class="pic">
                      </viewer>
                    </div>
                  </div>
                  <div style="flex: 1"></div>
                </div>
              </li>
            </ul>
            <div v-else>
              <no-data-tip></no-data-tip>
            </div>
            <!--输入框-->
            <div class="input-content">
              <div class="content-box">
                <textarea placeholder="说点什么吧...." style="resize:none" v-model="textValue"></textarea>
                <uploadImg :uploadImgSet="{maxUploadNum:3}" :showClose="true" @gitPicUrl="getPicUrl"  v-model="isReset"></uploadImg>
              </div>
              <!--发送按钮-->
              <div class="send-btn" @click="sendInfo">
                发送
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container min-width" v-else>
        <no-data-tip></no-data-tip>
      </div>
    </div>

    <confirm-dialog v-model="showConfirmPayment" :is-pc="true">
      <div slot="title">释放数额 {{DetailList.debitAmount}} UET</div>
      <div slot="content">
        <div class="dialog-content">{{$t('orderDetailPay.confirmPayTitle')}}</div>
        <div class="dialog-content color-red">{{$t('orderDetailPay.confirmPayCont')}}</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel bg-gray">{{$t('postPend.cancel')}}</div>
      <div slot="rightBtn" @click="payCompleted" class="bg-blue">{{$t('orderDetailPay.confirmPayBtn')}}</div>
    </confirm-dialog>
    <!--聊天部分-->
    <div class="chatRoom" @click="showChatList()" v-if="chatOnline">
      <div class="chatRoom_content">
        <span class="iconfont icon-tab-talk"></span> 在线聊天
        <div class="unread-count" v-show="unreadCountUpdate>0" :class="{'upMax':unreadCountUpdate>99}">
          {{unreadCountUpdate}}
          <span class="add_symbol" v-show="unreadCountUpdate>99">+</span>
        </div>
      </div>
    </div>
    <div v-show="isPCstate" style="position: relative">
      <chatList :isPC="isPCstate" v-if="openListState" @closeChatroom="iscloseChatroom"></chatList>
      <chat
        class="chatWindow"
        v-if="chatState"
        :detail="orderId"
        :debitNum="DetailList.debitAmount"
        :historyState="DetailList.historyState"
        @chatShow="chatStateUpdate"
        :isPc="isPCstate"
        @openList="openListUpdate"
        @closeChatroom="iscloseChatroom"
      ></chat>
    </div>
    <v-footer></v-footer>
  </div>

</template>

<script>
  import navMenu from 'components/nav';
  import breadCrumbs from 'components/bread-crumbs';
  import NoDataTip from 'components/no-data-tip'
  import confirmDialog from 'components/confirm'
  import vFooter from 'components/footer';
  import {generateTitle} from '@/util/i18n'
  import {chatWith, transaction, userCenter} from 'api'
  import {mapGetters} from 'vuex'
  import chatList from '../../../views/mobile/chatroom/chat-list'
  import chat from '../../../views/mobile/chatroom/chat'
  import uploadImg from 'components/upload-img'

  export default {
    data() {
      return {
        orderId: '',
        DetailList: {},
        breadList: [
          {
            urlName: 'transaction',
            name: 'navbar.tradingHall'
          },
          {
            urlName: 'tranRecord',
            name: 'transactionHome.orderRecord'
          },
          {
            urlName: 'orderDetailAppeal',
            name: 'transactionRecord.orderDetails'
          }
        ],
        detailType: [
          {name: 'transactionRecord.orderDetails', value: 'orderDetails'},
          {name: 'transactionRecord.appealArbitrat', value: 'appealArbitrat'}
        ],
        detailTypeItem: 'orderDetails',
        AppealList: {},
        myMessage: '',
        request: {},
        isCredit: false,
        isDebit: false,
        showConfirmPayment: false,
        isPCstate: '',
        chatState: '',
        chatOnline: true,
        openListState: false,
        typeState: 3,
        textValue: '',
        attachmentUrls: '',
        isReset: false,
      };
    },
    methods: {
      generateTitle,
      fetchData() {
        this.request = {
          limit: '20',
          offset: '0',
          orderId: this.orderId,
          userId: this.userId,
          type: 3   //默认为3
        }
        transaction.getAppealDetailPage(this.request).then(res => {
          // data.orderx   订单详情
          // data.sendInfo   申诉消息列表
          // data.appeal   申诉状态
          if (res.code == '10000') {
            this.DetailList = res.data.orderx;
            this.AppealList = res.data;
            if (this.DetailList.credit == this.userId) {
              this.isCredit = true;
            } else if (this.DetailList.debit == this.userId) {
              this.isDebit = true;
            }
          } else {
            toast(res.message)
          }

          //statusText
//          this.DetailList.creditProofUrlTwin = res.data.creditProofUrlTwin.split(',');

        }).catch(error => {
          toast(error.message);
        });
      },
      chatStateUpdate() {
        this.chatState = false
      },
      refreshContent(){
        this.fetchData()
      },
      openListUpdate() {
        this.openListState = true
        this.chatState = false
      },
      getPicUrl(res) {
        this.attachmentUrls = res
        console.log('为什么我们是我们')
      },
      iscloseChatroom() {
        this.isPCstate = false
        this.chatOnline = true
      },
      sendInfo() {
        const requests = {
          'orderId': this.orderId,
          'userId': this.userId,
          'userName': this.userData.nickname,
          'attachmentUrls': this.attachmentUrls ? this.attachmentUrls.join(',') : '',
          'content': this.textValue
        }
        userCenter.addAppealDetail(requests).then((res) => {
          if (res.code == '10000') {
            toast('发送成功')
            this.textValue = ''
            this.fetchData()
            this.isReset = true
          } else {
            toast(res.message)
          }
        })
      },
      payCompleted() {
        this.showConfirmPayment = false;
        this.request = {
          orderId: this.orderId
        }
        transaction.payCompleted(this.request).then(res => {
          if (res.code == '10000') {
            Vue.$global.bus.$emit('update:balance');
            toast('您已确认收款，请勿重复操作');
            this.$router.push({name: 'orderDetailOver', params: {id: this.orderId}});
          } else {
            toast(res.message)
          }

        }).catch(err => {
          toast(err.message);
        });
      },
      handleScroll() {

        if (this.detailTypeItem == 'appealArbitrat') {

        }

      },
      copystr(text) {
        text.$copy();
        toast(this.$t('transactionHome.successCopy'));
      },
      showChatList() {
        if (!this.connectState) {
          toast('聊天功能正在初始化,请稍后片刻！')
          return
        }
        let params = {
          groupId: this.orderId,
          founderId: this.userData.userId,
          type: this.typeState,
          founderNickname: this.userData.nickname
        }
        chatWith.createChatGroup(params).then(res => {
          if (res.code === 10000) {
            this.$store.commit('GET_HISTORYSTATE', 3)
            this.isPCstate = true
            this.chatOnline = false
            this.chatState = true
          } else {
            toast(res.message)
          }
        }).catch(res => {
          toast(res.message)
        })
      },
    },
    created() {
      if (this.$route.params.id) {
        this.orderId = this.$route.params.id;
        this.fetchData();
      }
    },
    watch: {
      "$route"(val) {
        this.orderId = val.params.id;
        this.fetchData();
      }
    },
    computed: {
      ...mapGetters(["userData", "islogin", "userId", 'connectState', 'unreadCount']),
      reverseAppealList() {
        // 按照时间倒序显示数据
        if (this.AppealList.send && this.AppealList.send.length > 0) {
          this.AppealList.send = this.AppealList.send.map(item => {
            return item;
          });
        }
        return this.AppealList.appealDetailList.reverse();
      },
      unreadCountUpdate() {
        if (this.unreadCount < 0) {
          return 0
        } else if (this.unreadCount > 99) {
          return 99
        } else {
          return this.unreadCount
        }
      }
    },
    components: {
      navMenu, breadCrumbs, NoDataTip, confirmDialog, vFooter, chatList, chat, uploadImg
    },
    filters: {
      bankIcon: function (value) {
        if (!value) return 'icbc';
        if (value == '工商银行') {
          return 'icbc';
        }
        if (value == '招商银行') {
          return 'cmbc';
        }
        return value
      }
    }
  };
</script>

<style lang="scss">

  .content_list {
    display: flex;
    flex-direction: row;
    padding-top: r(20);
    .user_symbol {
      background: url('~images/chatWith/seller.png') no-repeat;
      background-size: 100%;
      width: 60px;
      height: 60px;
    }
    .user_content {
      padding-right: 10px;
      .name {
        color: #333;
        font-size: 16px;
        text-align: right;
      }
      .text_content {
        text-align: right;
        font-size: 16px;
        padding: 10px 0 5px;
        width: 100%;
        word-break: break-all;
        max-width: 15rem;
      }
      .pic {
        padding: 10px;
        width: 120px;
        height: 120px;
        text-align: left;
      }
      .time {
        text-align: right;
        color: #949494;
        padding-bottom: r(19);
      }
    }
  }

  .content_list_buyer {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    .user_symbol {
      background: url('~images/chatWith/buyer.png') no-repeat;
      background-size: 100%;
      width: 60px;
      height: 60px;
    }
    .user_content {
      padding-left: 10px;
      .name {
        color: #333;
        font-size: 16px;
        text-align: left;
      }
      .text_content {
        text-align: left;
        font-size: 16px;
        padding: 10px 0 5px;
        width: 100%;
        word-break: break-all;
        max-width: 15rem;
      }
      .pic {
        padding: 10px;
        width: 120px;
        height: 120px;
        text-align: right;
      }
      .time {
        text-align: left;
        color: #949494;
      }
    }
  }

  .content_list_kefu {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    .user_symbol {
      background: url('~images/chatWith/kefu.png') no-repeat;
      background-size: 100%;
      width: 60px;
      height: 60px;
    }
    .user_content {
      padding-left: 10px;
      .name {
        color: #333;
        font-size: 16px;
        text-align: left;
      }
      .text_content {
        text-align: left;
        color: #333;
        font-size: 16px;
        padding: 10px 0 5px;
        width: 100%;
        word-break: break-all;
        max-width: 15rem;
      }
      .pic {
        padding:10px;
        width: 120px;
        height: 120px;
        text-align: left;
      }
      .time {
        text-align: left;
        color: #949494;
      }
    }
  }

  .content-title {
    display: flex;
    flex-direction: row;
    padding: 31px 41px 0;
    .title-state {
      color: #333;
      font-size: 16px;
      line-height: 40px;
    }
    .title-blank {
      flex: 1;
    }
    .title-refresh {
      width: 120px;
      height: 40px;
      background-color: #f68887;
      color: #fff;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }

  .appeal-list-ul {
    height: 600px;
    overflow-y: scroll;
    padding: 10px 0;
    li {
      padding: 10px 10px 0;
      overflow: hidden;
    }
  }

  .detailapp-navtabs {
    height: 48px;
    line-height: 48px;
    span {
      display: block;
      float: left;
      width: 18%;
      text-align: center;
      font-size: 16px;
      color: #787876;
      border: 1px solid #D4D4D4;
      border-bottom: none;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      margin-right: 2.2%;
      cursor: pointer;
      &:hover, &.active {
        color: #ffffff;
        background: #4AA9E9;
        border: 1px solid #4AA9E9;
        border-bottom: none;
      }
      &:last-child {
        margin: 0;
      }
    }
  }

  .detail-content {
    min-height: 300px;
    margin: 30px 0;
  }

  .order-status-title {
    text-align: center;
  }

  .detail-box_scoped {
    border: 1px solid #d4d4d4;
    input {
      height: 40px;
      line-height: 40px;
      border: 1px solid #d4d4d4;
      width: 100%;
      padding: 0 20px;
      font-size: 16px;
    }
    input:read-only {
      background: #f7f7f7;
    }
    .btn-sell {
      background: orange;
    }
    .time-stame {
      font-size: 22px;
      padding: 10px 0;
    }
    .col-33 {
      display: block;
      width: 33%;
      float: left;
      border-right: 1px solid #d4d4d4;
      margin: 0;
      min-height: 427px;
      min-width: 350px;
      &:last-child {
        border: 0;
      }
    }

    .red {
      color: red;
    }
    .alipay-box {
      margin: 30px 50px 40px;
      .alipay-box-title {
        border: 1px solid #d4d4d4;
        padding: 10px 10px 10px 10px;
        background-size: 30px;
        font-size: 16px;
        &.bank-ttile {
          font-size: 20px;
        }
      }
      .i-alipay {
        display: inline-block;
        float: left;
        height: 50px;
        width: 38px;
        background: url('~images/i-alipay.png') no-repeat left center;
        background-size: 30px;
      }
      .i-wechat {
        display: inline-block;
        float: left;
        height: 50px;
        width: 38px;
        background: url('~images/i-wechat.png') no-repeat left center;
        background-size: 30px;
      }
      .alipay-qrcode {
        background: #4aa9e9;
        color: #fff;
        text-align: center;
        padding: 18px;
        &.text-left {
          text-align: left;
        }
        &.bank-txt-box {
          padding: 18px 22px;
        }
        h3 {
          font-weight: normal;
          font-size: 18px;
          padding: 2px 0 8px;
        }
        img {
          width: 160px;
          height: 160px;
          padding: 12px;
          background: url('~images/j.png') no-repeat;
          margin-bottom: 5px;
          display: inline-block;
        }
      }
    }
    .input-content {
      padding: 20px;
      background-color: #f5f5f5;
      .content-box {
        background-color: #fff;
        width: 100%;
        padding: 10px 0;
        textarea {
          border: transparent;
          text-indent: 19px;
          height: 40px;
          width: 100%;
          padding: 0;
          &::placeholder {

            font-size: 16px;
          }
          &:focus {
            outline: none;
          }
        }
        .upload-imgpart {
          padding: 0;
          .upload-imgitem {
            width: 100px;
            height: 100px;
          }
        }
      }
      .send-btn {
        color: #fff;
        background-color: #4982FF;
        text-align: center;
        width: 100px;
        height: 40px;
        line-height: 40px;
        margin: 20px 20px 20px 0;
        border-radius: 4px;
      }
    }

  }

  .order-time {
    padding: 20px 50px;
  }

  .detail-title {
    height: 80px;
    border-bottom: 1px solid #d4d4d4;
  }

  .title-btn {
    height: 80px;
    line-height: 80px;
    display: inline-block;
    width: 140px;
    color: #fff;
    text-align: center;
    background: #5087ff;
    margin: 0 20px 0 0;
    font-size: 18px;
  }

  .detail-tips {
    border-top: 1px solid #d4d4d4;
    color: #787876;
    line-height: 30px;
    padding: 18px 30px 50px;
    p {
      font-size: 16px;
    }
    .tips-title {
      color: red;
      font-size: 18px;
      padding: 0 0 15px 0;
    }
    .tips-title-i {
      background: url(~images/tips.png) no-repeat left 4px;
      padding: 0 0 15px 25px;
    }
    .tips-title0 {
      padding: 0 0 15px 0;
    }
  }

  .detail-tips-sell {
    padding: 18px 30px 20px;
    overflow: hidden;
  }

  .h3, .bank-title {
    font-weight: normal;
    color: #333;
    font-size: 22px;
    padding: 20px 30px 0;
  }

  .details-data {
    padding: 0 30px 30px;
    li {
      padding: 16px 0 0 0;
    }
    p {
      font-size: 16px;
      padding: 0 0 8px 0;
    }
    .red {
      color: red;
    }
  }

  .upload-btngroup {
    width: 100px !important;
    height: 100px !important;
  }

  input[type="button"] {
    &.btn {
      display: inline-block;
      border: 1px solid #5087ff;
      color: #5087ff;
      border-radius: 4px;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      margin: 10px 0 0 0;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
    .btn-blue {
      border: 1px solid #5087ff;
      color: #5087ff;
    }
    &.btn-orange {
      border: 1px solid #ffa500;
      color: #ffa500;
    }
    &.btn-normal {
      border: 1px solid #5087ff;
      background: #5087ff;
      color: #fff;
    }
  }

  .item-info {
    color: #333;
  }

  .item-info.active {
    color: #5087FF;
  }

  .text-center {
    text-align: center;
  }

  .pic-ul {
    overflow: hidden;
    float: left;
  }

  .pic-ul li {
    float: left;
    margin-right: 15px;
  }

  .pic-ul li img {
    height: 190px;
  }

  .friend-txt {
    margin-top: 150px;
  }

  .bank-list-p {
    position: relative;
    margin-bottom: 18px;
  }

  .btn-copy {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #fff;
    border: 0;
    cursor: pointer;
  }

  .i-bank {
    display: inline-block;
    height: 40px;
    width: 46px;
    vertical-align: -13px;
    background: url(~images/bankIcon/juan-bank.png) no-repeat;
    background-size: contain;
    &.icbc {
      background: url(~images/bankIcon/icbc.png) no-repeat;
      background-size: 40px;
    }
    &.cmbc {
      background: url(~images/bankIcon/cmbc.png) no-repeat;
      background-size: 40px;
    }
  }

  .chatRoom {
    color: #fff;
    width: 150px;
    height: 50px;
    background-color: #FF6666;
    border-radius: 10px 10px 0 0;
    font-size: 18px;
    line-height: 50px;
    text-align: center;
    float: right;
    position: fixed;
    right: 0;
    bottom: 0;
  }

  .unread-count {
    display: inline-block;
    border-radius: 50%;
    padding: 0 5px;
    background-color: red;
    font-size: 12px;
    text-align: center;
    margin: 0 auto;
    color: #fff;
    line-height: 17px;
    vertical-align: top;
    margin-top: 7px;
    position: relative;
    &.upMax {
      padding: 0 10px 0 5px;
    }
    .add_symbol {
      position: absolute;
      top: -3px;
      right: 0;
      margin-top: -1px;
      font-size: 14px;
      font-weight: bold;
    }
  }

  ::-webkit-scrollbar-track-piece {
    margin: 0;
  }
</style>

