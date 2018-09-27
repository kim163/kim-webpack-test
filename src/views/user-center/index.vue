<template>
  <div class="main header-padding">
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <div class="container min-width">
      <div class="tab-list">
        <div class="tab-item"
             :class="{active: type === item.type}"
             v-for="(item,index) in navList"
             :key="index"
             @click="changeTab(item.type)">
          {{$t(item.name)}}
        </div>
      </div>
      <div class="bottom">
        <div class="content">
          <card-list v-if="type === 3 && !showBind" :is-pc="true" @addNewCard="showBind = true" @setUserInfo="type = 4"></card-list>
          <set-user-info v-else-if="type === 4" :is-pc="true"></set-user-info>
          <bind-card v-else :is-pc="true" :tab-type="type" @showCardList="showBind = false"></bind-card>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
    <confirm-dialog v-model="showConfirm" :is-pc="true">
      <div slot="content">
        <div class="dialog-content">{{confrimCfg.content}}</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel dialog-cancel">{{confrimCfg.leftBtn}}</div>
      <div slot="rightBtn" class="dialog-btn-yes" @click="toSetUserInfo">{{confrimCfg.rightBtn}}</div>
    </confirm-dialog>
  </div>
</template>

<script>
  import NavMenu from 'components/nav';
  import VFooter from 'components/footer';
  import BreadCrumbs from 'components/bread-crumbs'
  import BindCard from '../mobile/bind-payment/card-bind'
  import CardList from '../mobile/bind-payment/card-list'
  import SetUserInfo from '../mobile/user-center/set-user-info'
  import ConfirmDialog from 'components/confirm'
  import {mapGetters} from 'vuex'
  export default {
    name: "user-center",
    data(){
      return{
        navList:[
          {
            name:'userCenter.bindCard',
            type:3,
          },
          // {
          //   name:'userCenter.bindAlipay',
          //   type:1,
          // },
          // {
          //   name:'userCenter.bindWeChat',
          //   type:2,
          // },
          {
            name:'userCenter.completeMaterial',
            type:4,
          }
        ],
        breadList: [
          {
            urlName: 'transaction',
            name: 'navbar.navHome'
          },
          {
            urlName: 'pcUserCenter',
            name: 'navbar.userCenter'
          },
        ],
        type:3,
        showBind:false,
        confrimCfg:{},
        showConfirm:false,
      }
    },
    watch:{
      type(){
        this.showBind = false
      }
    },
    components:{
      NavMenu,
      VFooter,
      BreadCrumbs,
      BindCard,
      CardList,
      SetUserInfo,
      ConfirmDialog
    },
    computed:{
      ...mapGetters([
        'userData'
      ])
    },
    methods:{
      changeTab(type){
        if(type === 1 || type === 2){
          if(_.isNull(this.userData.name)){
            Object.assign(this.confrimCfg,{
              content:'请前往设置您的真实姓名',
              leftBtn:'取消',
              rightBtn:'确定',
              type: 2
            })
            this.showConfirm = true
          }else{
            this.type = type
          }
        }else{
          this.type = type
        }
      },
      toSetUserInfo(){
        this.showConfirm = false
        this.type = 4
      }
    }
  }
</script>

<style lang="scss" scoped>
  .main{
    .container{
      width: 80%;
      /*height: 883px;*/
      border: solid 1px #d4d4d4;
      margin: 20px auto 50px;
      .tab-list{
        width: 100%;
        height: 62px;
        background-color: #f7f7f7;
        .tab-item{
          display: inline-block;
          width: 200px;
          height: 100%;
          line-height: 62px;
          text-align: center;
          font-size: 20px;
          color: #333333;
          border-right: 1px solid #d4d4d4;
          cursor: pointer;
          &.active{
            color: #ffffff;
            background-color: #5087ff;
          }
        }
      }
      .bottom{
        display: flex;
        width: 100%;
        /*height: 821px;*/
        padding: 100px 0;
        justify-content: center;
        align-items: center;
      }
      .content{
        width: 500px;
        /*width: 50%;*/
        /*padding: 0%;*/
        /*background-color: #ffffff;*/
        box-shadow: 0 0 10px rgba(0,0,0,.2);
      }
    }
  }
</style>
