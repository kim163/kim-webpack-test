<template>
  <div class="tran-list-main">
    <Scroll
            :updateData="[tranList]"
            :refreshData="[]"
            :pullDownConfig="pullDownCfg"
            :pullUpConfig="pullUpCfg"
            @pullingDown="loadRefresh"
            @pullingUp="loadMore"
            ref="scroll"
            @scroll="getScroll"
            :listenScroll="true"
            :probeType="2"
                    v-if="!noData">
    <ul class="list">
      <router-link tag="li" :to="orderDetailLink(item)" class="tran-item" v-for="(item,index) in tranList"
                   :key="index">
        <div class="type-status">
          <div class="type" :class="getType(item).className">{{getType(item).text}}</div>
          <!--<div class="type red-text" v-show="item.debit === userId">{{$t('transactionRecord.sale')}}</div>-->
          <div class="status-time" v-if="type === 0">
            <div class="status" v-if="item.status != 61">
              {{(item.status === 45 ? $t('transactionRecord.waitingForPayment') : $t('transactionRecord.waitingForRelease'))}}
            </div>
            <div class="time" v-if="item.status != 61">
              <countdown :end-time="item.intervalTime-item.elapsedTime" end-text="过期"></countdown>
            </div>
            <div class="time" v-else>申诉锁定</div>
          </div>
          <div class="status-time" v-else>
            <div class="status">
              <span v-if="item.status =='204'">已取消</span>
              <span v-if="item.status =='203'">{{$t('transactionRecord.tranComplete')}}</span>
            </div>
          </div>
        </div>
        <div class="user-amount">
          <div class="user">{{item.credit === userId ? item.debitName : item.creditName}}</div>
          <div class="amount">
            <span class="text-red">{{item.creditAmount}}</span> UET
          </div>
        </div>
      </router-link>
    </ul>
  </Scroll>
    <no-data-tip v-else></no-data-tip>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Scroll from 'vue-slim-better-scroll'
  import { generateTitle } from '@/util/i18n'
  import NoDataTip from 'components/no-data-tip'
  import Countdown from 'components/countdown'
  import {
    getOrderxPage,
    getTransactionPage
  } from 'api/transaction'
  export default {
    name: "transaction-list",
    data() {
      return {
        limit: 10,
        offset: 0,
        tranList: [],//交易列表
        currentPage:1,
        total:0, //总条数
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
        noData:false
      }
    },
    components: {
      Countdown,
      Scroll,
      NoDataTip
    },
    props: {
      type: {
        type: Number,
        default: 0 //0代表交易中 1代表已完成
      }
    },
    computed: {
      ...mapGetters([
        "userId"
      ]),
      totalPage () {
        return Math.ceil(this.total / this.limit)
      },
    },
    methods: {
      generateTitle,
      getTranList() {
        const api = this.type === 0 ? getOrderxPage : getTransactionPage
        const request = {
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
          credit: this.userId,
          debit: this.userId,
          types: [11, 12, 41, 42, 43, 51, 52, 53, 54]
        }
        console.log(request)
        api(request).then(res => {
          if (res.code === 10000) {
            console.log('getOrderxPage res:', res)
            if(res.data.length === 0 && this.currentPage === 1){
              this.noData = true
            }else{
              this.noData = false
            }
            this.tranList = [...this.tranList, ...res.data]
            this.total = res.pageInfo.total
            if(this.currentPage >= this.totalPage){
              this.$refs.scroll.update(true)
            }
          } else {
            toast(res.message)
          }
        }).catch(error => {
          toast("请求失败")
        })
      },
      loadMore() {
        this.currentPage += 1
        this.getTranList()
      },
      loadRefresh() {
        this.currentPage = 1
        this.tranList = []
        this.getTranList()
      },
      orderDetailLink(item){
        let routerName = ''
        if(this.type === 0){
          routerName = item.status === 61 ? 'mOrderAppeal' : 'mOrder'
        }else{
          routerName = 'mOrderOver'
         /*如果是从交易记录里面去mOrderOver的话那么不用发送请求*/
          this.$store.commit('GET_ISNEEDCOUPON',false)
        }
        return {name: routerName, params:{ id: item.id}}
      },
      getScroll(e){
        this.scrollY = e.y
      },
      getType(data){
        const obj = {
          text:'',
          className:''
        }
        if(data.type === 11 || data.type === 12){
          if(this.userId === data.credit){
            obj.text = '买入'
            obj.className = 'c-blue'
          }else if(this.userId === data.debit){
            obj.text = '卖出'
            obj.className = 'c-orange'
          }
        }else{
          switch (data.type){
            case 41:
              obj.text = '转账'
              break
            case 42:
              obj.text = '商户充值'
              break
            case 43:
              obj.text = '商户提现'
              break
            case 51:
              obj.text = '交易奖励'
              break
            case 52:
              obj.text = '商户充值奖励'
              break
            case 53:
              obj.text = '商户提现奖励'
              break
            case 54:
              obj.text = '活动奖励'
              break
          }
        }
        return obj
      }
    },
    mounted() {
      this.getTranList()
    },
    activated() {
      if(this.$refs.scroll){
        setTimeout(()=>{
          if(this.$refs){
            this.$refs.scroll.scrollTo(0,this.scrollY,0)
          }
        },1000)
      }
      Vue.$global.bus.$on('update:tranList',() => {
        this.getTranList()
      })
    },
    deactivated(){
      Vue.$global.bus.$off('update:tranList')
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .tran-list-main{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .list {
    display: block;
  }

  .tran-item {
    width: 100%;
    height: r(88);
    background: $white;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: #D8D8D8;
    margin-bottom: r(12);
    padding: r(20) r(10) 0;
    @include f(15px);
    .type-status {
      display: flex;
      justify-content: space-between;
      .type {
        &.red-text {
          color: #FF0000;
        }
        &.blue-text {
          color: #5087FF;
        }
      }
      .status-time {
        display: flex;
        justify-content: center;
      }
      .time {
        margin-left: r(5);
      }
    }
    .user-amount {
      display: flex;
      justify-content: space-between;
      margin-top: r(10);
      .text-red {
        color: #FF0000;
        @include f(18px)
      }
    }
  }
</style>
