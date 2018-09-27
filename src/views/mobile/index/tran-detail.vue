<template>
  <div class="mtran-detail cfx">
    <div class="fl mtran-itemleft">
        <span class="disp-inlblo posit-rel">
             <a class="avatars-item" :style="{'background':item.avatarColor}" href="javascript:void(0);"> {{(item.userName).substring(0, 1)}} </a>
        </span>
      <div v-if="item.sponsorOnlineStatus === 1" class="avatar-onlinebtn now-online">在线</div>
      <div v-else-if="item.sponsorOnlineStatus === 0" class="avatar-onlinebtn not-online">离线</div>
      <div v-else class="avatar-onlinebtn not-online">
        {{item.sponsorOnlineStatus}}
      </div>
    </div>
    <div class="fr mtran-itemright">
      <p class="item">
        <span class="user-name"> {{item.userName}}</span>
        <i class="iconfont" :class="getPayInfo(item.accountTypeTwin).className"></i>
        <span :class="checkFinish(item)">
          <span>{{$t('transactionHome.completionRate')}}</span>
          <span>{{ item.tradeTotal ? ((item.finishedTotal/item.tradeTotal)*100).toFixed(2) : 0}}</span>%
        </span>
      </p>
      <p class="item" v-if="typeInfo === 1">
        支持<span class="m-LR-xs">{{$t(getPayInfo(item.accountTypeTwin).name)}}</span>收款
      </p>
      <p class="item">
        订单UET总数：<span class="amount"> {{item.amount}} UET </span>
      </p>
      <p class="item">
        剩余UET：
        <span class="amount"> {{item.balance}} UET </span>
      </p>
      <p class="item" v-if="typeInfo === 2">
        <progress class="progress" :value="item.amount - item.balance" :max="item.amount"></progress>
      </p>
      <p class="item">
        <a href="javascript:void(0);" class="transaction-btn"
           :class="{disabled: item.userId === userData.userId}"
           @click="item.userId !== userData.userId ? $emit('buySell',item) : ''">
          {{typeInfo === 1 ? '向ta买币' : '卖币给ta'}}
        </a>
      </p>
    </div>
  </div>
</template>
<script>
  import tranBuySell from './tran-buy-sell'
  import {mapGetters} from 'vuex';
  export default {
    data() {
      return {
      };
    },
    props: {
      item: {
        type: Object
      },
      typeInfo:{
        type:Number,
        default:1 //1买入 2卖出
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    components: {
    },
    methods: {
      getPayInfo(data) {
        const obj = {
          name: '',
          className: ''
        }
        switch (data) {
          case 1:
            obj.name = 'transactionHome.payAlipay'
            obj.className = 'icon-pay-type-ali'
            break
          case 2:
            obj.name = 'transactionHome.payWechat'
            obj.className = 'icon-pay-type-wechat'
            break
          case 3:
            obj.name = 'transactionHome.payBank'
            obj.className = 'icon-pay-type-bank'
            break
        }
        return obj
      },
      checkFinish(item){
        if(item.tradeTotal){
          const res = item.finishedTotal / item.tradeTotal * 100
          if(res <= 33.33){
            return 'low'
          }else if(res > 33.33 && res <= 66.66){
            return 'middle'
          }else if(res > 66.66){
            return 'high'
          }
        }else{
          return 'low'
        }
      }
    },
  };
</script>
<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .mtran-detail {
    @include f(14px);
  }

  .mtran-itemleft {
    width: 19%;
    text-align: center;
  }

  .mtran-itemright {
    width: 81%;
    position: relative;
    padding: r(10) 0;
    .item {
      line-height: r(22);
    }
    .user-name {
      @include f(14px);
      margin-right: r(3);
    }
    .low{
      color:  #EC3A4E;
    }
    .middle{
      color: #B74E00;
    }
    .high{
      color: #16AC00;
    }
    .iconfont {
      vertical-align: top;
      margin-right: r(3);
      &.icon-pay-type-ali {
        color: #03A9F3;
      }
      &.icon-pay-type-wechat {
        color: #14CA39;
      }
      &.icon-pay-type-bank {
        color: #ec3a4e;
      }
    }
    .m-LR-xs {
      margin: 0 r(5);
    }
    .tradeTotal {
      margin-right: r(10);
    }
    .unit-price {
      color: $font-color;
    }
    .quantity-txt {
      margin-left: r(14);
    }
    .amount {
      color: #787876;
    }
    .right-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: r(10);
    }
    .icon-right-arrow {
      color: #D8D8D8;
      @include f(19px);
    }
  }

  .transaction-btn {
    width: r(80);
    height: r(30);
    line-height: r(30);
    border: r(1) solid #3573FA;
    border-radius: r(5);
    text-align: center;
    @include f(14px);
    color: #3573FA;
    background: $white;
    position: absolute;
    right: r(10);
    bottom: r(20);
    &.disabled{
      background: #f1f1f1;
      border-color: #9d9d9d;
      color: #9d9d9d;
    }
  }
  .progress{
    background: #FFFFFF;
    border: r(1) solid #3573FA;
    border-radius: r(10);
    color: #3573FA;
    width: r(180);
    height: r(12);
    overflow: hidden;
  }
  progress::-moz-progress-bar {
    background: #3573FA;
  }
  progress::-webkit-progress-bar {
    background: #FFFFFF;
    border-radius: r(10);
  }
  progress::-webkit-progress-value  {
    background: #3573FA;
    border-top-left-radius: r(10);
    border-bottom-left-radius: r(10);
  }
  .avatars-item {
    width: r(50);
    height: r(50);
    line-height: r(50);
    border-radius: r(35);
    text-align: center;
    @include f(18px);
    color: $white;
    vertical-align: middle;
    margin: r(15) 0 0;
    display: block;
  }

  .avatar-onlinebtn {
    width: r(40);
    height: r(18);
    line-height: r(18);
    text-align: center;
    margin: r(7) auto 0;
    @include f(12px);
  }

  .now-online {
    color: #16AC00;
    border: 1px solid #16AC00;
  }

  .not-online {
    color: #787876;
    border: 1px solid #787876;
  }

  .avatar-onlineicon {
    position: absolute;
    width: r(10);
    height: r(10);
    right: r(0);
    bottom: r(0);
    border: 1px solid #FEEDEB;
    border-radius: r(35);
  }

  .online-icon {
    background: #0cce43;
  }

  .notonline-icon {
    background: #D3D3D3;
  }
</style>
