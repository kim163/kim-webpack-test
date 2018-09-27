<template>
  <div>
    <p class="c-l-title"> 久安扫码支付</p>
    <div v-if="endTime > 0">
      <p v-show="qrCodeStatus != 1"> 二维码将在<span class="orange">{{qrCodeTime}}秒</span>后失效</p>
      <p v-show="qrCodeStatus === 1">支付中</p>
    </div>
    <div v-else>该笔订单已超时</div>
    <div class="qrcode-box">
      <div v-if="endTime > 0">
        <div class="pay-mask" v-show="qrCodeStatus === 1">正在支付......</div>
        <div class="pay-mask" v-show="qrCodeStatus === 2">
          <div>二维码已失效</div>
          <div class="qrcode-refresh" @click="$emit('qrcodeRefresh')">重新获取</div>
        </div>
      </div>
      <div class="pay-mask" v-else>订单已超时</div>
      <qrcode :text="infoData.qrCodeImg" v-if="infoData.qrCodeImg" :size="248"></qrcode>
    </div>
    <p class="i-scan">打开久安钱包<br>扫一扫</p>
    <div class="tutorial">
      <div class="text">
        不会使用？
        <span @mouseover="showPhone = true" @mouseout="showPhone = false">请戳我</span>
      </div>
      <div class="text">
        没有久安钱包app?
        <span @mouseover="showDownQrcode = true" @mouseout="showDownQrcode = false">扫码下载</span>
      </div>
      <transition name="pic-show">
        <div class="phone-app" v-show="showPhone"></div>
      </transition>
      <transition name="pic-show">
        <div class="app-down-qrcode" v-show="showDownQrcode">
          <qrcode :text="SETTING.appUrl" :logoSrc="Logo" :margin="0" :logoScale="0.2" :size="150"></qrcode>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import Qrcode from 'vue-qr';
  import {SETTING} from "@/assets/data"
  import Logo from '@/assets/images/logo-blue.png'
  export default {
    name: "cash-qrcode",
    data() {
      return {
        qrCodeTime:180, //二维码倒计时
        showPhone: false,
        showDownQrcode:false,
        SETTING,
        Logo
      }
    },
    watch:{
      qrCodeStatus(val){
        if(val === 0){
          this.qrCodeTime = 180
          this.qrCodeCountDown()
        }
      },
    },
    model: {
      prop: 'qrCodeStatus',
      event: 'change'
    },
    props:{
      infoData:{
        type:Object,
        default:{}
      },
      endTime:{
        type:Number,
        default:0
      },
      qrCodeStatus:{
        type:Number,
        default:0
      }
    },
    components:{
      Qrcode
    },
    methods:{
      qrCodeCountDown(){
        setTimeout(() => {
          this.qrCodeTime -= 1
          if(this.qrCodeTime <= 0){
            this.$emit('change', 2)
          }else{
            this.qrCodeCountDown()
          }
        },1000)
      },
    },
    mounted(){
      this.qrCodeCountDown()
    }
  }
</script>

<style lang="scss" scoped>

  .pic-show-enter,.pic-show-leave{
    opacity: 0;
    transform: translate3d(-10%, 0, 0);
  }
  .pic-show-enter-active,.pic-show-leave-active{
    transition: all .5s;
  }

  .c-l-title {
    font-size: 26px;
    padding: 8px 0;
  }
  .qrcode-box {
    width: 250px;
    height: 250px;
    border: 1px solid #ececec;
    margin: 20px auto;
    position: relative;
    .pay-mask{
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: rgba(0,0,0,.8);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .qrcode-refresh{
      margin-top: 20px;
      width: 120px;
      height: 30px;
      background: #619eff;
      border-radius: 5px;
      font-size: 16px;
      line-height: 30px;
      cursor: pointer;
    }
  }

  .i-scan {
    background: url(~images/scan.png) no-repeat left center;
    padding-left: 52px;
    width: 170px;
    margin: 0 auto;
    text-align: left;
    font-size: 18px;
  }
  .orange {
    color: #ff9200;
  }
  .tutorial{
    position: relative;
    margin-top: 20px;
    .text{
      font-size: 16px;
      margin-top: 10px;
      span{
        color: #138bd9;
        cursor: pointer;
      }
    }
    .phone-app{
      width: 473px;
      height: 519px;
      background: url("~images/phone.png") ;
      position: absolute;
      top: -519px;
      left: 55%;
      z-index: 2;
    }
    .app-down-qrcode{
      border: 1px solid #999999;
      background: #ffffff;
      position: absolute;
      top: -100px;
      left: 85%;
      z-index: 3;
      padding: 10px;
      border-radius: 10px;
    }
  }
</style>