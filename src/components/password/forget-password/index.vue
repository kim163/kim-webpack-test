<template>
  <div class="modal">
    <div class="modal-dialog forget-password">
      <div type="button" class="close" @click="$emit('hide',false)">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="pop-content">
        <ul class="pop-tab">
          <li v-for="item in getType" @click="type=item" :class="{active:type==item}">{{item}}</li>
            <li><a target="_blank" :href="SETTING.live800">客服找回</a></li>
        </ul>
        <div class="form-box" v-show="type=='短信找回'">
          <div class="form-group">
            <i class="iconfont icon-yonghu"></i>
            <input type="text" class="ps-input" v-model="phone.name" placeholder="请输入您的游戏账号" maxlength="20">
          </div>
          <div class="form-group">
            <i class="iconfont icon-shouji"></i>
            <input type="text" autocomplete="off" class="ps-input" v-model="phone.phone" placeholder="请输入绑定手机号码"
                   maxlength="11"/>
          </div>
          <v-touclick v-model="showVerify" @success="success" class="validate"></v-touclick>
          <div>
            <input type="submit" class="submit" @click.prevent="verify" v-show="forbidtime == 0" value="验证">
            <p class="txt-center" v-show="forbidtime != 0"><span class="cl-red">{{forbidtime}}</span>秒后可重新获取验证码</p>
          </div>

        </div>
        <div class="form-box" v-show="type=='邮箱找回'">
          <div class="form-group">
            <i class="iconfont icon-yonghu"></i>
            <input type="text" class="ps-input" v-model="email.name" placeholder="请输入您的游戏账号" maxlength="20">
          </div>
          <div class="form-group">
            <i class="iconfont icon-youjian"></i>
            <input type="text" autocomplete="off" class="ps-input" v-model="email.yxdz" placeholder="请输入邮箱"/>
          </div>
          <div class="form-group">
            <i class="iconfont icon-yanzhengma"></i>
            <input type="text" class="ps-input ps-input2" v-model="email.code" placeholder="验证码" maxlength="4">
            <a href="javascript:;" class="captcha-code icon_popup"></a>

          </div>
          <input type="submit" class="submit" @click.prevent="getbackPwdByEmail" value="提交">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
 // import {getbackPwdByDx_dc, getbackPwdByEmail} from "api/show";
  import vTouclick from "components/touclick"
//  import {getAuthImg} from 'api/authService';
  import cover from 'base/cover/cover';
  import  {SETTING} from "@/assets/data"
  import  check from "@/util/RegExp"
  export default {
    mixins: [cover],
    data() {
      return {
        forbidtime: 0,
        interval: null,
        SETTING,
        authImg: '',
        getType: ["短信找回", '邮箱找回'],
        type: "短信找回",
        showVerify: false, //显示验证
        phone: {
          sid: "9d154e5f-4f65-4b6d-9201-632adcdba1b7", // true string
          phone: "", // true string
          check_address: "sverify-5-2-0", // true string
          token: "99da842a-40d4-4f10-9a221499131241289", //true string
          name: "",
          check_key: "",
        },
        email: {
          yxdz: '', //true string
          name: '', //true string
          code: '',
        }
      }
    },
    watch:{
      type(val){
       // if(val=="邮箱找回")this.getimg();
      }
    },
    methods: {

      verify() {
        if (this.phone.name == '') toast("请输入游戏账户");
        else if (!check.phone.test(this.phone.phone)) toast("手机号码格式不正确");
        else {
          this.showVerify = true;
        }
      },
      success(obj, tc) {
        this.phone.token=this.phone.check_key = obj.token;
        this.phone.check_address = obj.checkAddress;
        this.phone.sid = obj.sid;
       /* getbackPwdByDx_dc(this.phone).then(res => {
          this.showVerify = false;
          tc.destory();
          toast(res.message);

          if (res.success) {
            this.forbidtime = 120;

            let self = this;
            this.interval = setInterval(function(){
              self.forbidtime --;
              if (self.forbidtime == 0) {
                clearInterval(self.interval);
              }
            }, 1000);
          }

        }).catch(err => {
          toast("请求验证失败");
        })*/
      },
      getbackPwdByEmail() {
        if (this.email.name == "") toast("请输入游戏账户");
        else if (this.email.yxdz == "") toast("请输入对应的邮箱");
        else if (!check.email.test(this.email.yxdz)) toast("邮箱格式不正确");
        else if(this.email.code== "") toast("请输入验证码");
        else {
          /*getbackPwdByEmail(this.email).then(res => {
            toast(res.message)
          }).catch(err=>{
            toast("找回失败,请重新尝试")
          })*/
        }
      }
    },
    beforeDestroy() {
      window.clearInterval(this.interval)
    },
    components: {
      vTouclick
    }
  }
</script>
<style lang="scss">
  .forget-password .pop-content {
    position: relative;
    padding-bottom: 30px;
    padding-top: 54px;
    h2 {
      font-size: 24px;
      color: #282828;
      margin-bottom: 15px;
      text-align: center;
      font-weight: normal;
    }
  }

  .forget-password .form-box {
    width: 300px;
    margin: 0 auto;
    margin-top: 20px;
    .form-group {
      height: 34px;
      line-height: 34px;
      position: relative;
      margin-bottom: 14px;
      width: 100%;
    }
    p {
      text-align: center;
      color: #999;
    }
    .captcha-code {
      width: 90px;
      height: 34px;
      float: left;
      display: block;
      position: relative;
      background: no-repeat;

      img {
        height: 34px;
        width: 90px;
        vertical-align: top;
      }
    }
    .ps-input {
      width: 300px;
      height: 34px;
      border: 0;
      background: 0 0;
      border-bottom: 1px solid #ccc;
      outline: 0;
      line-height: 34px;
      font-size: 16px;
      color: #333;
      padding: 0 20px 0 30px;
    }
    .ps-input2 {
      width: 210px;
      float: left;
      height: 34px;
      border-bottom: 1px solid #ccc;
      outline: 0;
      line-height: 34px;
      font-size: 16px;
      color: #333;
      padding: 0 20px 0 30px;
    }
    i.iconfont {
      position: absolute;
      height: 100%;
      line-height: 34px;
      top: 0;
      left: 0;
      font-size: 24px;
      display: inline-block;
    }
  }

  .forget-password .icon_popup {
    position: absolute;
    display: block;
  }

  .forget-password .submit {
    width: 300px;
    height: 40px;
    background: #13a1ca;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
    display: block;
    border-radius: 4px;
  }

  .forget-password .pop-tab {
    overflow: hidden;
    text-align: center;
    width: 350px;
    margin: 0 auto;
    li {
      cursor: pointer;
      display: inline-block;
      font-size: 16px;
      color: #666;
      padding: 0 6px;
      line-height: 32px;
      height: 32px;
      margin: 0 15px;
      &.active, &:hover {
        color: #13a1ca;
        border-bottom: 2px solid #13a1ca;

      }
    }
  }

</style>
