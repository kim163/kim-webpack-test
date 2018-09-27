<template>
  <span>
       {{balance}} {{assetCode}}
  </span>
</template>
<script>
  import {transaction} from 'api'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        balance: '0',
        assetCode: 'UET',
        address:'',
        hasOnBus:false,
        needUpdate:true,
      }
    },
    computed: {
      ...mapGetters(["userId", "islogin", "userData"]),
    },
    watch: {
      islogin(newParam, oldParam) {
        this.getBalance()
      }
    },
    methods: {
      getBalance(order) {
        let userId = this.userId;
        const userData = this.userData
        if(userData.accountChainVos && userData.accountChainVos.length > 0){
          this.assetCode = userData.accountChainVos[0].assetCode
          this.address = userData.accountChainVos[0].address
        }
        this.request = {
          userId: userId,
          assetCode: this.assetCode,
          address: this.address,
        }
        transaction.getRealBalance(this.request).then(res => {
          console.log(res)
          if (res.code == '10000') {
            this.$nextTick(() => {
              this.balance = res.data.key;
              this.$emit('getBalance', this.balance)
            })
          } else {
            this.balance = '刷新后再试';
          }

        }).catch(error => {
          toast(error.message);
        });
      },
      onBus() {
        if(!this.hasOnBus){
          Vue.$global.bus.$on('update:balance', () => {
            this.getBalance()
          })
          this.hasOnBus = true
        }
      },
      offBus() {
        Vue.$global.bus.$off('update:balance')
        this.hasOnBus = false
      },
      checkLogin() {
        if (this.islogin) {
          this.getBalance()
        }
      }
    },
    created() {

    },
    mounted() {
      if(this.needUpdate){
        this.checkLogin()
        this.needUpdate = false
      }
      this.onBus()
    },
    components: {},
    activated() {
      this.onBus()
      if(this.needUpdate){
        this.checkLogin()
        this.needUpdate = false
      }
    },
    deactivated() {
      this.offBus()
      this.needUpdate = true
    },
    beforeDestroy() {
      this.offBus()
    }
  };
</script>

<style scoped lang="scss">

</style>
































