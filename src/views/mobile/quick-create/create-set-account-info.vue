<template>
  <div>
    <div v-if="!createSuccess">
      <div class="set-info" :class="{'ser-info-pc':isPc}">
        <i class="iconfont icon-danger" v-if="!isPc"></i>
        <div class="text">
          您的账户当前未设置任何安全信息，请务必完善
        </div>
      </div>
      <div class="user-account" :class="{'user-account-pc': isPc}">
        久安账号：{{merchantInfo.prefix}}{{merchantInfo.merchantUserName}}
      </div>
      <div class="set-account-info" :class="{'set-account-info-pc':isPc}">
        <div class="set-password">
          <div class="title-tip"><span class="red">*</span>登陆密码：</div>
          <input type="password" class="psd-input" v-model.trim="password" @mouseout="checkPwdReg"
                 placeholder="请设置您的登录密码"/>
          <input type="password" class="psd-input" v-model.trim="confirmPassword" @mouseout="checkPwd"
                 placeholder="请再次输入您的登录密码"/>
          <div class="error" v-show="pwdError">提示：{{pwdErrorText}}</div>
        </div>
        <div class="set-phone">
          <div class="title-tip">安全绑定：</div>
          <div class="choose-type">
            <div class="type-info" @click="type = 1" :class="{active: type === 1}">手机号</div>
            <div class="type-info" @click="type = 2" :class="{active: type === 2}">邮箱</div>
          </div>
          <div class="select-type" v-show="type === 1">
            <select class="select" v-model="areaCode">
              <option v-for="item in areaCodeData" :value="item.value">{{item.name}}</option>
            </select>
            <input type="text" class="type-input" v-model="typeNumber" :placeholder="typePlaceholder"/>
          </div>
          <div class="email" v-show="type === 2">
            <input type="text" class="type-input email-input" v-model="typeNumber" :placeholder="typePlaceholder"/>
          </div>
          <div class="code-info">
            <input type="text" class="code-input" v-model="code" placeholder="验证码"/>
            <get-verify-code v-model="startCountDown" class="get-code" @sendAuthCode="getCode()"></get-verify-code>
          </div>
          <div class="error" v-show="bindError">提示：{{bindErrorText}}</div>
        </div>
      </div>
      <div class="submit">
        <div class="bind-def-btn" @click="submit()">确认提交</div>
      </div>
    </div>
    <transition name="success">
      <create-success v-if="createSuccess" :is-pc="isPc"></create-success>
    </transition>
  </div>
</template>

<script>
  import GetVerifyCode from 'components/get-verify-code'
  import CreateSuccess from './create-success'
  import {$localStorage} from '@/util/storage'
  import aesutil from '@/util/aesutil';

  import RegExp from '@/util/RegExp'
  import {mapGetters} from 'vuex';
  import {
    sendCode,
    sendEmailCode,
    login
  } from 'api/show'
  import {
    // updatePassword,
    // bindEmail,
    // bindPhone,
    syncUserAndBindRelation
  } from 'api/cashier'

  export default {
    name: "create-set-password",
    data() {
      return {
        createSuccess: false,
        password: '',
        confirmPassword: '',
        pwdError: false,
        pwdErrorText: '',
        type: 1,  //1是手机号 2是邮箱
        areaCode: '+86',
        areaCodeData: [
          {name: "+63", value: "+63"},
          {name: "+86", value: "+86"}
        ],
        typeNumber: '',
        typePlaceholder: '请输入您常用的手机号码',
        code: '',//验证码
        bindError: false,
        bindErrorText: '',
        startCountDown: false,
      }
    },
    computed:{
      ...mapGetters([
        'userId'
      ])
    },
    components: {
      GetVerifyCode,
      CreateSuccess
    },
    watch: {
      type() {
        this.typePlaceholder = this.type === 1 ? '请输入您常用的手机号码' : '请输入您常用的邮箱地址'
        this.typeNumber = ''
        this.code = ''
        this.bindError = false
        this.bindErrorText = ''
      }
    },
    props: {
      merchantInfo: {
        type: Object,
        default: {}
      },
      isPc:{
        type:Boolean,
        default:false
      }
    },
    methods: {
      checkPwd() {
        if (this.password === '') {
          this.pwdError = true
          this.pwdErrorText = '请设置您的登录密码'
          return false
        } else if (this.confirmPassword === '') {
          this.pwdError = true
          this.pwdErrorText = '请再次输入您的登录密码'
          return false
        } else if (this.password != this.confirmPassword) {
          this.pwdError = true
          this.pwdErrorText = '两次输入的密码不一致'
          return false
        } else {
          this.pwdError = false
          this.pwdErrorText = ''
          return true
        }
      },
      checkPwdReg() {
        if (this.password === '') {
          this.pwdError = true
          this.pwdErrorText = '请设置您的登录密码'
          return false
        } else if (!RegExp.password.test(this.password)) {
          this.pwdError = true
          this.pwdErrorText = '您输入的密码不符合规则，请重新输入'
          return false
        } else {
          this.pwdError = false
          this.pwdErrorText = ''
          return true
        }
      },
      checkNumber() {
        if (this.typeNumber === '') {
          this.bindError = true
          this.bindErrorText = this.type === 1 ? '请输入您常用的手机号' : '请输入您常用的邮箱地址'
          return false
        } else {
          let reg = ''
          if (this.type === 1) {
            reg = this.areaCode === '+86' ? RegExp.phone : RegExp.php_phone
          } else {
            reg = RegExp.email
          }
          if (!reg.test(this.typeNumber)) {
            this.bindError = true
            this.bindErrorText = this.type === 1 ? '请输入正确的手机号' : '请输入正确的邮箱地址'
            return false
          } else {
            this.bindError = false
            this.bindErrorText = ''
            return true
          }
        }
      },
      getCode() { //获取验证码
        if (this.checkNumber()) {
          const api = this.type === 1 ? sendCode : sendEmailCode
          const request = {
            type: 1
          }
          if (this.type === 1) {
            Object.assign(request, {
              phone: this.typeNumber,
              areaCode: this.areaCode,
            })
          } else {
            Object.assign(request, {
              email: this.typeNumber,
            })
          }
          api(request).then(res => {
            if (res.code === 10000) {
              this.startCountDown = true
            } else {
              toast(res.message)
            }
          }).catch(err => {
            toast(err)
          })
        }
      },
      submit() {
        if (this.checkPwd()) { //密码必填  手机号邮箱非必填
          if(this.typeNumber != ''){
            if(this.checkNumber()){
              if(this.code != ''){
                const request = {}
                if(this.type === 1){
                  Object.assign(request,{
                    phone:this.typeNumber,
                    phoneMgs:this.code,
                    areaCode:this.areaCode,
                    // userId: this.userId
                  })
                }else{
                  Object.assign(request,{
                    email:this.typeNumber,
                    emailMgs:this.code,
                    // userId: this.userId
                  })
                }
                this.syncUserAndBind(request)
                // const api = this.type === 1 ? bindPhone : bindEmail
                // console.log(request)
                // api(request).then(res => {
                //   if(res.code === 10000){
                //     this.updateUserPassword()
                //   }else{
                //     toast(res.message)
                //   }
                // }).catch(err => {
                //   toast(err)
                // })
              }else{
                this.bindError = true
                this.bindErrorText = '请输入验证码'
                return false
              }
            }
          }else{
            this.syncUserAndBind({})
          }
        }
      },
      syncUserAndBind(data){
        const request = {
          // userId: this.userId,
          merchantId: this.merchantInfo.merchantId,
          merchantUserName: this.merchantInfo.merchantUserName,
          notifyUrl: this.merchantInfo.notifyUrl,
          password: this.password,
          confirmPassword:this.confirmPassword
        }
        Object.assign(request,data)
        console.log(request)
        syncUserAndBindRelation(request).then(res => {
          if(res.code === 10000){
            this.toLogin(res.data.token)
            this.createSuccess = true
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      toLogin(token){  //创建成功之后 自动调用登录接口
        const request = {
          type:11,
          token,
          merchantId: this.merchantInfo.merchantId.toString()
        }
        console.log(request)
        login(request).then(res => {
          if(res.code === 10000){
            console.log('toLogin',res)
            $localStorage.set('tokenInfo', JSON.stringify(res.data.tokenVo))
            $localStorage.set('userData', aesutil.encrypt(JSON.stringify(res.data)))
            this.$store.dispatch('CHECK_ONLINE', true)
            this.$store.dispatch('UPDATE_TOKEN_INFO', res.data.tokenVo)
            this.$store.commit('SET_USERDATA',res.data)
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  @mixin def-input {
    height: r(40);
    line-height: r(10);
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
    padding-left: r(10);
  }

  .set-info {
    width: 100%;
    height: r(156);
    text-align: center;
    /*color: #333333;*/
    @include f(15px);
    padding-top: r(38);
    border-bottom: 1px solid #d8d8d8;
    background: $white;
    .text {
      margin-top: r(20);
      color: #FF0000;
    }
    .iconfont {
      @include f(50px);
      color: red;
    }
    .business-logo {
      height: r(28);
      margin-left: r(8);
      margin-right: r(8);
    }
    &.ser-info-pc{
      height: auto;
      padding: 0;
      border: none;
      margin-bottom: r(30);
    }
  }

  .user-account {
    width: 100%;
    height: r(50);
    line-height: r(50);
    text-align: center;
    background: $white;
    color: #333333;
    @include f(15px);
    border-bottom: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    margin-top: r(10);
    &.user-account-pc{
      background-color: #f7f7f7;
      border: solid 1px #d4d4d4;
      width: calc(100% - #{r(40)});
      margin: 0 auto;
    }
  }

  .set-account-info {
    width: 100%;
    border-bottom: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    background: $white;
    margin-top: r(10);
    padding: r(20);
    &.set-account-info-pc{
      border: none;
    }
    .title-tip {
      color: #000000;
      @include f(15px);
      .red {
        color: #FF0000;
        margin-right: r(5);
      }
    }
    .psd-input {
      width: 100%;
      @include def-input;
      margin-top: r(10);
    }
    .error {
      width: 100%;
      color: #FF0000;
      @include f(15px);
      margin-top: r(10);
    }
    .set-phone {
      margin-top: r(20);
      .choose-type {
        margin-top: r(20);
        font-size: 0px;
        .type-info {
          width: 30%;
          height: r(40);
          display: inline-block;
          text-align: center;
          line-height: r(40);
          background: #f5f5f5;
          color: #868686;
          cursor: pointer;
          @include f(14px);
          &.active {
            background: #4982FF;
            color: $white;
          }
        }
      }
      .email {
        width: 100%;
        margin-top: r(20);
      }
      .select-type, .code-info {
        margin-top: r(20);
        display: flex;
        justify-content: space-between;
      }
      .select {
        width: 24%;
        height: r(40);
        background: url("~images/select-up-down.svg") no-repeat scroll 90% center transparent;
        background-size: r(10) r(12);
        padding: 0 3%;
        color: #4982FF;
        border: 1px solid #4982FF;
        @include f(15px);
      }
      .type-input {
        width: 74%;
        @include def-input;
        &.email-input {
          width: 100%;
        }
      }
      .code-input {
        width: 72%;
        @include def-input;
      }
      .get-code {
        width: 26%;
      }
    }
  }

  .submit {
    padding: r(10) r(10);
  }
</style>