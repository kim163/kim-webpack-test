<template>
  <div class="main" :class="{'width-all':isMobile}" v-if="show">
    <!--pc展示页面-->
    <div class="pc" v-if="!isMobile">
      <span class="pointer" @click="showQrcode">久安APP扫码登录</span>
    </div>
    <!--手机展示页面-->
    <div class="mobile" v-else>
      <div class="close">
        <i class="iconfont icon-close" @click="show = false"></i>
      </div>
      <img class="logo" src="~images/logo.png">
      <span>久安定制钱包APP</span>
      <div class="open-app" @click="showQrcode">
        立即打开 >
      </div>
    </div>
    <div class="dialog" v-if="showDialog">
      <div class="dialog-main" :class="{bdr: !isMobile}">
        <div class="title" v-if="!isMobile">
          久安APP扫码登录
          <i class="iconfont icon-close close" @click="showDialog = false"></i>
        </div>
        <div class="dialog-content">
          <!--pc弹出信息-->
          <div class="content-pc" v-if="!isMobile"> <!--pc弹出信息-->
            <vue-qrcode class="qrcode" v-if="qrcodeLink != ''" :text="qrcodeLink" :margin="0" :size="188"></vue-qrcode>
            <div class="text">打开久安定制APP，扫码二维码快速登录</div>
          </div>
          <!--手机弹出信息-->
          <div class="content-mobile" v-else>
            <header class="tip-title">温馨提示</header>
            <section class="tip-text">
              请确认已经下载安装“久安定制钱包”,App如果未安装请点击下载安装,如果已经安装请点击打开App
            </section>
            <a :href="SETTING.appUrl" class="link download">下载安装</a>
            <a :href="qrcodeLink" class="link open-app">打开APP</a>
          </div>
        </div>
      </div>
      <a class="close-btn-radius" v-if="isMobile" @click="showDialog = false"></a>
    </div>
  </div>
</template>

<script>
  import {
    qrCode
  } from 'api/show'
  import VueQrcode from 'vue-qr';
  import {SETTING} from "@/assets/data"
  export default {
    name: "login-app",
    data(){
      return{
        isMobile: _.isMobile(),
        qrcodeLink:'',
        showDialog:false,
        show:true,
        SETTING
      }
    },
    components:{
      VueQrcode
    },
    methods:{
      showQrcode(){
        qrCode({}).then(res => {
          console.log(res)
          if(res.code === 10000){
            if(res.data && !_.isNull(res.data)){
              this.qrcodeLink = res.data.key
              this.showDialog = true
            }else{
              toast('获取App登录信息失败')
            }
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    display: inline-block;
    color: $white;
    &.width-all{
      width: 100%;
    }
  }
  .pointer{
    cursor: pointer;
  }
  .mobile{
    width: 100%;
    height: r(50);
    line-height: r(50);
    background: #2F67E0;
    /*display: flex;*/
    @include f(14px);
    .close{
      float: left;
      width: r(18);
      height: r(18);
      line-height: r(14);
      text-align: center;
      border: r(1) solid $white;
      border-radius: 50%;
      margin-left: r(20);
      margin-top: r(17);
      .icon-close{
        @include f(12px);
        color: $white;
      }
    }
    .logo{
      height: r(30);
      margin: r(0) r(5) 0 r(20);
    }
    .open-app{
      float: right;
      width: r(88);
      height: r(30);
      background: rgba(255,255,255,0.20);
      border-radius: 2px;
      text-align: center;
      line-height: r(30);
      margin-top: r(10);
      margin-right: r(20);
    }
  }
  .dialog{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.40);
    z-index: 998;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .dialog-main{
      max-width: r(500);
      width: 67%;
      &.bdr{
        border-radius: 10px;
        overflow: hidden;
      }
      .title{
        width: 100%;
        height: 50px;
        background-color: #5087ff;
        padding-left: 30px;
        line-height: 50px;
        .close{
          font-size: 20px;
          color: $white;
          float: right;
          margin-right: 20px;
          cursor: pointer;
        }
      }
      .dialog-content{
        background: $white;
      }
      .content-pc{
        padding: 30px;
        .qrcode{
          text-align: center;
        }
        .text{
          text-align: center;
          font-size: 18px;
          color: #333333;
          line-height: 18px;
          margin-top: 30px;
        }
      }
      .content-mobile{
        padding: r(10);
        .tip-title{
          color: #333333;
          @include f(16px);
          text-align: center;
          margin-top: r(10);
        }
        .tip-text{
          color: #787876;
          @include f(14px);
          margin-top: r(10);
          margin-bottom: r(16);
        }
        .link{
          display: block;
          width: 100%;
          height: r(30);
          text-align: center;
          color: $white;
          line-height: r(30);
          @include f(14px);
          border-radius: r(4);
          margin-bottom: r(10);
          &.download{
            background: #FF799E;
          }
          &.open-app{
            background: #3573FA;
          }
        }
      }
    }
  }
</style>