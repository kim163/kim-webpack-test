<template>
  <div class="display-nav">
    <div class="dispnav-announce">
      <div class="container f-white max-width">
        <div class="row">
           <text-scroll :dataList="dataList" ></text-scroll>
        </div>
      </div>
    </div>

    <!-- Mobile Nav Menu -->
    <div class="m-nav-container">
      <input id="toggle" type="checkbox">
      <label class="toggle-container" for="toggle"><span class="button button-toggle"></span></label>
      <div class="m-nav-title">
        <router-link :to="gotoIndex()">
          <i class="iconfont icon-prom-logo"></i>
        </router-link>
      </div>
      <div class="mobile-nav-bar">
        <router-link :to="gotoIndex()" class="nav-item">久安优势</router-link>
        <router-link :to="{name:'activityIndex'}" class="nav-item">最新优惠</router-link>
        <router-link :to="gotoHelp()" class="nav-item">帮助中心</router-link>
        <router-link :to="gotoContact()" class="nav-item">联系我们</router-link>
        <router-link :to="{name:'mIndex'}" v-show="isOfficialWeb" class="nav-item tran-btn">前往久安钱包</router-link>
      </div>
    </div>

    <!-- Desktop Nav Menu -->
    <div class="dispnav-content">
      <div class="container max-width">
        <div class="row cfx">
          <div class="logo fl">
            <router-link :to="gotoIndex()">
              <i class="iconfont icon-prom-logo"></i>
            </router-link>
          </div>
          <div class="link-part fr">
            <div class="col-2">
              <router-link :to="gotoIndex()">久安优势</router-link>
            </div>
            <div class="col-2">
              <router-link :to="{name:'activityIndex'}">最新优惠</router-link>
            </div>
            <div class="col-2">
              <router-link :to="gotoHelp()">帮助中心</router-link>
            </div>
            <div class="col-2 posit-rel" @mouseover="showAppDown=true" @mouseout="showAppDown=false">
              <a href="javascript:void(0);">APP下载</a>
              <div class="appdown-popup" v-show="showAppDown">
                 <span class="down-jiantou">
                   <i class="iconfont icon-uparrow"></i>
                 </span>
                 <div class="qrcode-part">
                   <qrcode :text="SETTING.appUrl" v-if="SETTING.appUrl" :logoSrc="Logo" :logoScale="0.2" :size="176"></qrcode>
                 </div>
                 <p class="tips">支持 IOS 和 Android</p>
              </div>
            </div>
            <div class="col-2">
              <router-link :to="gotoContact()">联系我们</router-link>
            </div>
            <div class="col-2 tran-btn" v-show="isOfficialWeb">
              <router-link :to="{name:'transaction'}">前往久安钱包</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import {SETTING} from "@/assets/data";
  import VueQrcode from 'vue-qr';
  import Logo from '@/assets/images/logo-blue.png';
  import textScroll from 'components/text-scroll';

  export default {
    data() {
      return {
        SETTING,
        Logo,
        showAppDown:false,
        dataList: [
          {content:"久安钱包坐落新加坡花园城市，拥有百人技术团队，专注区块链技术研发和运用"},
          {content:"久安钱包是一个数字货币钱包，更是解决金流瓶颈的全球化解决方案"},
          {content:"百万用户，交易更快，加入久安，一起打造数字货币王国"},
          {content:"加密技术有效保障用户隐私，结合区块链账本更加有效保障交易的真实性，解决交易的信任危机"}
        ]
      };
    },
    props: {
      isOfficialWeb:{
        type:Boolean,
        default:false
      }
    },
    methods: {
      gotoIndex(){
        let routerName = '';
        if(this.isOfficialWeb){
          routerName = 'index';
        }else {
          routerName = 'promIndex';
        }
        return {name: routerName};
      },
      gotoHelp(){
        let routerName = '';
        if(this.isOfficialWeb){
          routerName = 'helpCenter';
        }else {
          routerName = 'promHelp';
        }
        return {name: routerName};
      },
      gotoContact(){
        let contactName = '';
        if(this.isOfficialWeb){
          contactName = 'contactUs';
        }else {
          contactName = 'promContact';
        }
        return {name: contactName};
      }

    },
    computed: {},
    created() {
    },
    components: {
      textScroll,
      qrcode: VueQrcode
    }
  };
</script>
<style lang="scss" scoped>
  @import "./style/mobile-nav-bar.scss";

  .dispnav-announce{
   display: block;
   height: 30px;
   line-height: 30px;
   background: #3A3A3A;
   font-size: 12px;
   .col-12{
     min-height: auto;
     margin: 0;
   }
 }

 .m-nav-container{
   display: none;
 }

.dispnav-content{
  display: block;
  width: 100%;
  height: 60px;
  background: #FFFFFF;
  .logo a{
    display: block;
    font-size: 40px;
    color: #3573FA;
  }
  .link-part{
    [class^="col"]{
      margin: 0 18px;
      width: auto;
      &:last-child{
        margin: 0 0 0 18px;
      }
    }
   .tran-btn a{
     padding: 7px 12px;
     margin-top: 11.5px;
     background: #D33474;
     border-radius: 4px;
     color: #FFFFFF;
     height: auto;
     line-height: normal;
     &.active,&:hover{
       color: #FFFFFF;
       background: #FF0067;
       border-bottom: none;
     }
   }
    a{
      display: block;
      height: 58px;
      line-height: 58px;
      font-size: 16px;
      color: #333333;
      text-align: center;
      padding: 0 18px;
      &.active,&:hover{
        color: #3573FA;
        border-bottom: 2px solid #3573FA;
      }
    }
  }
  .appdown-popup{
    position: absolute;
    top: 58px;
    left: -28px;
    width: 160px;
    padding: 10px 10px 0;
    background: #FFFFFF;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.50);
    z-index: 9999;
    .down-jiantou{
      position: absolute;
      left: 50%;
      top: -19px;
      margin-left: -10px;
      .iconfont{
        font-size: 20px;
        color: #2AADE0;
      }
    }
    .qrcode-part{
      width: 140px;
      height: 140px;
      overflow: hidden;
    }
    .tips{
      font-size: 14px;
      color: #333333;
      line-height: 34px;
      text-align: center;
    }
  }
}

 @media only screen and (max-width: 1190px) and (min-width: 800px) {
   .dispnav-content .link-part [class^="col"]{
     margin: 0 1px;
     a{
       padding: 0 10px;
     }
     &:last-child{
       margin: 0 0 0 1px;
     }
     &.tran-btn{
       a{
         padding: 7px 10px;
       }
     }
   }
 }

  @media only screen and (max-width: 799px) {
   .dispnav-announce{
     display: none;
   }
   .m-nav-container{
     display: block;
   }
   .dispnav-content{
     display: none;
   }

  }

</style>
