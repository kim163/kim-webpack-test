<template>
  <div class="login-pay-main">
    <div class="pay-top">
      <p class="title">久安账号支付</p>
      <p class="bind-text" v-if="showBindLink">还没绑定久安？
        <router-link
                :to="{name: 'pcUserBind',
                  query:{
                          merchantId: data.merchantId,
                          callBackUrl: data.notifyUrl,
                          merchantUserName: data.bindUserid,
                          notifyUrl: data.merchantCallbackurl}}"
                class="go-bind" target="_blank">立即绑定</router-link></p>
    </div>
    <div class="pay-content">
      <cash-login v-if="!islogin"></cash-login>
      <cash-pay v-else :pay-info="data"></cash-pay>
    </div>
  </div>
</template>

<script>
  import CashLogin from './cash-login'
  import CashPay from './cash-pay'

  import {mapGetters} from 'vuex'

  import {login} from 'api/show'
  import aesutil from '@/util/aesutil';
  import {$localStorage} from '@/util/storage'

  export default {
    name: "login-pay",
    data(){
      return{
        showBindLink: false
      }
    },
    computed:{
      ...mapGetters([
        "userData",
        "islogin",
        "userId"
      ]),
    },
    watch:{
      islogin(){
        this.checkToken()
      }
    },
    props:{
      data:{
        type:Object,
        default:{}
      },
      token:{
        type:String,
        default:''
      }
    },
    components:{
      CashLogin,
      CashPay
    },
    methods:{
      tokenLogin() {//用授权码登录
        const request = {
          type: 11,
          token: this.token,
          merchantId: this.data.merchantId
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
            $localStorage.set('needBind', aesutil.encrypt(JSON.stringify({merchantId: this.data.merchantId})));
          }
        }).catch(err => {
        })
      },
      checkToken(){
        if(this.islogin && (this.token === '' || _(this.token).isUndefined() || this.token === 'undefined')){
          this.showBindLink = true
        }
      }
    },
    created() {
      if (!this.islogin && this.token != ''  && !_(this.token).isUndefined() && this.token != 'undefined') {
        this.tokenLogin()
      }else {
        this.checkToken()
      }
    },
  }
</script>

<style lang="scss" scoped>

  .login-pay-main{
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: left;
    align-items: center;
    padding-top: 100px;
    font-weight: lighter;
    .pay-top{
      height: 76px;
    }
    .title{
      font-weight: lighter;
      font-size: 26px;
      padding: 8px 0;

    }
    .bind-text{
      font-size: 20px;
      .go-bind{
        color: #FF0000;
      }
    }
    .pay-content{
      margin-top: 20px;
    }
  }
  .right-container{
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    /*padding-top: 100px;*/
  }
</style>