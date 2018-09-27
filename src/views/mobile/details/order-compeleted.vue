<template>
  <div class="transell-main0 transell-main-box">
    <m-header v-if="DetailList.credit==userData.userId">我的买币订单</m-header>
    <m-header v-else-if="DetailList.debit==userData.userId">我的卖币订单</m-header>
    <div class="m-order-details">
      <div class="character_choose" v-if="DetailList.credit==userData.userId">
        <!--买家流程图-->
        <div class="payOrder_progress">
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
            <img src="~images/trade_success_next.png" alt="">
            <p class="defaultColor">交易成功</p>
          </div>
        </div>
        <div class="trade-time-bar">
          <p class="pay_send">订单完成</p>
          <p class="pay_send" v-if="isShowDiscount">交易成功获赠{{couponValueStr}}UET</p>
        </div>
      </div>
      <!--卖家流程图-->
      <div v-else-if="DetailList.debit==userData.userId">
        <div class="payOrder_progress">
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
            <img src="~images/trade_success_next.png" alt="">
            <p class="defaultColor">交易成功</p>
          </div>
        </div>
        <div class="trade-time-bar">
          <p class="pay_send">订单完成</p>
          <p class="pay_send" v-if="isShowDiscount">交易成功获赠{{couponValueStr}}UET</p>
        </div>
      </div>

      <ul class="details-ul">
        <li>
          <p class="l-title">订单:</p>
          <p class="order-id-li extra_order"><span class="order_info">{{orderData.orderId}}</span>
            <a href="javascript:void(0);" class="copy-btn-next copy-btn" :data-clipboard-text="orderData.orderId"
               @click="copy">{{$t('transactionHome.copyBtn')}}</a>
          </p>
        </li>
        <li>
          <span class="l-title">交易数量 :</span>
          <span>
                     <span class="l-title">{{DetailList.debitAmount}} UET</span> <span class="equal_money"> ≈ ¥ {{(DetailList.debitAmount*0.01).toFixed(2)}} </span>
                 </span>
        </li>
      </ul>
      <div v-if="filterType">

        <!--卖币订单-->
        <ul class="details-ul pay-detail my-paymethod" v-if="DetailList.debit==userData.userId">
          <li>
              <span class="l-title">
                 <img src="~images/chatWith/buyer.png" alt="" class="character">
                {{DetailList.creditName}}</span>
          </li>
        </ul>
        <ul class="details-ul pay-detail">
          <li v-if="DetailList.credit==userData.userId">
              <span class="l-title">
                 <img src="~images/chatWith/seller.png" alt="" class="character">
               {{DetailList.debitName}} </span>
          </li>
          <li v-else>
               <span class="l-title">
                 <img src="~images/chatWith/seller.png" alt="" class="character">
                我</span>
          </li>
          <li>
            <span class="l-title">卖家收款 : </span>
            <div class="fr0">
              <span v-if="DetailList.debitAccountMerchantTwin == '支付宝'"><i class="iconfont icon-pay-alipay"></i></span>
              <span v-else-if="DetailList.debitAccountMerchantTwin == '微信'"><i
                class="iconfont icon-pay-wechat"></i></span>
              <span v-else><i class="iconfont icon-pay-bank"></i></span>
              {{DetailList.debitAccountMerchantTwin}}
            </div>
          </li>
          <li>
            <span class="l-title">收款姓名 : </span>
            <div class="fr0">{{DetailList.debitAccountNameTwin}}
            </div>
          </li>
          <li class="heightauto"
              v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'">
            <span class="l-title">收款二维码 : </span>
            <div class="qrcode-box" v-if="DetailList.debitAccountQrCodeUrlTwin != ''">
              <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img"/>
              <span class="qrcode-tips copy-btn"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-group">
      <input type="button" class="btn btn-block btn-primary" value="关闭页面" @click="closePage">
    </div>
    <!--弹窗-->
    <div v-if="isShowpopup">
      <discountPopup :value="couponValueStr" :isPC="false"  @closeState="isNeedClose"></discountPopup>
    </div>
  </div>
</template>

<script>
  import mHeader from "components/m-header"
  import {generateTitle} from '@/util/i18n'
  import {transaction} from 'api'
  import {mapGetters} from 'vuex'
  import Clipboard from 'clipboard';
  import discountPopup from 'components/discount-popup'
  export default {
    data() {
      return {
        detailType: [
          {name: 'detail.buyUet', value: '订单详情'},
          {name: 'detail.saleUet', value: '申诉与仲裁'}
        ],
        DetailList: {},
        orderData: {
          orderId: this.$route.params.id,
          debitName: '', // 交易买方
        },
        isShowpopup: false,
        isShowDiscount: false,
        type: '',
        typeArr: [41, 42, 43, 51, 52, 53, 54]
      };
    },
    methods: {
      generateTitle,
      goWatch() {
        this.$router.push({name:'mMyGift'})
      },
      defineOk() {
        this.isShowpopup = false
      },
      fetchData() {
        this.loading = true;
        this.request = {
          transactionId: this.$route.params.id
        }
        transaction.getCoinTransactionHistory(this.request).then(res => {
          this.loading = false;
          this.DetailList = res.data;
          this.type = res.data.type;
          //  多个图片分解
          if (res.data.creditProofUrlTwin && res.data.creditProofUrlTwin.length > 1) {
            this.DetailList.creditProofUrlTwin = res.data.creditProofUrlTwin.split(',');
          }

        }).catch(error => {
          toast(error.message);
        });
//        this.loading = false;
      },
      fetchFinallyDiscount() {
        const request = {
          'orderId': this.orderData.orderId
        }
        transaction.getFinallyAmount(request).then((res) => {
          console.log(res,'色空间啥都健康')
          if (res.code == '10000') {
            if (res.data) {
              this.isShowpopup = true
              this.couponValueStr = res.data.couponValueStr
              this.isShowDiscount = true
            } else {
              this.isShowpopup = false
              this.isShowDiscount = false
            }
          }
        })
      },
      closePage() {
        this.$router.push({name:'mTransaction'})
      },
      isNeedClose(val){
        this.isShowpopup = val
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
      }
    },
    created() {
      this.fetchData();

        setTimeout(() => {
          this.fetchFinallyDiscount()
        }, 5000)

    },
    watch: {
      "$route": "fetchData"
    },
    computed: {
      ...mapGetters(["userData", "islogin", 'userId', 'isShowCoupon']),
      filterType() {
        if (this.type == '11' || this.type == '22') {
          return true
        } else {
          return false
        }
      }
    },

    components: {
      mHeader,
      discountPopup
    }
  };

</script>

<style lang="scss">
  @import "~assets/scss/mobile";

  .cas-main {
    background: #F5F5F5;
  }

  .order-id-li {
    text-align: left;
    word-break: break-all;
    color: #333;
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
  }

  .details-ul {
    border-top: 1px solid #D8D8D8;
    border-bottom: transparent;
    li {
      background: #fff;
      min-height: r(35);
      padding: r(8) r(15);
      font-size: f(16px);
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
      .copy-btn {
        position: absolute;
        top: r(7);
        right: r(15);
        color: #5087ff;
      }
    }
  }

  .pay_send {
    font-size: r(16);
    color: #ec3a4e;
    text-align: center;
  }

  .btn-group {
    padding: r(5) r(15) r(10);
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
    .btn-cancel {
      color: #787876;
    }
    .btn-block {
      display: block;
      width: 100%;
    }
    .btn-gray {
      background: #E4E4E4;
      color: #666;
    }
  }

  .icon-pay-bank {
    color: red;
  }

  .icon-pay-wechat {
    color: #14CA39;
  }

  .icon-pay-alipay {
    color: #03A9F3;
  }

  .chatroom {
    width: r(50);
    height: r(50);
    background-color: #fff;
    position: fixed;
    right: 0;
    top: r(600);
    border-radius: 50%;
    background: url("../../../assets/images/chatbg.png") no-repeat;
    background-size: 100%;
    img {
      padding-top: r(7);
      display: block;
      width: r(20);
      height: r(20);
      margin: 0 auto;
    }
    .chatroom_num {
      font-size: r(12);
      color: #4982FF;
      line-height: r(12);
    }
  }

  .equal_money {
    color: #ec3a4e;
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
    }
    .copy-btn-next {
      position: relative !important;
      color: #5087ff;
      top: auto !important;
      left: auto !important;
      right: auto !important;
    }
  }

  .popup_container {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    .popup_content {
      background-color: #fff;
      width: r(250);
      height: r(274);
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%);
      padding: r(20);
      .discount_info {
        width: r(210);
        height: r(108);
        background-color: #ff8b8b;
        border-radius: r(10);
        display: flex;
        .left_side {
          width: r(60);
          font-size: r(30);
          color: #fff;
          line-height: r(108);
          text-align: center;
          position: relative;

        }
        .right_side {
          flex: 1;
          font-size: r(16);
          color: #fff;
          height: r(108);
          position: relative;
          .middle_line {
            position: absolute;
            top: 0;
            left: r(-8);
            width: r(15);
            height: r(108);
            background: url('~images/discount_pink.png') no-repeat;
            background-size: 100%;
            background-color: transparent;
          }
          .rmb_value {
            text-align: center;
            padding-top: r(25);
          }
          .uet_value {
            text-align: center;
            padding-top: r(10);
          }
        }
      }
      .discount_uet {
        font-size: r(14);
        color: #333;
        padding-top: r(20);
        text-align: center;
        span {
          font-size: r(14);
          color: #ec3a4e;
        }
      }
      .go_watch {
        border-radius: r(3);
        background-color: #3573FA;
        color: #fff;
        text-align: center;
        margin-top: r(20);
        height: r(30);
        line-height: r(30);
      }
      .define_ok {
        margin-top: r(10);
        border-radius: r(3);
        background-color: #84a4e9;
        color: #fff;
        text-align: center;
        height: r(30);
        line-height: r(30);
      }
      .close_btn {
        width: r(25);
        height: r(25);
        text-align: center;
        background: url("~images/close_btn.png") no-repeat;
        background-size: 100%;
        margin: 0 auto;
        margin-top: r(40);
      }
    }
  }
</style>
