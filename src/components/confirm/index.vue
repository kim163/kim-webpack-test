<template>
  <div class="confirm-main" v-if="show">
    <div class="mask-bg" @click="hideDialog"></div>
    <div class="container" :class="{'container-pc': isPc}">
      <div class="header" v-if="isPc">
        <slot name="header-title">温馨提示</slot>
        <a class="close" @click="hideDialog">
          <i class="iconfont icon-close"></i>
        </a>
      </div>
      <div class="confirm-title">
        <slot name="title"></slot>
      </div>
      <div class="confirm-content">
        <slot name="content"></slot>
      </div>
      <div class="confirm-footer">
        <div class="confirm-btn" v-if="showLeftBtn" :class="{'confirm-btn-pc': isPc}" @click="hideDialog">
          <slot name="leftBtn">{{$t('postPend.cancel')}}</slot>
        </div>
        <div class="confirm-btn" v-if="showRightBtn" :class="{'confirm-btn-pc': isPc}">
          <slot name="rightBtn"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "confirm-dialog",

    model: {
      prop: 'show',
      event: 'change'
    },

    data() {
      return {
      }
    },

    props:{
      show: {
        type: Boolean,
        default: false
      },
      isPc:{
        type:Boolean,
        default:false
      },
      showLeftBtn:{
        type:Boolean,
        default:true
      },
      showRightBtn:{
        type:Boolean,
        default:true
      }
    },
    watch: {
      show: {
        handler(val) {
          this.$nextTick(() => {
            if (val) {
              this.show = true
            } else {
              this.show = false
            }
          })
        },
        immediate: true
      },
    },
    methods:{
      hideDialog(){
        this.$emit('change', false)
      },
    },
    beforeDestroy(){
      this.$emit('change', false)
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .confirm-main{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    .mask-bg{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.40);
    }
    .header{
      width: 100%;
      height: r(50);
      background-color: #5087ff;
      line-height: r(50);
      padding: 0 r(20);
      display: flex;
      justify-content: space-between;
      color: #ffffff;
      @include f(20px);
      .close{
        cursor: pointer;
        .icon-close{
          @include f(14px);
          color: #FFFFFF;
        }
      }
    }
    .container{
      width: 72%;
      overflow: hidden;
      background: #FFFFFF;
      border-radius: 5px;
      z-index: 1001;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%);
      margin-left: -36%;
      &.container-pc{
        width: 500px;
        margin-left: -250px;
      }
      .confirm-title,.confirm-content{
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: #333333;
        margin-top: r(15);
        padding: 0 r(10);
      }
      .confirm-title{
        margin-top: r(30);
        padding: 0 r(10);
      }
    }
    .confirm-footer{
      width: 100%;
      border-top: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-around;
      margin-top: r(25);
      .confirm-btn{
        width: 50%;
        height: r(40);
        line-height: r(40);
        text-align: center;
        cursor: pointer;
        &.confirm-btn-pc{
          height: r(60);
          line-height: r(60);
        }
      }
    }
  }

</style>
