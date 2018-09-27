<template>
  <div  class="form-rowbox" style="padding: 20px 0;">
    <div class="inputbox">
      <span class="label">登录密码：</span>
      <input ref="pwd" type="password" v-model="loginPwd" name="loginPwd" placeholder="请输入您的登录密码" class="eyecheck">
      <eyes :dom="$refs.pwd"></eyes>
    </div>
    <div class="inputbox">
      <span class="label">支付密码：</span>
      <input ref="pwd1" type="password"  v-model="withdrawPwd"
             placeholder="请设置6位支付密码，由纯数字组成"  maxlength="6">
      <eyes :dom="$refs.pwd1"></eyes>
    </div>
    <button type="submit" class="formbtn btn-submit" @click="submit">确定</button>
  </div>
</template>
<script>
  import  md5  from "MD5";
  import  {bindWithdrawPwd,checkWithdrawPwd}  from "api/payment";
  import eyes from "components/eyes"
  import  check from "@/util/RegExp"
  export default {
    data() {
      return {
        withdrawPwd:'',
        loginPwd:""
      };
    },
    methods:{
      checkForm(){
        if(this.loginPwd=='')toast("请输入登录密码");
        else if(!check.pay_password.test(this.withdrawPwd))toast("支付密码为6位纯数字密码");
        else if(this.withdrawPwd=="")toast("请输入支付密码");
        else{ return true;}
      },
      submit(){
        if(!this.checkForm())return;
        bindWithdrawPwd({
          withdrawPwd:md5(md5(this.withdrawPwd)),
          loginPwd:this.loginPwd
        }).then((data)=>{
          if(data.success){
            toast("设置成功");
            this.$store.commit("SET_PAYPWD",true)
            const {rquest}= this.$route.query;
            if(rquest){
              this.$router.push({path:rquest});
            }
            this.loginPwd=this.withdrawPwd='';
          }else{
            toast(data.message);
          }
        }).catch(err=>{
          toast("设置失败,请重新尝试");
        })
      }
    }
    ,components:{eyes}
  };
</script>
<style lang="scss">
</style>

