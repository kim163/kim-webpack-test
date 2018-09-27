<template>
  <div class="transaction-main header-padding">
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <transact-menu v-if="islogin"></transact-menu>
    <guide-page v-if="!islogin"></guide-page>

    <div class="section transaction-content" v-if="islogin">
      <div class="container min-width">
        <div class="row relative min-height">
          <div class="col-18 fl">
               <tranbuy-list></tranbuy-list>
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
    <withdraw-tip v-if="withdrawTip" v-model="withdrawTip" :is-pc="true"></withdraw-tip>
  </div>
</template>
<script>
  import navMenu from 'components/nav';
  import vFooter from 'components/footer';
  import BreadCrumbs from 'components/bread-crumbs'
  import transactMenu from 'components/transact-menu';
  import guidePage from './components/guide-page';
  import tranbuyList from './components/tranbuy-list';

  import userWalletass from 'components/trancomp/user-walletass';
  import recentOrders from 'components/trancomp/recent-orders';
  import WithdrawTip from 'components/withdraw-tip';

  import {mapGetters,mapActions,mapMutations} from 'vuex'

  export default {
    data() {
      return {
        breadList:[
          {
            urlName:'transaction',
            name:'navbar.tradingHall'
          }
        ],
        withdrawTip:false
      };
    },
    methods: {

    },
    created() {
      if(this.getWithdraw){
        this.withdrawTip = true
        this.$store.commit('GET_WIDTHDRAW',false)
      }
    },
    watch: {

    },
    computed: {
      ...mapGetters([
        "islogin",
        "getWithdraw"
      ])
    },
    components: {
      navMenu, vFooter, BreadCrumbs, transactMenu, guidePage, tranbuyList, userWalletass, recentOrders,
      WithdrawTip
    },
    beforeRouteEnter(to,from,next){
      if(_.isMobile()){
        next({name:'mIndex',replace:true})
      }else{
        next()
      }
    }
  };
</script>
<style lang="scss">
  .transaction-main {
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
    .relative{
      position: relative;
    }
  }
</style>
