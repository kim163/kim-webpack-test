<template>
  <div class="main" v-if="show">
    <div class="container">
      <div class="balance">
        <div v-show="typeInfo === 1">
          对方剩余：<span>{{itemInfo.balance}} UET</span>
        </div>
        <div v-show="typeInfo === 2">
          您最高可卖：<span><balance @getBalance="getUserBalance"></balance></span>
        </div>
      </div>
      <div class="buy-sell">
        <input type="text" class="input"
               :placeholder="`输入${typeInfo === 1 ? '买入' : '卖出'}数量`"
               v-number-only
               v-model="amount">
        <div class="all-in" @click="allIn">全</div>
      </div>
      <div class="pay-info" v-if="typeInfo === 2">
        <div>收款方式</div>
        <div class="pay-card">
          <get-bankcard :auto-select="true" :filter-bank="filterBank" @selCardChange="selCardChange"></get-bankcard>
        </div>
      </div>
      <div class="buy-sell-btn" @click="toBuySell">确定</div>
      <div class="tip-info">注意：</div>
      <div class="tip-info">恶意下单又取消的账户会被禁用</div>
    </div>
    <a class="close-btn-radius" @click="close"></a>
  </div>
</template>

<script>
  import Balance from 'components/balance'
  import getBankcard from 'components/get-bankcard'
  import {mapGetters} from 'vuex';
  import {
    placeAnOrder
  } from 'api/transaction';
  export default {
    name: "tran-buy-sell",
    data(){
      return{
        userBalance:0,
        payType: '',
        amount:'',
        filterBank: this.typeInfo === 1 ? false : true,
      }
    },
    model:{
      prop:'show',
      event:'change'
    },
    props:{
      show:{
        type:Boolean,
        default:false
      },
      typeInfo:{
        type:Number,
        default:1,//1买入 2卖出
      },
      itemInfo:{
        type:Object,
        default:{
          balance:0
        }
      }
    },
    components:{
      Balance,
      getBankcard
    },
    computed:{
      ...mapGetters([
        'userData'
      ])
    },
    methods:{
      close(){
        this.$emit('change',false)
      },
      selCardChange(selCard){
        this.payType = selCard;
      },
      getUserBalance(data){
        this.userBalance = data
      },
      allIn(){
        if(this.typeInfo === 1){
          if(Number(this.userBalance) > Number(this.itemInfo.balance)){
            this.amount = this.itemInfo.balance
          }else{
            this.amount = this.userBalance
          }
        }else{
          this.amount = this.userBalance
        }
      },
      toBuySell(){
        const isBuy = this.typeInfo === 1
        if(this.amount === '' || this.amount === '0'){
          toast(`请输入正确${isBuy ? '买入' : '卖出'}数量`)
          return
        }
        if(this.typeInfo === 1){
          if(Number(this.amount) > Number(this.itemInfo.balance)){
            toast('您输入的金额超出对方剩余')
            this.amount = this.itemInfo.balance
            return
          }
        }else{
          if(Number(this.amount) > Number(this.userBalance)){
            toast('您输入的金额已超出您的账户余额')
            this.amount = this.userBalance
            return
          }
        }
        if(this.typeInfo === 2 && this.payType === ''){
          toast('请选择收款方式')
          return
        }
        let payTypeBank = ''
        if(this.payType.type =='1'){
          payTypeBank='支付宝'
        }else if(this.payType.type =='2'){
          payTypeBank='微信'
        }else{
          payTypeBank=this.payType.bank
        }
        const requestda = {
          orderId: this.itemInfo.id,
          userId: this.userData.userId,
          accountChainVo: {
            name: this.userData.nickname,
            address: this.userData.accountChainVos[0].address,
            assetCode: 'UET', //资产编码 默认 UET,登录后资产的编码
            amount: this.amount //uet的数量
          },
          accountCashVo: {
            account: this.payType.account,
            bank: payTypeBank, //机构名称
            name: this.payType.name,
            type: this.payType.type,
            amount: this.amount /100
          }
        }
        placeAnOrder(requestda).then(res => {
          console.log(res)
          if (res.code == 10000) {
            this.$emit('change',false)
            Vue.$global.bus.$emit('update:balance');
            this.$router.push({name: 'mOrder',params:{ id: res.data.key}});
          }else {
            toast(res.message);
          }

        }).catch(err => {
          toast(err.message);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0,0,0,0.40);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateZ(100px);
  }
  .container{
    width: 66%;
    background: $white;
    color: #333333;
    @include f(14px);
    padding: r(20);
    /*animation: flipInY 1s forwards;*/
    .balance{
      span{
        color: #787876;
      }
    }
    .buy-sell{
      margin-top: r(15);
      display: flex;
      .input{
        width: calc(100% - #{r(35)});
        height: r(35);
        background: #FFFFFF;
        border: r(1) solid #DADADA;
        padding-left: r(10);
      }
      .all-in{
        width: r(35);
        height: r(35);
        line-height: r(35);
        text-align: center;
        @include f(14px);
        color: $white;
        background: #3573FA;
      }
    }
    .pay-info{
      margin-top: r(10);
      .pay-card{
        margin-top: r(10);
        width: 100%;
        height: r(35);
      }
    }
    .buy-sell-btn{
      width: 100%;
      height: r(30);
      line-height: r(30);
      text-align: center;
      background: #3573FA;
      border-radius: r(3);
      color: $white;
      margin-top: r(10);
    }
    .tip-info{
      color: #EC3A4E;
      margin-top: r(10);
    }
  }
  /*.close-btn{*/
    /*width: r(25);*/
    /*height: r(25);*/
    /*background: url(~images/close-round.png) no-repeat;*/
    /*background-size: 100% 100%;*/
    /*margin-top: r(15);*/
    /*opacity: 0;*/
    /*animation: rotateIn 1s forwards;*/
  /*}*/
</style>