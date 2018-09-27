<template>
  <div  class="form-rowbox" style="padding:20px 0;">
    <div class="inputbox">
      <span class="label">原密码：</span>
      <input ref="pwd" type="password" v-model="password" name="password" placeholder="原密码" class="eyecheck">
      <eyes :dom="$refs.pwd"></eyes>
    </div>
    <div class="inputbox">
      <span class="label">新密码：</span>
      <input ref="pwd1" type="password" v-model="new_password" name="new_password"
             placeholder="密码为6-16位数字或英文字母，英文字母开头且不能和账号相同">
      <eyes :dom="$refs.pwd1"></eyes>
    </div>
    <div class="inputbox">
      <span class="label">确认密码：</span>
      <input ref="pwd2" type="password" v-model="confirm_password" name="confirm_password" placeholder="再次输入"
             class="eyecheck">
      <eyes :dom="$refs.pwd2"></eyes>
    </div>
    <button type="submit" class="formbtn btn-submit" @click="submit">确定</button>

  </div>
</template>
<script>
  import md5 from "MD5";
  import {changepws} from "api/payment";
  import eyes from "components/eyes"
  import  check from "@/util/RegExp"
  export default {
    data() {
      return {
        password: "",// true string
        confirm_password: "",// true string
        new_password: ""
      };
    },
    props: {},
    methods: {
      check() {
        if(this.password == "") toast("请输入原密码");
        else if (!check.password.test(this.new_password))toast("密码需为6-16位，包含数字和字母");
        else if (this.new_password == "") toast("请输入新密码");
        else if (this.confirm_password == "") toast("请重复新密码");
        else if (this.new_password != this.confirm_password) toast("二次密码不一致");
        else if (this.password == this.new_password) toast("新密码不能与旧密码相同");
        else {
          return true;
        }
      },
      submit() {
        if (!this.check()) return;
        changepws(
          this.$data
        ).then(data => {
          if (data.success) {
            toast(data.message);
            this.password = this.confirm_password = this.new_password = ""
          } else {
            toast(data.message)
          }
        }).catch(err => {
          toast("修改失败,稍后重试")
        })
      }
    },
    components:{eyes}
  };
</script>
<style lang="scss">
</style>
