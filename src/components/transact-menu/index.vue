<template>
  <div>
    <pc-activity @quickBuySell="quickBuyOrSell"></pc-activity>
    <div class="transact-menu">
      <div class="container min-width">
        <div class="row">
          <router-link v-for="(item,i) in transactMenuData" class="item-info" :to="item.to" :key="i">
            {{generateTitle(item.name)}}
          </router-link>
          <a href="javascript:void(0);" class="item-info" @click="isShowPostPend=true">
            <span class="float-trantips"></span>
            {{$t('postPend.postTitle')}}
          </a>
          <router-link :to="{name: 'tranPending'}" class="item-info">{{$t('transactionHome.pengdingOrder')}}
          </router-link>
          <router-link :to="{name: 'tranRecord'}" class="item-info">{{$t('transactionHome.orderRecord')}}</router-link>
          <router-link :to="{name:'pcMyGift'}" class="item-info">{{$t('userCenter.myGift')}}</router-link>
        </div>
      </div>
    </div>
    <post-pendord v-if="isShowPostPend" v-model="isShowPostPend" url-name="tranPending"
                  :type="getType"
                  :amount="amount"
                  :bank-no="bankNo"
                  :auto="auto"
    ></post-pendord>
  </div>
</template>
<script>
  import postPendord from 'components/trancomp/post-pendord'
  import {generateTitle} from '@/util/i18n'
  import PcActivity from '../../views/pc-activity'
  import {mapGetters} from 'vuex'

  let transactMenuData = [
    {name: 'transactionHome.buyUet', value: 'buyUet', to: {name: 'transaction'}},
    {name: 'transactionHome.saleUet', value: 'saleUet', to: {name: 'transell'}}
  ]

  export default {
    data() {
      return {
        transactMenuData: transactMenuData,
        isShowPostPend: false,
        mode: Number(this.$route.query.mode) || 1, //判断用户意图 1是默认不打开买卖弹窗 2是打开我要买币弹窗  3是打开我要卖币
        amount: this.$route.query.amount, //商户提现 金额
        bankNo: this.$route.query.bankNo, //商户提现 银行卡号
        auto: Number(this.$route.query.auto) || 0, //商户提现 自动填写信息
      }
    },
    props: {},
    watch: {
      isShowFastSale(val) {
        if (val) {
          this.isShowPostPend=true
        }
      }
    },
    methods: {
      generateTitle,
      toSell(data) {
        this.mode = data.mode
        this.amount = data.amount
        this.bankNo = data.bankNo
        this.auto = data.auto
        this.isShowPostPend = true
      },
      quickBuyOrSell(type){
        this.mode = type === 'sell' ? 3 : 1
        this.isShowPostPend = true
      }
    },
    computed: {
      getType() {
        return this.mode === 1 ? 1 : (this.mode === 3 ? 2 : 1)
      },
      ...mapGetters(["isShowFastSale"])
    },
    created() {
      if (this.mode > 1) {
        this.isShowPostPend = true
      }
      Vue.$global.bus.$on('open:QuickSell', (data) => {
        this.toSell(data)
      });
    },
    mounted() {
    },
    activated() {
    },
    components: {
      postPendord,
      PcActivity
    },
    destroyed() {
      Vue.$global.bus.$off('open:QuickSell')
    }
  };
</script>
<style lang="scss">
.transact-menu {
  width: 100%;
  height: 48px;
  line-height: 48px;
  margin-top: 20px;
  a {
    position: relative;
    display: block;
    float: left;
    width: 15%;
    text-align: center;
    font-size: 16px;
    color: #787876;
    border: 1px solid #D4D4D4;
    border-bottom: none;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    margin-right: 1.75%;
    &:hover, &.active {
      color: #ffffff;
      background: #5087FF;
      border: 1px solid #5087FF;
      border-bottom: none;
    }
    &:last-child {
      margin: 0;
      float: right;
    }
   .float-trantips{
     position: absolute;
     top: -12px;
     right: -2px;
     width: 58px;
     height: 29px;
     background: url("~images/transend-coins.png") no-repeat center center;
     -webkit-animation: a-float 1.4s linear infinite;
     animation: a-float 1.4s linear infinite;
   }
  }
}
</style>
