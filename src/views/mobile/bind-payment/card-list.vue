<template>
  <div>
    <mobile-header v-if="!isPc">绑定银行卡</mobile-header>
    <div class="p-def">
      <div class="card-item" v-for="(item,i) in cardList" :key="i">
        <div class="card-info">
          <div class="title">银行卡号</div>
          <div class="info">{{item.account}}</div>
        </div>
        <div class="card-info">
          <div class="title">开户行</div>
          <div class="info">{{item.bank}}</div>
        </div>
        <div class="card-info">
          <div class="title">持卡人姓名</div>
          <div class="info">{{item.name}}</div>
        </div>
        <div class="card-info">
          <div class="unbind" @click="unbindBankConfrim(item.account)">解除绑定</div>
        </div>
      </div>
      <div class="m-top-md" v-if="!isPc">
        <router-link :to="{name: 'mBindCard',params: {id: 3}}" class="bind-def-btn" v-if="cardList.length < 3">添加新的银行卡
        </router-link>
        <div v-else class="bind-def-btn disabled">添加新的银行卡</div>
      </div>
      <div class="m-top-md" v-else>
        <div class="bind-def-btn" :class="{disabled: cardList.length >= 3}" @click="cardList.length >= 3 ? '' : pcAddCard()">添加新的银行卡</div>
      </div>
    </div>
    <confirm-dialog v-model="showConfirm" :is-pc="isPc">
      <div slot="content">
        <div class="dialog-content">{{confrimCfg.content}}</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel dialog-cancel">{{confrimCfg.leftBtn}}</div>
      <div slot="rightBtn" class="dialog-btn-yes" @click="confrimCfg.type === 1 ? unbind() : toSetUserInfo()">{{confrimCfg.rightBtn}}</div>
    </confirm-dialog>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import {mapGetters} from 'vuex'
  import ConfirmDialog from 'components/confirm'
  import {
    getBankList,
    unbindBank
  } from 'api/user-center'

  export default {
    name: "card-list",
    data() {
      return {
        cardList: [],
        showConfirm: false,
        account: '',
        confrimCfg:{
          content:'您是否确定解绑该银行卡？',
          leftBtn:'暂不解绑',
          rightBtn:'确定解绑',
          type: 1
        }
      }
    },
    components: {
      MobileHeader,
      ConfirmDialog
    },
    props:{
      isPc:{
        type:Boolean,
        default:false
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'userData'
      ])
    },
    methods: {
      unbindBankConfrim(account) {
        if (account) {
          Object.assign(this.confrimCfg,{
            content:'您是否确定解绑该银行卡？',
            leftBtn:'暂不解绑',
            rightBtn:'确定解绑',
            type: 1
          })
          this.account = account
          this.showConfirm = true
        }
      },
      getBankListInfo() {
        getBankList({userId: this.userId}).then(res => {
          if (res.code === 10000) {
            console.log('card list:',res)
            this.cardList = res.data.filter((item) => {
              return item.type === 3
            });
            this.$store.commit('GET_BANKCARD',res.data);
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      unbind() {
        const data = {
          userId: this.userId,
          account: this.account
        }
        unbindBank(data).then(res => {
          if (res.code === 10000) {
            toast('解除绑定成功')
            this.showConfirm = false
            this.getBankListInfo()
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      toSetUserInfo(){
        this.showConfirm = false
        if(this.isPc){
          this.$emit('setUserInfo')
        }else{
          this.$router.push({name:'mSetUserInfo'})
        }
      },
      checkUserName(){
        if(_.isNull(this.userData.name)){
          Object.assign(this.confrimCfg,{
            content:'请前往设置您的真实姓名',
            leftBtn:'取消',
            rightBtn:'确定',
            type: 2
          })
          this.showConfirm = true
          return false
        }
        return true
      },
      pcAddCard(){
        if(this.checkUserName()){
          this.$emit('addNewCard')
        }
      }
    },
    mounted() {
      this.getBankListInfo()
    },
    beforeRouteLeave (to, from , next) {
      if(to.name === 'mBindCard'){
        if(!this.checkUserName()){

        }else{
          next()
        }
      }else{
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";

  .card-item {
    width: 100%;
    background: $white;
    border-radius: r(5);
    margin-bottom: r(20);
    box-shadow: 0px 0px 5px rgba(0,0,0,.2);
    .card-info {
      display: flex;
      justify-content: space-between;
      padding: 0 r(15);
      height: r(50);
      line-height: r(50);
      border-bottom: 1px solid #dfdfdf;
      @include f(18px);
      &:last-child {
        border-bottom: none;
      }
    }
    .unbind {
      width: 100%;
      text-align: center;
      color: #ff0000;
      cursor: pointer;
    }
  }

  .m-top-md {
    margin-top: r(30);
  }
</style>
