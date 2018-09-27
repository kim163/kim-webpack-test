<template>
  <div :class="['navbar',{'nav-start':!isScrollTop}]">
    <div class="container min-width">
      <div class="row cfx">
        <div class="logo">
          <router-link :to="{name:'transaction'}" class="nav-logo-link">
            <i class="iconfont icon-prom-logo"></i>
          </router-link>
        </div>
        <div class="link-part">
          <div class="col-2">
            <get-live800></get-live800>
          </div>
          <v-header></v-header>
          <div class="col-2 tran-btn fr">
            <router-link :to="{name:'index'}">前往久安首页</router-link>
          </div>

          <div class="lang-icons">
            <a href="javascript:void(0);" class="lang-en j-languageSel" @click="handleSetLanguage" >{{$t('navbar.languageSel')}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {SETTING} from "@/assets/data"
  import vHeader from 'components/header'
  import getLive800 from 'components/get-live800'

  export default {
    name: "",
    data() {
      return {
        isScrollTop: false,
        SETTING
      }
    },
    props: {},
    computed: {
      language() {
        return this.$store.getters.language
      }
    },
    watch: {},
    methods: {
      handleSetLanguage() {
        this.$i18n.locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh';
        this.$store.dispatch("SET_LANGUAGE", this.$i18n.locale);
      },

      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTop > 0){
           this.isScrollTop = true;
        }else{
          this.isScrollTop = false;
        }
      }
    },
    created() {
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll);
    },
    activated() {
    },
    components: {
      vHeader,
      getLive800
    }
  }
</script>
<style lang="scss">
  .navbar {
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 10px 0 ;
    background-color: rgba(255,255,255,0.85);
    box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
    -moz-box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
    -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
  }
  .navbar .logo {
    float: left;
    height: 50px;
  }
  .navbar a {
    font-weight: 300;
  }
  .navbar a:hover {
    color: #5087FF;
  }
  .navbar .link-part{
    float: right;
  }
  .navbar .link-part .col-2{
    width: auto;
    margin: 15px 15px 0;
    &.tran-btn{
      margin: 5px 0 0 15px;
    }
  }
  .navbar .link-part .col-2 a{
    font-size: 18px;
  }
  .navbar .link-part .lang-icons{
    margin: 8px 0 0 20px;
    float: right;
    display: none;
  }
  .nav-start .link-part .lang-icons{
    margin: 18px 0 0 20px;
  }
  .navbar .link-part .iconfont{
    margin-right: 5px;
    vertical-align: top;
    &.icon-online-service{
      vertical-align: middle;
    }
  }
  a.lang-en{
    font-size: 18px;
    padding: 7px 16px;
    border: 1px solid #14171a;
    border-radius: 35px;
    display: block;
  }
  .navbar a.lang-en,.navbar .lang-icons a:hover{
    border: 1px solid #14171a;
  }
  .nav-start a.lang-en,.nav-start .lang-icons a:hover{
    border: 2px solid #ffffff;
  }
  .nav-start a.btn-other, .nav-start a.btn-other:hover{
    border: 1px solid #ffffff;
  }

  @media only screen and (min-width: 800px) and (max-width: 1020px) {
    .navbar .link-part .col-2{
      width: auto;
    }
  }

  .nav-down {
    top: -200px;
  }
  .nav-start {
    padding: 15px 0;
    transition: all 0.2s ease-in-out;
    background: #5087FF;
    box-shadow: 1px 1px 4px rgba(0,0,0,0);
    -moz-box-shadow: 1px 1px 4px rgba(0,0,0,0);
    -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0);
  }
  .nav-start a {
    color: white;
  }
  .navbar a{
    display: block;
  }
  .nav-start a:hover {
    border-bottom: 1px solid white;
    color: white;
  }
  .nav-start .nav-logo-link .iconfont{
    font-size:50px;
    color: white;
  }
  .nav-logo-link .iconfont{
    font-size:50px;
    color: #5087FF;
  }
  .navbar .link-part .tran-btn{
    a{
      padding: 8px 16px;
      background: transparent;
      border: 1px solid #14171a;
      border-radius: 3px;
      font-size: 16px;
    }
  }
  .navbar.nav-start .link-part .tran-btn{
     a{
        background: #FFFFFF;
        border: 1px solid #FFFFFF;
        font-size: 16px;
        color: #5087ff;
       border-radius: 35px;
     }
  }


  .nav-logo-link:hover, .nav-start .nav-logo-link:hover{
    border-bottom:none;
  }
  .lang-icons a:hover , a.btn-other:hover,.navbar .link-part .tran-btn a:hover{
    box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
    -moz-box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
    -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
    text-decoration: none;
    border: 1px solid #5087FF;
  }
</style>
