<template>
  <transition name="mint-toast-pop">
    <div class="mint-toast" v-show="visible" :class="customClass" :style="{ 'padding': iconClass === '' ? '30px' : '50px' }">
      <i class="mint-toast-icon" :class="iconClass" v-if="iconClass !== ''"></i>
      <span class="mint-toast-text" :style="{'padding-top':iconClass === '' ? '0' : '10px' }">{{ message }}</span>
    </div>
  </transition>
</template>
<style lang="scss">
  .mint-toast {
    position: fixed;
    max-width: 350px;
    border-radius:10px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index:9999999;
    -webkit-transition: opacity .3s linear;
    transition: opacity .3s linear
  }
  .mint-toast.is-placebottom {
    bottom: 50px;
    left: 50%;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0)
  }
  .mint-toast.is-placemiddle {
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%)
  }
  .mint-toast.is-placetop {
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0)
  }
  .mint-toast-icon {
    display: block;
    text-align: center;
    font-size: 56px;
  }
  .mint-toast-text {
    font-size: 16px;
    line-height: 28px;
    display: block;
    text-align: center
  }
  .mint-toast-pop-enter, .mint-toast-pop-leave-active {
    opacity: 0
  }
</style>
<script type="text/babel">
  export default {
    props: {
      message: String,
      className: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'middle'
      },
      iconClass: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        visible: false
      };
    },
    computed: {
      customClass() {
        var classes = [];
        switch (this.position) {
          case 'top':
            classes.push('is-placetop');
            break;
          case 'bottom':
            classes.push('is-placebottom');
            break;
          default:
            classes.push('is-placemiddle');
        }
        classes.push(this.className);
        return classes.join(' ');
      }
    }
  };
</script>
