<template>
  <div class="my-pending-orders">
    <mobile-header>{{$t('transactionRecord.tranPending')}}</mobile-header>
    <div class="mobilenav-tabs">
        <span v-for="(item,i) in pendingOrdersType" @click="pendingOrdersItem = item.value"
              :class="{active:pendingOrdersItem === item.value}" :key="item.value">
            {{generateTitle(item.name)}}
        </span>
    </div>
    <div class="orders-list">
      <transition name="list-animate">
        <my-pending-list :tab-type="1" v-if="pendingOrdersItem === 1"></my-pending-list>
      </transition>
      <transition name="list-animate">
        <my-pending-list :tab-type="2" v-if="pendingOrdersItem === 2"></my-pending-list>
      </transition>
    </div>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header';
  import { generateTitle } from '@/util/i18n';
  import { mapGetters } from 'vuex'
  import MyPendingList from './my-pending-list'
  export default {
    name: "my-pending-orders",
    data() {
      return {
        pendingOrdersType:[
          {name:'postPend.processing', value: 1 },
          {name:'postPend.hasBeenRemoved', value: 2 }
        ],
        pendingOrdersItem: 1,
      }
    },
    computed: {
      ...mapGetters([
        "userData"
      ]),
    },
    components:{
      MobileHeader,
      MyPendingList,
    },
    methods: {
      generateTitle,
    },
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .list-animate-enter { //临时添加点小动画
    opacity: 0;
  }
  .list-animate-leave {
    opacity: 0;
  }
  .list-animate-enter-active{
    transition: all .5s;
  }
  .list-animate-leave-active{
    transition: all 0s;
  }

  .amount-balance {
    @include f(16px);
    color: #333333;
    padding: 0 0 r(15) r(10);
  }
  .orders-list{
    width: 100%;
    height: calc(100% - #{r(109)});
    position: absolute;
    top: r(109);
  }
</style>