<template>
  <div class="prom-helpcent">
     <display-nav :isOfficialWeb="isOfficialWeb"></display-nav>
     <div class="helpcent-banner-part">
       <div class="container max-width context">
         <div class="row">
             <h2>如有疑问 我们帮您解答</h2>
             <h3>请点击每个问题获取答案。<br>如果你的问题不在这里，请不要犹豫与我们联系。</h3>
         </div>
       </div>
     </div>

     <div class="helpcent-content-part">
       <div class="container max-width">
         <div class="row" :class="{isOfficialWeb:isOfficialWeb}">
           <div class="helpcent-nav">
             <a href="javascript:void(0);" v-for="(item,i) in helpcentNav" :key="i" @click="helpcentType=item.value" :class="{active:helpcentType==item.value}">
               {{item.name}}
             </a>
           </div>

           <div class="context product-access" v-show="helpcentType=='howAccess'">
             <h2>如何接入</h2>
             <p>久安钱包提供PC，H5，手机APP接入，全平台覆盖，商户只需要提供一个登录令牌的接口，久安使用该登录令牌做快速登录，从而隔离玩家的隐私信息，
               建立商户与久安之间的信任关系，如果商户不知道如何开发登录令牌的接口，久安技术团队会全程支持；</p>
             <h2>接入流程</h2>
             <img src="~images/prom/access-process.png" class="width-100">
             <h2>产品费率</h2>
             <p>为建立久安品牌，目前不收费率，我们欢迎需要解决金流问题的伙伴与我们共谋大事</p>
             <h2>合作领域</h2>
             <p>久安钱包与多家国际公司建立合作关系，合作领域包括电商平台，实体餐饮，线上游戏，在线支付，实体赌场等，久安钱包是一个支付工具，
               它是可以无缝接入任何领域的，它是基于去中心化的区块链开发的，所以它的运用场景是非常广泛的，我们非常欢迎各个领域的公司与我们合作，共建区块货币生态圈；
             </p>
           </div>

           <div class="context common-problem" v-show="helpcentType=='commonProblem'">
             <h2>1.如何注册</h2>
             <p>在久安钱包官网登录页面，点击“注册账户”进入注册页面，填写信息即可注册账户；在久安商户定制包，不可以在官网注册的，需要在商户的网站上从快速入口进入；</p>
             <h2>2.如何登录</h2>
             <p>在久安钱包官网登录页面，选择账户登录，手机登录或者邮箱登录，输入账号密码便可登录；在久安商户定制包，需要从商户官网上面快速入口进入，或者扫码登录；</p>
             <h2>3.如何购买UET</h2>
             <p>UET可以通过两种方式购买：一.在久安钱包官网 交易大厅页面，选择与其他用户的挂单配单，线下转账给对方账户，对方收到款项之后再释放UET到您的UET账户；
               二.在 快速交易页面，发布买币需求，久安再将需求与卖家匹配，匹配后进入C2C交易，同样线下转账给对方账户之后，对方收到款项之后再释放UET到您的UET账户。</p>
             <h2>4.如何出售UET</h2>
             <p>UET出售，即为提现的过程，方式有两种：一.在久安钱包官网 交易大厅页面，选择与其他用户的挂单配单，对方会线下转账给您，您收到款项之后再释放UET到对方的UET账户；
               二.在 快速交易页面，发布卖币需求，久安再将需求与买家匹配，匹配后进入C2C交易，同样对方线下转账给您的账户之后，您收到款项之后再释放UET到对方的UET账户。</p>
             <h2>5.如何发布买币/卖币挂单</h2>
             <p>在久安钱包官网主页，有一个“ 快速买卖 ”按钮，点击之后可以选择发布买币，和卖币订单，在页面内完善交易金额、账户信息和支付方式信息，
               发布之后久安会优先进行匹配，匹配成功即可进入C2C交易，另外也会在C2C交易大厅里展示给所有久安钱包用户，任何一个用户都可以通过C2C大厅与您展开交易。</p>
             <h2>6.如何查询平台充值/平台提现记录</h2>
             <p>进行中的平台充值和平台提现记录会显示在 交易记录-交易中 页面里，已完成的充值提现记录会显示在 交易记录-交易完成 模块里。</p>
             <h2>7.如何查询我的快速交易状态</h2>
             <p>您发布的快速交易可以在 我的挂单 里面查询，已上架的挂单可以下架，正在交易中的挂单可以点击查看详细状态和进度。</p>
             <h2>8.如何查看我的收款码</h2>
             <p>久安钱包内不同账户有不同的收款地址和收款码，可以在收款码页面查看，收款码页面可以从 我的 页面右上角的 二维码 图标，点击进入查看。</p>
             <h2>*9.如何在合作商家扫码支付</h2>
             <p>合作商家网站上，选择久安支付，设置金额后生成支付的二维码，通过在久安钱包APP 我的 页面的二维码扫描图标，点击进入扫描支付二维码，
               便会跳转到支付页面，并生成对应商家的账户，在输入支付密码校验成功之后完成快速支付，支付之后的记录是在 资产明细-区块链账单里面查询。</p>
             <h2>*10.如何绑定完善信息</h2>
             <p>完善信息在 我的-安全中心 模块里面完成，可以进行绑定手机，绑定邮箱，设置支付密码，完善昵称和真实姓名 等操作。</p>
             <h2>*11.如何绑定银行卡，支付宝或者微信</h2>
             <p>从个人中心页面，点击绑定收款银行卡，绑定支付宝和绑定微信，分别进入不同的绑定页面，补充完整信息之后便可绑定成功。</p>
             <h2>12.如何申诉</h2>
             <p>交易关闭后的订单/正常交易时间内的订单，不能进行申诉；超出正常交易时间后未解决的订单，可以发起申诉；
               进行中的订单里，点击进去查看详情，满足申诉订单条件的会有申诉按钮，申诉之后会有人工客服联系您进行核对。</p>
           </div>

         </div>
       </div>
     </div>

     <v-footer :isDisplayFoot="true" :isOfficialWeb="isOfficialWeb" ></v-footer>
  </div>
</template>
<script>
  import displayNav from 'components/nav/display-nav';
  import vFooter from 'components/footer';

  export default {
    data() {
      return {
        helpcentNav:[
          {
            name: "如何接入",
            value: "howAccess"
          },
          {
            name: "常见问题",
            value: "commonProblem"
          }
        ],
        helpcentType:"howAccess"
      };
    },
    props: {
      isOfficialWeb:{
        type:Boolean,
        default:false
      }
    },
    methods: {},
    computed: {},
    created() {
      if(this.isOfficialWeb){
        this.helpcentType = 'commonProblem';
      }
    },
    components: {
      displayNav, vFooter
    }
  };
</script>
<style lang="scss">
 .helpcent-banner-part{
   min-height: 420px;
   background: url(~images/prom/help-banner.jpg) no-repeat center center;
   background-size: cover;
   .context{
     display: none;
   }
 }

 .helpcent-content-part{
   background: #F5F5F5;
   padding: 30px 0;
   .row{
     background: #FFFFFF;
   }
   .isOfficialWeb {
     .helpcent-nav{
       display: none;
     }
     .context{
       width: 100%;
       float: none;
       border-left: none;
     }
   }
   .helpcent-nav{
      width: 15%;
      float: left;
     padding-top: 38px;
     a{
       display: block;
       line-height: 40px;
       font-size: 16px;
       color: #333333;
       border-right: 2px solid transparent;
       text-align: center;
       margin-bottom: 12px;
       &.active,&:hover{
         color: #3573FA;
         border-right: 2px solid #3573FA;
       }
     }
   }
   .context{
     width: 85%;
     float: right;
     border-left: 1px solid #E6E6E6;
     min-height: 930px;
     padding: 27px 41px;
     h2{
       font-size: 24px;
       color: #333333;
       line-height: 50px;
       font-weight: normal;
     }
     p{
       font-size: 14px;
       color: #A9A9B1;
       line-height: 24px;
       margin-bottom: 25px;
     }
     .width-100{
       margin: 30px 0 50px;
       max-width: 31%;
     }
   }
 }

 @media only screen and (max-width: 1199px) and (min-width: 1000px) {
   .helpcent-banner-part{
     min-height: 340px;
   }
 }

 @media only screen and (max-width: 999px) and (min-width: 800px) {
   .helpcent-banner-part{
     min-height: 270px;
   }
 }

 @media only screen and (max-width: 799px) {
   .helpcent-banner-part{
     min-height: 244px;
     background: #4982FF url(~images/prom/base-map.jpg) no-repeat center bottom;
     background-size: cover;
     .context{
       display: block;
       padding-top: 68px;
       h2{
         font-size: 24px;
         color: #FFFFFF;
         line-height: 54px;
         font-weight: normal;
       }
       h3{
         font-size: 18px;
         color: #FFFFFF;
         line-height: 28px;
         font-weight: normal;
       }
     }
   }
   .helpcent-content-part{
      background: #FFFFFF;
      padding: 0 0 20px;
     .helpcent-nav{
       width: 100%;
       float: none;
       padding-top: 0;
       height: 58px;
       border-bottom: 2px solid #E7E7E7;
       a{
         width: 50%;
         float: left;
         line-height: 56px;
         font-size: 18px;
         color: #787876;
         border-right: none;
         margin-bottom:0;
         &:hover,&.active{
           color: #3573FA;
           border-right: none;
           border-bottom: 2px solid #3573FA;;
         }
       }
     }
     .context{
       width: 100%;
       float: none;
       border-left:none;
       padding:16px 0;
       h2{
         font-size: 20px;
       }
       .width-100{
         margin: 15px 0 28px;
         max-width: 86%;
       }
     }
   }

 }

</style>
