<template>
  <a :class="['item-href','live-800',liveSpecStyle]" target="_blank" :href="live800Url">
    <i v-if="isRoundIcon" class="iconfont icon-online-serv"></i>
    <i v-else class="iconfont icon-online-service"></i>
    {{$t('navbar.onlineService')}}
    <i class="iconfont icon-right-arrow fr" v-show="showRightArrow"></i>
  </a>
</template>
<script>
  import { show } from 'api';

  export default {
    data() {
      return {
        live800Url: ''
      };
    },
    props: {
      showRightArrow:{
        type:Boolean,
        default:false
      },
      isRoundIcon:{
        type:Boolean,
        default:false
      },
      liveSpecStyle:{
        type:String,
        default:""
      }
    },
    methods: {
      getLive800Url(){
        show.getLive800Url({}).then(res => {
          if (res.code == 10000) {
            this.live800Url = res.data.url;
          }else{
            toast(res.message);
          }
        }).catch(err => {
          toast(err.message);
        })
      }
    },
    computed: {},
    created() {
      this.getLive800Url();
    },
    components: {}
  };
</script>
<style lang="scss">
  @import "~assets/scss/mixin";

  .mcenter-live{
    .icon-online-serv{
      @include  f(25px);
      margin-right: r(5);
      color: #27BD91;
    }
  }
</style>
