<template>
  <div>
    <div class="group-head">
      <span class="unit">订单类型</span>
      <span class="unit">{{tabType === 3 ? '申诉人' : '对方'}}</span>
      <span class="unit">交易数量</span>
      <span class="unit">交易单价</span>
      <span class="unit">交易金额</span>
      <span class="unit">状态</span>
      <span class="unit">操作 <span>(刷新)</span></span>
    </div>
    <div class="group-body">
      <div v-if="!noData">
        <div class="group-tr" v-for="(item,index) in dataList" :key="index">
          <span class="unit">
            <span v-if="tabType != 3">
              <span class="type" :class="getType(item).className">{{getType(item).text}}</span>
              <!--<span class="c-orange type" v-if="item.debit == userData.userId">{{$t('transactionRecord.sale')}}</span>-->
            </span>
            <span v-else>
              <span class="c-blue type" v-if="item.userId == userData.userId">我方发起申诉</span>
              <span class="c-orange type" v-else>对方发起申诉</span>
            </span>
          </span>
          <span class="unit">{{getUserName(item)}}</span>
          <span class="unit"> {{tabType === 3 ? item.amount : item.creditAmount}}   UET</span>
          <span class="unit"> 0.01 CNY</span>
          <span class="unit cl-red">{{tabType === 3 ? item.amountTwin : item.creditAmountTwin}} CNY</span>
          <span class="unit" v-if="tabType === 1">
            <span v-if="item.status != 61">
              {{(item.status === 45 ? $t('transactionRecord.waitingForPayment') : $t('transactionRecord.waitingForRelease'))}}
            </span>
            <span v-else-if="item.status != 61">
              <countdown :end-time="item.intervalTime-item.elapsedTime" end-text="已过期"></countdown>
            </span>
            <span v-else>申诉锁定</span>
          </span>
          <span class="unit" v-if="tabType === 2">
            <span v-if="item.status =='204'" :class="{'text-gray': item.status =='204'}">交易取消</span>
            <span v-else>交易完成</span>
          </span>
          <span class="unit" v-if="tabType === 3">
            {{item.resultTypeText}}
          </span>
          <span class="unit">
            <router-link :to='orderDetailLink(item)' class="btn btn-primary">详情</router-link>
          </span>
        </div>
        <paging-by :data="pageInfo" @search="getDataList"></paging-by>
      </div>
      <no-data-tip v-else></no-data-tip>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import NoDataTip from 'components/no-data-tip'
  import PagingBy from "components/paging-by"
  import CountDown from 'components/countdown'
  import {
    getAppealHistoryPage,
    getTransactionPage,
    getOrderxPage
  } from 'api/transaction'
  export default {
    name: "record-list",
    data() {
      return {
        dataList: [],
        limit: 10,
        offset: 0,
        currentPage: 1,
        noData: false,
        pageInfo: {}
      }
    },
    watch:{
      search(val){
        if(val){
          this.getDataList()
        }
      },
    },
    model:{
      prop: 'search',
      event: 'change'
    },
    props: {
      tabType: {  //1交易中  2交易完成  3申诉记录
        type: Number,
        default: 1,
        request: true
      },
      searchKey:{
        type:String,
        default:''
      },
      search:{
        type:Boolean,
        default:false
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'userData'
      ])
    },
    components: {
      NoDataTip,
      PagingBy,
      CountDown,
    },
    methods: {
      getDataList(index){
        this.currentPage = !isNaN(index) ? index : this.currentPage
        const request={
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
        }
        if(this.tabType != 3){
          Object.assign(request,{
            credit: this.userId,
            debit: this.userId,
            types:[11, 12, 41, 42, 43, 51, 52, 53, 54]
          })
        }else {
          Object.assign(request,{
            userId: this.userId
          })
        }
        if(this.searchKey != ''){
          if(this.tabType != 3){
            Object.assign(request,{
              debitName: this.searchKey,
              creditName: this.searchKey
            })
          }else{
            Object.assign(request,{
              nickname: this.searchKey
            })
          }
        }
        console.log('record request',request)
        let api = _.noop()
        switch (this.tabType){
          case 1:
            api = getOrderxPage
            break
          case 2:
            api = getTransactionPage
            break
          case 3:
            api = getAppealHistoryPage
            break
          default:
            break
        }
        api(request).then(res => {
          console.log('record list',res)
          if(res.code === 10000){
            if(res.data.length === 0 && this.currentPage === 1){
              this.noData = true
            }else{
              this.noData = false
            }
            this.dataList = [...res.data]
            this.pageInfo = res.pageInfo
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        }).finally(() => {
          this.$emit('change',false)
        })
      },
      orderDetailLink(item){
        let routerName = ''
        let id = item.id
        if(this.tabType === 1){
          routerName = item.status === 61 ? 'orderDetailAppeal' :'orderDetail'
        }else if(this.tabType === 2){
          routerName = 'orderDetailOver'
        }else if(this.tabType === 3){
          routerName = 'orderDetailOver'
          id = item.orderId
        }
        return {name: routerName, params:{ id }}
      },
      getUserName(item){
        if(this.tabType === 3){
          return item.userName
        }else{
          return item.credit == this.userData.userId ? item.debitName : item.creditName
        }
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
    mounted(){
      this.getDataList()
    },
    activated() {
      Vue.$global.bus.$on('update:tranList',() => {
        this.getDataList()
      })
    },
    deactivated(){
      Vue.$global.bus.$off('update:tranList')
    }
  }
</script>

<style lang="scss" scoped>
  .type{
    display: block;
    width: 80%;
    border-radius: 5px;
    margin: 0 auto;
  }
  .blue-border{
    border: 1px solid #5087ff;
  }
  .orange-border{
    border: 1px solid #ff9600;
  }
  .text-gray{
    color: #787876;
  }
</style>

