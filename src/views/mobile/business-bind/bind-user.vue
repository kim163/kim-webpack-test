<template>
  <div>
    <div class="bing-container" v-if="!bindSuccess">
      <div class="bing-info" :class="{'bing-info-pc':isPc}">
        <i class="iconfont icon-bind-avatar" v-if="!isPc"></i>
        <div class="text">
          您将绑定<img :src="merchantInfo.logo" class="business-logo"/>的账号至久安钱包
        </div>
      </div>
      <div class="user-account" :class="{'user-account-pc': isPc}">
        您的{{merchantInfo.short}}账号：{{merchantUserName}}
      </div>
      <div class="bind-content">
        <div class="has-bind-tip" v-show="hasBind">
          提示：您的{{merchantInfo.short}}账号已被绑定或已在久安注册，不能重复操作
        </div>
        <div class="btn-list" :class="{'btn-list-pc':isPc}">
          <div class="bind-def-btn" @click="checkBindStatus()">立即绑定</div>
          <router-link tag="div" class="bing-list" :to="{name:'mBindList'}" v-if="!isPc">商户绑定记录</router-link>
        </div>
        <div class="tip-info">
          <p><strong>温馨提示</strong></p>
          <p>1，久安钱包不会获取您{{merchantInfo.name}}上除账号以外的任何信息。</p>
          <p>2，绑定后，您在{{merchantInfo.short}}网站的九安钱包入口进入久安钱包，可自动登录钱包。</p>
        </div>
      </div>
    </div>
    <transition name="success">
      <bind-success v-if="bindSuccess" :is-pc="isPc" :call-back-url="callBackUrl"></bind-success>
    </transition>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import BindSuccess from './bind-success'
  import BusinessCfg from '../../misc/merchant-config'
  import {
    bindMerchantLoginRelation,
    isSyncUser
  } from 'api/cashier'
  export default {
    name: "user-bind",
    data(){
      return{
        bindSuccess: false,
        merchantId: this.$route.query.merchantId, //商户id
        merchantInfo:{}, //商户基本信息
        hasBind: false,
        notifyUrl: this.$route.query.notifyUrl, //商户h5登陆回调地址
        merchantUserName: this.$route.query.merchantUserName, //商户登陆账户名
        callBackUrl: this.$route.query.callBackUrl//商户地址
      }
    },
    computed:{
      ...mapGetters([
        'userId'
      ])
    },
    props:{
      isPc:{
        type:Boolean,
        default:false
      }
    },
    components:{
      BindSuccess
    },
    methods:{
      checkBindStatus(){
        const request = {
          merchantId:this.merchantId,
          merchantUserName:this.merchantUserName
        }
        console.log(request)
        isSyncUser(request).then(res => {
          if(res.code === 10000){
            if(res.message === 'yes'){
              this.hasBind = true
            }else{
              this.bindUser()
            }
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      bindUser(){
        const data = {
          merchantId: this.merchantId,
          notifyUrl: this.notifyUrl,
          merchantUserName: this.merchantUserName,
          userId: this.userId
        }
        console.log('bind data',data)
        bindMerchantLoginRelation(data).then(res => {
          if(res.code === 10000){
            this.bindSuccess = true
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
    },
    created(){
      if(this.merchantId != '' && this.merchantId != undefined){
        Object.assign(this.merchantInfo,BusinessCfg.getDeail(this.merchantId))
      }
    },
    mounted(){
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .bing-info{
    width: 100%;
    height: r(156);
    text-align: center;
    color: #333333;
    @include f(15px);
    padding-top: r(38);
    border-bottom: 1px solid #d8d8d8;
    background: $white;
    &.bing-info-pc{
      height: auto;
      padding: 0;
      @include f(18px);
      margin-bottom: r(60);
      border: none;
      .text{
        margin: 0;
      }
    }
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
  .bind-content{
    padding: r(10);
    .has-bind-tip{
      width: 90%;
      @include f(15px);
      color: #FF0000;
      margin: r(10) r(20);
      line-height: r(25);
    }
    .btn-list-pc{
      margin-top: r(30);
    }
    .bing-list{
      width: 100%;
      text-align: center;
      @include f(18px);
      margin-top: r(20);
      color: #333333;
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