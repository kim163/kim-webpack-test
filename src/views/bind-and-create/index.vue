<template>
  <div>
    <v-header></v-header>
    <div class="container">
      <div class="top">
        <div class="title">{{type === 1 ? '绑定商户' : '快速创建久安账号'}}</div>
        <router-link :to="{name: 'pcBindList'}" v-if="islogin && type === 1" class="bind-list">我的商户列表</router-link>
      </div>
      <div class="bottom">
        <div class="content">
          <bind-bussiness v-if="type === 1" :is-pc="true"></bind-bussiness>
          <quick-create v-else :is-pc="true"></quick-create>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import BindBussiness from '../mobile/business-bind'
  import QuickCreate from '../mobile/quick-create'
  import VFooter from 'components/footer'
  import VHeader from 'components/header-bind-create'
  import {mapGetters} from 'vuex'
  export default {
    name: "bind-and-create",
    data(){
      return{

      }
    },
    props:{
      type:{ // 页面类型  1为商户绑定 2为快速创建
        type:Number,
        default:1
      }
    },
    computed:{
      ...mapGetters([
        "islogin"
      ])
    },
    components:{
      BindBussiness,
      QuickCreate,
      VFooter,
      VHeader
    },
    methods:{

    },
    created(){
      if(_.isMobile()){
        const data = {
          merchantId: this.$route.query.merchantId, //商户id
          notifyUrl: this.$route.query.notifyUrl, //商户h5登陆回调地址
          merchantUserName: this.$route.query.merchantUserName, //商户登陆账户名
          callBackUrl: this.$route.query.callBackUrl//商户地址
        }
        const urlName = this.type ===1 ? 'mUserBind' : 'mQuickCreate'
        this.$router.replace({name: urlName,query: data})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    width: 80%;
    height: 883px;
    border: solid 1px #d4d4d4;
    margin: 150px auto 50px;
    .top{
      width: 100%;
      height: 62px;
      background-color: #f7f7f7;
      display: flex;
      justify-content: space-between;
      .title{
        width: 200px;
        height: 100%;
        line-height: 62px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
        background-color: #5087ff;
      }
    }
    .bottom{
      display: flex;
      width: 100%;
      height: 821px;
      justify-content: center;
      align-items: center;
    }
    .content{
      min-width: 500px;
      width: 50%;
      padding: 5%;
      background-color: #ffffff;
      box-shadow: 0 0 10px rgba(0,0,0,.2);
    }
  }
  .bind-list{
    height: 100%;
    line-height: 62px;
    font-size: 20px;
    margin-right: 40px;
    color: #333333;
  }
  @media only screen and (max-width: 999px) {
    .container{
      width: 96%;
    }
  }
</style>