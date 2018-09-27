<template>
  <div>
    <div class="login-box">
      <ul class="pop-tab tab-box">
        <li v-for="item in loginType" @click="loginItem=item.value" class="tab-info" :class="{active:loginItem==item.value}"
            :key="item.value">
          {{generateTitle(item.name)}}
        </li>
      </ul>
      <div class="form-box form-box-phone">
        <div class="form-group" v-show="loginItem=='account'">
          <div class="form-input">
            <label class="form-subtitle">{{$t('login.jiuanUserName')}}：</label>
            <input name="account" @keyup.enter="login" v-model="data.account" type="text" class="ps-input ps-input1"
                   :placeholder="$t('login.usernamePhd')">
          </div>
        </div>
        <div class="form-group" v-show="loginItem=='phone'">
          <div class="form-input">
            <label class="form-subtitle">{{$t('login.mobileNum')}}：</label>
            <select class="select-country area-box" v-model="data.areaCode">
              <option v-for="areacd in areaCodeData" :value="areacd.value" :key="areacd.value"> {{areacd.name}}</option>
            </select>
            <input type="text" class="ps-input ps-input-phone" v-model="data.phone"
                   :placeholder="$t('login.mobileNumPhd')" maxlength="11" name="phone">
          </div>
        </div>
        <div class="form-group" v-show="loginItem=='email'">
          <div class="form-input">
            <label class="form-subtitle">{{$t('login.emailadd')}}：</label>
            <input name="email" @keyup.enter="login" v-model="data.email" type="text" class="ps-input ps-input1"
                   :placeholder="$t('login.emailaddPhd')">
          </div>
        </div>
        <div class="form-group">
          <div class="form-input posit-rel">
            <label class="form-subtitle">{{$t('login.loginPwd')}}：</label>
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
  </div>
</template>

<script>
  import { show } from 'api'
  import {$localStorage, $sessionStorage} from '@/util/storage'
  import {generateTitle} from '@/util/i18n'
  import aesutil from '@/util/aesutil';
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  export default {
    name: "pc-cash-login",
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
        const api = this.loginItem=='account' ? show.loginByUserNameAndPwd : show.login
        api(this.requestda).then(res => {
          if (res.code == 10000) {
            this.$emit('input',false);
            this.$store.commit('SHOW_LOGIN',false);

            $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
            $localStorage.set('userData', aesutil.encrypt(JSON.stringify(res.data)));
            this.$store.dispatch('CHECK_ONLINE', true);
            this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
            this.$store.dispatch('INIT_INFO');
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
  .tab-box {
    border-bottom: 0;
    display: flex;
    justify-content: space-between;
    .tab-info {
      display: inline-block;
      height: 40px;
      width: 30%;
      line-height: 40px;
      text-align: center;
      /*border: 1px solid #D8D8D8;*/
      background: #ffffff;
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
    width: 85%;
    height: 40px;
    background: #4982FF;
    color: #ffffff;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    margin-top: 30px;
    margin-left: 10%;
    cursor: pointer;
  }
  .go-app-pay{
    font-size: 14px;
    color: #333333;
    margin-top: 30px;
    cursor: pointer;
  }
  .text-center {
    text-align: center;
  }

  .ps-input {
    height: 40px;
    border: 1px solid #DEDEDE;
    padding: 0 10px;
    width: 344px;
    &.ps-input-phone{
      width: 258px;
      margin-left: 5px;
    }
  }

  .form-box-phone {
    border: 1px solid #DEDEDE;
    background: #ffffff;
    width: 500px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .area-box {
    background: #F4F7FF;
    border: 1px solid #4982FF;
    width: 76px;
    height: 40px;
    color: #4982FF;
    font-size: 15px;
    padding: 0 10px;
  }

  .form-group {
    /*padding:0 15px;*/
  }
  .form-input{
    margin: 10px 0px;
  }

  .form-subtitle {
    font-size: 15px;
    color: #333333;
    width: 20%;
    text-align: right;
    display: inline-block;
  }
</style>