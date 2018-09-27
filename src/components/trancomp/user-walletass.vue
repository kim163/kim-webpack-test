<template>
  <div class="user-walletasset">
     <h2 class="title"> {{$t('transactionHome.userWalletAss')}} </h2>
     <div v-for="(item,i) in userData.accountChainVos">
        <h3 class="amount">
          <balance></balance>
        </h3>
        <div class="qrcode">
           <qrcode :text="'UET,'+item.address" v-if="item.address" :logoSrc="Logo" :logoScale="0.2" :size="188"></qrcode>
        </div>
        <p class="address"> {{item.address}} </p>
        <a href="javascript:void(0);" class="copy-btn" @click="copystr(item.address)" >{{$t('transactionHome.copyBtn')}}</a>
     </div>

  </div>
</template>
<script>
  import { mapGetters,mapActions, mapMutations} from 'vuex';
  import VueQrcode from 'vue-qr';
  import Logo from '@/assets/images/logo-blue.png'
  import balance from 'components/balance';

  export default {
    data() {
      return {
        Logo
      };
    },
    props: {},
    methods: {
      copystr(text) {
        text.$copy();
        toast(this.$t('transactionHome.successCopy'));
      }
    },
    computed: {
      ...mapGetters(["userData"])
    },
    created() {
    },
    components: {
      qrcode: VueQrcode,
      balance
    }
  };
</script>
<style lang="scss">
.user-walletasset{
   .title{
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #ffffff;
      background: #5087FF;
      padding: 0 19px;
      font-weight: normal;
   }
   .amount{
     line-height: 52px;
     border-bottom: 1px solid #D4D4D4;
     padding: 0 19px;
     font-size: 16px;
     color: #333333;
     font-weight: normal;
   }
  .qrcode{
    margin: 35px 0 0;
    text-align: center;
  }
  .address{
    word-break: break-all;
    font-size: 16px;
    color: #333333;
    max-width: 280px;
    text-align: center;
    margin: 10px auto 15px;
    line-height: 24px;
  }
  .copy-btn{
    width: 188px;
    height: 38px;
    line-height: 38px;
    font-size: 20px;
    color: #5087ff;
    border: 1px solid #5C8FFF;
    border-radius: 5px;
    display: block;
    margin: 0 auto 20px;
    text-align: center;
    &:hover{
      color: #ffffff;
      background: #FF9600;
      border: 1px solid #FF9600;
    }
  }

}
</style>
