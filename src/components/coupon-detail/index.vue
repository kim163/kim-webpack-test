<template>
  <div class="coupon">
    <div class="info-detail info-left">
      <div class="info">{{item.remark}}</div>
      <div class="info">至{{item.couponEndtime | Date('yyyy-MM-dd')}}过期</div>
      <div class="info">单号：{{item.id}}</div>
    </div>
    <div class="info-detail info-right" :class="{used:isUsed}">
      <div class="info">¥ {{(item.couponValueStr*0.01).toFixed(2)}}</div>
      <div class="info">&yen; ={{item.couponValueStr}}UET</div>
      <div class="use-btn" v-if="showBtn && !isUsed" @click="$emit('toUse')">立即使用</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "coupon-detail",
    data(){
      return{

      }
    },
    props:{
      item:{ //基本信息对象
        type:Object,
        default:{}
      },
      isUsed:{ //是否已使用
        type:Boolean,
        default:false
      },
      showBtn:{ //显示立即使用按钮
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .coupon{
    width: 555px;
    height: 100%;
    display: flex;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
    &:after,&:before{
      content: '';
      position: absolute;
      background: url(~images/act-border.png);
      width: 10px;
      height: 90%;
      top: 5%;
      background-size: 100% 100%;
      z-index: 2;
    }
    &:after{
      left: -5px;
    }
    &:before {
      right: -5px;
    }
    .info-detail{
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      text-align: left;
      .info{
        font-size: 14px;
        margin-bottom: 3%;
        color: #787876;
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .info-left{
      width: 375px;
      background: #F0F5FF;
    }
    .info-right{
      width: 180px;
      background: #5087FF;
      position: relative;
      &.used{
        background: #A584FB;
      }
      &:after,&:before{
        content: '';
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #ffffff;
        position: absolute;
        top: -7.5px;
        left: -7.5px;
      }
      &:before{
        top: calc(100% - 7.5px);
      }
      .info{
        font-size: 18px;
        color: #ffffff;
        margin-bottom: 0;
      }
      .use-btn{
        width: 97px;
        height: 30px;
        border: 1px solid #96B7FF;
        border-radius: 20px;
        text-align: center;
        line-height: 28px;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
        margin-top: 3%;
      }
    }
  }
</style>