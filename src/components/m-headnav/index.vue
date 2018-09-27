<template>
  <header class="mobile-headnav">
    <!--<a @click="value=true" class="back-link"><i class="iconfont icon-menu"></i></a>-->
    <slot></slot>
    <m-toolbar v-model="value" ></m-toolbar>
  </header>
</template>
<script>
  import mToolbar from 'components/m-toolbar';

  export default {
    data() {
      return {
        value:false
      };
    },
    props: {

    },
    methods: {
      doClick(){

      }
    },
    computed: {},
    created() {
    },
    components: {
      mToolbar
    }
  };
</script>
<style lang="scss">
  @import "~assets/scss/mixin";

  header.mobile-headnav{
    position: relative;
    height: r($header-hg);
    line-height: r($header-hg);
    background: $main-color;
    @include  f(18px);
    color: $white;
    text-align: center;
    .back-link{
      position: absolute;
      height: 100%;
      left:0;
      width:r(66);
      top:50%;
      transform:translateY(-50%);
      text-align: left;
      padding-left: r(15);
    }
    .icon-menu{
      @include f(13px)
    }
  }

</style>
