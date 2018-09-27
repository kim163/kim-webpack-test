<template>
  <div class="popup_container">
    <div class="popup_content">
      <div class="discount_info">
        <div class="left_side">
          <p>赠</p>
        </div>
        <div class="right_side">
          <p class="rmb_value">¥ {{(value*0.01).toFixed(2)}}</p>
          <p class="uet_value">= <span>{{value}}</span>UET</p>
          <div class="middle_line"></div>
        </div>
      </div>
      <p class="discount_uet">您此次的交易获赠 <span>{{value}}UET</span></p>
      <div class="btn go_watch" @click="goWatch">前去查看</div>
      <div class="btn define_ok" @click="defineOk">确定</div>
      <p class="close_btn" @click="defineOk"></p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return{

          }
        },
        props:{
          value:{
            type:String,
            default:0
          },
          isPC:{
            type:Boolean,
            default:false
          }
        },
        methods:{
          goWatch(){
              if(this.isPC){
                this.$router.push({name:'pcMyGift'})
              }else {
                this.$router.push({name:'mMyGift'})
              }
          },
          defineOk(){
            this.$emit('closeState',false)
          }
        }
    }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixin";
  .popup_container {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    .popup_content {
      background-color: #fff;
      width: r(250);
      height: r(274);
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%);
      padding: r(20);
      .discount_info {
        width: r(210);
        height: r(108);
        background-color: #ff8b8b;
        border-radius: r(10);
        display: flex;
        .left_side {
          width: r(60);
          font-size: r(30);
          color: #fff;
          line-height: r(108);
          text-align: center;
          position: relative;

        }
        .right_side {
          flex: 1;
          font-size: r(16);
          color: #fff;
          height: r(108);
          position: relative;
          .middle_line {
            position: absolute;
            top: 0;
            left: r(-8);
            width: r(15);
            height: r(108);
            background: url('~images/discount_pink.png') no-repeat;
            background-size: 100%;
            background-color: transparent;
          }
          .rmb_value {
            text-align: center;
            padding-top: r(25);
          }
          .uet_value {
            text-align: center;
            padding-top: r(10);
          }
        }
      }
      .discount_uet {
        font-size: r(14);
        color: #333;
        padding-top: r(20);
        text-align: center;
        span {
          font-size: r(14);
          color: #ec3a4e;
        }
      }
      .go_watch {
        border-radius: r(3);
        background-color: #3573FA;
        color: #fff;
        text-align: center;
        margin-top: r(20);
        height: r(30);
        line-height: r(30);
      }
      .define_ok {
        margin-top: r(10);
        border-radius: r(3);
        background-color: #84a4e9;
        color: #fff;
        text-align: center;
        height: r(30);
        line-height: r(30);
      }
      .close_btn {
        width: r(25);
        height: r(25);
        text-align: center;
        background: url("~images/close_btn.png") no-repeat;
        background-size: 100%;
        margin: 0 auto;
        margin-top: r(40);
      }
    }
  }
</style>
