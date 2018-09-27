<template>
  <div>
    <div class="top-tip" :class="{'top-tip-pc': isPc}">
      <div class="icon" v-if="!isPc">
        <i class="iconfont icon-avatar"></i>
      </div>
      <div class="text">{{$t('bindUser.noLoginTip')}}</div>
    </div>
    <div class="bottom-login">
      <login></login>
    </div>
  </div>
</template>

<script>
  import Login from '../login/login-inline'
  export default {
    name: "no-login",
    components:{
      Login
    },
    props:{
      isPc:{
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .top-tip{
    width: 100%;
    height: r(156);
    background: $white;
    padding-top: r(40);
    text-align: center;
    @include f(15px);
    color: #333333;
    border-bottom: 1px solid #D8D8D8;
    .text{
      margin-top: r(10);
    }
    .iconfont{
      @include f(50px);
    }
    &.top-tip-pc{
      height: auto;
      border: none;
      @include f(24px);
      color: #ff0000;
      padding: 0;
      margin-bottom: r(60);
    }
  }
  .bottom-login{
    padding: r(20);
  }
</style>