<template>
  <div class="pay-main">
    <div class="amout-info">
      <div class="title">UET钱包支付</div>
      <div class="amount-detail">
        <div class="blance">{{$t('cash.balance')}}：<balance @getBalance="getUserBalance"></balance></div>
        <div class="amount-status" :class="amountStatus ? 'green' : 'red'">
          {{ amountStatus ? $t('cash.enough') : $t('cash.notEnough')}}
        </div>
      </div>
    </div>
    <div class="pay-password">
      <div class="title">{{$t('cash.payPassWord')}}:</div>
      <input type="password" class="input-password" v-model.trim="payPassword" :placeholder="$t('cash.psdInputPlaceholder')"/>
      <div class="pay-btn" :class="{disabled: !amountStatus || !payBtn}" @click="amountStatus && payBtn ? payment() : ''">{{$t('cash.confirmPayment')}}</div>
      <router-link :to="{name: 'mIndex'}" class="go-tran">{{$t('cash.goTran')}}</router-link>
    </div>
  </div>
</template>

<script>
  import Balance from 'components/balance'
  export default {
    name: "cash-pay",
    data(){
      return{
        amountStatus: false, //余额状态
        payPassword:'',
        userBalance:0,
        coinAmount:0,
      }
    },
    components:{
      Balance
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
          this.$emit('pay',this.payPassword)
        }else{
          toast('请输入支付密码')
        }
      },
      getUserBalance(data){
        this.userBalance = data
      },
      checkAmountStatus(){
        if(Number(this.coinAmount) > Number(this.userBalance)){
          this.amountStatus = false
        }else{
          this.amountStatus = true
        }
      }
    },
    // activated(){
    //   this.coinAmount = this.payInfo.coinAmount
    // },
    mounted(){
      this.coinAmount = this.payInfo.coinAmount
    },
    beforeDestroy(){
      this.amountStatus = false
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .pay-main{
    width: 100%;
    background: $white;
    .amout-info{
      padding: r(20);
      @include f(15px);
      border-bottom: 1px solid #D8D8D8;

      .amount-detail{
        margin-top: r(15);
        display: flex;
        justify-content: space-between;
      }
      .blance{
        color: #787876;
      }
    }
    .pay-password{
      padding: r(20);
      @include f(15px);
      .input-password{
        width: 100%;
        height: r(40);
        background: #FFFFFF;
        border: 1px solid #DEDEDE;
        margin-top: r(10);
        padding-left: r(10);
      }
      .pay-btn,.go-tran{
        width: 100%;
        height: r(40);
        background: #4982FF;
        text-align: center;
        line-height: r(40);
        color: $white;
        @include f(18px);
        margin-top: r(20);
        &.disabled{
          background: #E4E4E4;
          color: #787876;
        }
      }
      .go-tran{
        display: block;
        background: #86A5F8;
      }
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