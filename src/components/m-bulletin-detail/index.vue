<template>
  <transition name="rightIn">
    <div class="detail-main" v-if="show">
      <mobile-header :back="goBack">公告详情</mobile-header>
      <div class="title">{{detail.title}}</div>
      <div class="time">{{detail.time | Date('yyyy-MM-dd hh:mm:ss')}}</div>
      <div class="container" v-html="detail.content"></div>
    </div>
  </transition>
</template>

<script>
  import MobileHeader from 'components/m-header'
  export default {
    name: "m-bulletin-detail",//公告详情
    data(){
      return{

      }
    },
    model:{
      prop:'show',
      event:'change'
    },
    props:{
      show:{
        type:Boolean,
        default:false
      },
      detail:{
        type:Object,
        default:{
          title:'',
          time:'',
          content:''
        }
      },
    },
    components:{
      MobileHeader
    },
    methods:{
      goBack(){
        this.$emit('change',false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixin";
  .rightIn-enter, .rightIn-leave-to{
    transform: translateX(100%);
  }
  .rightIn-enter-active, .rightIn-leave-active{
    transition: all 0.5s;
  }
  .detail-main{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1001;
    top: 0;
    left: 0;
    background: $body-bg;
  }
  .title{
    @include f(21px);
    text-align: center;
    margin-top: r(30);
    color: #373737;
    width: 100%;
    padding: 0 r(10);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time{
    @include f(12px);
    text-align: center;
    margin-top: r(15);
    color: #8f8f8f;
    padding-bottom: r(15);
    border-bottom: 1px solid #8f8f8f;
  }
  .container{
    padding: r(10);
    @include f(15px);
    color: #333333;
  }
</style>