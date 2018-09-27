<template>
  <div v-if="showRes">
    <mobile-header v-if="!isPc">绑定{{typeName}}</mobile-header>
    <div v-if="!hasBind">
      <div class="title-tip" v-if="type != 3">{{typeName}}认证姓名，务必与真实姓名相同</div>
      <div class="card-main">
        <div class="p-def" v-if="type === 3">
          <div class="card-item">
            <label class="title">银行卡号:</label>
            <input class="card-input" type="text" v-model.trim="account"/>
          </div>
          <div class="card-item">
            <label class="title">银行名称:</label>
            <input class="card-input" type="text" v-model.trim="bank" @focus="getBankName(false)"/>
          </div>
          <div class="card-item">
            <label class="title">持卡人姓名:</label>
            <span class="has-name" v-if="userData.name != ''">{{name}}</span>
            <input v-else class="card-input" type="text" v-model.trim="name"/>
          </div>
        </div>
        <div v-else>
          <div class="add-qrcode">
            <upload-img :upload-img-set="upLoadCfg" :show-close="true" v-model="uploadReset" @gitPicUrl="getQrcodeUrl"></upload-img>
          </div>
          <div class="card-item p-LR-sm">
            <label class="title qr-title">{{typeName}}账号:</label>
            <input class="card-input qr-input" type="text" v-model.trim="account"/>
          </div>
          <div class="card-item p-LR-sm">
            <label class="title qr-title">{{typeName}}认证姓名:</label>
            <span class="has-name" v-if="userData.name">{{name}}</span>
            <input v-else class="card-input qr-input" type="text" v-model.trim="name"/>
          </div>
        </div>
        <div class="p-def">
          <div class="bind-def-btn" @click="bindCard">绑定</div>
        </div>
      </div>
    </div>
    <has-bind v-else :data-info="hasBindInfo" :type-name="typeName"></has-bind>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import {mapGetters} from 'vuex'
  import UploadImg from 'components/upload-img'
  import HasBind from './has-bind'
  import {
    autoRecognize,
    bindBankV2,
    getBankList
  } from 'api/user-center'
  export default {
    name: "bind-card",
    data(){
      return{
        account:'',
        bank:'',
        name:'',
        type:1,  // 绑定类型  1支付宝 2微信 3银行卡
        typeName:'',
        upLoadCfg:{
          maxUploadNum:1,
          uploadImgTips: 'userCenter.uploadQrcode',
          isShowUploadTip:true
        },
        qrCodeUrl:'',
        hasBindInfo:[],
        hasBind:false,
        showRes:false,
        uploadReset:false
      }
    },
    watch:{
      tabType(){
        this.hasBind = false
        this.uploadReset = true
        this.getBindInfo()
      }
    },
    props:{
      isPc:{
        type:Boolean,
        default:false
      },
      tabType:{
        type:Number,
        default:1
      }
    },
    components:{
      MobileHeader,
      UploadImg,
      HasBind
    },
    computed:{
      ...mapGetters([
        'userData'
      ])
    },
    methods:{
      getQrcodeUrl(url){
        this.qrCodeUrl = url[0]
      },
      bindCard(){
        if(this.account === ''){
          const txt = this.type === 3 ? '请输入银行卡号' : `请输入${this.typeName}账号`
          toast(txt)
          return false
        }
        if(this.type === 3 && this.bank === ''){
          toast('请输入银行名称')
          return false
        }
        if(this.name === ''){
          const txt = this.type === 3 ? '请输入持卡人姓名' : `请输入${this.typeName}认证姓名`
          toast(txt)
          return false
        }
        if(this.type != 3 && (this.qrCodeUrl === '' || _.isUndefined(this.qrCodeUrl))){
          toast('请点击上传您的收款二维码')
          return false
        }
        if(this.type === 3){
          this.getBankName(true)
        }else{
          this.toBind()
        }
      },
      toBind(){
        const data = {
          userId: this.userData.userId,
          account: this.account,
          type: this.type,
          name: this.name
        }
        if(this.type != 3){
          Object.assign(data,{
            qrCodeUrl: this.qrCodeUrl
          })
        }else{
          Object.assign(data,{
            bank: this.bank,
          })
        }
        bindBankV2(data).then(res => {
          console.log('bind Card res',res)
          if(res.code === 10000){
            toast('绑定成功')
            if(this.type === 3){
              if(this.isPc){
                this.$emit('showCardList')
              }else{
                this.$router.replace({name:'mCardList'})
              }
            }else{
              this.hasBindInfo.push(res.data)
              if(!_.isEmpty(this.hasBindInfo) && !_.isNull(this.hasBindInfo)){
                this.hasBind = true
              }
              this.$store.dispatch("GET_BANKCARD");
            }
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      getBankName(isToBind){
        if(this.account != ''){
          const data = {
            bankNo:this.account
          }
          autoRecognize(data).then(res => {
            console.log(res)
            if(res.code === 10000){
              if(res.data && !_.isEmpty(res.data)){
                this.bank = res.data.bankName
                if(isToBind){
                  this.toBind()
                }
              }else{
                toast('您输入的银行卡号不能识别，请重新输入')
                this.bank = ''
              }
            }else{
              toast(res.message)
              this.bank = ''
            }
          }).catch(err => {
            toast(err)
          })
        }else{
          toast('请输入银行卡号')
        }
      },
      getBindInfo(){
        this.name = this.userData.name
        this.type = Number(this.$route.params.id) || this.tabType
        this.typeName = this.type === 1 ? '支付宝' : (this.type === 2 ? '微信' : '银行卡')
        if(this.type != 3){
          getBankList({userId: this.userData.userId}).then(res => {
            if(res.code === 10000){
              this.hasBindInfo = res.data.filter((item) => {
                return item.type === this.type
              })
              if(!_.isEmpty(this.hasBindInfo) && !_.isUndefined(this.hasBindInfo)){
                this.hasBind = true
              }
            }else{
              toast(res.message)
            }
          }).catch(err => {
            toast(err)
          }).finally(() => {
            this.showRes = true
          })
        }else{
          this.showRes = true
        }
      }
    },
    created(){
      this.getBindInfo()
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .title-tip{
    height: r(40);
    line-height: r(40);
    @include f(16px);
    color: #8f8f8f;
    border-bottom: 1px solid #dfdfdf;
    padding-left: r(10);
  }
  .card-main{
    background: #FFFFFF;
    .card-item{
      width: 100%;
      @include f(18px);
      border-bottom: 1px solid #dfdfdf;
      height: r(50);
      line-height: r(50);
      .card-input{
        padding-left: r(15);
        @include f(18px);
        border: none;
        height: r(48);
        line-height: r(50);
        vertical-align: top;
        &.qr-input{
          width: 50%;
        }
      }
      .qr-title{
        width: 45%;
        display: inline-block;
        text-align: right;
      }
      &.p-LR-sm{
        padding: 0 r(10);
      }
    }
    .has-name{
      padding-left: r(15);
    }
    .bind-def-btn{
      margin-top: r(20);
    }
    .add-qrcode{
      padding: r(20);
      text-align: center;
      border-bottom: 1px solid #dfdfdf;
      .add-icon{
        width: 50%;
        height: 50%;
        background: url('~images/add-qrcode.png') no-repeat;
      }
    }
  }

</style>
