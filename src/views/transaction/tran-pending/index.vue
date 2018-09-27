<template>
  <div>
    <div class="top-header header-padding"></div>
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <transact-menu></transact-menu>
    <div class="section pengding-orders">
      <div class="container min-width min-height">
        <div class="row0">
          <div class="tran-content border-box">
            <div class="row border-bottom">
              <tranred-sub-nav :nav-list="pendingType"
                               :show-search="false"
                               @changeTab="pendingItem = $event"
                               ></tranred-sub-nav>
            </div>

            <div class="group-head">
              <span class="unit">挂单类型</span>
              <span class="unit">挂单时间</span>
              <span class="unit">挂单数量</span>
              <span class="unit">交易单价</span>
              <span class="unit unit2">已完成</span>
              <span class="unit">操作 <span @click="">(刷新)</span></span>
            </div>
            <transition name="list-animate">
              <pend-list :tab-type="1" v-model="searchKey" v-if="pendingItem === 'tranPendingOrder'"></pend-list>
            </transition>
            <transition name="list-animate">
              <pend-list :tab-type="2"  v-model="searchKey" v-if="pendingItem === 'tranPendingRemoved'"></pend-list>
            </transition>
          </div>
        </div>
      </div>

    </div>
    <v-footer></v-footer>
  </div>

</template>
<script>
  import NavMenu from 'components/nav';
  import VFooter from 'components/footer';
  import BreadCrumbs from 'components/bread-crumbs'
  import TransactMenu from 'components/transact-menu';
  import TranredSubNav from 'components/transact-menu/tranred-subnav'

  import {transaction} from 'api'
  import {generateTitle} from '@/util/i18n'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import PendList from './pending-list'

  let orderHead = [
    {name: "order.orderType", value: "orderType"},
    {name: "order.otherSide", value: "otherSide"},
    {name: "order.transQuantity", value: "transQuantity"},
    {name: "order.transUnitPrice", value: "transUnitPrice"},
    {name: "order.transAmount", value: "transAmount"},
    {name: "order.transStatus", value: "transStatus"},
    {name: "order.transControl", value: "transControl"},
  ]


  export default {
    data() {
      return {
        pendingType: [
          {name: "transactionRecord.tranPendingOrder", value: "tranPendingOrder"},
          {name: "transactionRecord.tranPendingRemoved", value: "tranPendingRemoved"}
        ],
        pendingItem: 'tranPendingOrder',
        breadList:[
          {
            urlName:'transaction',
            name:'navbar.tradingHall'
          },
        ],
        searchKey:''
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'islogin',
      ]),

    },
    methods: {
      generateTitle,

    },

    created() {

    },
    mounted() {

    },
    components: {
      NavMenu,
      VFooter,
      BreadCrumbs,
      TransactMenu,
      PendList,
      TranredSubNav,
    }
  };
</script>

<style lang="scss" scoped>
  .list-animate-enter,.list-animate-leave{
    opacity: 0;
  }
  .list-animate-leave-active{
    transition: all .5s;
  }
  .percent-bar{
    display:inline-block;
    height:18px;
    border:1px solid #d4d4d4;
    border-radius: 20px;
    width:65%;
    position:relative;
    i{
      position:absolute;
      left:0;
      display:inline-block;
      height:18px;
      width:10%;
      border-radius: 20px;
      background: #5087ff;
      -webkit-transition:width .8s ease;
      -moz-transition:width .8s ease;
      transition:width .8s ease;
      -webkit-animation:progressbar 7s infinite;
      animation:progressbar 7s infinite;

    }
  }
  .border-bottom{
    border-bottom:1px solid #d5d5d5;
    height:79px;
    overflow: hidden;
  }
  .s-percent{
    display:inline-block;
    min-width:60px;
    padding:0 0 0 5px;
  }
  .group-head .unit2, .group-body .unit2 {
    width: 26%;
  }

  .pengding-orders {

      .border-box {
        border: 1px solid #D4D4D4;
      }

  }

  .c-blue {
    color: #5087ff;
  }

  .c-orange {
    color: #ff9600;
  }

  .tab-link-a {
    display: inline-block;
    width: 200px;
    text-align: center;
    font-size: 16px;
    color: #333333;
    height: 77px;
    line-height: 77px;
    cursor: pointer;

      &.active {
        color: #5087ff;
        border-bottom: 1px solid #5087FF;
      }

  }

  .tran-content .btn-danger {
    background: orange;
    color: #fff;
    border-color: orange;
  }

</style>
