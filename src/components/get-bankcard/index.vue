<template>
  <p class="bind-card-part">
     <select class="my-input" v-if="!noCardTips" v-model="selBankCard">
         <option value="">{{$t(setBankcard.pleaseSelTitle)}}</option>
         <option v-for="item in bankList.data||[]" :value="item">
            <span  v-if="item.type === 1">支付宝 {{item.account}}</span>
            <span  v-else-if="item.type === 2">微信 {{item.account}}</span>
            <span  v-else-if="item.type === 3">{{item.bank}} {{subData(item.account)}}</span>
            <span  v-else>{{$t(item.account)}}</span>
         </option>
     </select>

     <span class="nocard-tips cl-sky-blue" v-if="noCardTips">
        您尚未绑定银行卡 <router-link :to="userCenterLink()" class="link-item cl-red">立即绑定</router-link>
     </span>
  </p>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        selBankCard:'',
        bankList: {
          data: []
        },
        requestdata:{},
        noCardTips:false
      };
    },
    model:{
      prop: 'reset',
      event: 'changeReset'
    },
    props: {
      setBankcard: {
        type: Object,
        default() {
          return {
            pleaseSelTitle:'component.pleaseSelCard',    // 请选择标题文字
            addOption:[]                  // 添加的选项
          }
        }
      },
      reset:{
        type:Boolean,
        default:false
      },
      defSelect:{
        type:String,
        default:''
      },
      autoSelect:{
        type:Boolean,
        default:false
      },
      filterBank:{ //过滤信息 只能选择银行卡
        type:Boolean,
        default:false
      }
    },
    watch: {
      "selBankCard"(val){
        this.$emit("selCardChange", val);
      },
      reset(val){
        if(val){
          this.selBankCard = '';
          this.$emit("selCardChange", this.selBankCard);
          this.$emit('changeReset',false);
        }
      },
      filterBank(){
        this.getBankInfo()
      }
    },
    methods: {
      getBankInfo(){
        // this.bankList.data = this.bankCardInfo;
        if(this.bankCardInfo.length<1){
          this.noCardTips = true;
          this.$emit("selCardChange", this.bankCardInfo);
        }
        let cardList = this.bankCardInfo
        if(this.filterBank){
          cardList = this.bankCardInfo.filter((item) => {
            return item.type === 3
          });  //临时添加支付宝、微信过滤
        }
        if(cardList.length < 1){
          this.noCardTips = true;
          this.selBankCard = '';
        }else{
          this.noCardTips = false;
        }
        this.bankList.data = cardList
        if(this.setBankcard.addOption.length>0){
          for (let i in this.setBankcard.addOption){
            this.bankList.data.push(this.setBankcard.addOption[i]);
          }
        }
        if(this.bankList.data.length > 0 && this.autoSelect){
          this.selBankCard = this.bankList.data[0]
        }
        if(this.defSelect != ''){
          this.selBankCard = _(this.bankList.data).find((item) => {
            return item.account === this.defSelect
          })
        }
      },
      subData(item){
        return (item.substring(item.length-4))
      },
      userCenterLink(){
        let routerName = '';
        if(_.isMobile()){
          routerName = 'mUserCenter';
        }else {
          routerName = 'pcUserCenter';
        }
        return {name: routerName};
      }
    },
    computed: {
      ...mapGetters([
        'bankCardInfo'
      ])
    },
    created() {
      this.getBankInfo();
    },
    components: {}
  };
</script>
<style lang="scss" scoped>
  .bind-card-part{
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    .my-input{
      /*border: none;*/
      width: 100%;
      height: 100%;
      border: 1px solid #D3D3D3;
    }
    .nocard-tips{
      a{
        padding: 5px 2px;
        border-bottom: 1px solid #ff1e1e;
      }
    }
  }

</style>
