<template>
  <div class="error-page-main section">
    <simple-header></simple-header>
    <m-header>{{$t('navbar.juanWallet')}}</m-header>

    <div class="error-content">
      <div class="errcontent-part">
        <div class="fbbg">
          <img src="./images/500.png" class="width-100" />
        </div>
        <div class="title">500</div>
        <div class="des-info">别怕，我们已经派人抢修了</div>
        <div class="btn-group">
          <a href="javascript:void(0);" @click="goHome" class="blue-btn interval">返回首页</a>
          <a href="javascript:void(0);" @click="goback" class="orange-btn">返回上一页</a>
        </div>
      </div>
    </div>

    <copyright-footer></copyright-footer>
  </div>
</template>
<script>
  import {SETTING} from "@/assets/data"
  import simpleHeader from './components/simple-header'
  import copyrightFooter from './components/copyright-footer'
  import mHeader from 'components/m-header'

  export default {
    name: "",
    data() {
      return {SETTING}
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      goHome(){
        if(_.isMobile()){
          this.$router.replace({name: 'mIndex'});
        }else{
          window.location.href = "/static/index.html";
        }
      },
      goback(){
        this.$router.back();
      }
    },
    created() {

    },
    activated() {
    },
    components: {
      simpleHeader, mHeader, copyrightFooter
    }
  }
</script>
<style lang="scss">
  @import "./style/error.scss";

</style>
