<template>
  <div>
    <MobileHeader>申诉详情</MobileHeader>
    <div class="appeal_info">
      <p class="appeal_title">申诉信息</p>
      <div class="appeal_content">
        <p>申诉原因: {{textInfo}}</p>
        <p>交易金额: {{tradeMoney}} CNY</p>
        <p>交易数量: {{amount}} UET</p>
        <p>创建时间: {{createTime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
      </div>
      <div class="appeal_content" v-if="defaultState">
        <p><span class="sub-title">买家:</span> {{creditName}}</p>
        <div><span class="sub-title">卖家:</span> {{debitName}}</div>
        <p>银行类型: {{bankCategory}}</p>
        <p class="list_accountName"><span class="account_name">开户姓名: {{debitAccountNameTwin}} </span> <a
          href="javascript:void(0);" class="copy-btn copy-btn-next"
          :data-clipboard-text="debitAccountNameTwin"
          @click="copy">{{$t('transactionHome.copyBtn')}}</a></p>
        <p class="list_number"><span class="account_num">开户卡号: {{bankNumber}} </span> <a href="javascript:void(0);"
                                                                                         class="copy-btn copy-btn-next"
                                                                                         :data-clipboard-text="bankNumber"
                                                                                         @click="copy">{{$t('transactionHome.copyBtn')}}</a>
        </p>
      </div>
      <div class="open-info" @click="displayInfo(1)" v-if="!defaultState">展开内容 <i
        class="iconfont icon-down-arrow-circle"></i></div>
      <div class="open-info" @click="displayInfo(2)" v-if="defaultState">收起内容 <i
        class="iconfont icon-up-arrow-circle"></i></div>
    </div>
    <div class="leaveMessage_info">
      <p class="message_title">留言</p>
      <noDataTip v-if="appealDetailList.length==0"></noDataTip>
      <div class="leaveMessage_content" v-else v-for="(list,key) in appealDetailList">
        <!--判断用户角色-->

        <div v-if="list.sourceTypeText=='卖家'" class="content_list">
          <div style="flex: 1"></div>
          <div class="user_content">
            <p class="name">卖家: {{list.userName}}</p>
            <p class="text_content">{{list.content}}</p>
            <div v-if="list.attachmentUrls&&list.attachmentUrls!==null" style="display: inline-block">
              <viewer :images="list.attachmentUrls.split(',')" v-for="(listNext,value) in list.attachmentUrls.split(',')" :key="value" style="text-align: right;display: inline-block">
                <img :src="listNext" class="pic">
              </viewer>
            </div>
            <p class="time">{{list.modifytime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
          </div>
          <div class="user_symbol"></div>
        </div>
        <div v-if="list.sourceTypeText=='买家'" class="content_list_buyer">
          <div class="user_symbol"></div>
          <div class="user_content">
            <p class="name">买家:{{list.username}}</p>
            <p class="text_content">{{list.content}}</p>
            <div  v-if="list.attachmentUrls&&list.attachmentUrls!==null"  style="display: inline-block">
              <viewer :images="list.attachmentUrls.split(',')" v-for="(listNext,value) in list.attachmentUrls.split(',')"  :key="value" style="text-align: right;display: inline-block">
                <img :src="listNext" class="pic">
              </viewer>
            </div>
            <p class="time">{{list.modifytime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
          </div>
          <div style="flex: 1"></div>
        </div>
        <div v-if="list.sourceTypeText=='钱包客服'" class="content_list_kefu">
          <div class="user_symbol"></div>
          <div class="user_content"  >
            <p class="name">客服: {{list.userName}} </p>
            <p class="text_content">{{list.content}}</p>
            <div v-if="list.attachmentUrls&&list.attachmentUrls!==null" style="display: inline-block">
              <viewer :images="list.attachmentUrls.split(',')" v-for="(listNext,value) in list.attachmentUrls.split(',')" :key="value" style="text-align: right;display: inline-block">
                <img :src="listNext" class="pic">
              </viewer>
            </div>
            <p class="time">{{list.modifytime|Date('yyyy-MM-dd hh:mm:ss')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="write_Message" @click="sendMessage" v-if="$route.query.num == 1">
      <i class="iconfont icon-leave-message"></i> 留言
    </div>
    <transition name="toolSlideRight" v-if="offSwitch">
      <leaveMessage @closeMessage="closeState" :idInfo="orderId"></leaveMessage>
    </transition>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import leaveMessage from './leave-message'
  import noDataTip from 'components/no-data-tip'
  import {userCenter} from 'api'
  import {mapGetters} from 'vuex'
  import Clipboard from 'clipboard';
  import PcCash from "../../cash/index";

  export default {
    data() {
      return {
        textInfo: '',
        tradeMoney: '',
        amount: '',
        createTime: '',
        debitAccountNameTwin: '',
        bankCategory: '',
        bankNumber: '',
        debitName: '',
        creditName: '',
        defaultState: false,
        appealDetailList: [],
        offSwitch: false,
        orderId: '',
        newArr: [],
        attachmentUrls:''
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    created() {
      this.fetchData()
    },
    methods: {
      closeState(val) {
        this.offSwitch = val
        if(!val){
          this.fetchData()
        }
      },
      copy() {
        var clipboard = new Clipboard('.copy-btn')
        clipboard.on('success', e => {
          toast('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        })
      },
      fetchData() {
        if (this.$route.query.num == 1) {
          const requests = {
            'limit': 10,
            'offset': 0,
            'orderId': this.$route.params.id
          }
          userCenter.getAppealDetailPage(requests).then((res) => {
            if(res.code=='10000'){
              this.textInfo = res.data.appeal.typeText
              this.tradeMoney = res.data.appeal.amountTwin
              this.amount = res.data.appeal.amount
              this.createTime = res.data.appeal.modifytime
              this.creditName = res.data.orderx.creditName
              this.debitName = res.data.orderx.debitName
              this.debitAccountNameTwin = res.data.orderx.debitAccountNameTwin
              this.bankCategory = res.data.orderx.debitAccountMerchantTwin
              this.bankNumber = res.data.orderx.debitAccountTwin
              this.appealDetailList = res.data.appealDetailList
              this.orderId = this.$route.params.id
            }else {
              toast(res.message)
            }

          })
        } else {
          const requests = {
            'limit': 10,
            'offset': 0,
            'orderId': this.$route.params.id,
            'userId': this.userId,
            'types': [1, 2, 3, 4]
          }
          userCenter.getAppealDetailHistoryPage(requests).then((res) => {
            if(res.code=='10000'){
              this.textInfo = res.data.appealHistory.typeText
              this.tradeMoney = res.data.appealHistory.amountTwin
              this.amount = res.data.appealHistory.amount
              this.createTime = res.data.appealHistory.createtime
              this.debitAccountNameTwin = res.data.transaction.debitAccountNameTwin
              this.bankCategory = res.data.transaction.debitAccountMerchantTwin
              this.bankNumber = res.data.transaction.debitAccountTwin
              this.debitName = res.data.transaction.debitName
              this.creditName = res.data.transaction.creditName
              this.orderId = this.$route.params.id
              this.appealDetailList = res.data.appealDetailHistoryList
            }else {
              toast(res.message)
            }

          })
        }
      },
      displayInfo(num) {
        if (num == 1) {
          this.defaultState = true
        } else {
          this.defaultState = false
        }
      },
      sendMessage() {
        this.offSwitch = true
      }
    },
    components: {PcCash, MobileHeader, noDataTip, leaveMessage}
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .toolSlideRight-enter-active, .toolSlideRight-leave-active {
    transition: transform .5s;
  }

  .toolSlideRight-enter {
    transform: translateX(100%);
  }

  .toolSlideRight-leave-to {
    transform: translateX(-100%);
  }

  .appeal_info {
    padding: r(10) r(10) r(0) r(10);
    background-color: #fff;
    .appeal_title {
      color: #333;
      padding: r(8);
      @include f(16px)
    }
    .appeal_content {
      color: #949494;
      @include f(16px);
      border-bottom: 1px solid #f5f5f5;
      p {
        padding: r(8);
      }
      div {
        padding: r(8);
        border-top: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
      }
      .list_accountName {
        display: flex;
        flex-direction: row;
        .account_name {
          flex: 1;
        }
        .copy-btn {
          color: #3573FA;
        }
      }
      .list_number {
        display: flex;
        flex-direction: row;
        .account_num {
          flex: 1;
        }
        .copy-btn {
          color: #3573FA;
        }
      }
    }
    .open-info {
      border-top: 1px solid #f5f5f5;
      height: r(40);
      line-height: r(40);
      text-align: center;
    }
    .sub-title {
      color: #333;
    }
  }

  .leaveMessage_info {
    background-color: #fff;
    margin-top: r(10);
    padding: r(0) r(10);
    .message_title {
      padding: r(8);
      @include f(16px)
    }
    .leaveMessage_content {
      .content_list {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f5f5f5;
        padding-top: r(20);
        .user_symbol {
          background: url('~images/chatWith/seller.png') no-repeat;
          background-size: 100%;
          width: r(45);
          height: r(48);
        }
        .user_content {
          padding-right: r(10);
          .name {
            color: #333;
            @include f(16px);
            text-align: right;
          }
          .text_content {
            text-align: right;
            color: #949494;
            @include f(16);
            padding: r(0) r(0) r(5);
            width: 100%;
            word-break: break-all;
            max-width: 15rem;
          }
          .pic {
            padding: r(10);
            width: r(60);
            height: r(60);
            text-align: left;
          }
          .time {
            text-align: right;
            color: #949494;
            padding-bottom: r(19);
          }
        }
      }
      .content_list_buyer {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f5f5f5;
        padding-top: r(20);
        .user_symbol {
          background: url('~images/chatWith/buyer.png') no-repeat;
          background-size: 100%;
          width: r(45);
          height: r(48);
        }
        .user_content {
          padding-left: r(10);
          .name {
            color: #333;
            @include f(16px);
            text-align: left;
          }
          .text_content {
            text-align: left;
            color: #949494;
            @include f(16);
            padding: r(0) r(0) r(5);
            width: 100%;
            word-break: break-all;
            max-width: 15rem;
          }
          .pic {
            padding: r(10);
            width: r(60);
            height: r(60);
            text-align: right;
          }
          .time {
            text-align: left;
            color: #949494;
            padding-bottom: r(19);
          }
        }
      }
      .content_list_kefu {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f5f5f5;
        padding-top: r(20);
        .user_symbol {
          background: url('~images/chatWith/kefu.png') no-repeat;
          background-size: 100%;
          width: r(45);
          height: r(48);
        }
        .user_content {
          padding-left: r(10);
          .name {
            color: #333;
            @include f(16px);
            text-align: left;
          }
          .text_content {
            text-align: left;
            color: #949494;
            @include f(16);
            padding: r(0) r(0) r(5);
            width: 100%;
            word-break: break-all;
            max-width: 15rem;
          }
          .pic {
            padding: r(10);
            width: r(60);
            height: r(60);
            text-align: left;
          }
          .time {
            text-align: left;
            color: #949494;
            padding-bottom: r(19);
          }
        }
      }
    }
  }

  .write_Message {
    width: 100%;
    height: r(45);
    background-color: #3573FA;
    color: #fff;
    text-align: center;
    line-height: r(45);
    @include f(18px);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
</style>
