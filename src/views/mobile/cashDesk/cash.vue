<template>
  <div class="cash-main">
    <mobile-header :back="goBack">{{$t('cash.title')}}</mobile-header>
    <template v-if="!cashSuccess">
      <div class="cash-details">
        <div class="trade-time">
          {{$t('cash.realTime')}}
          <span class="red fr">
        <count-down :end-time="endTime" end-text="订单已超时" @callBack="countDownEnd"></count-down>
      </span>
        </div>
        <cash-info :data="infoData"></cash-info>
        <a :href="infoData.notifyUrl" class="other-pay">{{$t('cash.otherPay')}}&gt;&gt;</a>
        <!--<div class="other-pay" @click="goApp()">{{$t('cash.otherPay')}}&gt;&gt; 安装app：{{hasApp}}</div>-->
      </div>
      <div class="payment-loading" v-if="showPaymentLoading">
        加载中...
      </div>
      <transition name="login-animate">
        <div v-if="!showPaymentLoading">
          <transition name="pay-type">
            <div class="quick-pay" v-if="hasApp">
              <div class="pay-btn">{{$t('cash.payment')}}</div>
              <div class="pay-btn login-pay" @click="hasApp = false">{{$t('cash.loginPay')}}</div>
            </div>
          </transition>
          <transition name="pay-type">
            <div class="pay-info" v-if="!hasApp">
              <transition name="login-animate">
                <login v-if="!islogin"></login>
              </transition>
              <transition name="pay-info-animate">
                <cash-pay v-if="islogin" :pay-info="infoData" :pay-btn="payBtnStatus" @pay="pay"></cash-pay>
              </transition>
            </div>
          </transition>
          <a :href="infoData.notifyUrl" class="go-back" v-if="!hasApp">{{$t('cash.goBack')}}</a>
        </div>
      </transition>
    </template>
    <transition name="success">
      <cash-success :pay-info="infoData" v-if="cashSuccess"></cash-success>
    </transition>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import CountDown from 'components/countdown'
  import ConfirmDialog from 'components/confirm'
  import {generateTitle} from '@/util/i18n'
  import {mapGetters} from 'vuex'
  import Login from '../login/login-inline'
  import CashPay from './cash-pay'
  import CashInfo from './cash-info'
  import CashSuccess from './cash-success'
  import merchantCfg from '../../misc/merchant-config'

  import aesutil from '@/util/aesutil';
  import {$localStorage} from '@/util/storage'

  import {
    cashierInit,
    loginH5,
    paymentPay,
    getOrderStatus,
  } from 'api/cashier'
  import {login} from 'api/show'

  export default {
    data() {
      return {
        infoData: {
          exchangeRate: 100, // 汇率
          businessName: '', //商户名
          jiuanOrderid: '',  //久安订单号
          amount: this.$route.query.amount || '',//应付金额
          coinAmount:'', //对应uet金额
          assetCode: this.$route.query.assetCode || '', //资产代码
          merchantId: this.$route.query.merchantId || '', //商户号
          merchantOrderid: this.$route.query.merchantOrderid || '', //商户订单号
          merchantCallbackurl: this.$route.query.merchantCallbackurl || '', //商户回调地址
          sign: this.$route.query.sign || '', //商户请求签名
          notifyUrl: this.$route.query.notifyUrl || '',//返回商户地址
          bindUserid: this.$route.query.bindUserid || '',
          bindPhone: this.$route.query.bindPhone || '',
          bindName: this.$route.query.bindName || '',
          bindAreacode: this.$route.query.bindAreacode || '',
          bindUserLevel: this.$route.query.bindUserLevel || '',
          spareFields: this.$route.query.spareFields || '',
          customerAddress: '', //钱包地址
          createtime: 0,//订单时间
        },
        hasApp: false, //商户是否安装app
        endTime: 3600000, //订单结束倒计时
        payPassword: '',
        payBtnStatus: true, //确定付款按钮状态
        token: this.$route.query.token || '',//授权token
        cashSuccess: false,  //充值成功
        showPaymentLoading: true
      }
    },
    watch:{
      islogin(){
        if(this.islogin){
          this.infoData.customerAddress = this.userData.accountChainVos[0].address
        }
      },
    },
    components: {
      MobileHeader,
      Login,
      CashPay,
      CashInfo,
      CountDown,
      ConfirmDialog,
      CashSuccess
    },

    created() {
      //判断是否安装app  如果没有  就用授权码登录
      this.infoData.businessName = merchantCfg.getDeail(this.infoData.merchantId).name
      // var ifr = document.createElement('iframe');
      // ifr.src = 'jiuanapp';
      // ifr.style.display = 'none';
      // this.checkInstallApp()
      // document.body.appendChild(ifr);
      // setTimeout(function() {
      //   document.body.removeChild(ifr);
      // }, 2000);
      let paySuccessList = $localStorage.get('paySuccessList') //获取本地支付成功列表
      if(!_.isUndefined(paySuccessList) && !_.isNull(paySuccessList)){
        paySuccessList = JSON.parse(aesutil.decrypt(paySuccessList))
        const info = paySuccessList.find((item) => {
          return item.merchantOrderid === this.infoData.merchantOrderid
        })
        if(info){
          console.log(info)
          Object.assign(this.infoData,info)
          this.cashSuccess = true
        }
      }
      //Vue.$global.bus.$emit('merchantOrderid',this.infoData.merchantOrderid)
      if (!this.islogin && this.token != '' && !_(this.token).isUndefined() && this.token != 'undefined') {
        this.tokenLogin()
      }else{
        this.showPaymentLoading = false
      }
      if(this.islogin){
        this.infoData.customerAddress = this.userData.accountChainVos[0].address
      }
    },
    computed: {
      ...mapGetters([
        "userData",
        "islogin",
        "userId"
      ]),
    },
    methods: {
      generateTitle,
      goBack() {
        window.location.href = this.infoData.notifyUrl
      },
      formatParameter(val){
        return val === 'null' ? '' : val
      },
      init() { //调用初始化接口
        const data = {
          amount: this.formatParameter(this.infoData.amount),
          merchantOrderid: this.formatParameter(this.infoData.merchantOrderid),
          assetCode: this.formatParameter(this.infoData.assetCode),
          merchantId: this.formatParameter(this.infoData.merchantId),
          merchantCallbackurl: this.formatParameter(this.infoData.merchantCallbackurl),
          sign: this.formatParameter(this.infoData.sign.replace(/\s/g,'+')),
          bindUserid: this.formatParameter(this.infoData.bindUserid),
          bindPhone: this.formatParameter(this.infoData.bindPhone),
          bindName: this.formatParameter(this.infoData.bindName),
          bindAreacode: this.formatParameter(this.infoData.bindAreacode.replace(/\s/g,'+')),
          bindUserLevel: this.formatParameter(this.infoData.bindUserLevel),
          spareFields: this.formatParameter(this.infoData.spareFields),
        }
        cashierInit(data).then(res => {
          console.log('cash init res: ', res)
          if (res.code === 10000) {
            const data = res.data
            this.infoData.jiuanOrderid = data.payOrder.jiuanOrderid
            this.infoData.exchangeRate = data.payOrder.exchangeRate
            this.infoData.createtime = data.payOrder.createtime
            this.infoData.coinAmount = data.payOrder.coinAmount
            if(data.payOrder.status === 1){
              this.cashSuccess = true
            }
            const nowTime = _.now()
            if (nowTime > _(data.payOrder.createtime).add(3600000)) {
              this.endTime = 0
              this.payBtnStatus = false
            } else {
              const endTime = _.chain(data.payOrder.createtime).add(3600000).subtract(nowTime).value()
              this.endTime = endTime > 3600000 ? 3600000 : endTime
              _.merchantOrderidWs(this.infoData.jiuanOrderid)
            }
          } else {
            this.endTime = 0
            toast(res.message)
          }
        }).catch(err => {
          this.endTime = 0
          toast(err)
        })
      },
      checkInstallApp() {
        // let timeout, t = 2000, hasApp = true;
        // setTimeout(() => {
        //   this.hasApp = hasApp
        //   this.showPaymentLoading = false
        //   document.body.removeChild(ifr);
        // }, 2000)
        //
        // const t1 = Date.now();
        // const ifr = document.createElement("iframe");
        // ifr.setAttribute('src', 'scheme="jiuanapp"');
        // // ifr.setAttribute('src', 'jiuanapp');
        // ifr.setAttribute('style', 'display:none');
        // document.body.appendChild(ifr);
        // timeout = setTimeout(function () {
        //   var t2 = Date.now();
        //   if (!t1 || t2 - t1 < t + 100) {
        //     hasApp = false;
        //   }
        // }, t);
        var _clickTime = +(new Date());

        //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
        var _count = 0, intHandle;
        intHandle = setInterval(() => {
          _count++;
          var elsTime = +(new Date()) - _clickTime;
          if (_count>=100 || elsTime > 3000 ) {
            clearInterval(intHandle);
            this.check(elsTime);
          }
        }, 20);
      },
      check(elsTime) {
        if ( elsTime > 3000 || document.hidden || document.webkitHidden) {
          this.hasApp = true
        } else {
          this.hasApp = false
        }
        this.showPaymentLoading = false
      },
      tokenLogin() {//用授权码登录
        const request = {
          type: 11,
          token: this.token,
          merchantId: this.infoData.merchantId
        }
        console.log(request)

        login(request).then(res => {
          if (res.code === 10000) {
            $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
            $localStorage.set('userData', JSON.stringify(aesutil.encrypt(res.data.userId)));
            this.$store.dispatch('CHECK_ONLINE', true);
            this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
            this.$store.dispatch('INIT_INFO');
            this.$store.commit('SET_USERDATA',res.data);
          } else {
            toast(res.message)
          }
        }).catch(err => {
        }).finally(() => {
          this.showPaymentLoading = false
        })
      },
      checkPayPassWord() {
        if (this.payPassword === '') {
          toast(this.generateTitle('cash.psdInputPlaceholder'))
        } else {
          this.pay(this.payPassword)
        }
      },
      pay(password) {
        //调用支付接口
        const request = {
          jiuanOrderid: this.infoData.jiuanOrderid,
          userId: this.userId,
          payPassword: password,
          assetCode: this.infoData.assetCode,
          customerAddress: this.infoData.customerAddress,
          amount: this.infoData.amount,
        }
        console.log(request)
        paymentPay(request).then(res => {
          if (res.code === 10000) {
            this.cashSuccess = true
            this.unSubscribe()
            this.saveLocal()
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      countDownEnd() {
        toast('该订单已超时')
        this.payBtnStatus = false
        this.unSubscribe()
      },
      saveLocal(){
        this.$store.dispatch("UPDATE_USERDATA")
        let paySuccessList = $localStorage.get('paySuccessList') //获取本地支付成功列表
        if(!_.isUndefined(paySuccessList) && !_.isNull(paySuccessList)){
          paySuccessList = JSON.parse(aesutil.decrypt(paySuccessList))
          paySuccessList.push(this.infoData)
          $localStorage.set('paySuccessList',aesutil.encrypt(JSON.stringify(paySuccessList)))
        }else{
          const arr = []
          arr.push(this.infoData)
          $localStorage.set('paySuccessList',aesutil.encrypt(JSON.stringify(arr)))
        }
      },
      unSubscribe(){
        Vue.$global.bus.$emit('merchantOrderidUnsubscribe')
      },
      goToDownLoad(status){
        if(status === 0){
          window.location.href='https://9apro.com/app/9anapp.html'
        }
      },
      goApp(){
        // let _downLoadUrl = '';
        // let _schema = '';
        // let _protocal = '';
        // if (_.isIos()) {
        //   _downLoadUrl = 'https://9anapp.com/app/9anapp.html';
        //   _schema = '?promoter';
        //   _protocal = 'jiuanapp';
        // } else if (_.isAndroid()) {
        //   _downLoadUrl = 'https://9anapp.com/app/9anapp.html';
        //   _schema = 'promotion';
        //   _protocal = 'jiuanapp';
        // }
        // _.openAppFun().loadSchema({
        //   // 通过NN打开某个链接
        //   schema: _schema,
        //   //schema头协议，实际情况填写
        //   protocal: _protocal,
        //   //发起唤醒请求后，会等待loadWaiting时间，超时则跳转到failUrl，默认3000ms
        //   loadWaiting:"2000",
        //   //唤起失败时的跳转链接，默认跳转到下载页
        //   failUrl: _downLoadUrl,
        //   // apk信息,请根据实际情况填写
        //   // apkInfo:{
        //   //   PKG: "com.jiuan.wallet",
        //   //   CATEGORY: "android.intent.category.DEFAULT",
        //   //   ACTION: "android.intent.action.VIEW"
        //   // }
        // });
        _.openApp('weixin://',this.goToDownLoad)
      },
    },
    mounted() {
      if(!this.cashSuccess) {
        this.init()
        Vue.$global.bus.$on('update:paySuccess',() => {
          this.cashSuccess = true
          this.saveLocal()
          this.unSubscribe()
        })
      }
    },
    beforeDestroy(){
      Vue.$global.bus.$off('update:paySuccess')
    }
  };

</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .login-animate-enter {
    opacity: 0;
  }

  .pay-info-animate-enter {
    transform: translateX(100%);
  }

  .login-animate-enter-active, .pay-info-animate-enter-active {
    transition: all .5s;
  }

  .pay-type-enter {
    transform: translateX(100%);
  }

  .pay-type-enter-active {
    transition: all .5s;
  }

  .cash-details {
    background: $white;
  }

  .red {
    color: red;
  }

  .trade-time {
    height: r(44);
    line-height: r(44);
    padding: 0 r(10);
    border-bottom: 1px solid #d8d8d8;
  }

  .other-pay {
    display: block;
    width: 100%;
    height: r(44);
    line-height: r(44);
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    @include f(15px);
    color: #333333;
    padding-left: r(10);
    margin-top: r(20);
  }

  .cash-main {
    overflow-x: hidden;
    overflow-y: auto;
    .go-back {
      display: block;
      text-align: center;
      height: r(50);
      line-height: r(50);
      background: #86A5F8;
      color: #fff;
      @include f(18px);
      /*position: fixed;*/
      width: 100%;
      bottom: 0;
    }
  }

  .quick-pay {
    padding: r(20) r(10);
    .pay-btn {
      width: 100%;
      height: r(50);
      line-height: r(50);
      background: #4982FF;
      border-radius: r(4);
      text-align: center;
      margin-bottom: r(20);
      color: $white;
      @include f(18px);
      &.login-pay {
        background: #86A5F8;
      }
    }
  }

  .pay-info {
    width: 90%;
    padding-top: r(20);
    padding-bottom: r(20);
    margin: 0 auto;
  }

  .pay-psd-input {
    width: 80%;
    height: r(40);
    padding-left: 2%;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
  }

  .btn-cancel, .btn-yes {
    width: 100%;
    height: 100%;
  }

  .btn-cancel {
    background: #D8D8D8;
    color: #333333;
  }

  .btn-yes {
    background: #4982FF;
    color: $white;
  }

  .payment-loading {
    text-align: center;
    padding-top: r(30);
    animation: looming 2s infinite;
  }

  @keyframes looming {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
