<template>
  <div class="tranrecord-main header-padding">
    <nav-menu></nav-menu>
    <BreadCrumbs :bread-list="breadList"></BreadCrumbs>
    <transact-menu></transact-menu>
    <div class="container min-width min-height">
      <div class="row0">
        <div class="tran-content border-box">
          <div class="row border-bottom">
            <tranred-subnav :nav-list="navListData"
                            @changeTab="tabItem = $event"
                            @search="search = $event"
                            @searchKey="searchKey = $event"></tranred-subnav>
            <transition name="list-animate">
              <record-list v-if="tabItem === 'tranProgress'" v-model="search" :tab-type="1" :search-key="searchKey"></record-list>
            </transition>
            <transition name="list-animate">
              <record-list v-if="tabItem === 'tranComplete'" v-model="search" :tab-type="2" :search-key="searchKey"></record-list>
            </transition>
            <transition name="list-animate">
              <record-list v-if="tabItem === 'appealRecord'" v-model="search" :tab-type="3" :search-key="searchKey"></record-list>
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
  import TransactMenu from 'components/transact-menu';
  import VFooter from 'components/footer';
  import TranredSubnav from 'components/transact-menu/tranred-subnav';
  import BreadCrumbs from 'components/bread-crumbs'
  import RecordList from './record-list'

  export default {
    data() {
      return {
        breadList: [
          {
            urlName: 'transaction',
            name: 'navbar.tradingHall'
          },
        ],
        navListData: [
          {name: 'transactionRecord.tranProgress', value: 'tranProgress'},
          {name: 'transactionRecord.tranComplete', value: 'tranComplete'},
          // {name: 'transactionRecord.appealRecord', value: 'appealRecord'}
        ],
        tabItem: 'tranProgress',
        tabType: 1,
        searchKey: "",
        search:false,
      };
    },
    components: {
      NavMenu,
      TransactMenu,
      VFooter,
      TranredSubnav,
      BreadCrumbs,
      RecordList
    }
  };
</script>
<style lang="scss">

</style>
