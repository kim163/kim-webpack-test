<template>
  <transition name="fade">
    <div class="tool-warp" v-show="myValue" @click.self="myValue=false">
      <transition name="toolSlideLeft">
        <div v-show="myValue" class="tool-bar">

          <div @click="myValue=false" class="tool-user-info">
            <div class="account-img">
               <img :src="getLogo" >
            </div>
          </div>
          <div v-if="islogin" @click="myValue=false">
             <!--<div class="tool-item-href">-->
               <!--{{$t('navbar.userAccount')}} <span class="fr"> {{userData.userName}} </span>-->
             <!--</div>-->
            <div class="tool-item-href">
              {{$t('navbar.nickName')}} <span class="fr"> {{userData.nickname}} </span>
            </div>
            <div class="tool-item-href">
              {{$t('navbar.accountBalance')}} <span class="fr"><balance></balance></span>
            </div>

          </div>
          <div v-else @click="myValue=false">
            <router-link :to="{name:'mobileLogin'}" v-if="!isCustomize" class="tool-item-href"><i class="iconfont icon-user-login"></i>{{$t('login.iWantLogin')}}</router-link>
            <router-link :to="{name:'mobileRegister'}" v-if="!isCustomize" class="tool-item-href"><i class="iconfont icon-user-register"></i>{{$t('login.iWantRegister')}}
            </router-link>
            <get-live800></get-live800>
            <a class="tool-item-href" target="_blank" :href="SETTING.appUrl">
              <i class="iconfont icon-download"></i>{{$t('navbar.juanApp')}}
            </a>
            <router-link :to="{name:'index'}" class="tool-item-href border-bot">
              <i class="iconfont icon-juan-logo1"></i>前往久安首页
            </router-link>
          </div>
          <div class="tool-item-href border-bot hidden" @click="handleSetLanguage" > {{$t('navbar.languageSel')}} </div>

        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  import { show } from 'api';
  import {SETTING} from "@/assets/data"
  import {mapGetters} from 'vuex'
  import Balance from 'components/balance'
  import getLive800 from 'components/get-live800'
  import {$localStorage} from '@/util/storage'

  import jiuanLogo from '@/assets/images/icon/juan-logo.svg'

  export default {
    data() {
      return {
        SETTING,
        myValue: false,
        isCustomize: _.customize()
      }
    },
    props: ["value"],
    components:{
      Balance, getLive800
    },
    computed: {
      ...mapGetters(["userData", 'islogin']),
      language() {
          return this.$store.getters.language
      },
      getLogo(){
        const menuStyle = JSON.parse($localStorage.get('menuStyle'))
        let logoSrc = jiuanLogo
        if(this.userData.nodeId > 10000 && menuStyle){
          logoSrc = menuStyle.iconUrl
        }
        return logoSrc
      }
    },
    watch: {
      value(val) {
        this.myValue = val;
      },
      myValue(val) {
        this.$emit("input", val);
      }
    },
    methods: {
      handleSetLanguage() {
        this.$i18n.locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh';
        this.$store.dispatch("SET_LANGUAGE", this.$i18n.locale);
      }

    },
    created(){

    }
  }
</script>
<style lang="scss" >
  @import "~assets/scss/mixin";

  .tool-warp {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.40);
    z-index: 100;
    .tool-bar {
      @include f(15px);
      transition: transform 0.5s;
      top: 0;
      left: 0;
      text-align: left;
      background: $white;

      height: 100%;
      width: r(250);
      color: $font-color;
      &.active {
        display: block;
        transform: translateX(0);
      }
      .tool-user-info {
        text-align: center;
        padding: r(51) 0 ;
      }
      .tool-item-href {
        display: block;
        height: r(44);
        line-height: r(44);
        border-top: 1px solid #D8D8D8;
        padding: 0 r(10) 0 r(20);
        .iconfont{
          @include f(18px);
          margin-right: r(10);
          color: #ABABAB;
        }
        i.icon-download,i.icon-juan-logo1{
          @include f(20px);
          margin-right: r(8);
        }
        span{
          color: #787876;
        }
      }
      .border-bot{
        border-bottom: 1px solid #D8D8D8;
      }
      .mt-line{
        margin-top: r(10);
      }
    }
    .tool-custom{ //定制版头部
      width: 100%;
      background: #3573fa;
      min-height: r(100);
    }
  }
</style>
