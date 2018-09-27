<template>
  <div>
    <div class="success-tip" :class="{'success-tip-pc':isPc}">
      <i class="iconfont icon-success"></i>
      <div class="text">恭喜您，绑定成功！</div>
    </div>
    <div class="btn-list">
      <router-link class="bind-def-btn" :to="{name: isPc ? 'pcBindList' : 'mBindList'}">查看绑定记录</router-link>
      <router-link class="bind-def-btn" :to="{name:'mIndex'}" v-if="!isPc">进入交易大厅</router-link>
      <a class="go-business" :href="callBackUrl">返回商户</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "success",
    data(){
      return{

      }
    },
    props:{
      callBackUrl:{
        type:String,
        default:''
      },
      isPc:{
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .success-tip{
    width: 100%;
    height: r(260);
    background: $white;
    border-bottom: 1px solid #d8d8d8;
    text-align: center;
    padding-top: r(60);
    &.success-tip-pc{
      padding: 0;
      height: r(200);
    }
    .iconfont{
     @include f(100px);
      color: #0ABB07;
    }
    .text{
      @include f(18px);
      color: #333333;
      margin-top: r(20);
    }
  }
  .btn-list{
    padding: r(10);
    .go-business{
      display: block;
      width: 100%;
      text-align: center;
      @include f(18px);
      margin-top: r(20);
      color: #333333;
    }
  }
</style>