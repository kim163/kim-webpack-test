<template>
    <div class="pay-main">
      <div class="amout-info">
        <div class="amount-detail">
          <div class="title">UET钱包支付</div>
          <div class="blance">{{$t('cash.balance')}}：<balance @getBalance="getUserBalance"></balance></div>
          <div class="amount-status" :class="amountStatus ? 'green' : 'red'">
            {{ amountStatus ? $t('cash.enough') : $t('cash.notEnough')}}
          </div>
        </div>
      </div>
      <div class="pay-password">
        <div class="input-info">
          <div class="title">{{$t('cash.payPassWord')}}:</div>
          <input type="password" class="input-password" v-model.trim="payPassword" :placeholder="$t('cash.psdInputPlaceholder')"/>
        </div>
        <div class="error red">{{errorText}}</div>
        <div class="btn-info">
          <div class="pay-btn" :class="{disabled: !amountStatus || !payBtn}" @click="amountStatus && payBtn ? payment() : ''">{{$t('cash.confirmPayment')}}</div>
          <div class="btn-sec-list">
            <a class="sec-btn" @click="showQuickBuy = true">{{$t('postPend.quickBuy')}}</a>
            <router-link :to="{name: 'transaction'}" class="sec-btn">{{$t('cash.goTran')}}</router-link>
          </div>
        </div>
      </div>
      <post-pendord v-model="showQuickBuy" urlName="mTranRecord" title="postPend.quickBuy" :show-tab="false"></post-pendord>
    </div>
</template>

<script>
  import Balance from 'components/balance'
  import PostPendord from 'components/trancomp/post-pendord'
  export default {
    name: "pc-cash-pay",
    data(){
      return{
        amountStatus: false, //余额状态
        payPassword:'',
        userBalance:0,
        errorShow:false,
        errorText:'',
        coinAmount:0,
        showQuickBuy:false,
      }
    },
    components:{
      Balance,
      PostPendord
    },
    watch:{
      coinAmount(){
        this.checkAmountStatus()
      },
      userBalance(){
        this.checkAmountStatus()
      },
      "payInfo.coinAmount":function(newVal){
        this.coinAmount = newVal
      }
    },
    props:{
      payInfo:{
        type:Object,
        default:{}
      },
      payBtn:{
        type:Boolean,
        default:true
      }
    },
    methods:{
      payment(){
        if(this.payPassword != ''){
          Vue.$global.bus.$emit('cash:payPassword',this.payPassword);
        }else{
          this.errorShow = true,
          this.errorText = '请输入支付密码'
        }
      },
      getUserBalance(data){
        this.userBalance = data
      },
      checkAmountStatus(){
        if(Number(this.coinAmount) > Number(this.userBalance)){
          this.amountStatus = false
          this.showQuickBuy = true
        }else{
          this.amountStatus = true
          this.showQuickBuy = false
        }
      }
    },
    mounted(){
      this.coinAmount = this.payInfo.coinAmount
    },
  }
</script>

<style lang="scss" scoped>
  .pay-main{
    width: 500px;
    height: 340px;
    background-color: #ffffff;
    border: solid 1px #e4e4e4;
    .amout-info{
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      padding: 0 15px;
      border-bottom: 1px solid #D8D8D8;

      .amount-detail{
        display: flex;
        justify-content: space-between;
      }
      .blance{
        color: #787876;
      }
    }
    .pay-password{
      padding: 62px 20px 0px;
      font-size: 15px;
      .input-info{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .input-password{
        width: 344px;
        height: 40px;
        background: #FFFFFF;
        border: 1px solid #DEDEDE;
        padding-left: 10px;
      }
      .btn-info{
        margin-top: 30px;
        width: 344px;
        margin-left: 102px;
      }
      .pay-btn,.sec-btn{
        width: 100%;
        height: 40px;
        background: #4982FF;
        text-align: center;
        line-height: 40px;
        color: #ffffff;
        font-size: 18px;
        cursor: pointer;
        &.disabled{
          background: #E4E4E4;
          color: #787876;
        }
      }
      .btn-sec-list{
        display: flex;
        justify-content: space-between;
      }
      .sec-btn{
        width: 45%;
        background: #86A5F8;
        margin-top: 15px;
      }
    }
    .error{
      font-size: 14px;
      text-align: left;
      padding-left: 100px;
      margin-top: 10px;
      height: 14px;
    }
    .title{
      color: #333333;
    }
    .green{
      color: #14CA39;
    }
    .red{
      color: #FF0000;
    }
  }
</style>