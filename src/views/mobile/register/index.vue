<template>
  <div class="mobile-register">
      <m-header>{{$t('register.title')}}</m-header>

      <div class="register-content">
        <ul class="mobile-navtabs mregister-nav cfx">
          <li v-for="item in registerType" @click="registerItem=item.value" class="s" :class="{active:registerItem==item.value}" :key="item.value">
            {{generateTitle(item.name)}}
          </li>
        </ul>
        <div class="mobile-form-box form-box-phone">
          <div class="form-group cfx" v-if="registerItem=='phone'">
            <p class="iconfont icon-mobile"></p>
            <div class="form-input">
              <label class="form-subtitle">手机号</label>
              <select class="select-country"  v-model="data.areaCode">
                <option v-for="areacd in areaCodeData" :value="areacd.value" :key="areacd.value" > {{areacd.name}} </option>
              </select>
              <input type="text" class="ps-input ps-input1 mobile-input" v-model="data.phone" :placeholder="$t('register.inputPlaceholder1')" maxlength="20" />
            </div>

          </div>
          <div class="form-group cfx" v-if="registerItem=='email'">
            <p class="iconfont icon-login-email"></p>
            <div class="form-input">
              <label class="form-subtitle">邮箱</label>
              <input type="text" class="ps-input ps-input1" v-model="data.email" :placeholder="$t('register.inputPlaceholder0')"  />
            </div>
          </div>
          <div class="form-group cfx">
            <p class="iconfont icon-verifcode"></p>
            <div class="form-input  posit-rel">
              <label class="form-subtitle">{{$t('register.Code')}}</label>
              <input type="text" autocomplete="off" class="ps-input ps-input1"
                   v-model="data.imageCode" :placeholder="$t('register.inputPlaceholder2')" maxlength="16" />
              <a href="javascript:;" @click.prevent="getCaptcha" class="captcha-code">
                {{$t('register.sendCode')}}</a>
            </div>
          </div>
          <div class="form-group cfx">
            <p class="iconfont icon-password"></p>
            <div class="form-input posit-rel">
                <label class="form-subtitle">{{$t('register.password')}}</label>
                <input ref="regpwd" type="password" autocomplete="off" class="ps-input ps-input1"
                   v-model="data.password" :placeholder="$t('register.inputPlaceholder3')" maxlength="16" />
                <eyes :dom="$refs.regpwd"></eyes>
            </div>
          </div>
          <div class="form-group cfx">
            <p class="iconfont icon-password"></p>
            <div class="form-input posit-rel">
               <label class="form-subtitle again-pwd">{{$t('register.AgainPassword')}}</label>
               <input ref="regconfpwd" type="password" autocomplete="off" class="ps-input ps-input1"
                   v-model="data.confirmPassword" :placeholder="$t('register.inputPlaceholder4')" maxlength="16" />
               <eyes :dom="$refs.regconfpwd"></eyes>
            </div>
          </div>

          <input type="submit" class="submit btn btn-block" @click="register" id="submit_user" :value="$t('register.register')">
          <div class="link-group cfx">
            <router-link :to="{name:'mobileLogin'}" class="link-register fr">{{$t('register.loginNow')}}</router-link>
          </div>
        </div>
      </div>

  </div>
</template>
<script>
  import { show } from 'api'
  import { generateTitle } from '@/util/i18n'
  import eyes from "components/eyes"
  import mHeader from "components/m-header"
  import check from "@/util/RegExp"
  import {mapGetters,mapActions,mapMutations} from 'vuex'
  import {$localStorage, $sessionStorage} from '@/util/storage'
  import aesutil from '@/util/aesutil';

  export default {
    props: {
      value: Boolean
    },
    data() {
      return {
        registerType:[
          {name: "register.phoneReg", value: "phone"},
          {name: "register.emailReg", value: "email"}
        ],
        registerItem: 'email',
        areaCodeData: [
          {name:"+63", value: "+63" },
          {name:"+86", value: "+86" }
        ],
        data: {
          phone: "", //true string
          email: "", //true string
          imageCode: "", //true string
          password: "", //true string
          confirmPassword: "",// true string
          areaCode:"+86"
        },
        requestdata: {}
      }
    },
    methods: {
      generateTitle,
      ...mapMutations(["SHOW_LOGIN"]),
      checked() {
          if(this.registerItem =='email'){
            if (!this.data.email || this.data.email==''){
              toast("邮箱地址不允许为空");
            }else if (!check.email.test(this.data.email)) {
              toast("邮箱地址格式不正确");
            }else if (!this.data.imageCode || this.data.imageCode==''){
              toast("验证码不能为空");
            }else if (!this.data.password || this.data.password==''){
              toast("请输入密码");
            }else if (!this.data.confirmPassword || this.data.confirmPassword==''){
              toast("请输入确认密码");
            }else {
              return true;
            }
          }else{
            if (!this.data.phone || this.data.phone==''){
              toast("手机号不允许为空");
            }else if (!this.data.imageCode || this.data.imageCode==''){
              toast("验证码不能为空");
            }else if (!this.data.password || this.data.password==''){
              toast("请输入密码");
            }else if (!this.data.confirmPassword || this.data.confirmPassword==''){
              toast("请输入确认密码");
            }else {
              return true;
            }
          }
      },
      register() {
        if(this.registerItem =='email'){
          this.requestdata={
            email: this.data.email,
            emailMgs: this.data.imageCode, //true string
            password: this.data.password, //true string
          }
        }else{
          this.requestdata={
            phone: this.data.phone,
            areaCode:this.data.areaCode,
            phoneMgs: this.data.imageCode, //true string
            password: this.data.password, //true string
          }
        }
        if (!this.checked()) return;
        show.register(this.requestdata).then(res => {
            if(res.code == 10000){
              console.log('register success :', res);
              this.$emit('input',false);
              this.SHOW_LOGIN(false);
              $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo));
              $localStorage.set('userData', JSON.stringify(aesutil.encrypt(res.data.userId)));
              this.$store.dispatch('CHECK_ONLINE', true);
              this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo);
              this.$store.dispatch('INIT_INFO');
              this.$store.commit('SET_USERDATA',res.data);
              this.$router.replace({name: 'mIndex'});
              _.initRongyun()
            }else{
              toast(res.message);
            }
        }).catch(err => {
          toast(err.message);
        });
      },
      getCaptcha(e) {
        // 发送验证码  判断是否输入手机号或者邮箱号
        //this.authImg = getAuthImg();
        if(this.registerItem =='email'){
          if (!this.data.email || this.data.email==''){
            toast("邮箱地址不允许为空");
          }else if (!check.email.test(this.data.email)) {
            toast("邮箱地址格式不正确");
          }else{
            this.requestdata={
              email: this.data.email, //true string
              type: "1", //true string
            }

            show.sendEmailCode(this.requestdata).then((res) => {
              if (res.success) {
                toast(res.message);
                this.$router.push({name: 'transaction'});
              } else {
                console.log(res.message)
                toast(res.message);
              }

            }).catch(err => {

            });

          }
        }else{
          if (!this.data.phone || this.data.phone==''){
            toast("手机号不允许为空");
          }else{
            this.requestdata={
              phone: this.data.phone,
              type: "1",
              areaCode:this.data.areaCode
            }

            show.sendCode(this.requestdata).then((res) => {

              if (res.success) {
                toast('恭喜，您已注册成功');
                this.$router.push({name: 'transaction'});
              } else {
                console.log(res);
                toast(res.message);
              }
            }).catch(err => {
              alert(err);
              toast(err.message);
            });
          }
        }
      }

    },
    components: {
      eyes, mHeader
    }
  }
</script>
<style lang="scss">
  @import "~assets/scss/mobile";

</style>
