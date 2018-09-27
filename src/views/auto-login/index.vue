<template>
  <div class="main">
    <div v-if="!showTip">
      {{!withdrawTip ? '正在跳转...' : '提款审核中，请稍后...'}}
    </div>
    <div v-else>
      对不起！您的授权码已经失效，请在商户页刷新再试一下！
      <div class="back-link" v-if="backURL && isMobile">{{countDownTime}}s后自动返回商户 <a class="c-blue" :href="backURL">立即返回</a></div>
    </div>
  </div>
</template>

<script>
  import aesutil from '@/util/aesutil';
  import {$localStorage} from '@/util/storage'
  import {
    login
  } from 'api/show'
  export default {
    name: "index",
    data(){
      return{
        showTip:false,
        token: this.$route.query.token,
        merchantId: this.$route.query.merchantId,
        nodeId: this.$route.query.nodeId,   //定制版需要的参数 nodeId
        mode: this.$route.query.mode, //定制版需要的参数 mode=1, 打开钱包到首页，mode=2 打开快速买币， mode=3 打开快速卖币
        backURL: this.$route.query.backURL,  //定制版需要的参数 商户返回地址
        menuStyle: this.$route.query.menuStyle, //定制版皮肤颜色 logo等参数集合
        amount: this.$route.query.amount,// 定制版 用户快速卖币金额
        bankNo: this.$route.query.bankNo,// 定制版 银行卡号
        withdraw: this.$route.query.withdraw, //定制版 提现标识
        merchantOrderId: this.$route.query.merchantOrderId, //定制版 提现订单id
        withdrawTip:false, //定制版 提现提示
        countDownTime:30,//倒计时
        isMobile: _.isMobile(),
      }
    },
    beforeCreate(){
      $localStorage.remove('tokenInfo');
      $localStorage.remove('userData');
      this.$store.commit('INIT_STATE')
      this.$store.commit('CHECK_ONLINE', false);
    },
    created(){
      // this.$store.dispatch('LOGIN_OUT', false)
      if(!_.isUndefined(this.backURL)){
        $localStorage.set('backURL', JSON.stringify(this.backURL))
      }
      if(!_.isUndefined(this.menuStyle)){
        const style = JSON.parse(_.b64DecodeUnicode(this.menuStyle))
        $localStorage.set('menuStyle', JSON.stringify(style))
        // const styleText = `.main-bg-color{background-color: ${style.mainColor} !important;}
        //                     .main-color{color:${style.mainColor} !important;}
        //                     .sec-bg-color{background-color: ${style.secColor} !important;}
        //                     .sec-color{color:${style.secColor} !important;}`
        // _.loadCssCode(styleText)
      }
      const request = {
        type:11,
        token: this.token,
        merchantId: this.merchantId
      }
      console.log(request)
      login(request).then(res => {
        if(res.code === 10000){
          $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
          this.$store.commit('SET_USERDATA',res.data);
          this.$store.dispatch('CHECK_ONLINE', true);
          this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
          this.$store.dispatch("GET_BANKCARD");
          _.initRongyun()
          // if(this.nodeId && this.nodeId > 10000){
          //   this.saveCustomUser(res.data)
          // }
          if(this.withdraw && this.withdraw === 'true'){
            _.merchantOrderidWs(this.merchantOrderId)
            const data = {
              amount: this.amount,
              bankNo: this.bankNo
            }
            $localStorage.set(`withdraw_${res.data.userId}`,
              aesutil.encrypt(JSON.stringify(data)))
          }
          this.jumpLink(true)
        }else{
          toast(res.message)
          if(this.nodeId && Number(this.nodeId) > 10000){
            this.showTip = true
            if(this.isMobile && this.backURL && !_.isUndefined(this.backURL)){
              this.conutDown()
            }
          }else{
            $localStorage.set('needBind', aesutil.encrypt(JSON.stringify({merchantId: this.$route.query.merchantId})));
            this.$store.dispatch('LOGIN_OUT')
            this.jumpLink(false)
          }
        }
      }).catch(err => {
        toast(err)
        if(this.nodeId && Number(this.nodeId) > 10000){
          this.showTip = true
          if(this.isMobile && this.backURL && !_.isUndefined(this.backURL)){
            this.conutDown()
          }
        }else{
          this.jumpLink(false)
        }
      })
    },
    methods:{
      jumpLink(success){
        // const tranAddress = _.isMobile() ? (!_.isUndefined(this.mode) && Number(this.mode) > 1 ? 'mPendingBuy' : 'mIndex') : 'transaction'
        let tranAddress = ''
        if(_.isMobile()){
          if(!_.isUndefined(this.mode) && Number(this.mode) > 1){
            if(Number(this.mode) === 4){
              tranAddress = 'activityIndex'
            }else{
              tranAddress = 'mPendingBuy'
            }
          }else{
            tranAddress = 'mIndex'
          }
        }else{
          if(Number(this.mode) === 4){
            tranAddress = 'activityIndex'
          }else{
            tranAddress = 'transaction'
          }
        }
        const loginAddress = _.isMobile() ? 'mobileLogin' : 'aindex'
        if(success){
          if(!_.isUndefined(this.mode)){
            const query = {mode: this.mode}
            if(this.withdraw && this.withdraw === 'true'){
              // Object.assign(query,{
              //   withdraw: this.withdraw
              // })
              this.$store.commit('GET_WIDTHDRAW',true)
            }
            this.$router.replace({name:tranAddress,query})
          }else{
            this.$router.replace({name:tranAddress})
          }
        }else{
          this.$router.replace({name:loginAddress})
        }
      },

      saveCustomUser(data){   //多账号切换   存储该账号必要信息
        const customUserList = $localStorage.get('customUserList')
        const customUserInfo = {
          merchantId: this.merchantId,
          icon: JSON.parse(_.b64DecodeUnicode(this.menuStyle)).icon,
          accessToken: data.tokenVo.accessToken,
          nickname: data.nickname
        }
        let arr = []
        if(!_.isUndefined(customUserList)){
          arr = JSON.parse(aesutil.decrypt(customUserList, true))
        }
        arr.push(customUserInfo)
        $localStorage.set('customUserList', aesutil.encrypt(JSON.stringify(arr), true))
      },
      conutDown(){
        setTimeout(() => {
          this.countDownTime -= 1
          if(this.countDownTime === 0){
            window.location.href = this.backURL
          }
          this.conutDown()
        },1000)
      }
      // merchantWithdrawal(){ //商户提款
      //   Vue.$global.bus.$on('update:withdrawSuccess',() => {
      //     this.jumpLink(true)
      //   });
      //   _.merchantOrderidWs(this.merchantOrderId)
      //   this.withdrawTip = true
      //   setTimeout(() => {
      //     window.opener = null;
      //     window.open('', '_self');
      //     window.close()
      //   },3600000)
      // }

    },
  }
</script>

<style lang="scss" scoped>
  .main{
    position: absolute;
    width: 80%;
    left: 10%;
    text-align: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .back-link{
    margin-top: 5%;
  }
</style>