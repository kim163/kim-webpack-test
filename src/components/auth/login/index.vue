<template>
  <div>
  <div class="modal fade in" v-show="value">
    <div class="modal-dialog popup">
      <div type="button" class="close" @click="$emit('input',false)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="pop-content">
        <h2 class="alert-title">{{$t('login.title')}}</h2>
        <ul class="pop-tab tab-box">
          <li v-for="item in loginType" @click="loginItem=item.value" class="s" :class="{active:loginItem==item.value}" :key="item.value">
            {{generateTitle(item.name)}}
          </li>
        </ul>
        <div class="form-box form-box-phone">
          <div class="form-group" v-show="loginItem=='account'">
             <label class="form-subtitle">{{$t('login.username')}}</label>
             <div class="form-input">
                <input name="account" @keyup.enter="login" v-model="data.account" type="text" class="ps-input ps-input1" :placeholder="$t('login.usernamePhd')">
             </div>
            </div>
          <div class="form-group" v-show="loginItem=='phone'">
            <label class="form-subtitle">{{$t('login.mobileNum')}}</label>
            <div class="form-input">
               <select class="select-country" v-model="data.areaCode">
                     <option v-for="areacd in areaCodeData" :value="areacd.value" :key="areacd.value" > {{areacd.name}} </option>
               </select>
               <input type="text" class="ps-input ps-input1 ps-phoneput" v-model="data.phone"
                   :placeholder="$t('login.mobileNumPhd')" maxlength="11" name="phone">
            </div>
          </div>
          <div class="form-group" v-show="loginItem=='email'">
            <label class="form-subtitle">{{$t('login.emailadd')}}</label>
            <div class="form-input">
               <input name="email" @keyup.enter="login" v-model="data.email" type="text" class="ps-input ps-input1" :placeholder="$t('login.emailaddPhd')">
            </div>
          </div>
          <div class="form-group">
            <label class="form-subtitle">{{$t('login.password')}}</label>
            <div class="form-input posit-rel">
              <input ref="pwd" @keyup.enter="login" name="password" v-model="data.password" type="password" class="ps-input ps-input1" :placeholder="$t('login.passwordPhd')">
               <eyes :dom="$refs.pwd"></eyes>
            </div>
          </div>

          <span class="validate"></span>
          <input type="button" class="submit btn btn-block" @click.enter="login" id="submit_user" :value="$t('login.logIn')">
          <div class="link-fogroup">
            <a href="javascript:void(0);" class="forget-btn" @click="openFindPWD">{{$t('login.forgotpwd')}}</a>
            <span class="right-part fr">
              还没有久安账户？<a href="javascript:void(0);" class="register-btn" @click="loginGoRegEvt" >立即注册</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

    <forget-password v-show="showPass"  @hide="showPass=false"></forget-password>
  </div>
</template>
<script>
  import { show } from 'api'
  import forgetPassword from "components/password/forget-password"
  import eyes from "components/eyes"
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
        showPass:false,
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
    props: {
      value: {
        type:Boolean,
        default: false
      }
    },
    watch:{

    },
    methods:{
      generateTitle,
      ...mapMutations(["SHOW_LOGIN"]),
      openFindPWD(findType){
        this.showPass=true;
        this.$emit('input',false);
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
            this.$emit('input',false);
            this.SHOW_LOGIN(false);
            console.log(this.$route)
            // const rquest = this.$route.name;
            $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
            //$localStorage.set('userData', aesutil.encrypt(JSON.stringify(res.data)));
            this.$store.dispatch('CHECK_ONLINE', true);
            this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
            this.$store.dispatch('INIT_INFO');
            this.$store.commit('SET_USERDATA',res.data);
            _.checkUserBind({userId: res.data.userId})
            _.initRongyun()
            // this.$router.push({path:rquest});
          }else {
            toast(res.message);
          }
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
      },
      loginGoRegEvt(){
        this.$emit('input',false);
        this.$emit('loginGoReg');
      }
    },
    created(){

    },
    computed: {

    },
    components:{
      forgetPassword, eyes
    }
  };
</script>
<style lang="scss" scoped>

</style>
