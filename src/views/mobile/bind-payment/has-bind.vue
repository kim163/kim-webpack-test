<template>
  <div class="p-def">
    <div class="main">
      <div class="qr-code">
        <div class="qr-img">
          <img v-lazy="dataInfo[0].qrCodeUrl"/>
        </div>
      </div>
      <div class="info">
        <div class="title">{{typeName}}账号:</div>
        <div>{{dataInfo[0].account}}</div>
      </div>
      <div class="info">
        <div class="title">{{typeName}}认证姓名:</div>
        <div>{{dataInfo[0].name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "has-bind",
    data(){
      return{}
    },
    props:{
      dataInfo:{
        type:Array,
        default:[]
      },
      typeName:{
        type:String,
        default:''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    background: $white;
    border-radius: r(5);
    box-shadow: 0px 0px 5px rgba(0,0,0,.2);
    .qr-code{
      padding: r(20);
      .qr-img{
        width: 50%;
        min-height: r(100);
        margin: 0 auto;
        /*background: url("~images/logo.png") no-repeat center #e1e1e1;*/
        img{
          width: 100%;
        }
      }
    }
    .info{
      width: 100%;
      padding: 0 r(10);
      display: flex;
      justify-content: space-between;
      height: r(50);
      line-height: r(50);
      border-top: 1px solid #efefef;
      .title{
        width: 45%;
        text-align: right;
      }
    }
  }
</style>