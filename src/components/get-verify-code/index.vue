<template>
  <div class="main" :class="{disabled: startCountDown}" >
    <span v-show="!startCountDown" @click="$emit('sendAuthCode')">{{defText}}</span>
    <span v-show="startCountDown">{{countDownTime}}{{countDownText}}</span>
  </div>
</template>

<script>
  export default {
    name: "get-verify-code",
    data(){
      return {
        countDownTime:0
      }
    },
    model: {
      prop: 'startCountDown',
      event: 'change'
    },
    watch:{
      startCountDown(){
        if(this.startCountDown){
          this.countDown()
        }
      }
    },
    props:{
      startCountDown:{  //开始倒计时
        type:Boolean,
        default:false
      },
      endTime:{  //倒计时时间
        type:Number,
        default:60
      },
      defText:{
        type:String,
        default:'获取验证码'
      },
      countDownText:{
        type:String,
        default:'s后重新获取'
      }
    },
    methods:{
      countDown(){
        setTimeout(() => {
          this.countDownTime -= 1
          if(this.countDownTime <= 0){
            this.$emit('change',false)
            this.countDownTime = this.endTime
          }else{
            this.countDown()
          }
        }, 1000)
      }
    },
    created(){
      this.countDownTime = this.endTime
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    width: r(100);
    height: r(40);
    line-height: r(40);
    background: #4982FF;
    text-align: center;
    @include f(14px);
    color: $white;
    span{
      display: block;
      width: 100%;
      height: 100%;
    }
    &.disabled{
      background: #d8d8d8;
    }
  }
</style>