<template>
  <div class="main">
    <header class="header">
      <div class="header-in">
        <div class="logo-left">
          <img src="~images/logo-blue.png" class="logo">
          <div class="title">久安钱包</div>
          <div class="line"></div>
          <div class="des">商户收银台</div>
        </div>
        <div class="logo-right">您好，欢迎使用久安支付！ <a class="blue hidden">常见问题</a></div>
      </div>
    </header>
    <div class="content-box" v-if="!cashSuccess">
      <div class="content" id="pageOne">
        <div class="content01">
          <div class="book-box">
            <p class="p0 p-txt1">您正在使用即时到账交易，
              <span v-if="endTime > 0">
                请在
                <strong class="orange">
                  <count-down :end-time="endTime" end-text="订单已超时" @callBack="countDownEnd"></count-down>
                </strong>
              内完成支付，否则订单将会自动取消
              </span>
              <span v-else><strong class="orange">订单已超时</strong></span>
            </p>
            <p class="p0 p-txt2">
              <strong>订单号：{{infoData.jiuanOrderid}}
                <span class="fr shop-user">商户名：{{infoData.businessName}}</span>
              </strong>
            </p>
            <p class="p0 p-txt3">
              应付金额：
              <span class="red">{{infoData.coinAmount}}  {{infoData.assetCode}}</span> 折合
              <span class="red">{{infoData.amount}} CNY </span>
              <span class="gray current-rate">当前汇率：100{{infoData.assetCode}}={{formatCny(100)}}CNY	</span>
              <a :href="infoData.notifyUrl" class="orange fr otherPay"><strong>更换其他支付方式&gt;&gt; </strong></a>
            </p>
          </div>
        </div>
        <div class="content02 mobile">
          <div class="c-l">
            <cash-qrcode :end-time="endTime"
                         :info-data="infoData"
                         v-model="qrCodeStatus"
                         @qrcodeRefresh="init()"></cash-qrcode>
          </div>
          <div class="c-r">
            <login-pay :data="infoData" :token="token"></login-pay>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <cash-success :data="infoData" v-else></cash-success>

    <footer class="footer">
      <div class="footer-in">
        <span class="fl">
          久安钱包<br>支持支付方式:
        </span>
        <img src="~images/pay.png">
      </div>
    </footer>
  </div>
</template>

<script>
  import CountDown from 'components/countdown'
  import {generateTitle} from '@/util/i18n'
  import {mapGetters} from 'vuex'
  import CashSuccess from './cash-success'
  import merchantCfg from '../misc/merchant-config'
  import LoginPay from './login-pay'
  import CashQrcode from './cash-qrcode'
  import CashLogin from './cash-login'
  import CashPay from './cash-pay'
  import aesutil from '@/util/aesutil';
  import {$localStorage} from '@/util/storage'

  import {
    cashierInit,
    paymentPay,
    getOrderStatus,
  } from 'api/cashier'
  import {login} from 'api/show'

  export default {
    name: "pc-cash",
    data() {
      return {
        infoData: {
          exchangeRate: 100, // 汇率
          businessName: '', //商户名
          jiuanOrderid: '',  //久安订单号
          amount: this.$route.query.amount || '',//应付金额
          coinAmount: '', //对应uet金额
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
          qrCodeImg: '', //二维码地址
        },
        endTime: 3600000, //订单结束倒计时
        payPassword: '',
        payBtnStatus: true, //确定付款按钮状态
        token: this.$route.query.token || '',//授权token
        cashSuccess: false,  //充值成功
        showPaymentLoading: true,
        qrCodeStatus: 0,//二维码状态 0 正常显示 1支付中 2二维码失效
        // qrCodeTime:180, //二维码倒计时
        loginPay: false, // 登录支付
        hasSubscribe: false, //是否订阅
      }
    },
    watch: {
      islogin() {
        if (this.islogin) {
          this.infoData.customerAddress = this.userData.accountChainVos[0].address
          _.merchantOrderidWs(this.infoData.jiuanOrderid, this.userData)
        }
      },
    },
    components: {
      CountDown,
      CashSuccess,
      LoginPay,
      CashQrcode,
      CashLogin,
      CashPay
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
      formatCny(data) {
        return data / this.infoData.exchangeRate
      },
      formatParameter(val) {
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
            this.infoData.qrCodeImg = data.qrCode
            this.qrCodeStatus = 0
            if (data.payOrder.status === 1) {
              this.cashSuccess = true
            }
            const nowTime = _.now()
            if (nowTime > _(data.payOrder.createtime).add(3600000)) {
              this.endTime = 0
              this.payBtnStatus = false
            } else {
              const endTime = _.chain(data.payOrder.createtime).add(3600000).subtract(nowTime).value()
              this.endTime = endTime > 3600000 ? 3600000 : endTime
              // this.qrCodeTime = 180
              // this.qrCodeCountDown()
              if (!this.hasSubscribe) {
                _.merchantOrderidWs(this.infoData.jiuanOrderid)
                this.hasSubscribe = true
              }
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
      saveLocal() {
        this.$store.dispatch("UPDATE_USERDATA")
        let paySuccessList = $localStorage.get('paySuccessList') //获取本地支付成功列表
        if (!_.isUndefined(paySuccessList) && !_.isNull(paySuccessList)) {
          paySuccessList = JSON.parse(aesutil.decrypt(paySuccessList))
          paySuccessList.push(this.infoData)
          $localStorage.set('paySuccessList', aesutil.encrypt(JSON.stringify(paySuccessList)))
        } else {
          const arr = []
          arr.push(this.infoData)
          $localStorage.set('paySuccessList', aesutil.encrypt(JSON.stringify(arr)))
        }
      },
      countDownEnd() {
        toast('该订单已超时')
        this.payBtnStatus = false
        this.unSubscribe()
      },
      unSubscribe() {
        Vue.$global.bus.$emit('merchantOrderidUnsubscribe')
        this.hasSubscribe = false
      }
    },
    created() {
      if (_.isMobile()) {
        this.$router.replace({
          name: 'mCashDesk', query: {
            amount: this.infoData.amount,
            assetCode: this.infoData.assetCode,
            merchantId: this.infoData.merchantId,
            merchantOrderid: this.infoData.merchantOrderid,
            merchantCallbackurl: this.infoData.merchantCallbackurl,
            sign: this.infoData.sign,
            notifyUrl: this.infoData.notifyUrl,
            token: this.token,
            bindUserid: this.infoData.bindUserid,
            bindPhone: this.infoData.bindPhone,
            bindName: this.infoData.bindName,
            bindAreacode: this.infoData.bindAreacode,
            bindUserLevel: this.infoData.bindUserLevel,
            spareFields: this.infoData.spareFields,
          }
        })
      }
      let paySuccessList = $localStorage.get('paySuccessList') //获取本地支付成功列表
      if (!_.isUndefined(paySuccessList) && !_.isNull(paySuccessList)) {
        paySuccessList = JSON.parse(aesutil.decrypt(paySuccessList))
        const info = paySuccessList.find((item) => {
          return item.merchantOrderid === this.infoData.merchantOrderid
        })
        if (info) {
          console.log(info)
          Object.assign(this.infoData, info)
          this.cashSuccess = true
        }
      }
      this.infoData.businessName = merchantCfg.getDeail(this.infoData.merchantId).name

      if (this.islogin) {
        this.infoData.customerAddress = this.userData.accountChainVos[0].address
      }
    },
    mounted() {
      if (!this.cashSuccess && !_.isMobile()) {
        this.init()
        Vue.$global.bus.$on('cash:payPassword', (pwd) => {
          this.pay(pwd)
        })
        Vue.$global.bus.$on('update:paying', () => {
          this.qrCodeStatus = 1
        })
        Vue.$global.bus.$on('update:paySuccess', () => {
          this.cashSuccess = true
          this.saveLocal()
          this.unSubscribe()
        })
      }
    },
    beforeDestroy() {
      Vue.$global.bus.$off('cash:payPassword')
      Vue.$global.bus.$off('update:paying')
      Vue.$global.bus.$off('update:paySuccess')
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    height: 100%;
    min-height: 100%;
    background: #f7f7f7;
    color: #616161;
  }

  .clear {
    clear: both;
  }

  .blue {
    color: #138bd9;
  }

  .red {
    color: #ff0000;
  }

  .orange {
    color: #ff9200;
  }

  .gray {
    color: #909090;
  }

  .text-right {
    text-align: right;
  }

  .header {
    width: 100%;
    height: 96px;
    background: rgba(255, 255, 255, .99);
    border-bottom: 1px solid #e3e3e3;
  }

  .header-in, .content {
    width: 1200px;
    margin: 0 auto;
  }

  .header-in {
    overflow: hidden;
  }

  .logo {
    margin-top: 20px;
  }

  .logo-left {
    float: left;
    display: flex;
    justify-content: center;
    .title {
      font-size: 24px;
      color: #333333;
      margin-left: 15px;
      margin-top: 30px;
    }
    .line {
      margin-left: 15px;
      height: 40px;
      width: 1px;
      background: #666666;
      margin-top: 28px;
    }
    .des {
      font-size: 24px;
      color: #999999;
      margin-left: 15px;
      margin-top: 30px;
    }
  }

  .logo-right {
    float: right;
    margin-top: 40px;
  }

  .book-box {
    padding: 40px 0;
  }

  .book-box .p0 {
    line-height: 37px;
  }

  .book-box .p-txt1 {
    font-size: 18px;
  }

  .book-box .p-txt2,
  .book-box .p-txt3 {
    font-size: 20px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .otherPay {
    font-size: 16px;
  }

  .shop-user {
    font-size: 18px;
  }

  .content02 {
    background: #fff;
    padding: 25px 0;
    /*overflow: hidden;*/
    text-align: center;
    margin: 0 auto 50px;
    box-shadow: 0 5px 5px 5px #efefef;
    border-radius: 5px;
    height: 660px;
  }

  .content02 .c-l {
    float: left;
    width: 498px;
    padding: 0 30px 45px 69px;
    font-weight: lighter;
    font-size: 20px;
    border-right: 1px solid #e6e6e6;
    margin: 105px 0 60px 0;
  }

  .content02 .c-r {
    float: left;
    width: 700px;
    text-align: center;
  }

  .login-pay {
    width: 150px;
    margin: 15px auto;
    cursor: pointer;
  }

  .footer {
    width: 100%;
    background: #464646;
    padding: 42px 0;
    height: 60px;
    /*position: fixed;*/
    /*bottom: 0;*/
  }

  .footer-in {
    text-align: center;
    width: 460px;
    margin: 0 auto;
    font-size: 18px;
    color: #a5a5a5;
  }
</style>
