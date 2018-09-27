<template>
  <div class="header ">
    <div v-if="!islogin && !isCustomize" class="cfx">
      <div class="col-2">
        <a href="javascript:void(0);" @click="showLoginEvt">{{$t('navbar.login')}}</a>
      </div>
      <div class="col-2">
        <a href="javascript:void(0);" @click="showRegisterDialog=true">{{$t('navbar.register')}}</a>
      </div>
    </div>
    <div v-if="islogin" class="islogin-part">
      <span class="islogin-info login-user">
        {{$t('navbar.nickName')}}：{{userData.nickname}}
      </span>
      <span class="balance-part">
        {{$t('navbar.accountBalance')}}：<balance></balance>
      </span>
      <router-link :to="{name:'pcUserCenter'}" class="info-item link-item">
        <i class="iconfont icon-useravat"></i>
        {{$t('navbar.userCenter')}}
      </router-link>
      <span class="login-line"></span>
      <login-app v-if="isCustomize"></login-app>
      <a href="javascript:void(0);" v-if="userData.nodeId < 10000" @click="$store.dispatch('LOGIN_OUT')" class="btn-other">{{$t('navbar.logOut')}}</a>
    </div>
    <v-login @loginGoReg="showRegisterDialog=true" v-if="!islogin" v-model="showLoginDialog"></v-login>
    <v-register @showLogin="showLoginEvt" v-if="!islogin" v-model="showRegisterDialog"></v-register>

  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import vLogin from "components/auth/login"
  import vRegister from "components/auth/register"
  import {SETTING} from "@/assets/data"
  import balance from 'components/balance';
  import LoginApp from './login-app'

  export default {
    data() {
      return {
        SETTING,
        showLoginDialog: false,
        showRegisterDialog: false,
        isCustomize: _.customize()
      };
    },
    methods: {
      showLoginEvt() {
        if (!this.showLoginDialog) {
          this.showLoginDialog = true;
        }
      },

    },
    watch: {
      showLogin(val){
        if(!this.isCustomize){
          this.showLoginDialog = val;
        }
      }
    },
    computed: {
      ...mapGetters(["userData", "islogin", "showLogin"])
    },
    created() {
      if(this.showLogin){
        if(!this.isCustomize){
          this.showLoginDialog = true;
        }
      }else {
        this.showLoginDialog = false;
      }
    },
    components: {
      vLogin,
      vRegister,
      balance,
      LoginApp,
    }

  };
</script>
<style lang="scss">

  .header {
    a.link-item{
      display: inline-block;
    }
    .xuanzhuan {
      animation: rotate11 2s linear infinite;
      display: inline-block;
    }
    display: inline-block;
    .fl > a {
      margin: 0 15px;
    }
    .islogin-part{
      height: 50px;
      line-height: 50px;
      font-size: 18px;
    }
    .islogin-info {
      background: url('~images/user.png') no-repeat left center;
      padding-left: 45px;
      display: inline-block;
      color: #333;
      position: relative;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      max-width:230px;
      float: left;
      margin-right: 12px;
    }
   .balance-part{
     margin-right: 12px;
   }
    .login-line{
      width: 2px;
      height: 25px;
      background-color: #c9daff;
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
    }
    .login-form {
      line-height: 27px;
      display: inline-block;
    }
    .login-form p {
      border: 1px solid #293758;
      padding-left: 60px;
      padding-right: 5px;
      display: inline-block;
      margin-right: 9px;
      vertical-align: middle;
      position: relative;
      height: 25px;
      width: 135px;
    }
    .login-form p input {
      color: #a4a3a7;
      width: 100%;
      background: none;
      height: 25px;
      outline: none;
      vertical-align: top;
    }
    .login-form p label {
      position: absolute;
      left: 9px;
      top: 0px;
      line-height: 25px;;
    }
    .login-form p.identifying-code {
      width: 145px;
      padding-left: 85px;
    }
    .login-form .btn {
      display: inline-block;
      width: 68px;
      height: 24px;
      line-height: 22px;
      border: 1px solid #ff4242;
      background: #d90000;
      color: #fff;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      vertical-align: middle;
    }
    .login-form .btn-register {
      background: #ffd300;
      border-color: #ffcb5a;
      margin-left: 6px;
      color: #121212;
    }
    .free-try-play {
      display: inline-block;
      margin: 0 17px;
      vertical-align: middle;
    }
    .cl-yelow {
      color: #ffd924 !important;
    }
    .cl-red {
      color: #ff1e1e !important;
    }

    .btn-other {
      border:1px solid #14171a;
      display: inline-block;
      height: 26px;
      line-height: 26px;
      position: relative;
      padding: 0 14px;
      font-size: 14px;
      margin-left: 10px;
      text-align: center;
      border-radius: 3px;
      font-weight: 500;
    }
    .server {
      margin: 0;
      animation: flashs 0.6s infinite;;
    }
    @keyframes flashs {
      0% {
        color: #f00;
      }
      100% {
        color: yellow;
      }
    }
    .header-fast-btn {
      display: inline-block;
      margin: 0 6px;
    }
  }

  .nav-start {
    .islogin-info {
      color: #fff;
    }
    .balance-part{
      color: #fff;
    }
  }

  @media(max-width: 1330px) {
    .navbar .link-part .col-2 a {
      font-size: 18px;
    }
    .navbar .link-part .lang-icons a {
      font-size: 16px;
      padding: 4px 10px;
      -webkit-border-radius: 35px;
      -moz-border-radius: 35px;
      border-radius: 35px;
      display: block;
    }
  }

  @media(max-width: 1072px) {

    .nav-start .nav-logo-link {
      width: 50px;
    }
  }
</style>
