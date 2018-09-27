<template>
  <div class="prom-contactus">
     <display-nav :isOfficialWeb="isOfficialWeb"></display-nav>
     <div class="contactus-banner-part">
       <div class="container max-width context">
         <div class="row">
           <h2>这里有久安持续进化的创作团队</h2>
           <h3>未来我们继续专注数字钱包的服务，在金融行业深耕， 结合最新的技术为企业提供更优良的服务。</h3>
         </div>
       </div>
     </div>

     <div class="contact-content-part">
       <div class="container max-width">
         <div class="row">
           <h1 class="contact-title">联系我们</h1>
           <p class="conttact-context">2017.09 久安钱包项目启动。   2018.01 经过团队两个月日日夜夜不断努力的研发设计，久安钱包测试上线。
             2018.03久安发行UET，开始流通，逐渐接入平台和项目，并作为主要代币进行流通使用</p>
           <div class="contact-info cfx">
             <a href="javascript:void(0);" v-for="(item,i) in contactInfor" :key="i" class="col-23 info-item">
                 <span class="logo">
                      <i :class="['iconfont',item.logo]"></i>
                 </span>
                 <h2>{{item.title}}</h2>
                 <h3>{{item.number}}</h3>
             </a>
           </div>

           <div class="maps-part">
             <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4743.534231638758!2d103.85304033241245!3d1.2811573591428191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc6a871082a5724b2!2sMBFC+Tower+1!5e0!3m2!1szh-CN!2sph!4v1533951963023"
                     width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>
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
        contactInfor:[
          {logo:"icon-prom-skype",title:"Skype",number:"9664668254"},
          {logo:"icon-prom-telegram",title:"Telegram",number:"9664668254"},
          {logo:"icon-prom-wechat",title:"微信",number:"jiuanqianbao"},
          {logo:"icon-prom-qq",title:"QQ",number:"3132684891"}
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
    },
    components: {
      displayNav, vFooter
    }
  };
</script>
<style lang="scss">
 .contactus-banner-part{
   min-height: 420px;
   background: url(~images/prom/contactus-banner.jpg) no-repeat center center;
   background-size: cover;
   .context{
     display: none;
   }
 }

 .contact-content-part{
   padding: 30px 0;
   background: #F5F5F5;
   .row{
     background: #FFFFFF;
     padding: 20px 40px 40px;
   }
   .contact-title{
     font-size: 36px;
     color: #212121;
     font-weight: normal;
     line-height: 72px;
   }
   .conttact-context{
     font-size: 14px;
     color: #6C6C6C;
     line-height: 26px;
     margin-top: 3px;
   }
   .contact-info{
     margin: 41px 0 31px;
     .info-item{
       display: block;
       text-align: center;
       margin: 0;
       &:hover {
         -webkit-transition: all 200ms ease-in;
         -webkit-transform: scale(1.1);
         -ms-transition: all 200ms ease-in;
         -ms-transform: scale(1.1);
         -moz-transition: all 200ms ease-in;
         -moz-transform: scale(1.1);
         transition: all 200ms ease-in;
         transform: scale(1.1);
       }
       .logo{
         display: block;
         line-height: 70px;
         .iconfont{
           font-size: 70px;
         }
         .icon-prom-skype{
           color: #30B8FF;
         }
         .icon-prom-telegram{
           color: #00B1E2;
         }
         .icon-prom-wechat{
           color: #50B674;
         }
         .icon-prom-qq{
           color: #68A5E1;
         }
       }
       h2,h3{
         font-size: 18px;
         color: #333333;
         font-weight: normal;
         line-height: 36px;
       }
       h2{
         margin-top: 9px;
       }
     }
   }
   .maps-part{
     height: 518px;
   }

 }

 @media only screen and (max-width: 1199px) and (min-width: 1000px) {
   .contactus-banner-part{
     min-height: 340px;
   }
 }

 @media only screen and (max-width: 999px) and (min-width: 800px) {
   .contactus-banner-part{
     min-height: 270px;
   }
 }

 @media only screen and (max-width: 799px) {
   .contactus-banner-part{
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

   .contact-content-part{
     background: #FFFFFF;
     padding: 0 0 20px;
     .row{
       padding: 0;
     }
     .contact-title{
       font-size: 24px;
       color: #212121;
       line-height: 40px;
       margin-top: 11px;
     }
     .contact-info{
       margin: 20px 0 0;
       .info-item{
         margin-bottom: 20px;
       }
     }
     .maps-part{
       height: 300px;
     }
   }

 }

</style>
