<template>
  <div class="mobile-trandatas-main">
    <scroll
            ref="scroll"
            :updateData="[dataList.data]"
            :refreshData="[]"
            :pullDownConfig="pullDownCfg"
            :pullUpConfig="pullUpCfg"
            @pullingDown="loadRefresh"
            @pullingUp="loadMore"
            @scroll="getScroll"
            :listenScroll="true"
            :probeType="2"
            v-if="!noData"
    >
      <div class="mobile-trandatas mtranbuy-list">
        <div class="tranlist-container">
          <div class="tranlist-item" v-for="(item,i) in dataList.data||[]" :key="i">
            <tran-detail :item="item" :type-info="type" @buySell="buyOrSell"></tran-detail>
          </div>
        </div>
      </div>
    </scroll>
    <tran-buy-sell v-if="showBuySell"
                   v-model="showBuySell"
                   :item-info="buySellItem"
                   :type-info="type"></tran-buy-sell>
    <no-data-tip v-if="noData"></no-data-tip>
  </div>
</template>
<script>
  import {
    getOrderxPendingPage
  } from 'api/transaction';
  import {generateTitle} from '@/util/i18n';
  import {SETTING} from "@/assets/data";
  import Scroll from 'vue-slim-better-scroll';
  import NoDataTip from 'components/no-data-tip';
  import tranDetail from './tran-detail';
  import tranBuySell from './tran-buy-sell'
  import {mapGetters} from 'vuex';

  export default {
    data() {
      return {
        SETTING,
        dataList: {
          data: [],
          total: 0
        },
        reqData: {
          limit: 10,
          offset: 0,
          currentPage:1,
          status:1,
          startBalance: 0
        },
        pullDownCfg:{
          txt:this.generateTitle('scorllCfg.pullDownText'),
          threshold:45,
          stop:20
        },
        pullUpCfg:{
          txt:{
            more:this.generateTitle('scorllCfg.pullUpMore'),
            noMore:this.generateTitle('scorllCfg.pullUpNoMore')
          }
        },
        scrollY:0,
        noData:false,
        showBuySell:false,
        buySellItem:{}
      }
    },
    props:{
      type:{
        type:Number,
        default:1 //1买入 2卖出
      }
    },
    watch:{
      showBuySell(val){
        if(!val){
          this.buySellItem = {}
        }
      }
    },
    components: {
      Scroll,
      NoDataTip,
      tranDetail,
      tranBuySell
    },
    computed: {
      ...mapGetters(["userData"]),
      avatarDealw() {
        return this.SETTING.avatarColor.length;
      },
      totalPage() {
        return Math.ceil(this.dataList.total / this.reqData.limit)
      },
    },
    methods: {
      generateTitle,
      searchDataList(index) {
        // if (!isNaN(index)) {
          this.reqData.offset = (this.reqData.currentPage - 1) * this.reqData.limit;
        // }
        console.log('req:', this.reqData);
        Object.assign(this.reqData,{
          type: this.type === 1 ? 11 : 12
        })
        getOrderxPendingPage(this.reqData).then(res => {
          console.log('买入UET get OrderxPageForHallSell data:');
          console.log(res);
          if(res.data.length === 0 && this.reqData.currentPage === 1){
            this.noData = true
          }else{
            this.noData = false
            this.dataList.data = [...this.dataList.data, ...res.data.map(item => {
              let mathRand = parseInt(Math.random()*this.avatarDealw,10);
              item.avatarColor = this.SETTING.avatarColor[mathRand];
              return item;
            })];
            this.dataList.total = res.pageInfo.total;
            if (this.totalPage <= this.reqData.currentPage) {
              this.$refs.scroll.update(true)
            }
          }
        }).catch(error => {
          toast(error.message);
        });
      },

      tipsOwnOrder(){
        toast('不能购买自己的挂单');
      },

      loadRefresh() {
        this.reqData.currentPage = 1
        this.dataList.data = []
        this.searchDataList()
      },
      loadMore() {
        this.reqData.currentPage += 1
        this.searchDataList()
      },
      getScroll(e){
        this.scrollY = e.y
      },
      buyOrSell(item){
        this.buySellItem = item
        this.showBuySell = true
      }
    },
    created() {
      this.searchDataList();
    },
    mounted() {

    },
    activated() {
      setTimeout(() => {
        if(this.$refs.scroll){
          this.$refs.scroll.scrollTo(0,this.scrollY,0)
        }
      }, 100)
    },
  };
</script>
<style lang="scss">
  @import "~assets/scss/mobile";
  .mobile-trandatas-main{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .mobile-trandatas{
      width: 100%;
      .tranlist-container{
        @include  f(12px);
        /*color: #787876;*/
        .tranlist-item{
          background: $white;
          border-bottom: r(1) solid #D8D8D8;
          a{
            display: block;
          }
        }
      }
    }
  }
</style>

