<template>
  <div>
    <m-header :show-left-btn="false">提示</m-header>
    <div class="main">
      <div class="tip-bg"></div>
      <div class="text">您还没有登录哦</div>
      <div class="text">请从久安的合作商户网址登陆</div>
    </div>
  </div>
</template>

<script>
  import mHeader from "components/m-header"
  export default {
    name: "customize-login-tip",
    components:{
      mHeader
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .tip-bg{
    width: r(155);
    height: r(170);
    background: url(~images/customize-tip.png) no-repeat;
    background-size: 100% 100%;
    margin-bottom: r(60);
  }
  .text{
    color: #333333;
    @include f(20px);
    text-align: center;
    margin-bottom: r(20);
  }
</style>