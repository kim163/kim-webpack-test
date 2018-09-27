<template>
  <div class="act-main">
    <login-app v-if="isCustomize"></login-app>
    <div class="header">
      <div class="activity-balance">
        <div class="title">赠币活动剩余</div>
        <div>
          <span class="balance">{{coinBalance}}</span> UET
        </div>
      </div>
      <div class="adv-marquee">
        <i class="iconfont icon-sys-msg"></i>
        <div class="msg-list" ref="msgList">
          <marquee :speed="40000"
                   :scroll-width="scrollWidth"
                   v-if="awardLiveInfoList.length"
                   :content="awardLiveInfoList"
                   :focus-stop="false">
            <template slot-scope="props">
              <a v-for="(item, index) in props.content" :key="index" @click="showBulletinDetail(item)">
                {{item.title.replace('”','"')}}
                <!--<span class="m-LR-sm" v-if="index <  props.content.length -1">/</span>-->
              </a>
            </template>
          </marquee>
        </div>
      </div>
    </div>
    <div class="activity-list p-def">
      <div class="activity-item" v-for="(item,index) in activityList" :key="index">
        <div class="title" :class="`item-${index}`" @click="showDetail(index + 1)">
          <div class="left">
            <div class="main-title">
              <i class="iconfont icon-hot-fire"></i>
              {{item.title}}
            </div>
            <div class="des-title">{{item.subtitle}}</div>
          </div>
          <img class="icon-img" :src="item.iconUrl">
        </div>
        <transition name="panel">
          <div class="detail" v-show="showIndex === index + 1">
            <div class="content-info" v-for="(info,i) in item.contentList" :key="i">{{info}}</div>
            <router-link class="link" :class="`link-${index}`"
                         v-if="item.schemeUrl" :to="checkLink(item.type)">{{item.schemeText}}</router-link>
          </div>
        </transition>
      </div>
    </div>
    <div class="quick-buy-sell quick-buy" :class="{active: buySell === 'buy'}">
      <div class="container-info buy">
        <div class="buy-sell-btn buy" @click="buySell != 'buy' ? buySell= 'buy' : buySell = ''">买</div>
        <quick-buy-sell :mini="true"></quick-buy-sell>
      </div>
    </div>
    <div class="quick-buy-sell quick-sell" :class="{active: buySell === 'sell'}">
      <div class="container-info sell">
        <div class="buy-sell-btn sell" @click="buySell != 'sell' ? buySell= 'sell' : buySell = ''">卖</div>
        <quick-buy-sell :mini="true" :tab-type="1"></quick-buy-sell>
      </div>
    </div>
    <m-navbar></m-navbar>
    <bulletin-detail :detail="bulletinDetail" v-model="showBullDetail"></bulletin-detail>
    <withdraw-tip v-if="withdrawTip" v-model="withdrawTip"></withdraw-tip>
  </div>
</template>

<script>
  // import MobileHeader from 'components/m-header'
  import store from '@/store';	//加载状态管理器
  import mNavbar from 'components/m-navbar';
  import Marquee from 'components/marquee'
  import BulletinDetail from 'components/m-bulletin-detail'
  import { getAwardInfo } from 'api/activity'
  import QuickBuySell from '../pending-orders'
  import WithdrawTip from 'components/withdraw-tip';
  import {mapGetters} from 'vuex'
  import LoginApp from 'components/header/login-app'

  export default {
    name: "activity-center",
    data(){
      return{
        activityList:[],
        awardLiveInfoList:[],
        showIndex:0,
        coinBalance:0,
        showBullDetail:false,
        bulletinDetail:{},
        buySell:'',
        withdrawTip:false,
        isCustomize: _.customize()
      }
    },
    components:{
      mNavbar,
      Marquee,
      BulletinDetail,
      // MobileHeader,
      QuickBuySell,
      WithdrawTip,
      LoginApp
    },
    computed:{
      scrollWidth(){
        return this.$refs.msgList.offsetWidth
      },
      ...mapGetters([
        "userData",
        "islogin",
        "getWithdraw"
      ])
    },
    methods:{
      getActivityList(){
        getAwardInfo({}).then(res => {
          console.log(res)
          if(res.code === 10000){
            this.coinBalance = res.data.coinBalance
            this.activityList = [...res.data.awardList]
            this.awardLiveInfoList = [...res.data.awardLiveInfoList]
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      showDetail(num){
        this.showIndex = this.showIndex === num ? 0 : num
      },
      checkLink(type){
        let routerTo = ''
        switch (type){
          case 'sellCoins':
            routerTo = {name:'mPendingBuy',query:{mode:3}}
            break
          case 'buyCoins':
            routerTo = {name:'mPendingBuy'}
            break
          default:
            break
        }
        return routerTo
      },
      showBulletinDetail(data){
        this.bulletinDetail = data
        this.showBullDetail = true
      }
    },
    created(){
      if(this.getWithdraw){
        this.withdrawTip = true
        this.$store.commit('GET_WIDTHDRAW',false)
      }
    },
    mounted(){
      this.getActivityList()
    },
    beforeRouteEnter(to,from,next){
      if(store.getters.islogin){
        next()
      }else{
        if(!_.customize()){
          next({name: 'mobileLogin',replace: true})
        }else{
          next({name: 'mobileCusLogin',replace: true})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .panel-enter{
    opacity: 0;
  }
  .panel-enter-active{
    transition: all .5s;
  }
  .act-main{
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .header{
    width: 100%;
    .activity-balance{
      width: 100%;
      color: $white;
      background: #3573FA;
      @include f(18px);
      text-align: center;
      padding:r(30) 0;
      .title{
        margin-bottom: r(15);
      }
      .balance{
        @include f(30px);
      }
    }
    .adv-marquee{
      width: 100%;
      height: r(40);
      padding: 0 r(10);
      display: flex;
      align-items: center;
      background: $white;
      .iconfont{
        color: $main-color;
      }
      .msg-list{
        width: calc(100% - #{r(14)});
        height: 100%;
        @include f(14px);
        line-height: r(40);
        padding-left: r(10);
        a{
          margin-right: r(10);
        }
      }
    }
  }
  .activity-list{
    padding-bottom: r(100);
    .activity-item{
      width: 100%;
      margin-bottom: r(15);
      background: $white;
      &:nth-child(odd){
        animation: fadeInLeft .5s forwards;
      }
      &:nth-child(even){
        animation: fadeInRight .5s forwards;
      }
      .title{
        height: r(90);
        border-radius: r(6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.item-0{
          background-image: linear-gradient(45deg, #AD7EFD 0%, #69EDFF 100%);
        }
        &.item-1{
          background-image: linear-gradient(44deg, #FA709A 0%, #FCA96D 50%, #FCA96D 50%, #FEE140 100%);
        }
        &.item-2{
          background-image: linear-gradient(47deg, #EE69FF 0%, #955AF9 100%);
        }
        &.item-3{
          background-image: linear-gradient(-236deg, #FB9F75 0%, #FA709A 100%);
        }
        .left{
          display: flex;
          height: 100%;
          justify-content: center;
          flex-direction: column;
          margin-left: 5%;
        }
        .main-title{
          color: $white;
          @include f(18px);
        }
        .iconfont{
          vertical-align: top;
        }
        .des-title{
          color: $white;
          @include f(14px);
          padding-left: r(25);
        }
        .icon-img{
          /*width: 30%;*/
          height: 80%;
          /*background: url(~images/activity-buy.png);*/
          background-size: cover;
          margin-right: 5%;
        }
      }
      .detail{
        padding: r(10);
      }
      .content-info{
        width: 100%;
        @include f(14px);
        line-height: r(22);
        color: #787876;
        position: relative;
        padding: r(10) 0;
        &:after{
          content: '';
          display: block;
          width: 100%;
          height: 1px;
          background: #d8d8d8;
          position: absolute;
          bottom: 0;
        }
      }
      .link{
        width: 100%;
        height: r(40);
        @include f(16px);
        text-align: center;
        line-height: r(40);
        color: $white;
        margin-top: r(10);
        display: block;
        border-radius: r(3);
        &.link-0{
          background-image: linear-gradient(45deg, #AD7EFD 0%, #69EDFF 100%);
        }
        &.link-1{
          background-image: linear-gradient(44deg, #FA709A 0%, #FCA96D 50%, #FCA96D 50%, #FEE140 100%);
        }
        &.link-2{
          background-image: linear-gradient(47deg, #EE69FF 0%, #955AF9 100%);
        }
        &.link-3{
          background-image: linear-gradient(-236deg, #FB9F75 0%, #FA709A 100%);
        }
      }
    }
  }
  .quick-buy-sell{
    width: 70%;
    background: #FFFFFF;
    box-shadow: 0 0 r(20) 0 rgba(0,0,0,0.60);
    position: fixed;
    transition: all .5s;
    &.active{
      .buy-sell-btn{
        &.buy{
          right: r(-30);
        }
        &.sell{
          left: r(-30);
        }
      }
    }
    &.quick-buy{
      border-radius: 0 r(6) r(6) 0;
      left: -80%;
      bottom: 16%;
      &.active{
        left: 0%;
      }
    }
    &.quick-sell{
      border-radius: r(6) 0 0 r(6);
      right: -80%;
      bottom: 15%;
      &.active{
        right: 0%;
      }
    }
    .container-info{
      /*position: relative;*/
      /*width: 100%;*/
      padding: r(20) 0;
      &.buy{
        padding-left: r(20);
        padding-right: r(30);
      }
      &.sell{
        padding-left: r(30);
        padding-right: r(20);
      }
    }
    .buy-sell-btn{
      position: absolute;
      width: r(60);
      height: r(60);
      border: r(2) solid #FFFFFF;
      text-align: center;
      line-height: r(56);
      @include f(24px);
      border-radius: 50%;
      color: $white;
      top: 50%;
      margin-top: r(-30);

      &.buy{
        background: #00B0FF;
        right: r(-80);
        animation: bounceInLeft 1s forwards;
      }
      &.sell{
        background: #F06292;
        left: r(-80);
        animation: bounceInRight 1s forwards;
      }
    }
  }
</style>