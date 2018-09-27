<template>
  <div>
    <div class="tip">
      <i class="iconfont icon-success"></i>
      <div class="tip-text">恭喜您，充值成功！</div>
    </div>
    <div class="cash-info">
      <cash-info :data="payInfo" :isSuccess="true"></cash-info>
    </div>
    <a class="go-back" :href="payInfo.notifyUrl">返回商户页面</a>
  </div>
</template>

<script>
  import CashInfo from './cash-info'
  export default {
    name: "cash-success",
    data(){
      return{
      }
    },
    components:{
      CashInfo
    },
    props:{
      payInfo:{
        type:Object,
        default:{}
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .tip{
    width: 100%;
    height: r(260);
    border-bottom: 1px solid #d8d8d8;
    text-align: center;
    padding-top: r(61);
    background: #FFFFFF;
    .iconfont{
      @include f(100px);
      color: #0abb07;
    }
    .tip-text{
      @include f(18px);
      color: #333333;
      margin-top: r(20);
    }
  }
  .cash-info{
    padding: r(5) 0;
    background: $white;
  }
  .go-back{
    display: block;
    position: fixed;
    width: 100%;
    height: r(50);
    line-height: r(50);
    text-align: center;
    background: #86A5F8;
    color: #FFFFFF;
    @include f(18px);
    bottom: 0;
    left: 0;
  }
</style>