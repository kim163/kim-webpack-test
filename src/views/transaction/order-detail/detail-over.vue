<template>
  <div class="transell-main header-padding">
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <div class="section detail-content">
      <div class="container min-width" v-if="DetailList">
        <div class="row00 detail-box" >
          <div class="detail-title">
            <span v-if="isCredit" class="title-btn btn-primary">买入</span>
            <span v-else-if="isDebit" class="title-btn btn-sell">卖出</span>
            <span v-else class="title-btn btn-primary">申诉订单</span>
            <span class="order-num">
              订单号：   {{orderId}}
            </span>
          </div>
          <div class="detail-in cfx">
              <div class="col-33" >
                <h3 v-if="isCredit" class="h3">卖方 : {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})</h3>
                <h3 v-else-if="isDebit" class="h3">买方 : {{DetailList.creditName}} ({{DetailList.creditAccountNameTwin}})</h3>
                <ul class="details-data">
                  <li>
                    <p>交易金额:</p>
                    <input type="text" class="red" readonly :value="DetailList.debitAmountTwin+' CNY'" >
                  </li>
                  <li>
                    <p>交易数量:</p>
                    <input type="text" readonly  :value="DetailList.debitAmount+' UET'">
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

              <div class="alipay-box" v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'" >
                <p class="alipay-box-title">
                  <i class="i-alipay" v-if="DetailList.debitAccountMerchantTwin == '支付宝'"></i>
                  <i class="i-wechat" v-else-if="DetailList.debitAccountMerchantTwin == '微信'"></i>
                  {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})<br> {{DetailList.debitAccountTwin}}
                </p>
                <div class="alipay-qrcode">
                  <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin"  class="qrcode-img" />
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
              <h4  class="bank-title">买家付款方式 : </h4>
              <div class="alipay-box" v-if="DetailList.creditAccountMerchantTwin == '支付宝' || DetailList.creditAccountMerchantTwin == '微信'" >
                <p class="alipay-box-title">
                  <i class="i-alipay" v-if="DetailList.creditAccountMerchantTwin == '支付宝'"></i>
                  <i class="i-wechat" v-else-if="DetailList.creditAccountMerchantTwin == '微信'"></i>
                  {{DetailList.creditName}}（{{DetailList.creditAccountNameTwin}}）<br>{{DetailList.creditAccountTwin}}
                </p>
                <div class="alipay-qrcode">
                  <img src="~images/qrcode.jpg" :src="DetailList.creditAccountQrCodeUrlTwin"  class="qrcode-img" />
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
                  <p class="text-center time-stame" v-if="DetailList.status == 203">
                    <img src="~images/order-completed.png" height="107">
                    <span >订单已完成</span>
                  </p>
                  <p class="text-center time-stame" v-else-if="DetailList.status == 204">
                    <img src="~images/order-cancel.png" height="107">
                    <span >订单已取消</span>
                  </p>
                </div>
            </div>
          </div>
          <div class="detail-tips detail-tips-sell" v-if="DetailList.creditProofUrlTwin">
            <p v-if="isDebit" class="tips-title0">买家付款截图:</p>
            <p v-else-if="isCredit" class="tips-title0">您的付款截图:</p>
            <ul class="pic-ul">
              <li v-for="proofImg in DetailList.creditProofUrlTwin||[]">
                <viewer :images="DetailList.creditProofUrlTwin">
                  <img :src="proofImg" alt="付款截图">
                </viewer>
              </li>
            </ul>
            <span class="fl friend-txt">提示：点击缩略图可放大查看</span>
          </div>

        </div>

      </div>
      <div class="container min-width" v-else>
        <no-data-tip></no-data-tip>
      </div>

    </div>
    <div v-if="isShowpopup">
      <discountPopup :value="couponValueStr" :isPC="true"  @closeState="isNeedClose"></discountPopup>
    </div>

    <v-footer ></v-footer>
  </div>
</template>

<script>
  import navMenu from 'components/nav';
  import breadCrumbs from 'components/bread-crumbs';
  import NoDataTip from 'components/no-data-tip'
  import vFooter from 'components/footer';
  import { generateTitle } from '@/util/i18n'
  import { transaction } from 'api'
  import {mapGetters,mapActions,mapMutations} from 'vuex'
  import discountPopup from 'components/discount-popup'
  export default {
    data() {
      return {
        DetailList: {

        },
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
            urlName:'orderDetailOver',
            name: 'transactionRecord.orderDetails'
          }
        ],
        request:{},
        orderId: '',
        isCredit: false,
        isDebit: false,
        isShowpopup:false
      };
    },
    methods: {
      generateTitle,
      fetchData(){
        this.request={
          transactionId:this.orderId
        }
        transaction.getCoinTransactionHistory(this.request).then(res => {
          this.DetailList = res.data;
          if(this.DetailList.credit == this.userId){
            this.isCredit = true;
          }else if(this.DetailList.debit == this.userId){
            this.isDebit = true;
          }
          //  多个图片分解
          if(res.data.creditProofUrlTwin && res.data.creditProofUrlTwin.length > 1){
            this.DetailList.creditProofUrlTwin = res.data.creditProofUrlTwin.split(',');
          }

        }).catch(error => {
          toast(error.message);
        });
      },
      isNeedClose(val){
        this.isShowpopup = val
      },
      copystr(text) {
        text.$copy();
        toast(this.$t('transactionHome.successCopy'));
      },
      fetchFinallyDiscount() {
        const request = {
          'orderId': this.orderId
        }
        transaction.getFinallyAmount(request).then((res) => {
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
      goWatch(){

      },
      defineOk(){

      }
    },
    created() {
      if (this.$route.params.id) {
        this.orderId = this.$route.params.id;
        this.fetchData();
      }
      setTimeout(()=>{
        this.fetchFinallyDiscount()
      },5000)
    },
    watch: {
      "$route"(val) {
        this.orderId = val.params.id;
        this.fetchData();

      }
    },
    computed: {
      ...mapGetters(["userData","islogin","userId"]),
    },
    components: {
      navMenu, breadCrumbs, NoDataTip, vFooter,discountPopup
    },
    filters: {
      bankIcon: function (value) {
        if (!value) return 'icbc';
        if(value == '工商银行'){
          return 'icbc';
        }
        if(value == '招商银行'){
          return 'cmbc';
        }
        //value = value.toString()
        return value
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixin";
  .detail-content{
    min-height:300px;
    margin:30px 0;
  }

  .detail-box{
    border:1px solid #d4d4d4;
  input{
    height:40px;
    line-height: 40px;
    border:1px solid #d4d4d4;
    width:100%;
    padding:0 20px;
    font-size:16px;
  }
  input:read-only {
    background: #f7f7f7;
  }
  .btn-sell{
    background: orange;
  }
  .time-stame{
    padding: 105px 0 0;
    span{
      display: block;
      font-size:24px;
      color: #333333;
      line-height: 40px;
      margin-top: 20px;
    }
  }
  .col-33{
    display:block;
    width:33%;
    float: left;
    border-right:1px solid #d4d4d4;
    margin:0;
    min-height:427px;
    min-width:350px;
  &:last-child{
     border:0;
   }
  }
  p {
    font-size: 16px;
    padding:5px 0;
    line-height: 25px;
  }
  .red{color:red;}
  .alipay-box{
    margin: 20px 50px 10px;
  .alipay-box-title{
    border:1px solid #d4d4d4;
    padding:10px 10px 10px 10px;
    background-size: 30px;
    font-size:16px;
  &.bank-ttile{
     font-size:20px;
   }
  }
  .i-alipay{
    display:inline-block;
    float:left;
    height:50px;
    width:38px;
    background: url('~images/i-alipay.png') no-repeat left center;
    background-size: 30px;
  }
  .i-wechat{
    display:inline-block;
    float:left;
    height:50px;
    width:38px;
    background: url('~images/i-wechat.png') no-repeat left center;
    background-size: 30px;
  }
  .alipay-qrcode{
    background: #4aa9e9;
    color:#fff;
    text-align: center;
    padding:18px;
  &.text-left{
     text-align: left;
   }
  &.bank-txt-box{
     padding:18px 22px;
   }
  h3{
    font-weight:normal;
    font-size:18px;
    padding:2px 0 8px;
  }
  img{
    width:160px;
    height:160px;
    padding:12px;
    background: url('~images/j.png') no-repeat;
    margin-bottom:5px;
    display: inline-block;
  }
  }
  }
  }

  .order-time{
    padding:20px 50px;
  }
  .detail-title{
    height:80px;
    border-bottom:1px solid #d4d4d4;
  }
  .title-btn{
    height:80px;
    line-height: 80px;
    display:inline-block;
    width:140px;
    color:#fff;
    text-align: center;
    background: #5087ff;
    margin:0 20px 0 0;
    font-size:18px;
  }

  .detail-tips{
    border-top:1px solid #d4d4d4;
    color:#787876;
    line-height:30px;
    padding:18px 30px 50px;
  p{
    font-size:16px;
  }
  .tips-title{
    color:red;
    font-size:18px;
    padding:0 0 15px 0;
  }
  .tips-title-i{
    background: url(~images/tips.png) no-repeat left 4px;
    padding:0 0 15px 25px;
  }
  .tips-title0{
    padding:0 0 15px 0;
  }
  }
  .detail-tips-sell{
    padding:18px 30px 20px;
    overflow: hidden;
  }
  .h3,.bank-title{
    font-weight:normal;
    color:#333;
    font-size:22px;
    padding:20px 30px 0;
  }
  .details-data{
    padding:0 30px 10px;
  li{
    padding:15px 0 0 0;
  }
  p{
    font-size:16px;
    padding: 0 0 8px 0;
  }
  .red{color:red;}
  }

  input[type="button"]{
  &.btn{
     display:inline-block;
     border:1px solid #5087ff;
     color:#5087ff;
     border-radius: 4px;
     height:50px;
     line-height: 50px;
     padding:0 20px;
     margin:10px 0 0 0;
     cursor: pointer;
  &:hover{opacity: .8;}
  }
  .btn-blue{
    border:1px solid #5087ff;
    color:#5087ff;
  }
  &.btn-orange{
     border:1px solid #ffa500;
     color:#ffa500;
   }
  &.btn-normal{
     border:1px solid #5087ff;
     background:#5087ff ;
     color:#fff;
   }
  }
  .item-info{
    color:#333;
  }
  .item-info.active{
    color:#5087FF;
  }

  .text-center{
    text-align: center;
  }

  .pic-ul{overflow: hidden;float:left;}
  .pic-ul li{float:left; margin-right:15px;}
  .pic-ul li img{ height:190px;}
  .friend-txt{
    margin-top:150px;
  }
  .bank-list-p{
    position:relative;
    margin-bottom:18px;
  }
  .btn-copy{
    position: absolute;
    right:0;
    bottom:0;
    color:#fff;
    border:0;
    cursor: pointer;
  }
  .i-bank{
    display:inline-block;
    height:40px;
    width:46px;
    vertical-align: -13px;
    background: url(~images/bankIcon/juan-bank.png) no-repeat;
    background-size: contain;
  &.icbc{
     background: url(~images/bankIcon/icbc.png) no-repeat;
     background-size: 40px;
   }
  &.cmbc{
     background: url(~images/bankIcon/cmbc.png) no-repeat;
     background-size: 40px;
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
