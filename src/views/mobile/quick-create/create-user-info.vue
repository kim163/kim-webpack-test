<template>
  <div>
    <div class="create-container">
      <div class="create-info" :class="{'create-info-pc': isPc}">
        <i class="iconfont icon-register" v-if="!isPc"></i>
        <div class="text">
          您即将用<img :src="merchantInfo.logo" class="business-logo"/>账号创建久安钱包账号
        </div>
      </div>
      <div class="user-account" :class="{'user-account-pc': isPc}">
        您的{{merchantInfo.short}}账号：{{merchantInfo.merchantUserName}}
      </div>
      <div class="create-content">
        <div class="has-create-tip" v-show="createError">
          提示：您的{{merchantInfo.short}}账号已在久安注册，或已被绑定久安钱包，不能重复操作
        </div>
        <div class="btn-list">
          <div class="bind-def-btn" @click="create()">立即创建</div>
        </div>
        <div class="tip-info">
          <p><strong>温馨提示</strong></p>
          <p>1，久安钱包不会获取您{{merchantInfo.name}}上除账号以外的任何信息。</p>
          <p>2，创建后，您可以使用{{merchantInfo.short}}前缀（{{merchantInfo.prefix}}）+该{{merchantInfo.short}}账号登陆久安钱包。</p>
          <p>3，创建后，您的{{merchantInfo.short}}账号将默认绑定久安钱包</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    checkExistUser
  } from 'api/cashier'

  export default {
    name: "create-user-info",
    data(){
      return{
        createError:false
      }
    },
    props:{
      merchantInfo:{
        type:Object,
        default:{}
      },
      isPc:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      create(){
        const request = {
          merchantId: this.merchantInfo.merchantId,
          merchantUserName: this.merchantInfo.merchantUserName,
        }
        console.log('checkExistUser',request)
        checkExistUser(request).then(res => {
          if(res.code === 10000){
            // this.toLogin(res.data.token)
            this.$emit('createNow')
          }else if(res.code === 15047){
            this.createError = true
          } else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .create-info{
    width: 100%;
    height: r(156);
    text-align: center;
    color: #333333;
    @include f(15px);
    padding-top: r(38);
    border-bottom: 1px solid #d8d8d8;
    background: $white;
    .text{
      margin-top: r(20);
    }
    .iconfont{
      @include f(50px);
    }
    .business-logo{
      height: r(28);
      margin-left: r(8);
      margin-right: r(8);
    }
    &.create-info-pc{
      border: none;
      margin-bottom: r(50);
      padding-top: 0;
      height: auto;
    }
  }
  .user-account{
    width: 100%;
    height: r(50);
    line-height: r(50);
    text-align: center;
    background: $white;
    color: #333333;
    @include f(15px);
    border-bottom: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    margin-top: r(10);
    &.user-account-pc{
      background-color: #f7f7f7;
      border: solid 1px #d4d4d4;
      width: calc(100% - #{r(20)});
      margin: 0 auto;
    }
  }
  .create-content{
    padding: r(10);
    .has-create-tip{
      width: 90%;
      @include f(15px);
      color: #FF0000;
      margin: r(10) r(20);
      line-height: r(25);
    }
    .tip-info{
      @include f(15px);
      color: #787876;
      margin-top: r(30);
      p{
        margin-bottom: r(10);
      }
    }
  }
</style>