<template>
  <div>
    <div class="top-tip">
      <i class="iconfont icon-success"></i>
      <div class="info def-color">安全信息已提交</div>
      <div class="info">请妥善保管好您的账号密码</div>
      <div class="info">为了您的账户安全，您可以在久安官网下载久安APP，继续完善您的安全信息</div>
      <div class="line"></div>
      <div class="info">久安官网：https://www.9security.com</div>
    </div>
    <div class="btn-list">
      <router-link :to="{name: isPc ? 'index' : 'mIndex'}" class="bind-def-btn">进入久安官网</router-link>
    </div>
  </div>
</template>

<script>
  import {SETTING} from "@/assets/data"
  export default {
    name: "create-success",
    data(){
      return{
        SETTING
      }
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
    /*height: r(298);*/
    border-bottom: 1px solid #d8d8d8;
    padding: r(43) r(25) r(10);
    text-align: center;
    color: #787876;
    @include f(15px);
    .iconfont{
      @include f(40px);
      color: #0ABB07;
    }
    .def-color{
      margin-top: r(15);
      color: #333333;
    }
    .info{
      margin-bottom: r(20);
    }
    .line{
      width: 100%;
      height: 1px;
      background: #D8D8D8;
      margin-bottom: r(26);
    }
  }
  .btn-list{
    padding: r(10);
  }
</style>