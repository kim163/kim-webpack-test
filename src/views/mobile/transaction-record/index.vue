<template>
  <div class="tran-record-main">
    <mobile-header :back="goBack">{{$t('navbar.transactionRecord')}}</mobile-header>
    <div class="nav-list cfx">
      <div class="nav-item" :class="{active: navIndex === 0}" @click="navIndex = 0">
        {{$t('transactionRecord.tranProgress')}}
      </div>
      <div class="nav-item" :class="{active: navIndex === 1}" @click="navIndex = 1">
        {{$t('transactionRecord.tranComplete')}}
      </div>
    </div>
    <div class="amount-balance">{{$t('navbar.accountBalance')}}：<balance></balance></div>
    <div class="tran-list">
      <transition name="tran-animate">
          <transcation-list :type="0"
                            v-if="navIndex === 0"></transcation-list>
      </transition>
      <transition name="tran-animate">
          <transcation-list :type="1"
                            v-if="navIndex === 1"></transcation-list>
      </transition>
    </div>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import balance from 'components/balance'
  import TranscationList from './transaction-list';
  import {mapGetters} from 'vuex'

  export default {
    name: "transaction-record",

    components: {
      MobileHeader,
      TranscationList,
      // Scroll,
      balance
    },
    methods:{
      goBack(){
        this.$router.push({name:'mUserCenter'})
      }
    },
    computed: {
      ...mapGetters([
        "userData"
      ]),
    },
    data() {
      return {
        navIndex: 0,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .tran-animate-enter { //临时添加点小动画
    opacity: 0;
    //transform: translateX(100%);
  }

  .tran-animate-leave {
    opacity: 0;
    //transform: translateX(-100%);
  }

  .tran-animate-enter-active, .tran-animate-leave-active {
    transition: all .8s;
  }

  $otherHeight: r(149);
  .tran-record-main {
    width: 100%;
    background: #F5F5F5;
    .nav-list {
      width: 100%;
      height: r(50);
      line-height: r(50);
      background: #FFFFFF;
      border-bottom: 1px solid #D8D8D8;
    }
    .nav-item {
      width: 50%;
      float: left;
      display: block;
      text-align: center;
      @include f(15px);
      color: #787876;
      position: relative;
      user-select: none;
      &.active {
        color: #4982FF;
        &:after {
          content: '';
          width: 100%;
          height: 1px;
          background: #4982FF;
          position: absolute;
          left: 0;
          bottom: -1px;
        }
      }
    }
    .amount-balance {
      @include f(16px);
      color: #333333;
      padding: r(15) 0 r(15) r(10);
    }
    .tran-list {
      width: 100%;
      height: calc(100% - #{$otherHeight});
      overflow: hidden;
      position: absolute;
      top: r(140)
    }
  }
</style>
