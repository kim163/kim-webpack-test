<template>
  <div class="muser-center-home">
    <div class="mcenter-userinfo">
       <div class="login-user">
         <img :src="getLogo" class="logo">
         {{$t('navbar.nickName')}}：{{userData.nickname}}
       </div>
       <div class="assets cfx">
         <div class="item-info">
           <div class="mcertent">
              <p> UET资产：</p>
              <span class="amount"> {{calUserBalance(1)}}</span>
              <span class="money"> ≈ &nbsp;{{formatCny(1)}} &nbsp;CNY</span>
           </div>
         </div>

         <div class="item-info txt-center">
           <div class="mcertent right-lock">
             <p> 锁定资产：</p>
             <span class="amount"> {{calUserBalance(2)}}</span>
             <span class="money"> ≈ &nbsp;{{formatCny(2)}} &nbsp;CNY</span>
           </div>
         </div>
       </div>
    </div>

    <div class="mcenter-hotlink cfx">
      <router-link :to="{name:'mreceivcode'}" class="item-href">
        <i class="iconfont icon-receipt-code"></i>
        {{$t('userCenter.receivcode')}}
      </router-link>
      <router-link :to="{name:'mTranRecord'}" class="item-href">
        <i class="iconfont icon-tran-record1"></i>
        {{$t('userCenter.transactionRecord')}}
        <span class="tran-num" v-if="homeInforma.tradingOrderCount>0">{{homeInforma.tradingOrderCount}}</span>
      </router-link>
      <router-link :to="{name:'mMyPending'}" class="item-href">
        <i class="iconfont icon-mypend-order"></i>
        {{$t('transactionRecord.tranPending')}}
        <span class="tran-num" v-if="homeInforma.pendingOrderCount>0">{{homeInforma.pendingOrderCount}}</span>
      </router-link>
      <router-link :to="{name:'mMyGift'}" class="item-href">
        <i class="iconfont icon-my-gift"></i>
        {{$t('userCenter.myGift')}}
        <span class="tran-num" v-if="myGiftTotal>0">{{myGiftTotal}}</span>
      </router-link>
    </div>

    <div class="panel-item">
     <div class="mcenter-linkitem">
      <router-link :to="{name:'mBindList'}" v-if="userData.nodeId < 10000" class="item-href">
        <i class="iconfont logo icon-business-list"></i>
        {{$t('navbar.busineList')}}
        <i class="iconfont icon-right-arrow"></i>
      </router-link>
       <router-link :to="{name:'mAppealList'}" class="item-href">
         <i class="iconfont logo icon-appeal-list"></i>
         {{$t('userCenter.appealList')}}
         <i class="iconfont icon-right-arrow"></i>
       </router-link>
     </div>

     <div class="mcenter-linkitem">
      <router-link :to="{name:'mCardList'}" class="item-href">
        <i class="iconfont logo icon-bind-bank"></i>
        {{$t('userCenter.bindCard')}}
        <i class="iconfont icon-right-arrow"></i>
      </router-link>
      <!--<router-link :to="{name:'mBindCard',params:{id:1}}" class="item-href">-->
        <!--<i class="iconfont logo icon-bind-alipay"></i>-->
        <!--{{$t('userCenter.bindAlipay')}}-->
        <!--<i class="iconfont icon-right-arrow"></i>-->
      <!--</router-link>-->
      <!--<router-link :to="{name:'mBindCard',params:{id:2}}" class="item-href">-->
        <!--<i class="iconfont logo icon-bind-wechat"></i>-->
        <!--{{$t('userCenter.bindWeChat')}}-->
        <!--<i class="iconfont icon-right-arrow"></i>-->
      <!--</router-link>-->
     </div>

     <div class="mcenter-linkitem">
      <router-link :to="{name:'mSetUserInfo'}" class="item-href">
        <i class="iconfont logo icon-complete-material"></i>
        完善资料
        <i class="iconfont icon-right-arrow"></i>
      </router-link>
     </div>

     <div class="mcenter-linkitem">
      <get-live800 :showRightArrow="true" :liveSpecStyle="mcenterLive" :isRoundIcon="true"></get-live800>
      <a class="item-href" target="_blank" :href="SETTING.appUrl">
        <i class="iconfont logo icon-juan-app"></i>
        {{$t('navbar.juanApp')}}
        <i class="iconfont icon-right-arrow"></i>
      </a>
      <router-link :to="{name:'index'}" class="item-href">
        <i class="iconfont logo icon-juan-home"></i>
        前往久安首页
        <i class="iconfont icon-right-arrow"></i>
      </router-link>
     </div>

     <div class="mcenter-linkitem">
      <a href="javascript:void(0);" class="item-href" v-if="userData.nodeId < 10000" @click="$store.dispatch('LOGIN_OUT')">
        <i class="iconfont logo icon-sign-out"></i>
        {{$t('navbar.logOut')}}
        <i class="iconfont icon-right-arrow"></i>
      </a>
     </div>
    </div>
    <m-navbar></m-navbar>
    <confirm-dialog v-model="showConfirm">
      <div slot="title">温馨提示</div>
      <div slot="content">
        <div class="dialog-content">请前往设置您的真实姓名</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel dialog-cancel">取消</div>
      <div slot="rightBtn" class="dialog-btn-yes" @click="toSetInfo">确定</div>
    </confirm-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ConfirmDialog from 'components/confirm'
  import mNavbar from 'components/m-navbar';
  import {SETTING} from "@/assets/data";
  import getLive800 from 'components/get-live800';
  import {$localStorage} from '@/util/storage';

  import jiuanLogo from '@/assets/images/icon/juan-logo.svg';

  import {transaction,userCenter} from 'api';

  export default {
    name: "m-user-center",
    data() {
      return {
        SETTING,
        showConfirm:false,
        homeInforma:{},
        requestdata:{},
        mcenterLive:'mcenter-live',
        initPageNext: 0,
        myGiftTotal: 0
      }
    },
    components:{
      ConfirmDialog,
      mNavbar,
      getLive800
    },
    watch:{
      'userData.name':function(val){
        this.userData.name = val
      },
    },
    computed:{
      ...mapGetters([
        'userData',
        'userId'
      ]),
      getLogo(){
        const menuStyle = JSON.parse($localStorage.get('menuStyle'));
        let logoSrc = jiuanLogo;
        if(this.userData.nodeId > 10000 && menuStyle){
          logoSrc = menuStyle.iconUrl;
        }
        return logoSrc
      }
    },
    methods:{
      toSetInfo(){
        this.showConfirm = false;
        this.$router.push({name:'mSetUserInfo'});
      },
      formatCny(type){   // type 1表示用户余额 2表示锁定资产
        const amount = type === 1 ? this.homeInforma.chainAmount : (this.homeInforma.pendingAmount+this.homeInforma.lockedAmount);
        return !_.isNaN(Number(amount)) ? (Number(amount)*0.01).toFixed(2) : '0.00';
      },
      searchHomeInfo(){
        this.requestdata={
          userId: this.userId
        };
        transaction.getHomeInfo(this.requestdata).then(res => {
          if (res.code == 10000) {
            this.homeInforma = res.data;
          }
        }).catch(err => {
          toast(err.message);
        })
      },
      calUserBalance(type){
        const balAmount = type === 1 ? this.homeInforma.chainAmount : (this.homeInforma.pendingAmount+this.homeInforma.lockedAmount);
        return  !_.isNaN(Number(balAmount)) ? Number(balAmount) : '0.00';
      },
      getInfonext(){
        const requestDatas = {
          "limit": 10,
          "offset": this.initPageNext,
          "couponStatus": 2,
          "couponType": 100
        };
        userCenter.myGift(requestDatas).then(res => {
          if (res.code == 10000) {
            this.myGiftTotal = res.pageInfo.total;
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        });
      }
    },
    created() {
      this.searchHomeInfo();
      this.getInfonext();
    },
    beforeRouteLeave (to, from , next) {
      if(to.name === 'mBindCard'){
        if(_.isNull(this.userData.name)){
          this.showConfirm = true
        }else{
          next()
        }
      }else{
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .muser-center-home{
    padding-bottom: r($footer-hg+20);
  }
  .mcenter-userinfo{
    background: #3573FA;
    padding: r(20) r(20) r(22);
    color: $white;
    margin-bottom: r(10);
    .login-user{
      .logo{
        height: r(60);
        margin-right: r(6);
        border-radius: r(35);
      }
      line-height: r(60);
      @include  f(20px);
      margin-bottom: r(18);
    }
    .assets{
      .item-info{
        width: 50%;
        float: left;
        @include  f(16px);
        &:first-child{
          border-right: 1px solid #85ABFC;
        }
        .right-lock{
          display: inline-block;
          text-align: left;
        }
        span{
          display: block;
          word-wrap:break-word;
          &.amount{
            @include  f(26px);
            line-height: r(40);
          }
          &.money{
            @include  f(14px);
            line-height: r(14);
            margin-top: r(5);
          }
        }
      }
    }
  }

  .mcenter-hotlink{
    background: #FFFFFF;
    box-shadow: 0 r(4) r(4) 0 rgba(0,0,0,0.05);
    margin-bottom: r(11);
    .item-href{
      display: block;
      width: 25%;
      float: left;
      @include  f(13px);
      color:$font-color;
      text-align: center;
      position: relative;
      padding: r(10) 0;
      .iconfont{
        @include  f(29px);
        display: block;
        margin-bottom: r(8);
        &.icon-receipt-code{
          color: #39D65A;
        }
        &.icon-tran-record1{
          color: #3573FA;
        }
        &.icon-mypend-order{
          color: #955AF9;
        }
        &.icon-my-gift{
          color: #FF758D;
        }
      }
      .tran-num{
        position: absolute;
        right: r(12);
        top: r(8);
        @include  f(14px);
        width: r(20);
        height: r(20);
        border-radius: r(50);
        background: red;
        color: #FFFFFF;
      }
    }
  }

  .panel-item{
    .mcenter-linkitem{
      background: #FFFFFF;
      border-top: 1px solid #E4E4E4;
      border-bottom: 1px solid #E4E4E4;
      padding-left: r(20);
      margin-bottom: r(10);

      .item-href{
        height: r(50);
        line-height: r(50);
        padding: 0 r(10) 0 0;
        display: block;
        border-bottom: 1px solid #E4E4E4;
        @include  f(16px);
        color:$font-color;
        &:last-child{
          border-bottom: none;
        }
        .iconfont{
          &.logo{
            @include  f(25px);
            margin-right: r(5);
          }
          &.icon-business-list{
             color: #B0D443;
          }
          &.icon-appeal-list{
            color: #db1270;
          }
          &.icon-bind-bank{
             color: #3D88E4;
          }
          &.icon-bind-alipay{
            color: #00AAEE;
          }
          &.icon-bind-wechat{
             color: #3CB034;
          }
          &.icon-complete-material{
            color: #F4376D;
          }
          &.icon-juan-app{
             color: #C8151D;
          }
          &.icon-juan-home{
            color: #3573FA;
          }
          &.icon-sign-out{
            color: #E17367;
          }
        }
        .icon-right-arrow{
          float: right;
        }
      }
    }
  }
  .icon-gift{
    color: #03A9F3;
  }
</style>
