<template>
  <div class="error-page-main section">
    <simple-header></simple-header>
    <m-header>{{$t('navbar.juanWallet')}}</m-header>

    <div class="error-content">
      <div class="errcontent-part">
        <div class="fbbg">
          <img src="./images/403.png" class="width-100" />
        </div>
        <div class="title">403</div>
        <div class="des-info">抱歉，您暂时没有权限访问该页面</div>
        <div class="btn-group"></div>
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
