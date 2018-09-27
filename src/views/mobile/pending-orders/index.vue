<template>
  <div :class="{'pending-orders-page':!mini, 'mini-main':mini}">
    <mobile-header :show-left-btn="false" v-if="!mini">{{$t('postPend.postTitle')}}</mobile-header>
    <div class="balance" v-if="!mini">
      <i class="iconfont icon-wallet"></i>
      <balance @getBalance="getBalance"></balance> ≈ &yen;{{formatCny(1)}}
    </div>
    <div class="user-balance" v-else>
      我的余额：<balance @getBalance="getBalance"></balance>
    </div>
    <div class="tabs" v-if="!mini">
      <ul>
        <li v-for="item in pendingType" @click="pendingItem=item.value" class="s" :class="{active:pendingItem==item.value}" :key="item.value">
          <i class="iconfont" :class="item.icon"></i>
          <p>{{generateTitle(item.name)}}</p>
        </li>
      </ul>
    </div>
    <div :class="{container: !mini}">
      <div class="tip" v-if="!mini">
        您发布买币之后，钱包将会扫描所有用户需求进行配对，快速匹配买卖双方，请您注意查看APP提醒，
        匹配成功之后便可快速交易。<span class="red">注意：随意发布订单而不交易的，将被禁用账户。</span>
      </div>
      <div class="buy-sell">
        <div class="buy" v-show="pendingItem=='buyer'">
          <div class="buy-num">
            <range :min="1000" :max="100000" :step="1000" tip="购买数量：" :reset="rangeReset" v-model="buyAmount"></range>
          </div>
          <div class="flex">
            <input type="text" class="def-input" v-number-only
                   v-model.number="buyAmount"
                   :maxlength="max">
            <span>{{userData.accountChainVos[0].assetCode}}</span>
          </div>
          <div class="to-cny">≈ &yen;{{formatCny(2)}}</div>
        </div>
        <div class="sell" v-show="pendingItem=='seller'">
          <div class="sell-info flex">
            <div class="title">卖出数量：</div>
            <input type="text" class="def-input sell-input"
                   v-number-only
                   v-model.number="sellAmount"
                   :maxlength="max">
            <span class="all-in-btn" @click="allSell()">全</span>
          </div>
          <div class="to-cny">≈ &yen;{{formatCny(3)}}</div>
        </div>
      </div>
      <div class="select-card flex" v-show="pendingItem=='seller'">
        <div class="title">收款方式：</div>
        <div class="select-pay">
          <get-bankcard :setBankcard="setBankcard"
                        :def-select="bankNo"
                        :auto-select="true"
                        :filter-bank="filterBank"
                        @selCardChange="selCardChange"></get-bankcard>
        </div>
      </div>
      <div class="buy-sell-btn" @click="publishBuyOrSell">{{pendingItem=='buyer' ? '买' : '卖'}}币</div>
      <p class="coupon-tip" v-if="!mini && couponDetail">现在交易可兑现</p>
      <p class="coupon-tip-mini" v-if="mini && couponDetail">
        现在{{pendingItem=='buyer' ? '买' : '卖'}}币，可兑现赠币券 {{couponDetail.couponValueStr}} UET
      </p>
    </div>
    <div class="discount_ticket" v-if="!mini && couponDetail">
      <div class="left_side">
        <p class="remark_info">{{couponDetail.remark}}</p>
        <p class="time_date">至{{couponDetail.couponEndtime | Date('yyyy-MM-dd')}}过期</p>
        <div class="id_num" style="display: flex"><span style="float:left" class="id">单号:</span><span
                class="id-content">{{couponDetail.id}}</span></div>
      </div>
      <div class="middle_line_next"></div>
      <div class="right_side">
        <div class="side_money">¥ {{(couponDetail.couponValueStr*0.01).toFixed(2)}}</div>
        <div class="side_num"> ={{couponDetail.couponValueStr}}UET</div>
      </div>
    </div>
    <mobile-nav-bar v-if="!mini"></mobile-nav-bar>
    <confirm v-model="showBuySellRes" :show-right-btn="false">
      <div slot="content">下单成功</div>
      <div slot="leftBtn">关闭</div>
    </confirm>
    <confirm v-if="showBindCard" v-model="showBindCard">
      <div slot="title">请绑定您的</div>
      <div slot="content">银行卡号/微信/支付宝</div>
      <div slot="leftBtn">返回</div>
      <div slot="rightBtn" class="btn-yes" @click="toBindCard">去绑定</div>
    </confirm>
  </div>
</template>

<script>
  import {
    publishToBuy,
    publishToSell
  } from 'api/transaction'
  import {
    getFastTraderAward
  } from 'api/activity'

  import MobileNavBar from 'components/m-navbar'
  import MobileHeader from 'components/m-header'
  import balance from 'components/balance';
  import { generateTitle } from '@/util/i18n'
  import {mapGetters} from 'vuex'
  import getBankcard from 'components/get-bankcard'
  import Range from 'components/range'
  import Confirm from 'components/confirm'

  export default {
    name: "transaction-record",

    components: {
      MobileNavBar,
      MobileHeader,
      balance,
      getBankcard,
      Range,
      Confirm
    },

    data(){
      return{
        pendingType:[
          {
            name: "transactionRecord.buyer",
            value: "buyer",
            icon: 'icon-car-add'
          },
          {
            name: "transactionRecord.seller",
            value: "seller",
            icon: 'icon-car-sub'
          }
        ],
        pendingItem: 'buyer',
        buyAmount:this.mini ? 1000 : 0,
        sellAmount:0,
        payType: '',
        minAmount:1,
        proofType:0,
        typeBank:'',
        userBalance:0,
        bindCardReset:false,
        setBankcard: {
          pleaseSelTitle: 'component.pleaseSelPayMet',         // 请选择标题文字
          addOption:[]
        },
        bankNo:'',
        max:9,
        couponDetail:null,
        rangeReset:false,
        showBuySellRes:false,
        showBindCard:false,//展示绑定银行卡提示
        filterBank:false,
      }
    },
    watch: {
      pendingItem(val) {
        this.setBankcard.pleaseSelTitle = val === 'seller' ? 'component.pleaseSelRecMet' : 'component.pleaseSelPayMet'
        this.filterBank = val === 'seller' ? true : false
      },
      noBankCardTip(val){
        if(this.tabType === 0){
          this.showBindCard = val
        }
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'userData',
        'noBankCardTip'
      ]),
    },
    props:{
      mini:{  //迷你版
        type:Boolean,
        default:false
      },
      tabType:{
        type:Number,
        default:0 // 0表示买  1表示卖
      }
    },
    methods: {
      generateTitle,
      formatCny(type){ // type 1表示用户余额 2表示买入金额 3表示卖出金额
        const amount = type === 1 ? this.userBalance : (type === 2 ? this.buyAmount : this.sellAmount)
        return !_.isNaN(Number(amount)) ? (Number(amount)*0.01).toFixed(2) : '0.00'
      },
      selCardChange(selCard){
        this.payType = selCard;
      },
      publishBuyOrSell() {
        const buySellAmount = this.pendingItem === 'seller' ? this.sellAmount : this.buyAmount
        if (buySellAmount == '' || buySellAmount == 0) {
          toast('数量不能为空');
          return;
        }
        if(!_.isInteger(buySellAmount) || buySellAmount<1){
          toast('请输入整数数量');
          return;
        }
        if(this.pendingItem === 'seller' && Number(buySellAmount) > Number(this.userBalance)){
          toast('余额不足!请输入正确的卖出数量');
          return;
        }
        if (this.payType == '' || !this.payType) {
          toast(`请选择${this.pendingItem === 'seller' ? '收款' : '支付'}方式`);
          return;
        }
        if (this.payType.type == '1') {
          this.typeBank = '支付宝'
        } else if (this.payType.type == '2') {
          this.typeBank = '微信'
        } else {
          this.typeBank = this.payType.bank
        }
        this.requestda = {
          userId: this.userData.userId,
          orderOptionVo: {
            minUnit: this.minAmount,//等于发布的数量
            contractType: 1,
            mode: 1
          },
          accountChainVo: {
            name: this.userData.nickname,
            address: this.userData.accountChainVos[0].address,
            assetCode: 'UET', //资产编码 默认 UET,登录后资产的编码
            amount: buySellAmount //uet的数量
          },
          accountCashVo: {
            "account": this.payType.account,
            "bank": this.typeBank, //机构名称
            "name": this.payType.name,
            "type": this.payType.type,
            "amount": buySellAmount / 100
          },
        }
        if (this.pendingItem === 'seller') {
          Object.assign(this.requestda.orderOptionVo,{
            proofType: this.proofType
          })
        }
        console.log('requestda',this.requestda)
        const api = this.pendingItem === 'buyer' ? publishToBuy : publishToSell
        api(this.requestda).then((res) => {
          console.log(res)
          if (res.code == '10000') {
            this.buyAmount = this.mini ? 1000 : 0;
            this.sellAmount = 0;
            // this.bindCardReset=true;
            this.rangeReset = true
            setTimeout(() => {
              this.rangeReset = false
            },100)
            // toast('下单成功');
            this.showBuySellRes = true
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err.message);
        })
      },
      getBalance(data){
        this.userBalance = data
      },
      allSell(){
        this.sellAmount = Number(this.userBalance)
      },
      getGift(){
        getFastTraderAward({}).then(res => {
          console.log('myGift',res)
          if(res.code === 10000){
            if(res.data && !_.isNull(res.data)){
              this.couponDetail = res.data
            }
          }
        })
      },
      toBindCard(){
        this.showBindCard = false
        this.$router.push({name:'mUserCenter'})
      }
    },
    created() {
      this.pendingItem = this.tabType === 1 ? 'seller' : 'buyer'
      const mode = this.$route.query.mode
      if(!_.isUndefined(mode) && Number(mode) === 3){ // 判断用户意图  mode=3是想打开我要卖币 其他默认是买币
        this.pendingItem = 'seller'
      }
      const amount = this.$route.query.amount  //金额为CNY
      if(!_.isUndefined(amount) && Number(amount) > 0){
        if(this.pendingItem === 'seller'){
          this.sellAmount = Number(amount) * 100
        }else{
          this.buyAmount = Number(amount) * 100
        }
      }
      this.bankNo = this.$route.query.bankNo
      if(this.tabType === 0){
        this.showBindCard = this.noBankCardTip
      }
      // const withdraw = this.$route.query.withdraw
      // if(!_.isUndefined(withdraw) && withdraw === 'true'){
      //   if(this.pendingItem === 'seller'){
      //     this.minAmount = 1
      //     this.proofType = '1'
      //   }
      // }
    },
    mounted(){
      this.getGift()
    }

  }
</script>

<style lang="scss" scoped>
 @import "~assets/scss/mobile";
 .balance{
   width: 100%;
   height: r(40);
   background: $white;
   line-height: r(40);
   padding-left: r(10);
   .iconfont{
     margin-right: r(10);
     vertical-align: top;
   }
 }
 .mini-main{
   @include f(14px);
 }
 .tabs{
   width: 90%;
   margin: r(20) auto;
   ul{
     width: 100%;
     border: 1px solid #D3D3D3;
     border-radius: r(5);
     display: flex;
     background: $white;
     li{
       width: 50%;
       text-align: center;
       padding: r(15) 0;
       color: #333333;
       @include f(16px);
       &.active{
         color: $white;
         background: $main-color;
       }
       &:first-child{
         border-radius: r(5) 0 0 r(5);
       }
       &:last-child{
         border-radius: 0 r(5) r(5) 0;
       }
     }
     .iconfont{
       @include f(25px);
     }
     p{
       margin-top: r(10);
     }
   }
 }
 .flex{
   display: flex;
   align-items: center;
   justify-content: center;
 }
 .container{
   width: 90%;
   margin: 0 auto;
   background: $white;
   border: 1px solid #D3D3D3;
   border-radius: r(5);
   padding: r(15) r(20);

 }
 .tip{
   @include f(14px);
   line-height: r(22);
   .red{
     color: #FF8B8B;
   }
 }
 .buy-num{
   margin: r(20) 0 r(15) 0;
 }
 .def-input{
   height:r(39);
   line-height:r(39);
   width:84%;
   background: #FFFFFF;
   border: 1px solid #D3D3D3;
   padding-left: r(5);
   @include  f(15px);
   flex-grow: 1;
   &:hover,&:focus{
     outline: none;
   }
 }
 .to-cny{
   margin: r(15) 0;
   color: #EC3A4E;
   @include f(16px);
 }
 .sell{
   .sell-info{
     margin: r(20) 0 r(15) 0;
     .sell-input{
       width: calc(100% - #{r(121)});
     }
     .all-in-btn{
       display: inline-block;
       width: r(41);
       height: r(40);
       text-align: center;
       line-height: r(40);
       background: #3573FA;
       @include f(16px);
       color: $white;
     }
   }
   .to-cny{
     margin-left: r(80);
   }
 }
 .title{
   width: r(80);
   @include f(14px);
 }
 .select-card{
   .select-pay{
     flex-grow: 1;
     height:r(39);
     /*line-height:r(39);*/
     background: #FFFFFF;
     /*border: 1px solid #D3D3D3;*/
     @include f(14px);
   }
 }
 .buy-sell-btn{
   width: 100%;
   height: r(40);
   line-height: r(40);
   text-align: center;
   color: $white;
   @include f(16px);
   background: #3573FA;
   border-radius: 3px;
   margin-top: r(10);
 }
 .coupon-tip{
   @include f(16px);
   margin-top: r(20);
   text-align: center;
 }
 .coupon-tip-mini{
   @include f(14px);
   color: #EC3A4E;
   margin-top: r(15);
   text-align: center;
 }

 .discount_ticket {
   width: 90%;
   height: r(108);
   margin: r(20) auto;
   display: flex;
   flex-direction: row;
   .left_side {
     flex: 1;
     word-break: break-word;
     font-size: r(14);
     color: #fff;
     position: relative;
     padding: r(10) r(8);
     background-color: #FF8B8B;
     border-radius: r(5) 0 0 r(5);
     display: flex;
     flex-direction: column;
     justify-content: center;
     .time_date {
       padding: r(8) r(0);
     }
     .id_num {
       display: flex;
       .id {
         width: r(40);
       }
       .id-content{
         width: r(140);
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
       }
     }
   }
   .middle_line_next {
     width: r(15);
     height: r(108);
     background: url('~images/discount_pink.png') no-repeat;
     background-size: 100% 100%;
   }
   .right_side {
     width: r(112);
     text-align: center;
     padding: r(10) r(8);
     background-color: #FF8B8B;
     border-radius: 0 r(5) r(5) 0;
     .side_money {
       font-size: 18px;
       color: #fff;
       padding-top: r(12);
     }
     .side_num {
       font-size: 16px;
       color: #fff;
       padding-top: r(10);
     }
   }
 }
 .pending-orders-page{
   padding-bottom: r(60);
  .c-gray{
    color:#666;
  }
  .c-blue{
    color: #4982FF;
  }
 }
  .btn-yes{
    background: $main-color;
    color: $white;
  }
</style>
