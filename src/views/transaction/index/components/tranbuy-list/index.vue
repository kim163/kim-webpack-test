<template>
  <div class="tran-datalist">
      <div class="tranlist-container">
          <div class="tranlist-head">
              <p v-for="(item,i) in dataHead" :class="['head-item',item.value]">  {{generateTitle(item.name)}}  </p>
          </div>
          <div class="tranlist-body" v-if="!noData">
             <div class="tranlist-item" v-for="(item,i) in dataList.data||[]">
                 <div class="tran-message">
                   <p class="txt-left item sellers">
                     <span class="disp-inlblo fl avatars-part" >
                       <span class="disp-inlblo posit-rel">
                         <a class="avatars-item" :style="{'background':item.avatarColor}" href="javascript:void(0);"> {{(item.userName).substring(0, 1)}} </a>
                         <a :class="['avatar-onlineicon',item.sponsorOnlineStatus === 1?'online-icon':'notonline-icon']" href="javascript:void(0);"></a>
                       </span>
                      <a v-if="item.sponsorOnlineStatus === 1" href="javascript:void(0);" class="avatar-onlinebtn now-online">在线</a>
                      <a v-else-if="item.sponsorOnlineStatus === 0" href="javascript:void(0);" class="avatar-onlinebtn not-online">离线</a>
                      <a v-else href="javascript:void(0);" class="avatar-onlinebtn not-online">
                        {{item.sponsorOnlineStatus}}
                      </a>
                     </span>
                     {{item.userName}}
                   </p>
                   <p class="item tranCountOrRate">
                     {{item.tradeTotal}} 丨
                     <span v-if="item.tradeTotal"> {{ ((item.finishedTotal/item.tradeTotal)*100).toFixed(2)}}</span>
                     <span v-if="!item.tradeTotal">0 </span>％
                   </p>
                   <p class="item">0.01 CNY</p>
                   <p class="item quantity"> {{item.balance}} UET </p>
                   <p class="item">
                     <span v-if="item.accountTypeTwin === 1" class="iconfont icon-pay-alipay"></span>
                     <span v-else-if="item.accountTypeTwin === 2" class="iconfont icon-pay-wechat" ></span>
                     <span v-else-if="item.accountTypeTwin === 3" class="iconfont icon-pay-bank"></span>
                     <span v-else>
                      {{item.accountTypeTwin}}
                      </span>
                   </p>
                   <p class="item">
                     <a href="javascript:void(0);" v-if="item.userId !== userData.userId" class="transaction-btn" @click="showView('show',item)">{{$t('transactionHome.buyUet')}}</a>
                     <a href="javascript:void(0);" v-else class="transaction-btn ownpend-order">{{$t('transactionHome.buyUet')}}</a>
                   </p>
                 </div>
                 <tranbuy-order :item="item"
                                v-show="item.already"
                                v-if="item.userId !== userData.userId"
                                :ref="item.id"
                                @hiddenOrder="showView('hidden',item)"
                                :key="item.id"
                 ></tranbuy-order>

             </div>

          </div>
          <no-data-tip v-else></no-data-tip>
      </div>

    <paging-by :data="dataList.pageInfo" @search="searchDataList"></paging-by>
  </div>
</template>
<script>
  import { transaction } from 'api';
  import { generateTitle } from '@/util/i18n';
  import pagingBy from "components/paging-by";
  import  {SETTING} from "@/assets/data";
  import tranbuyOrder from "./tranbuy-order";
  import {mapGetters,mapActions,mapMutations} from 'vuex';
  import NoDataTip from 'components/no-data-tip';

  let dataHead = [
    {name: "table.sellers", value: "sellers"},
    {name: "table.tranCountOrRate", value: "tranCountOrRate"},
    {name: "table.unitPrice", value: "unitPrice"},
    {name: "table.quantity", value: "quantity"},
    {name: "table.payMethod", value: "payMethod"},
    {name: "table.operating", value: "operating"}
  ]

  export default {
    data() {
      return {
        SETTING,
        dataHead,
        dataList: {
          data: [],
          pageInfo: {}
        },
        reqData: {
          limit:10,
          offset:0,
          type: 11,
          startBalance:0,
          status:1,
        },
        noData:false
      }
    },
    computed: {
      ...mapGetters(["userData"]),
       avatarDealw(){
         return this.SETTING.avatarColor.length;
       }
    },
    methods: {
      generateTitle,
      searchDataList(index) {
        if(!isNaN(index)) {
          this.reqData.offset = (index - 1) * this.reqData.limit;
        }
        console.log('req:',this.reqData);

        transaction.getOrderxPendingPage(this.reqData).then(res => {
          console.log('买入UET get OrderxPageForHallSell data:',res);
          if(res.code === 10000){
            if(res.data.length === 0 && this.reqData.offset === 0){
              this.noData = true;
            }else{
              this.noData = false;
              this.dataList.data = res.data.map(item => {
                let mathRand = parseInt(Math.random()*this.avatarDealw,10);
                item.already = false;
                item.avatarColor = this.SETTING.avatarColor[mathRand];
                return item;
              });
            }
            this.dataList.pageInfo = res.pageInfo;
          }else{
           toast(res.message)
          }
        }).catch(error => {
          toast(error.message);
        });
      },

      showView(type,item) {
        if(type == 'show'){
          this.$nextTick(() => {
            item.already = true;
          });
        }else {
          this.$nextTick(() => {
            item.already = false;
          });
        }
      }

    },
    created() {
      this.searchDataList();
    },
    mounted() {
    },
    activated() {
    },
    components: {
      pagingBy, tranbuyOrder, NoDataTip
    }
  };
</script>
<style lang="scss">

</style>

