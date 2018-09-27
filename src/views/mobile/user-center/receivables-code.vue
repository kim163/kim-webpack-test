<template>
  <div class="mreceiv-code">
    <mobile-header>{{$t('userCenter.receivcode')}}</mobile-header>

    <div v-for="(item,i) in userData.accountChainVos" class="mreceiv-code-content">
      <p class="address"> {{item.address}} </p>
      <div class="qrcode">
        <qrcode :text="'UET,'+item.address" v-if="item.address" :logoSrc="Logo" :logoScale="0.2" :size="180"></qrcode>
      </div>
      <a href="javascript:void(0);" class="copy-btn mobile-pubtn" :data-clipboard-text="item.address"
         @click="copy" >{{$t('transactionHome.copyBtn')}}</a>
    </div>

  </div>
</template>
<script>
  import MobileHeader from 'components/m-header';
  import { mapGetters} from 'vuex';
  import VueQrcode from 'vue-qr';
  import Logo from '@/assets/images/logo-blue.png';
  import Clipboard from 'clipboard';

  export default {
    data() {
      return {
        Logo
      };
    },
    props: {},
    methods: {
      copy() {
        var clipboard = new Clipboard('a.copy-btn');
        clipboard.on('success', e => {
          toast('复制成功')
          // 释放内存
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        });
      }
    },
    computed: {
      ...mapGetters(["userData"])
    },
    created() {
    },
    components: {
      qrcode: VueQrcode,
      MobileHeader
    }
  };
</script>
<style lang="scss">
  @import "~assets/scss/mobile";
.mreceiv-code{
  padding-bottom: r($footer-hg+20);
}

.mreceiv-code-content{
  background: #FFFFFF;
  text-align: center;
  padding: r(32) r(20) r(60);

  .address{
    @include  f(16px);
    color:$font-color;
    line-height: r(22);
    word-wrap:break-word;
    margin-bottom: r(31);
  }
  .qrcode{
    width: r(150);
    height: r(150);
    overflow: hidden;
    margin: r(0) auto r(30);
  }
}
</style>
