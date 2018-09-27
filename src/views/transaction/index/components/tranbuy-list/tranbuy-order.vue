<template>
  <transition name="message">
     <div class="tran-contpart">
          <span class="s s1">
             <p>{{$t('transactionHome.quantity')}} {{item.balance}} UET</p>
             <p>{{$t('transactionHome.unitPrice')}} 0.01 CNY</p>
          </span>
          <span  class="s s2">{{$t('transactionHome.totalValue')}} {{item.balance}} UET</span>
         <div class="tran-input-part">
           <span class="input-box">
             <input type="text" :placeholder="buyMinUnit" v-model.number="buyAmountUet" :key="item.id" maxlength="9"> UET
           </span>
           <span class="input-box">
             <input type="text" :value="buyAmountCny" :placeholder="$t('transactionHome.convertAmount')" readonly>CNY
           </span>
           <get-bankcard :setBankcard="setBankcard" v-model="bindCardReset" @selCardChange="selCardChange"></get-bankcard>
         </div>

          <span class="btns">
             <span class="btn btn-primary" @click="placeAnOrder(item)">{{$t('transactionHome.order')}}</span>
             <span class="btn btn-cancel gray" @click="$emit('hiddenOrder')">{{$t('postPend.cancel')}}</span>
          </span>
    </div>
  </transition>
</template>
<script>
  import { transaction } from 'api';
  import {mapGetters,mapActions,mapMutations} from 'vuex';
  import getBankcard from 'components/get-bankcard'

  export default {
    data() {
      return {
        buyAmountUet:'',
        buyTypeBuy:'',
        buyTypeBuyBank:'',
        setBankcard: {
          pleaseSelTitle: 'component.pleaseSelPayMet',         // 请选择标题文字
          addOption:[]
        },
        bindCardReset:false,
      };
    },
    props: {
      item: {
        type: Object
      }
    },
    methods: {
      selCardChange(selCard) {
        this.buyTypeBuy = selCard;
      },
      checkVerif(){
        if(this.buyAmountUet =='' || !this.buyAmountUet){
          toast('请您输入正确的购买数量');
        }else if(!_.isInteger(this.buyAmountUet) || this.buyAmountUet<1){
          toast('请您输入整数购买数量');
        }else if(this.buyAmountUet < this.item.minUnit){
          toast('您输入的数量低于最低买入数量');
        }else if(this.buyAmountUet > this.item.balance){
          toast('您输入的数量高于可买数量');
        }else if(this.buyTypeBuy =='' || !this.buyTypeBuy){
          toast('请选择支付方式');
        }else {
          return true;
        }
      },

      placeAnOrder(item){
        if(!this.checkVerif()) return;
        if(this.buyTypeBuy.type =='1'){
          this.buyTypeBuyBank='支付宝'
        }else if(this.buyTypeBuy.type =='2'){
          this.buyTypeBuyBank='微信'
        }else{
          this.buyTypeBuyBank=this.buyTypeBuy.bank
        }

       let requestda={
          orderId:item.id,
          userId: this.userData.userId,
          accountChainVo:{
            name:this.userData.nickname,
            address:this.userData.accountChainVos[0].address,
            assetCode:'UET', //资产编码 默认 UET,登录后资产的编码
            amount:this.buyAmountUet //uet的数量
          },
          accountCashVo: {
           account: this.buyTypeBuy.account,
           bank: this.buyTypeBuyBank, //机构名称
           name: this.buyTypeBuy.name,
           type: this.buyTypeBuy.type,
           amount: this.buyAmountUet /100
          }
        }
        console.log('UET 充值 param',requestda)
        transaction.placeAnOrder(requestda).then(res => {
          console.log(res)
          if (res.code == 10000) {
            Vue.$global.bus.$emit('update:balance');
            this.$router.push({name: 'orderDetail',params:{ id: res.data.key}});
          }else {
            toast(res.message);
          }

        }).catch(err => {
          toast(err.message);
        })
      }
    },
    computed: {
      ...mapGetters(["userData"]),
      buyAmountCny(){
        return (Number(this.buyAmountUet) *0.01).toFixed(2);
      },
      buyMinUnit(){
        return '最低买入'+this.item.minUnit+'UET';
      }
    },
    created() {
    },
    components: {
      getBankcard
    }
  };
</script>
<style lang="scss">

</style>
