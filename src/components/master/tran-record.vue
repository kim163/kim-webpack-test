<template>
  <div class="tranrecord-main">
    <nav-menu></nav-menu>
    <BreadCrumbs :bread-list="breadList"></BreadCrumbs>
    <transact-menu></transact-menu>
    <tranred-subnav></tranred-subnav>

    <router-view></router-view>

    <v-footer ></v-footer>
  </div>
</template>
<script>
  import navMenu from 'components/nav';
  import transactMenu from 'components/transact-menu';
  import vFooter from 'components/footer';
  import tranredSubnav from 'components/transact-menu/tranred-subnav';
  import BreadCrumbs from 'components/bread-crumbs'

  export default {
    data() {
      return {
        breadList:[
          {
            urlName:'transaction',
            name:'navbar.tradingHall'
          },
          {
            urlName:'tranRecord',
            name:'transactionHome.orderRecord'
          },
        ]
      };
    },
    props: {},
    methods: {},
    computed: {},
    created() {
    },
    components: {
      navMenu, transactMenu, vFooter, tranredSubnav,BreadCrumbs
    }
  };
</script>
<style lang="scss">
.tranrecord-main{
  padding-top: 100px;


}

</style>
