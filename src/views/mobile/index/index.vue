<template>
  <div class="mtrading-hall">
    <div class="nav-tab">
      <div class="tabs">
        <span class="tab-item" v-for="(item,i) in transactType"
              @click="transactItem = item.value"
              :class="{active:transactItem === item.value}"
              :key="item.value">
          {{generateTitle(item.name)}}
        </span>
      </div>
    </div>
    <div class="warning-tip">
      <div class="text">交易时请注意检查UET是否到账，如果付款了卖家没有放币，请对订单进行申诉</div>
    </div>
    <div class="type">
      <!--<i class="iconfont icon-car-add" v-show="transactItem === 'buyUet'"></i>-->
      <!--<i class="iconfont icon-car-sub" v-show="transactItem === 'saleUet'"></i>-->
      <svg class="icon" aria-hidden="true" v-show="transactItem === 'buyUet'">
        <use xlink:href="#icon-car-add"></use>
      </svg>
      <svg class="icon" aria-hidden="true" v-show="transactItem === 'saleUet'">
        <use xlink:href="#icon-car-sub"></use>
      </svg>
      {{transactItem === 'buyUet' ? '买' : '卖'}}币大厅
    </div>
    <!--<div class="account-balline">-->
      <!--{{$t('navbar.accountBalance')}}：-->
      <!--<balance></balance>-->
    <!--</div>-->
    <div class="tran-container">
      <!--<tranbuy-list v-if="islogin && transactItem=='buyUet'"></tranbuy-list>-->

      <!--<transell-list v-if="islogin && transactItem=='saleUet'"></transell-list>-->
      <transition name="buy">
        <tran-list v-if="islogin && transactItem === 'buyUet'" :type="1"></tran-list>
      </transition>
      <transition name="sell">
        <tran-list v-if="islogin && transactItem === 'saleUet'" :type="2"></tran-list>
      </transition>
    </div>

    <m-navbar></m-navbar>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import mNavbar from 'components/m-navbar';
  import balance from 'components/balance';
  // import tranbuyList from './components/tranbuy-list';
  // import transellList from './components/transell-list';
  import tranList from './tran-list';

  import {generateTitle} from '@/util/i18n';

  export default {
    data() {
      return {
        transactType: [
          {name: 'transactionHome.buyUet', value: 'buyUet'},
          {name: 'transactionHome.saleUet', value: 'saleUet'}
        ],
        transactItem: 'buyUet',
      };
    },
    props: {
      value: Boolean
    },
    methods: {
      generateTitle,
    },
    watch: {
      islogin(val) {
        if (!val) {
          this.$router.push({name: 'mobileLogin'});
        }
        console.log('mindex islogin:', val);
      }
    },
    computed: {
      ...mapGetters(["userData", "islogin"])
    },
    created() {
      // if (!this.islogin) {
      //   this.$router.push({name: 'mobileLogin'});
      // }
    },
    components: {
      mNavbar,
      balance,
      // tranbuyList,
      // transellList
      tranList
    },
  };
</script>
<style lang="scss">
  @import "~assets/scss/mobile";

  .mtrading-hall {
    .account-balline {
      height: r(44);
      line-height: r(44);
      background: $white;
      @include f(16px);
      color: $font-color;
      padding: 0 r(10);
      border-top: 1px solid #D8D8D8;
      border-bottom: 1px solid #D8D8D8;
    }
    .nav-tab{
      width: 100%;
      padding: r(20) 0;
      background: #3573FA;
      display: flex;
      justify-content: center;
      .tabs{
        width: r(154);
        height: r(29);
        line-height: r(29);
        border: r(1) solid #FFFFFF;
        border-radius: r(4);
        display: flex;
      }
      .tab-item{
        width: 50%;
        height: 100%;
        text-align: center;
        @include f(14px);
        color: $white;
        &.active{
          background: $white;
          color: #3573FA;
        }
        &:first-child{
          border-bottom-left-radius: r(4);
          border-top-left-radius: r(4);
        }
        &:last-child{
          border-top-right-radius: r(4);
          border-bottom-right-radius: r(4);
        }
      }
    }
    .warning-tip{
      width: 100%;
      height: r(30);
      background: #FF8B8B;
      display: flex;
      .text{
        height: r(30);
        line-height: r(30);
        @include f(14px);
        color: $white;
        white-space: nowrap;
        animation: roll 15s linear infinite;
      }
    }
    .type{
      width: 100%;
      height: r(40);
      line-height: r(40);
      padding-left: r(10);
      background: $white;
      border-bottom: r(1) solid #D8D8D8;
      @include f(16px);
      .icon{
        /*margin-right: r(5);*/
        width: r(19);
        height: r(16);
      }
    }
    .tran-container {
      position: absolute;
      width: 100%;
      height: calc(100% - #{r(188)});
      top: r(139);
      left: 0;
      overflow: hidden;
    }
  }
  @keyframes roll {
    0%{
      transform: translateX(100%);
    }
    100%{
      transform: translateX(-100%);
    }
  }
</style>
