<template>
  <div class="main">
    <div class="img-tip">
      <img src="~images/no-data.png" class="img"/>
    </div>
    <div class="tip">{{tip}}</div>
  </div>
</template>

<script>
  export default {
    name: "no-data-tip",
    data(){
      return{

      }
    },
    props:{
      tip:{
        type:String,
        default:'抱歉！暂时找不到相关数据！'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    padding: 15% 0;
  }
  .img-tip{
    width: 100%;
    text-align: center;
    .img{
      width: 50%;
      height: 42.75%;
      max-width: r(400);
      max-height: r(342);
    }
  }
  .tip{
    width: 100%;
    text-align: center;
    @include f(16px);
    color: #333333;
    margin-top: r(30);
  }
</style>