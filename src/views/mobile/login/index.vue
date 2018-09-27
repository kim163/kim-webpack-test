<template>
  <div class="mobile-login">
      <m-header>{{$t('login.title')}}</m-header>

      <div class="login-content">
        <ul class="mobile-navtabs cfx">
          <li v-for="item in loginType" @click="loginItem=item.value" class="s" :class="{active:loginItem==item.value}" :key="item.value">
            {{generateTitle(item.name)}}
          </li>
        </ul>
        <div class="mobile-form-box form-box-phone">
          <div class="form-group cfx" v-show="loginItem=='account'">
             <p class="iconfont icon-useravat"></p>
             <div class="form-input">
                <label class="form-subtitle">{{$t('login.username')}}</label>
                <input name="account" @keyup.enter="login" v-model="data.account" type="text" class="ps-input ps-input1" :placeholder="$t('login.usernamePhd')">
             </div>
          </div>
          <div class="form-group cfx" v-show="loginItem=='phone'">
            <p class="iconfont icon-mobile"></p>
            <div class="form-input">
               <label class="form-subtitle">手机号</label>
               <select class="select-country" v-model="data.areaCode">
                     <option v-for="areacd in areaCodeData" :value="areacd.value" :key="areacd.value" > {{areacd.name}} </option>
               </select>
               <input type="text" class="ps-input ps-input1 mobile-input" v-model="data.phone"
                   :placeholder="$t('login.mobileNumPhd')" maxlength="11" name="phone">
            </div>
          </div>
          <div class="form-group cfx" v-show="loginItem=='email'">
            <p class="iconfont icon-login-email"></p>
            <div class="form-input">
               <label class="form-subtitle">邮箱</label>
               <input name="email" @keyup.enter="login" v-model="data.email" type="text" class="ps-input ps-input1" :placeholder="$t('login.emailaddPhd')">
            </div>
          </div>
          <div class="form-group cfx">
            <p class="iconfont icon-password"></p>
            <div class="form-input posit-rel">
              <label class="form-subtitle">{{$t('login.password')}}</label>
              <input ref="pwd" @keyup.enter="login" name="password" v-model="data.password" type="password" class="ps-input ps-input1" :placeholder="$t('login.passwordPhd')">
               <eyes :dom="$refs.pwd"></eyes>
            </div>
          </div>

          <input type="button" class="submit btn btn-block" @click="login" id="submit_user" :value="$t('login.logIn')">
          <div class="link-group">
            <a href="javascript:void(0);" class="forget-btn hide">{{$t('login.forgotpwd')}}</a>
            <router-link :to="{name:'mobileRegister'}" class="link-register fr">注册账户</router-link>
          </div>
        </div>
      </div>


  </div>
</template>
<script>
  import { show } from 'api'
  import eyes from "components/eyes"
  import mHeader from "components/m-header"
  import {$localStorage, $sessionStorage} from '@/util/storage'
  import { generateTitle } from '@/util/i18n'
  import aesutil from '@/util/aesutil';
  import {mapGetters,mapActions,mapMutations} from 'vuex'
  import check from "@/util/RegExp"

  export default {
    data(){
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
    mounted(){

      this.$nextTick(()=>{
        var jiangnan = document.getElementById('demoImg')
        console.log(jiangnan)
      })
    },
    props: {
      value: Boolean
    },
    watch:{

    },
    methods:{
      generateTitle,
      ...mapMutations(["SHOW_LOGIN"]),
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
            this.$emit('input',false);
            this.$store.commit('SHOW_LOGIN',false);
            $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
            //$localStorage.set('userData', aesutil.encrypt(JSON.stringify(res.data)));
            this.$store.dispatch('CHECK_ONLINE', true);
            this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
            this.$store.dispatch('INIT_INFO');
            this.$store.commit('SET_USERDATA',res.data);
             _.checkUserBind({userId: res.data.userId})
            _.initRongyun()
            this.$router.replace({name: 'mIndex'});
          }else {
            toast(res.message);
          }
          console.log('user login:', res);
        }).catch(err => {
          toast(err);
        })
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
          }else if (!check.email.test(this.data.email)) {
            toast("您输入的电子邮箱格式不正确");
          }else if(this.data.password=="" || !this.data.password){
            toast("请您输入密码");
          }else {
            return true;
          }
        }
      }
    },
    created(){

    },
    computed: {

    },
    components:{
       eyes, mHeader
    }
  };
</script>
<style lang="scss">
  @import "~assets/scss/mobile";

  .forget-btn{
     font-size: 18px;
     color: #4c74ed !important;
  }

</style>
