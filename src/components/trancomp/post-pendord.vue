<template>
  <div v-if="show">
    <div class="modal fade in">
      <div class="modal-dialog popup">
        <div type="button" class="close close-w" @click="hide">
          <i class="iconfont icon-close"></i>
        </div>

        <div class="pop-con">
          <h2 class="alert-title">{{generateTitle(title)}}</h2>
          <div class="stab-box" v-if="showTab">
            <span v-for="item in postType" @click="postItem=item.value" class="s" :class="{active:postItem==item.value}"
                  :key="item.value">
            {{generateTitle(item.name)}}
            </span>
          </div>
          <div class="form-input-content">
            <div class="form-input-box user-balace">
              <span class="left">我的{{userData.accountChainVos[0].assetCode}}余额：</span>
              <balance @getBalance="getBalance"></balance>
              <a class="c-blue all-in" @click="allSell()" v-show="postItem === 'seller'">{{$t('postPend.allsell')}}</a>
            </div>
            <div class="form-input-box">
              <span class="left">{{postItem == 'buyer' ? '买入' : '卖出'}}价格：</span>
              <span class="fl">
              <input type="text" class="ps-input" readonly placeholder="100 UET= 1CNY">
            </span>
            </div>
            <div class="form-input-box">
              <span class="left">{{postItem == 'buyer' ? $t('postPend.buyAmount') : $t('postPend.sellAmount')}}：</span>
              <span class="ps-input fl">
              <input type="text" class="ps-input-in" v-model.number="buyAmount" v-number-only maxlength="9">
              <span class="i-uet">UET</span>
            </span>
              <span class="fl">
              <span>&nbsp;{{buyAmountCny}}</span>
              CNY
            </span>
            </div>
            <div class="form-input-box payment">
              <span class="left">{{postItem == 'buyer' ? '支付' : '收款'}}方式：</span>
              <span class="ps-input">
                <get-bankcard :setBankcard="setBankcard"
                              v-model="bindCardReset"
                              :def-select="bankNo"
                              :filter-bank="filterBank"
                              @selCardChange="selCardChange"></get-bankcard>
              </span>
            </div>
            <div class="btn-groups">
              <span class="btn" @click="hide">取消</span>
              <span class="btn btn-primary" @click="publishBuyOrSell">快速{{postItem === 'buyer' ? '买' : '卖'}}币</span>
            </div>
          </div>
          <transition name="fade">
            <div class="coupon" v-if="couponDetail.length > 0">
              <coupon-detail :item="couponDetail"></coupon-detail>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {show} from 'api'
  import {transaction} from 'api'
  import {generateTitle} from '@/util/i18n'
  import {mapGetters} from 'vuex'
  import getBankcard from 'components/get-bankcard'
  import balance from 'components/balance';
  import CouponDetail from 'components/coupon-detail'
  import {
    getFastTraderAward
  } from 'api/activity'

  export default {

    data() {
      return {
        postType: [
          {name: "transactionRecord.buyer", value: "buyer"},
          {name: "transactionRecord.seller", value: "seller"}
        ],
        postItem: 'buyer',
        buyAmount: '',
        payType: '',
        accountCashVo: {},
        buyTypeBuyBank: '',
        minAmount: 1,
        proofType: '0',
        setBankcard: {
          pleaseSelTitle: 'component.pleaseSelPayMet',         // 请选择标题文字
          addOption:[]
        },
        bindCardReset:false,
        userBalance:0,//用户余额
        couponDetail:{},
        filterBank:false,
      }
    },
    watch: {
      postItem(val) {
        if(val === 'seller' && this.auto === 1){
          this.buyAmount = Number(this.amount) * 100;
          //this.minAmount = this.auto === 1 ? 1 : '';
        }else{
          this.buyAmount = '';
          this.bindCardReset = true;
          //this.minAmount = '';
        }
        this.setBankcard.pleaseSelTitle = val === 'seller' ? 'component.pleaseSelRecMet' : 'component.pleaseSelPayMet'
        this.filterBank = val === 'seller' ? true : false
      },
      type(val){
        if(val === 2){
          this.postItem = 'seller'
        }
      },
      show(val){
        if(!val){
          this.buyAmount = ''
          this.bindCardReset = true
          //this.minAmount = ''
          //this.postItem = 'buyer'
        }else{
          this.postItem = this.type === 1 ? 'buyer' : 'seller'
        }
      }
    },
    model: {
      prop: 'show',
      event: 'change'
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'postPend.postTitle'
      },
      showTab: {  //是都显示买入 卖出切换tab
        type: Boolean,
        default: true
      },
      urlName: { // 发布成功需要调整的路由名称
        type: String,
        default: ''
      },
      type: {  // 1代表买入 2代表卖出
        type: Number,
        default: 1
      },
      amount:{ //买卖币金额 CNY
        type: String,
        default: ''
      },
      auto:{ //自动填写挂单信息 商户提款会用到 0表示不填写 1表示填写
        type:Number,
        default:0
      },
      bankNo:{  //银行卡号
        type:String,
        default:''
      }
    },
    computed: {
      ...mapGetters(["userData"]),
      buyAmountCny() {
        return (Number(this.buyAmount) * 0.01).toFixed(2);
      }
    },
    methods: {
      generateTitle,
      hide() {
        this.$emit('change', false);
        this.$store.commit("SHOW_FASTSALE",false);
      },
      selCardChange(selCard) {
         this.payType = selCard;
      },
      publishBuyOrSell() {
        if (this.buyAmount == '' || !this.buyAmount) {
          toast('数量不能为空');
          return;
        }
        if(!_.isInteger(this.buyAmount) || this.buyAmount<1){
          toast('请输入整数数量');
          return;
        }
        if (this.payType == '' || !this.payType) {
          toast(`请选择${this.postItem === 'seller' ? '收款' : '支付'}方式`);
          return;
        }
        // if (this.minAmount == '' || this.minAmount < 0) {
        //   toast('最低买入数量输入不正确');
        //   return;
        // }
        // if(!_.isInteger(this.minAmount) || this.minAmount<1){
        //   toast('请输入整数最低买入数量');
        //   return;
        // }
        // if (this.postItem === 'seller' && (this.proofType == '' || !this.proofType)) {
        //   toast('付款说明不能为空');
        //   return;
        // }
        if (this.payType.type == '1') {
          this.buyTypeBuyBank = '支付宝'
        } else if (this.payType.type == '2') {
          this.buyTypeBuyBank = '微信'
        } else {
          this.buyTypeBuyBank = this.payType.bank
        }
        this.requestda = {
          userId: this.userData.userId,
          orderOptionVo: {
            minUnit: this.minAmount,//等于发布的数量
            contractType: 1,
            mode: 1
          },
          accountChainVo: {
            name: this.userData.nickname,
            address: this.userData.accountChainVos[0].address,
            assetCode: 'UET', //资产编码 默认 UET,登录后资产的编码
            amount: this.buyAmount //uet的数量
          },
          accountCashVo: {
            "account": this.payType.account,
            "bank": this.buyTypeBuyBank, //机构名称
            "name": this.payType.name,
            "type": this.payType.type,
            "amount": this.buyAmount / 100
          },
        }
        if (this.postItem === 'seller') {
          Object.assign(this.requestda.orderOptionVo,{
            proofType: this.proofType
          })
        }
        console.log('requestda',this.requestda)
        const api = this.postItem === 'buyer' ? transaction.publishToBuy : transaction.publishToSell
        api(this.requestda).then((res) => {
          console.log(res)
          if (res.code == '10000') {
            this.buyAmount = '';
            this.bindCardReset=true;
            // this.minAmount = '';
            toast('您已下单成功，请进入列表查询');
            this.hide()
            if (this.urlName != '') {
              this.$router.push({name: this.urlName});
            }
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err.message);
        })
      },
      getBalance(data){
        this.userBalance = data
      },
      allSell(){
        this.buyAmount = Number(this.userBalance)
      },
      getGift(){
        getFastTraderAward({}).then(res => {
          console.log('myGift',res)
          if(res.code === 10000){
            if(res.data && !_.isNull(res.data)){
              this.couponDetail = res.data
            }
          }
        })
      }
    },

    created() {
      this.postItem = this.type === 1 ? 'buyer' : 'seller'
      this.buyAmount = this.amount === '' ? '' : Number(this.amount) * 100
      if(this.auto === 1){
        this.minAmount = 1
        // this.proofType = '0'
      }
    },
    mounted() {
      this.getGift()
    },
    activated() {
    },
    components: {
      getBankcard,
      balance,
      CouponDetail
    }
  };
</script>
<style lang="scss" scoped>
  .stab-box {
    margin-bottom: 0 !important;
  }

  .form-input-content {
    padding-top: 20px;
  }

  .form-input-box {
    height: 45px;
    line-height: 45px;
    margin: 0 0 15px 0;
    padding: 5px 10px 5px 100px !important;
    /*.bind-card-part{*/
      /*width: 75% !important;*/
    /*}*/
  }

  .popup .pop-con .ps-input {
    display: inline-block;
  }

  .popup .pop-con .ps-input-in {
    display: inline-block;
    height: 42px;
    line-height: 42px;
    margin-top: 1px;
    border: 0;
    float: left;
    width: 80%;
    &:focus {
      outline: none;
    }
  }

  .form-input-box {
    position: relative;
  }

  .form-input-box .left {
    display: inline-block;
    float: left;
    height: 45px;
    line-height: 45px;
    width: 25%;
    text-align: right;
  }

  .i-uet {
    /*position: absolute;*/
    /*left: 350px;*/
    color: #777;
  }
  .payment{
    .ps-input{
      border: none;
      padding: 0;
    }
  }
  .user-balace{
    .all-in{
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .coupon{
    height: 100px;
    margin-top: 25px;
  }
</style>
