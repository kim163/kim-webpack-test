<template>
  <div>
    <div class="transell-main0 transell-main-box">
      <m-header v-if="DetailList.credit==userData.userId" :back="goBack">我的买币订单</m-header>
      <m-header v-else-if="DetailList.debit==userData.userId" :back="goBack">我的卖币订单</m-header>
      <div class="payOrder_progress" v-if="DetailList.credit==userData.userId">
        <div class="progress_state">
          <img src="~images/startpay.png" alt="">
          <p class="defaultColor">等待我付款</p>
          <span class="line"></span>
        </div>
        <div class="progress_state">
          <img src="~images/waitpay_next.png" alt="">
          <p class="defaultColor">等待对方放币</p>
          <span class="line"></span>
        </div>
        <div class="progress_state">
          <img src="~images/order_appeal.png" alt="">
          <p class="defaultColor">交易进入申诉</p>
        </div>
      </div>
      <!--卖家流程图-->
      <div class="payOrder_progress" v-else-if="DetailList.debit==userData.userId">
        <div class="progress_state">
          <img src="~images/startpay.png" alt="">
          <p class="defaultColor">等待对方付款</p>
          <span class="line"></span>
        </div>
        <div class="progress_state">
          <img src="~images/waitpay_next.png" alt="">
          <p class="defaultColor">等待我放币</p>
          <span class="line"></span>
        </div>
        <div class="progress_state">
          <img src="~images/order_appeal.png" alt="">
          <p class="defaultColor">交易进入申诉</p>
        </div>
      </div>
      <div class="trade-time-bar">
        <div>
          <p class="pay_send">申诉中</p>
        </div>
      </div>
      <div v-if="DetailList.credit == userId">
        <!--买-->
        <ul class="details-ul">
          <li>
            <span class="l-title">订单:</span>
            <p class="order-id-li extra_order"><span class="order_info">{{orderData.orderId}}</span>
              <a href="javascript:void(0);" class="copy-btn-next copy-btn" :data-clipboard-text="orderData.orderId"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </p>
          </li>
          <li>
            <span class="l-title">交易</span>
            <span>
                     <span class="l-title">{{DetailList.debitAmount}} UET</span>
              <span class="equal_money">≈ ¥ {{(DetailList.debitAmount*0.01).toFixed(2)}} </span>
                 </span>
          </li>
        </ul>
        <ul class="details-ul pay-detail">
          <li>
            <span class="l-title">
              <img src="~images/chatWith/seller.png" alt="" class="character">
              {{DetailList.debitName}}
            </span>
          </li>
          <li>
            <span class="l-title">收款</span>
            <div class="fr0">
                <span v-if="DetailList.debitAccountMerchantTwin == '支付宝'"><i
                  class="iconfont icon-pay-alipay"></i></span>
              <span v-else-if="DetailList.debitAccountMerchantTwin == '微信'"><i
                class="iconfont icon-pay-wechat"></i></span>
              <span v-else><i class="iconfont icon-pay-bank"></i></span>
              {{DetailList.debitAccountMerchantTwin}}
            </div>
          </li>
          <li>
            <span class="l-title">姓名</span>
            <div class="fr0">{{DetailList.debitAccountNameTwin}}
              <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountNameTwin"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </div>
          </li>
          <li>
            <span class="l-title">账号</span>
            <div class="fr0">
              <span>{{DetailList.debitAccountTwin}}</span>
              <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountTwin"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </div>
          </li>
          <li class="heightauto"
              v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'">
            <span class="l-title">收款二维码</span>
            <div class="qrcode-box">
              <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img">
              <span class="qrcode-tips copy-btn"></span>
            </div>
          </li>
        </ul>
        <div class="payment-tips credit" >该订单已进入申诉,请进入申诉会话提交您的证据,申诉失败一方将被处罚!</div>
      </div>
      <div v-else-if="DetailList.debit == userId">
        <!--卖-->
        <ul class="details-ul">
          <li>
            <span class="l-title">订单:</span>
            <p class="order-id-li extra_order"><span class="order_info">{{orderData.orderId}}</span>
              <a href="javascript:void(0);" class="copy-btn-next copy-btn" :data-clipboard-text="orderData.orderId"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </p>
          </li>
          <li>
            <span class="l-title">交易</span>
            <span>
                     <span class="l-title">{{DetailList.debitAmount}} UET</span>
              <span class="equal_money">≈ ¥ {{(DetailList.debitAmount*0.01).toFixed(2)}} </span>
                 </span>
          </li>
        </ul>
        <ul class="details-ul">
          <li>
              <span class="l-title">
                 <img src="~images/chatWith/buyer.png" alt="" class="character">
                {{DetailList.creditName}} </span>
          </li>
        </ul>
        <ul class="details-ul pay-detail">
          <li>
            <span class="l-title">
              <img src="~images/chatWith/seller.png" alt="" class="character">
              我
            </span>
          </li>
          <li>
            <span class="l-title">收款</span>
            <div class="fr0">
                <span v-if="DetailList.debitAccountMerchantTwin == '支付宝'"><i
                  class="iconfont icon-pay-alipay"></i></span>

                <span v-else-if="DetailList.debitAccountMerchantTwin == '微信'"><i
                  class="iconfont icon-pay-wechat"></i></span>
                <span v-else><i class="iconfont icon-pay-bank"></i></span>
                {{DetailList.debitAccountMerchantTwin}}
              </div>
            </li>
            <li>
              <span class="l-title">姓名 : </span>
              <div class="fr0">{{DetailList.debitAccountNameTwin}}
                <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountNameTwin"
                   @click="copy">{{$t('transactionHome.copyBtn')}}</a>

              </div>
            </li>
            <li>
              <span class="l-title">账号 : </span>
              <div class="fr0">
                <span class="">{{DetailList.debitAccountTwin}}</span>
                <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountTwin"
                   @click="copy">{{$t('transactionHome.copyBtn')}}</a>
              </div>
            </li>
            <li class="heightauto"
                v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'">
              <span class="l-title">收款二维码 : </span>
              <div class="qrcode-box">
                <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img">
                <span class="qrcode-tips">保存二维码</span>
              </div>
            </li>

          </ul>
        <div class="payment-tips">
          该订单已被申诉,请进入申诉会话提交您的证据,申诉失败一方将被处罚!

        </div>
        <div class="btn btn-block btn-primary btn-group">
          <input type="button" class="btn btn-block btn-border"  @click="showConfirmPayment=true" value="释放UET">
        </div>
      </div>

    </div>

    <confirm-dialog v-model="showConfirmPayment">
      <div slot="title">释放数额 {{DetailList.debitAmount}} UET</div>
      <div slot="content">
        <div class="dialog-content">{{$t('orderDetailPay.confirmPayTitle')}}</div>
        <div class="dialog-content color-red">{{$t('orderDetailPay.confirmPayCont')}}</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel bg-gray">{{$t('postPend.cancel')}}</div>
      <div slot="rightBtn" @click="payCompleted" class="bg-blue">确认释放UET</div>
    </confirm-dialog>

    <div class="Rongyunchatroom" @click="goChatroom()">
      <p>进入申诉对话<span style="color:#ec3a4e" v-if="unreadCountUpdate>0">(未读{{unreadCountUpdate}})</span></p>
    </div>
    <transition name="toolSlideRight">
      <chat v-if="chatState" class="chatWindow"
            :detail="gameID"
            :debitNum="DetailList.debitAmount"
            :historyState="DetailList.historyState"
            :noTime="true"
            @chatShow="chatStateUpdate"
      ></chat>
    </transition>
  </div>

</template>
<script>
  import mHeader from "components/m-header"
  import NoDataTip from 'components/no-data-tip'
  import {generateTitle} from '@/util/i18n'
  import {chatWith, transaction} from 'api'
  import {mapGetters} from 'vuex'
  import Clipboard from 'clipboard';
  import chat from '../chatroom/chat';
  import confirmDialog from 'components/confirm';

  export default {
    data() {
      return {
        /*   detailType:[
             {name:'detail.buyUet', value: '订单详情' },
             {name:'detail.saleUet', value: '申诉与仲裁' }
           ],*/
        DetailList: {},
        AppealList: {},
        myMessage: '',
        orderData: {
          orderId: this.$route.params.id,
          debitName: '', // 交易买方
        },
        request:{},
        gameID:'',
        chatState:'',
        isCredit: false,
        isDebit: false,
        showConfirmPayment:false
      };
    },
    methods: {
      generateTitle,
      fetchData() {
        this.loading = true;
        this.request = {
          limit: '20',
          offset: '0',
          orderId: this.$route.params.id,
          userId: this.userId,
          type: 3   //默认为3
        }
        console.log(this.request)
        console.log(this.userData)
        transaction.getAppealDetailPage(this.request).then(res => {
          this.loading = false;
          // data.orderx   订单详情
          // data.appealDetailList   申诉消息列表
          // data.appeal   申诉状态
          if (res.code === 10000) {
            this.DetailList = res.data.orderx;
            this.AppealList = res.data;
            if (this.DetailList.credit == this.userId) {
              this.isCredit = true;
            } else if (this.DetailList.debit == this.userId) {
              this.isDebit = true;
            }
          } else {
             this.$router.replace({name:'mTranRecord'})
          }
          //statusText
//          this.DetailList.creditProofUrlTwin = res.data.creditProofUrlTwin.split(',');

        }).catch(error => {
          toast(error.message);
        });

        this.loading = false;
      },
      addAppealDetail() {
        this.loading = true;
        this.request = {
          orderId: this.$route.params.id,
          userId: this.userId,
          userName: this.userData.nickname,
          attachmentUrls: '',
          content: this.myMessage
        }
        transaction.addAppealDetail(this.request).then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.code == '10000') {
            this.AppealList = res.data;
            toast('消息发送成功');
            this.fetchData();
            this.myMessage = '';
            this.fetchData();
          } else {
            toast(res.message);
          }


        }).catch(error => {
          toast(error.message);
        });
        this.loading = false;
      },
      payCompleted(){
        this.showConfirmPayment=false;
        this.request={
          orderId:this.$route.params.id
        }
        transaction.payCompleted(this.request).then(res => {
          this.loading = false;
          if (res.code == '10000') {
            Vue.$global.bus.$emit('update:balance');
            toast('您已确认收款，请勿重复操作');
            this.$router.push({name: 'mOrderOver', params: {id: this.request.orderId}});
          }else{
            toast(res.message)
          }

        }).catch(err => {
          toast(err.message);
        });
      },
      copy() {
        var clipboard = new Clipboard('.copy-btn')
        clipboard.on('success', e => {
          toast('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        })
      },
      chatStateUpdate() {
        this.chatState = false
      },
      goChatroom() {
        if (!this.connectState) {
          toast('聊天功能正在初始化,请稍后片刻!')
          return
        }
        //先获取订单号
        this.gameID = this.$route.params.id;
        //
        let params = {
          groupId: this.gameID,
          founderId: this.$store.state.userData.userId,
          type: 3,
          founderNickname: this.$store.state.userData.nickname

        }
        chatWith.createChatGroup(params).then(res => {
          if (res.code === 10000) {
            this.chatState = true
            this.$store.commit('GET_HISTORYSTATE', 3)
          } else {
            toast(res.message)
          }
        }).catch(res => {
          toast(res.message)
        })
      },
      goBack() {
        this.$router.replace({name: 'mTranRecord'})
      },

    },
    created() {
      this.fetchData();
    },
    watch: {
      "$route": "fetchData"
    },
    computed: {
      ...mapGetters(["userData", "islogin", 'userId', 'connectState', 'unreadCount']),
      reverseAppealList() {
        // 按照时间倒序显示数据
        if (this.AppealList.appealDetailList.length > 0) {
          this.AppealList.appealDetailList = this.AppealList.appealDetailList.map(item => {
            if (item.attachmentUrls && item.attachmentUrls.length > 1) {
              item.attachmentUrls = item.attachmentUrls.split(',');
            }
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
      mHeader,
      chat,
      NoDataTip,
      confirmDialog
    }
  };

</script>

<style lang="scss">
  @import "~assets/scss/mobile";

  .cas-main {
    background: #F5F5F5;
  }

  .order-id-li {
    width: 100%;
    text-align: left;
    word-break: break-all;
  }

  .c-red, .red {
    color: red;
  }

  .c-blue {
    color: #5087FF;
  }

  .c-orange {
    color: orange;
  }

  .trade-time-bar {
    background: #fff;
    padding: r(10) r(15);
    height: auto;
    text-align: center;
  }

  .appeal-list {
    padding: 0 0 70px 0;
  }

  .details-ul {
    border-top: 1px solid #d8d8d8;
    border-bottom: transparent;
    li {
      background: #fff;
      min-height: r(35);
      padding: r(8) r(15);
      @include f(16px);
      color: #8f8f8f;
      overflow: hidden;
      position: relative;
      &.heightauto {
        height: 180px;
      }
      .qrcode-img {
        width: 130px;
      }
      .fr0 {
        display: inline-block;
        /*width:50%;*/
        padding: 0 0 0 r(10);
      }
      .qrcode-tips {
        display: inline-block;
        word-break: break-all;
      }
      .l-title {
        display: inline-block;
        color: #333;
        .character {
          width: r(30);
          height: r(30);
          vertical-align: - r(8);
        }
      }
      .remind_info {
        font-size: r(12);
        color: #ec3a4e;
        vertical-align: - r(8);
        padding-top: r(3);
        text-align: right;
      }
      .equal_money {
        color: red;
        font-size: r(16);
      }
      .copy-btn {
        position: absolute;
        top: r(7);
        right: r(15);
        color: #5087ff;
      }
    }
  }

  .btn-group {
    padding: r(6) r(15) r(10);
    margin-bottom: r(90);
    .btn {
      display: inline-block;
      color: #5087ff;
      border-radius: 4px;
      height: r(45);
      line-height: r(45);
      padding: 0 r(20);
      margin: r(10) 0 0 0;
      cursor: pointer;
      font-size: r(18);
    }
    .btn-primary {
      border: 1px solid #5087ff;
      background: #5087ff;
      color: #fff;
    }
    .btn-border {
      border: 1px solid #5087ff;
      background: #fff;
      color: #5087ff;
    }
    .btn-cancel {
      color: #787876;
    }
    .btn-block {
      display: block;
      width: 100%;
    }
    .btn-gray {
      background: #E4E4E4;
      color: #787876;
    }
  }

  .icon-pay-bank {
    color: #B764FE;
  }

  .icon-pay-wechat {
    color: #14CA39;
  }

  .icon-pay-alipay {
    color: #03A9F3;
  }

  .mes-img {
    max-width: 100%;
  }

  .appeal-list-ul {
    li {
      padding: r(10) r(10) 0;
      overflow: hidden;
    }
    .userAvator {
      background: #E9BA52;
      height: r(45);
      width: r(45);
      line-height: r(45);
      text-align: center;
      border-radius: 50px;
      display: inline-block;
      float: left;
      margin: r(15) r(10) 0 0;
      color: #fff;
    }
    .mes-box {
      display: inline-block;
      width: calc(100% - #{r(85)});
      line-height: 25px;
      @include f(15px);
    }
    .mes-box-in {
      border: 1px solid #ddd;
      border-radius: 5px;
      background: #fff;
      display: inline-block;
    }
    .msg-time {
      color: #787876;
      @include f(14px);
    }
    .you-msg {
      .userAvator {
        background: #0ABB07;
        height: r(45);
        width: r(45);
        line-height: r(45);
        text-align: center;
        border-radius: 50px;
        display: inline-block;
        color: #fff;
        float: right;
      }
      .msg-time {
        text-align: right;
      }
      .mes-box {
        float: right;
        margin-right: r(15);
      }
      .mes-box-in {
        float: right;
        background: #A0E75A;
      }
    }
  }

  .pay_send {
    font-size: r(16);
    color: #ec3a4e;
  }

  .bottom-keyboard {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: r(8) r(10);
    border-top: 1px solid #ddd;
    background: #F5F5F5;
    .my-input {
      height: 42px;
      width: 80%;
      padding: 0 2%;
      display: inline-block;
      border-radius: 6px;
      border: 1px solid #ddd;
      @include f(16px);
    }
    .btn-send {
      display: inline-block;
      width: 17.5%;
      margin: 0 0 0 2.5%;
      text-align: center;
      height: 42px;
      line-height: 42px;
      background: #4982FF;
      color: #fff;
      border-radius: 6px;
      float: right;
    }
  }

  .msg-details {
    padding: r(10);
    word-break: break-all;
  }

  .Rongyunchatroom {
    width: 100%;
    height: r(50);
    position: fixed;
    right: 0;
    bottom: 0;
    background-color: #fff;
    text-align: center;
    line-height: r(50);
    img {
      padding-top: r(9);
      display: block;
      width: r(20);
      height: r(20);
      margin: 0 auto;
    }
    .chatroom_num {
      font-size: r(12);
      color: #4982FF;
      line-height: r(12);
      padding-top: r(3);
    }
  }

  .chatWindow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: #F5F5F5;
  }

  .payOrder_progress {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    .progress_state {
      padding-top: r(20);
      width: 33%;
      text-align: center;
      position: relative;
      img {
        width: r(33);
        height: r(30);
      }
      p {
        font-size: r(16);
        color: #333;
      }
      .line {
        position: absolute;
        right: r(-15);
        top: r(35);
        display: inline-block;
        width: r(40);
        height: r(1);
        background-color: #3573FA;
      }
      .defaultColor {
        color: #3573FA;
      }
    }
  }

  .extra_order {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .order_info {
      flex: 1;
      color: #333;
    }
    .copy-btn-next {
      position: relative !important;
      color: #5087ff;
      top: auto !important;
      left: auto !important;
      right: auto !important;
    }
  }

  .payment-tips {
    @include f(15px);
    line-height: r(30);
    margin: r(13) 0;
    color: #ec3a4e;
    padding: r(0) r(15);

    span {
      color: #FF0000;
    }
    &.credit{
      margin-bottom: r(90);
    }
  }
</style>
