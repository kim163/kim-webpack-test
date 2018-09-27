<template>
  <div class="transell-main header-padding">
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <transact-menu></transact-menu>
    <div class="section transaction-content">
      <div class="container min-width">
        <div class="row min-height">
          <div class="col-18 fl">
             <transell-list></transell-list>
          </div>
          <div class="col-19 fr">
            <h1 class="asset-title"> {{$t('transactionHome.assetManage')}} </h1>
            <user-walletass></user-walletass>
            <recent-orders></recent-orders>
          </div>
        </div>
      </div>
    </div>

    <v-footer ></v-footer>
  </div>
</template>
<script>
  import navMenu from 'components/nav';
  import vFooter from 'components/footer';
  import BreadCrumbs from 'components/bread-crumbs'
  import transactMenu from 'components/transact-menu';
  import transellList from './components/transell-list';

  import userWalletass from 'components/trancomp/user-walletass';
  import recentOrders from 'components/trancomp/recent-orders';

  export default {
    data() {
      return {
        breadList:[
          {
            urlName:'transaction',
            name:'navbar.tradingHall'
          },
        ]
      };
    },
    methods: {

    },
    created() {

    },
    watch: {

    },
    computed: {

    },
    components: {
      navMenu, vFooter, BreadCrumbs, transactMenu, transellList, userWalletass, recentOrders
    }
  };
</script>
<style lang="scss">
  .transell-main{
    .transaction-content{
      margin-bottom: 30px;
      .row{
        border: 1px solid #D4D4D4;
      }
      .col-18,.col-19{
        margin: 0;
      }
      .col-18{
        border-right: 1px solid #D4D4D4;
      }
      .asset-title{
        line-height: 60px;
        font-size: 20px;
        color: #333333;
        padding-left: 19px;
        font-weight: normal;
      }
    }

  }
</style>
