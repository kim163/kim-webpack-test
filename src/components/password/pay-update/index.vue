<template>
  <div class="form-rowbox" style="padding: 20px 0;">
    <div class="inputbox">
      <span class="label">原支付密码：</span>
      <input ref="pwd" type="password" v-model="originalPwd" name="originalPwd" placeholder="请输入您原来支付密码" class="eyecheck" maxlength="6">
      <eyes :dom="$refs.pwd"></eyes>
    </div>
    <div class="inputbox">
      <span class="label">新支付密码：</span>
      <input ref="pwd1" type="password" v-model="newPwd" name="newPwd" placeholder="请设置6位支付密码，由纯数字组成" class="eyecheck" maxlength="6">
      <eyes :dom="$refs.pwd1"></eyes>
    </div>
    <button type="submit" class="formbtn btn-submit" @click="submit">确定</button>
  </div>
</template>
<script>
  import  {modifyWithdrawPwd}  from "api/payment";
  import  md5  from "MD5";
  import eyes from "components/eyes"
  import  check from "@/util/RegExp"
  export default {
    data() {
      return {
        originalPwd:"",
        newPwd:""
      };
    },
    methods:{
      checkFrom(){
        if(this.originalPwd=='')toast("请输入原密码");
        else if(!check.pay_password.test(this.newPwd))toast("支付密码为6位纯数字密码");
        else if(this.newPwd=='')toast("请输入新密码");
        else if(this.newPwd==this.originalPwd)toast("新密码不能和旧密码相同");
        else{
          return true;
        }
      },
      submit(){
        if(!this.checkFrom())return;
        modifyWithdrawPwd({
          originalPwd:md5(md5(this.originalPwd)),
          newPwd:md5(md5(this.newPwd))
        }).then(data=>{
          if(data.success){
            this.originalPwd=this.newPwd='';
            toast("修改成功");

          }else{
            toast(data.message);
          }
        }).catch(err=>{
          toast("修改失败,请重新尝试");
        })
      }
    },
    components:{eyes}
  };
</script>
<style>
</style>
