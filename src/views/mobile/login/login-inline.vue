<template>
  <div class="m-login-box">
    <ul class="pop-tab tab-box">
      <li v-for="item in loginType" @click="loginItem=item.value" class="tab-info" :class="{active:loginItem==item.value}"
          :key="item.value">
        {{generateTitle(item.name)}}
      </li>
    </ul>
    <div class="form-box form-box-phone">
      <div class="form-group" v-show="loginItem=='account'">
        <label class="form-subtitle">{{$t('login.username')}}</label>
        <div class="form-input">
          <input name="account" @keyup.enter="login" v-model="data.account" type="text" class="ps-input ps-input1"
                 :placeholder="$t('login.usernamePhd')">
        </div>
      </div>
      <div class="form-group" v-show="loginItem=='phone'">
        <label class="form-subtitle">{{$t('login.mobileNum')}}</label>
        <div class="form-input">
          <select class="select-country area-box" v-model="data.areaCode">
            <option v-for="areacd in areaCodeData" :value="areacd.value" :key="areacd.value"> {{areacd.name}}</option>
          </select>
          <input type="text" class="ps-input ps-input-phone" v-model="data.phone"
                 :placeholder="$t('login.mobileNumPhd')" maxlength="11" name="phone">
        </div>
      </div>
      <div class="form-group" v-show="loginItem=='email'">
        <label class="form-subtitle">{{$t('login.emailadd')}}</label>
        <div class="form-input">
          <input name="email" @keyup.enter="login" v-model="data.email" type="text" class="ps-input ps-input1"
                 :placeholder="$t('login.emailaddPhd')">
        </div>
      </div>
      <div class="form-group">
        <label class="form-subtitle">{{$t('login.password')}}</label>
        <div class="form-input posit-rel">
          <input ref="pwd" @keyup.enter="login" name="password" v-model="data.password" type="password"
                 class="ps-input ps-input1" :placeholder="$t('login.passwordPhd')">
        </div>
      </div>
      <span class="validate"></span>
      <div class="text-center">
        <div class="next-btn" @click.enter="login">{{$t('cash.nextBtn')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { show } from 'api'
  import {$localStorage, $sessionStorage} from '@/util/storage'
  import {generateTitle} from '@/util/i18n'
  import aesutil from '@/util/aesutil';
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: "cash-login",
    data() {
      return {
        loginType:[
          {name: "login.accloginTitle", value: "account"},
          {name: "login.mobloginTitle", value: "phone"},
          {name: "login.emailloginTitle", value: "email"}
        ],
        loginItem: 'phone',
        areaCodeData: [
          {name:"+63", value: "+63" },
          {name:"+86", value: "+86" }
        ],
        showPass:false,
        showRig:false,
        ImgCode:"",
        isAgent:false,
        data:{
          account:"",
          phone:"",
          areaCode:"+86",
          email:"",
          password:""
        },
        requestda: {}
      }
    },
    methods: {
      generateTitle,
      reset(msg) {
        this.data.imageCode = ""
        toast(msg);
      },
      login() {
        if(!this.check())return;
        if(this.loginItem=='account'){
          this.requestda ={
            userName: this.data.account,
            password: this.data.password
          }
        }else if(this.loginItem=='phone'){
          this.requestda = {
            type:4,
            areaCode: this.data.areaCode,
            phone: this.data.phone,
            password: this.data.password
          }
        }else if(this.loginItem=='email'){
          this.requestda = {
            type:4,
            areaCode: this.data.areaCode,
            email: this.data.email,
            password: this.data.password
          }
        }
        const api = this.loginItem=='account' ?  show.loginByUserNameAndPwd : show.login
        api(this.requestda).then(res => {
          if (res.code == 10000) {
            // this.$emit('input',false);
            // this.$store.commit('SHOW_LOGIN',false);

            $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
            //$localStorage.set('userData', aesutil.encrypt(JSON.stringify(res.data)));
            this.$store.dispatch('CHECK_ONLINE', true);
            this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
            this.$store.commit('SET_USERDATA',res.data);
            _.checkUserBind({userId: res.data.userId})
          }else {
            toast(res.message);
          }
          console.log('user login:', res);
        }).catch(err => {
          toast(err.message);
        });
      },
      check() {
        if(this.loginItem=='account'){
          if(this.data.account=="" || !this.data.account){
            toast("请您输入用户名");
          }else if(this.data.password=="" || !this.data.password){
            toast("请您输入密码");
          }else {
            return true;
          }
        }else if(this.loginItem=='phone'){
          if(this.data.phone=="" || !this.data.phone){
            toast("请您输入电话号码");
          }else if(this.data.password=="" || !this.data.password){
            toast("请您输入密码");
          }else {
            return true;
          }
        }else if(this.loginItem=='email'){
          if(this.data.email=="" || !this.data.email){
            toast("请您输入邮箱");
          }else if(this.data.password=="" || !this.data.password){
            toast("请您输入密码");
          }else {
            return true;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  /* login */

  /* tab */
  .tab-box {
    border-bottom: 0;
    display: flex;
    justify-content: space-between;
    .tab-info {
      display: inline-block;
      height: r(40);
      width: 30%;
      line-height: r(40);
      text-align: center;
      border: 1px solid #D8D8D8;
      background: $white;
      color: #787876;
      cursor: pointer;
      &.active {
        /*border-bottom:3px solid #87b5ff;*/
        background: #4982FF;
        color: #fff;
        border-color: #4982FF;
      }
    }
  }
  .next-btn{
    width: 100%;
    height: r(40);
    background: #4982FF;
    color: $white;
    line-height: r(40);
    text-align: center;
    @include f(18px);
    margin-top: r(20);
  }

  .text-center {
    text-align: center;
  }

  .ps-input {
    height: r(40);
    border: 1px solid #DEDEDE;
    padding: 0 r(10);
    width: 100%;
    &.ps-input-phone{
      width: calc(100% - #{r(80)} - 6%);
      float: right;
    }
  }

  .form-box-phone {
    border: 1px solid #DEDEDE;
    padding: r(20);
    background: $white;
  }

  .area-box {
    background: #F4F7FF;
    border: 1px solid #4982FF;
    width: r(80);
    height: r(40);
    color: #4982FF;
    @include f(15px);
    padding: 0 3%;
    background: url("~images/select-up-down.svg") no-repeat scroll 90% center transparent;
    background-size: r(10) r(12);
  }

  .form-group {
    /*padding:0 15px;*/
  }
  .form-input{
    margin-top: r(10);
    margin-bottom: r(20);
  }

  .form-subtitle {
    @include f(15px);
    color: #333333;
  }
</style>
