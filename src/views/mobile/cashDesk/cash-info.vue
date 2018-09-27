<template>
  <div class="cash-info">
    <div class="info">
      <span class="title">{{$t('cash.orderNumber')}}</span>
      <span class="detail">{{data.jiuanOrderid}}</span>
    </div>
    <div class="info" v-if="isSuccess">
      <span class="title">订单时间</span>
      <span class="detail">{{data.createtime | Date('yyyy-MM-dd h:mm:ss')}}</span>
    </div>
    <div class="info">
      <span class="title">{{$t('cash.amountsPayable')}}</span>
      <span class="detail">
            <span class="red">{{data.coinAmount}} {{data.assetCode}}</span> 折合 <span class="red">{{data.amount}} CNY</span>
      </span>
    </div>
    <div class="info">
      <span class="title">{{$t('cash.currentExchangeRate')}}</span>
      <span class="detail">100{{data.assetCode}} = {{formatCny(100)}}CNY</span>
    </div>
    <div class="info" v-if="isSuccess">
      <span class="title">交易内容</span>
      <span class="detail">商户账户充值</span>
    </div>
    <div class="info">
      <span class="title">{{$t('cash.BusinessName')}}</span>
      <span class="detail">{{data.businessName}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "cash-info",
    data() {
      return {}
    },
    props: {
      data: {
        type: Object,
        default: {
          amount: '',//应付金额
          assetCode: '', //资产代码
          merchantId: '', //商户号
          merchantOrderid: '', //商户订单号
          merchantCallbackurl: '', //商户回调地址
          sign: '', //商户请求签名
          exchangeRate: 0, // 汇率
          businessName: '', //商户名
          jiuanOrderid: '',  //久安订单号
        }
      },
      isSuccess:{
        type:Boolean,
        default:false
      }
    },
    methods: {
      formatCny(data) {
        return data / this.data.exchangeRate
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .cash-info {
    width: 100%;
    .info {
      padding-left: r(10);
      @include f(15px);
      color: #333333;
      margin-top: r(15);
      .detail {
        color: #8F8F8F;
        margin-left: r(10);
      }
    }
  }
</style>