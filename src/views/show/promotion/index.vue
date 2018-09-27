<template>
  <div class="prom-advantage">
     <display-nav :isOfficialWeb="isOfficialWeb"></display-nav>
     <div class="advantage-banner-part">
       <div class="container max-width">
         <div class="row">
           <h3 class="title">久安钱包是场外交易 用户分担现金流</h3>
           <h2 class="subTitle">从而规避资金冻结风险</h2>

           <div class="appdown-part cfx">
             <div class="col-21">
               <div class="qrcode-part">
                 <qrcode :text="SETTING.appUrl" v-if="SETTING.appUrl" :logoSrc="Logo" :logoScale="0.2" :size="136"></qrcode>
               </div>
             </div>
             <div class="col-21 context">
                <p>扫描二维码下载APP<br>支持 IOS 和 Android</p>
                <span class="logo">
                   <i class="iconfont icon-ios-logo"></i>
                   <i class="iconfont icon-android-icon"></i>
                </span>
             </div>
           </div>

           <div class="product-display">
             <img src="~images/prom/product-effect.png" class="width-100" >
           </div>

         </div>
       </div>
     </div>

     <div class="advantage-payment-part">
       <div class="container max-width">
         <div class="row cfx">
           <div class="col-20 pay-item" v-for="(item,i) in paymentType" :key="i" >
             <span class="pay-logo">
               <i :class="['iconfont',item.payLogo]"></i>
             </span>
             <h2>{{item.payTitle}}</h2>
             <h3>{{item.paySubTitle}}</h3>
           </div>

         </div>
       </div>
     </div>

     <div class="advantage-content-part">
       <div class="container max-width">
         <div class="row">
            <div class="advcont-nav cfx" v-show="!isOfficialWeb">
               <div class="col-21" v-for="(item,i) in advantageNav" :key="i">
                  <a href="javascript:void(0);" @click="advantageType=item.value" :class="[{active:advantageType==item.value},item.value]">
                     <span class="cont-logo">
                        <i :class="['iconfont',item.navLogo]"></i>
                     </span>
                     <p>{{item.name}}</p>
                     <span class="down-jiantou" v-show="advantageType==item.value">
                        <i class="iconfont icon-jiantou"></i>
                     </span>
                  </a>
               </div>
            </div>

            <div class="advcont-context merchantAdvCont cfx" v-show="advantageType=='merchantAdv'">
              <div class="col-22 advcont-item" v-for="(item,i) in merchantAdvCont" :key="i">
                 <span class="advcont-logo">
                   <i :class="['iconfont',item.contLogo]"></i>
                 </span>
                 <h2>{{item.contTitle}}</h2>
                 <h3>{{item.contSubTitle}}</h3>
              </div>
            </div>

            <div class="advcont-context userAdvCont cfx" v-show="advantageType=='userAdv'">
              <div class="col-22 advcont-item" v-for="(item,i) in userAdvCont" :key="i">
                 <span class="advcont-logo">
                    <i :class="['iconfont',item.contLogo]"></i>
                 </span>
                 <h2>{{item.contTitle}}</h2>
                 <h3>{{item.contSubTitle}}</h3>
              </div>
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
  import {SETTING} from "@/assets/data";
  import VueQrcode from 'vue-qr';
  import Logo from '@/assets/images/logo-blue.png';

  export default {
    data() {
      return {
        SETTING,
        Logo,
        paymentType:[
          {payLogo:"icon-prom-pcpay",payTitle:"电脑网站支付",paySubTitle:"用户在商家网站上完成付款"},
          {payLogo:"icon-prom-mobilepay",payTitle:"手机网站支付",paySubTitle:"用户在商家手机网站进行付款"},
          {payLogo:"icon-prom-apppay",payTitle:"APP支付",paySubTitle:"用户在商家app内进行付款"},
          {payLogo:"icon-prom-facepay",payTitle:"当面付",paySubTitle:"扫描用户的付款码或商家的二维码付款"},
          {payLogo:"icon-prom-moneycode",payTitle:"收钱码",paySubTitle:"久安最新收钱工具，快速收钱、提钱"}
        ],
        advantageNav:[
          {navLogo:"icon-prom-businadv",name:"久安钱包对商户优势", value:"merchantAdv"},
          {navLogo:"icon-prom-useradv",name:"久安钱包对用户优势", value:"userAdv"}
        ],
        advantageType:"merchantAdv",
        merchantAdvCont:[
          {
            contLogo:"icon-prom-secure",
            contTitle:"安全 Secure",
            contSubTitle:"数万用户为您分担金流风险，玩家对玩家交易，一百万个用户相当于给您一百万张银行卡充值提现！"
          },
          {
            contLogo:"icon-prom-powerful",
            contTitle:"强大 Powerful",
            contSubTitle:"商户无限额充值提现，久安钱包能够自动撮合买币卖币，实现快速而强大的资金消化能力！"
          },
          {
            contLogo:"icon-prom-block",
            contTitle:"区块链 Block Chain",
            contSubTitle:"去中心化区块链记账，钱包账目无法篡改造假，再也不用担心支付厂商做假账了"
          },
          {
            contLogo:"icon-prom-private",
            contTitle:"私密 Private",
            contSubTitle:"久安不记录用户隐私信息，只记录区块地址，再也不用担心VIP用户的信息泄露了"
          },
          {
            contLogo:"icon-prom-fast",
            contTitle:"高效 Fast",
            contSubTitle:"秒存秒提，零银行卡现金转账，无须等待;  快速撮合买币卖币"
          },
          {
            contLogo:"icon-prom-stronger",
            contTitle:"更强 Stronger",
            contSubTitle:"加入我们，提款到久安钱包，共享久安C2C交易,  从而增强久安用户对用户的现金消化能力 , 实现金流渠道的互利共赢"
          }
        ],
        userAdvCont:[
          {
            contLogo:"icon-prom-secure",
            contTitle:"安全 Secure",
            contSubTitle:"久安钱包是场外交易，用户分担现金流，从而规避资金冻结风险"
          },
          {
            contLogo:"icon-prom-powerful",
            contTitle:"强大 Powerful",
            contSubTitle:"久安钱包充提无限额，能够自动撮合买币卖币，天高任鸟飞"
          },
          {
            contLogo:"icon-prom-block",
            contTitle:"区块链 Block Chain",
            contSubTitle:"久安钱包是分布式区块链记账，安全可追溯"
          },
          {
            contLogo:"icon-prom-private",
            contTitle:"私密 Private",
            contSubTitle:"久安钱包不记录私密信息，私有资产不怕怕"
          },
          {
            contLogo:"icon-promus-convenient",
            contTitle:"便捷 Convenient",
            contSubTitle:"久安钱包快速自动撮合买币卖币，海阔凭鱼跃"
          },
          {
            contLogo:"icon-prom-fast",
            contTitle:"高效 Fast",
            contSubTitle:"秒存秒提，无须等待，快速撮合买币卖币，驶上高速路"
          },
          {
            contLogo:"icon-promus-free",
            contTitle:"免费 Free",
            contSubTitle:"久安钱包买币卖币免费无佣金，撮合交易赠币爽歪歪"
          },
          {
            contLogo:"icon-promus-noninvas",
            contTitle:"无侵入性 Non-invasive",
            contSubTitle:"久安钱包无缝接入，且商户不侵入用户买币卖币交易过程"
          },
          {
            contLogo:"icon-prom-stronger",
            contTitle:"更强 Stronger",
            contSubTitle:"我们海纳百川、博采众议，一起构筑更强的久安钱包"
          }
        ]
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
        this.advantageType = 'userAdv';
      }
    },
    components: {
      qrcode: VueQrcode,
      displayNav,
      vFooter
    }
  };
</script>
<style lang="scss">
 .advantage-banner-part{
   min-height: 420px;
   background: url(~images/prom/advantage-banner.jpg) no-repeat center center;
   background-size: cover;
   .title{
     display: none;
   }
   .subTitle{
     display: none;
   }
   .qrcode-part{
     width: 114px;
     height: 114px;
     padding: 6px;
     background: #FFFFFF;
     overflow: hidden;
     margin-top: 210px;
     float: left;
     border-radius: 5px;
   }
   .context{
     display: none;
   }
   .product-display{
     display: none;
   }
 }
 .advantage-payment-part{
   padding: 59px 0 50px;
   .pay-item{
     padding: 39px 12px 10px;
     border: 1px solid #E7E7E7;
     border-radius: 10px;
     text-align: center;
     min-height: 252px;
     margin: 0 1.25% 10px;
     &:hover{
       -webkit-transition: all 200ms ease-in;
       -webkit-transform: scale(1.1);
       -ms-transition: all 200ms ease-in;
       -ms-transform: scale(1.1);
       -moz-transition: all 200ms ease-in;
       -moz-transform: scale(1.1);
       transition: all 200ms ease-in;
       transform: scale(1.1);
       box-shadow: 0 2px 6px 0 rgba(0,0,0,0.19);
     }
     .pay-logo{
       display: block;
       line-height: 100px;
       .iconfont{
         font-size: 100px;
         color: #3573FA;
       }
     }
     h2{
       font-size: 18px;
       color: #3D3D3D;
       line-height: 30px;
       margin: 17px 0 5px 0;
       font-weight: normal;
     }
     h3{
       font-size: 12px;
       color: #9A9A9A;
       line-height: 20px;
       font-weight: normal;
     }
   }
 }
 .advantage-content-part{
   background: #F5F5F5;
   padding: 61px 0 30px;
   .advcont-nav{
     margin-bottom: 60px;
     padding: 0 11%;
     [class^="col"]{
       margin: 0;
     }
     a{
       position: relative;
       width: 318px;
       height: 148px;
       display: block;
       text-align: center;
       background: #F9F9F9;
       border: 1px solid #DADADA;
       border-radius: 10px;
       margin: 0 auto;
       &.merchantAdv.active,&.merchantAdv:hover{
         background: #3573FA;
         border: 1px solid #3573FA;
       }
       &.userAdv.active,&.userAdv:hover{
         background: #2AADE0;
         border: 1px solid #2AADE0;
       }
       &.active .cont-logo .iconfont,&:hover .cont-logo .iconfont{
         color: #FFFFFF;
       }
       &.active p,&:hover p{
         color: #FFFFFF;
       }
       &.merchantAdv.active .down-jiantou .iconfont{
         color: #3573FA;
       }
       &.userAdv.active .down-jiantou .iconfont{
         color: #2AADE0;
       }
       .cont-logo{
          display: block;
          margin-top: 35px;
         .iconfont{
           font-size: 40px;
           color: #333333;
         }
       }
       p{
         font-size: 20px;
         color: #333333;
         line-height: 30px;
         margin-top: 10px;
       }
       .down-jiantou{
         position: absolute;
         bottom: -30px;
         margin-left: -20px;
         line-height: 40px;
         display: block;
         left: 50%;
         .iconfont{
           font-size:40px;
         }
       }

     }
   }
   .advcont-context{
     .advcont-item{
       margin: 0 1.3% 30px;
       padding: 59px 20px 5px;
       border: 1px solid #DADADA;
       border-radius: 10px;
       text-align: center;
       min-height: 368px;
       background: #FFFFFF;
       &:hover{
         -webkit-transition: all 200ms ease-in;
         -webkit-transform: scale(1.1);
         -ms-transition: all 200ms ease-in;
         -ms-transform: scale(1.1);
         -moz-transition: all 200ms ease-in;
         -moz-transform: scale(1.1);
         transition: all 200ms ease-in;
         transform: scale(1.1);
         box-shadow: 0 2px 15px 0 rgba(0,0,0,0.22);
       }
       .advcont-logo{
         display: block;
         line-height: 100px;
         .iconfont{
           font-size: 100px;
           color: #3573FA;
         }
       }
       h2{
         font-size: 18px;
         color: #3D3D3D;
         line-height: 30px;
         margin: 32px 0 14px 0;
         font-weight: normal;
       }
       h3{
         font-size: 14px;
         color: #9A9A9A;
         line-height: 24px;
         font-weight: normal;
       }
     }
   }
   div.userAdvCont .advcont-item .advcont-logo .iconfont{
     color: #2AADE0;
   }

 }

 @media only screen and (max-width: 1199px) and (min-width: 1000px) {
   .advantage-banner-part{
     min-height: 340px;
     .qrcode-part{
       margin-top: 150px;
     }
   }
 }

 @media only screen and (max-width: 999px) and (min-width: 800px) {
   .advantage-banner-part{
     min-height: 270px;
     .qrcode-part{
       margin-top: 130px;
     }
   }
   .advantage-content-part .merchantAdvCont .advcont-item{
     min-height: 388px;
   }

 }

 @media only screen and (max-width: 799px) {
   .advantage-banner-part{
     background: #4982FF;
     padding: 67px 0 27px;
     .title{
       display: block;
       font-size: 18px;
       color: #FFFFFF;
       line-height: 32px;
       text-align: center;
       font-weight: normal;
     }
     .subTitle{
       display: block;
       font-size: 20px;
       color: #FFFFFF;
       line-height: 30px;
       text-align: center;
     }
     .appdown-part{
       margin: 10px 0 16px;
     }
     .qrcode-part{
       float: none;
       margin: 0 auto;
       width: 86px;
       height: 86px;
       img{
         width: 98px;
       }
     }
     .context{
       display: block;
       p{
         font-size: 14px;
         color: #FFFFFF;
         line-height: 24px;
         margin-top: 6px;
       }
       .logo{
         display: block;
         .iconfont{
           font-size: 20px;
           color: #FFFFFF;
           &:last-child{
             margin-left: 13px;
           }
         }
       }
     }
     .product-display{
       display: block;
     }
   }
   .advantage-payment-part{
     padding: 10px 0;
     .pay-item{
       padding: 19px 5px 2px;
       min-height: 170px;
       .pay-logo{
         line-height: 60px;
         .iconfont{
           font-size: 60px;
         }
       }
       h2{
         font-size: 16px;
         line-height: 26px;
         margin: 14px 0 0;
       }
       h3{
         font-size: 12px;
       }
     }
   }
   .advantage-content-part{
      padding: 20px 0 25px;
      .advcont-nav{
        padding: 0;
        margin-bottom: 26px;
        a{
          width: 148px;
          height: 78px;
          .cont-logo{
            margin-top: 15px;
            .iconfont{
              font-size: 25px;
            }
          }
          p{
            font-size: 12px;
            line-height: 14px;
            margin-top: 8px;
          }
          .down-jiantou{
            bottom: -13px;
            margin-left: -8px;
            line-height: 16px;
            .iconfont{
              font-size: 16px;
            }
          }
        }
      }
     .advcont-context{
        &.userAdvCont{
          .advcont-item{
            min-height: 236px;
          }
        }
         .advcont-item{
           margin: 0 1.3% 10px;
           padding: 21px 10px 10px;
           min-height: 260px;
           .advcont-logo{
             line-height: 60px;
             .iconfont{
               font-size: 60px;
             }
           }
           h2{
             font-size: 16px;
             line-height: 26px;
             margin: 12px 0 0px;
           }
           h3{
             font-size: 12px;
             line-height: 18px;
           }
         }
     }
   }

 }

</style>
