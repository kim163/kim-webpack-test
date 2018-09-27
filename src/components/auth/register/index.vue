<template>
  <div class="modal fade in" v-show="value">
    <div class="modal-dialog popup">
      <div type="button" class="close" @click="$emit('input',false)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="pop-content">
        <h2 class="alert-title">{{$t('register.title')}} <span class="fr smalltxt">{{$t('register.hasAccount')}}？ <a class="a-login" @click="goLogin" >{{$t('register.loginNow')}}</a></span></h2>
        <div class="tab-box">
          <span v-for="item in registerType" @click="registerItem=item.value" class="s" :class="{active:registerItem==item.value}" :key="item.value">
            {{generateTitle(item.name)}}
          </span>
        </div>
        <div class="form-box form-box-phone">
          <div class="form-group" v-if="registerItem=='phone'">
            <p class="form-subtitle">{{$t('register.inputPhoneNum')}}</p>
            <div class="form-input">
              <select class="select-country"  v-model="data.areaCode">
                <option v-for="areacd in areaCodeData" :value="areacd.value" :key="areacd.value" > {{areacd.name}} </option>
              </select>
              <input type="text" class="ps-input cl-blue ps-phoneput" v-model="data.phone" :placeholder="$t('register.inputPlaceholder1')" maxlength="20" />
            </div>

          </div>
          <div class="form-group" v-if="registerItem=='email'">
            <p class="form-subtitle">{{$t('register.inputEmail')}}</p>
            <div class="form-input">
              <input type="text" class="ps-input" v-model="data.email" :placeholder="$t('register.inputPlaceholder0')"  />
            </div>

          </div>
          <div class="form-group">
            <p class="form-subtitle">{{$t('register.Code')}}</p>
            <div class="form-input posit-rel">
            <input ref="code" type="text" autocomplete="off" class="ps-input fl inpt-pwd"
                   v-model="data.imageCode" :placeholder="$t('register.inputPlaceholder2')" maxlength="16" />
              <a href="javascript:;" @click.prevent="getCaptcha" class="captcha-code">
                {{$t('register.sendCode')}}</a>
            </div>
          </div>
          <div class="form-group">
            <p class="form-subtitle">{{$t('register.password')}}</p>
            <div class="form-input posit-rel">
            <input ref="regconfpwd" type="password" autocomplete="off" class="ps-input fl inpt-pwd"
                   v-model="data.password" :placeholder="$t('register.inputPlaceholder3')" maxlength="16" />
            <eyes :dom="$refs.regconfpwd"></eyes>
            </div>
          </div>
          <div class="form-group">
            <p class="form-subtitle">{{$t('register.AgainPassword')}}</p>
            <div class="form-input posit-rel">
            <input ref="regpwd" type="password" autocomplete="off" class="ps-input fl inpt-pwd"
                   v-model="data.confirmPassword" :placeholder="$t('register.inputPlaceholder4')" maxlength="16" />
            <eyes :dom="$refs.regpwd"></eyes>
            </div>
          </div>
          <!--<div class="form-group">-->
            <!--<i class="iconfont icon-yanzhengma"></i>-->
            <!--<input type="text" class="ps-input ps-input2" v-model="data.imageCode" placeholder="验证码"-->
                   <!--maxlength="4">-->
            <!--<a href="javascript:;" class="captcha-code icon_popup">-->
              <!--<img @click="getimg" :src="authImg"></a>-->
          <!--</div>-->
          <div class="agreement hide">
            <input type="checkbox" checked>
            {{$t('register.readAgreenment')}} <a class="a-login">{{$t('register.agreenment')}}</a>
          </div>
          <span class="validate"></span>
          <input type="submit" class="submit btn btn-block" @click.prevent="register" id="submit_user" :value="$t('register.register')">
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { show } from 'api'
  import { generateTitle } from '@/util/i18n'
  import eyes from "components/eyes"
  import check from "@/util/RegExp"
  import {mapGetters,mapActions,mapMutations} from 'vuex'
  import {$localStorage, $sessionStorage} from '@/util/storage'

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
        show.register(this.requestdata).then((res) => {
            if(res.code == 10000){
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
      },
      getJsonInfo()  {
        // 国家
//        this.$http({
//          method: 'get',
//          url: '/country',
//          data: {
////            name: 'xiaoming',
////            info: '12'
//          }
//        })
      },
      goLogin(e){
        //alert('emit')
        this.$emit('input',false);
        this.$emit('showLogin');
      },

    },
    components: {
      eyes
    }
  }
</script>
<style lang="scss">

</style>
