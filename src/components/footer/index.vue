<template>
  <!--底部内容-->
  <div :class="['footer section',{'display-footer':isDisplayFoot}]">
    <div class="container center f-white">
      <div class="row foot-part">
        <div class="col-7 left">
          <router-link :to="gotoIndex()" class="p-goup-title">
            <i class="iconfont icon-juan-logo1"></i>
          </router-link>
          <p class="p-goup-subtitle" v-html="$t('footer.description')"> </p>
        </div>
        <div class="col-5 right">
          <div class="icon-sm facebook p-gradually-block3">
            <a href="javascript:void(0);" > <i class="iconfont icon-facebook"></i> </a>
          </div>
          <div class="icon-sm telegram p-gradually-block4">
            <a href="tg://resolve?domain=jiuan365" > <i class="iconfont icon-telegram"></i> </a>
          </div>
          <div class="icon-sm wechat p-gradually-block5">
            <a href="javascript:void(0);" > <i class="iconfont icon-wechat"></i> </a>
          </div>
          <div class="icon-sm skype p-gradually-block6">
            <a href="skype:live:jiuan366?chat" > <i class="iconfont icon-skype"></i> </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {};
        },
        props:{
          isDisplayFoot:{
            type:Boolean,
            default:false
          },
          isOfficialWeb:{
            type:Boolean,
            default:false
          }
        },
        methods:{
          gotoIndex(){
            let routerName = '';
            if(this.isDisplayFoot){
              if(this.isOfficialWeb){
                routerName = 'index';
              }else {
                routerName = 'promIndex';
              }
            }else {
              routerName = 'transaction';
            }
            return {name: routerName};
          }
        },
        computed:{},
        created(){
        },
        components:{}
    };
</script>
<style lang="scss">
  div.footer{
    background: #363636;
    .foot-part {
      padding: 67px 1.8% 166px;
      a {
        display: block;
        float: left;
        text-decoration:none;
        .icon-juan-logo1{
          font-size: 80px;
          color: #FFFFFF;
        }
      }
      p {
        display: block;
        font-size: 18px;
        color: #b1b1b1;
        padding: 8px 0 0 22px;
        margin: 0;
        float: left;
        font-weight: 400;
        line-height: 1.8;
      }
    }
    .icon-sm {
      display:inline-block;
      position: relative;
      margin: 10px 0 0 32px;
    }
    .icon-sm:first-child{
      margin: 10px 0 0 0;
    }
    .icon-sm a:hover, .contact-logo:hover{
      z-index: 2;
      -webkit-transition: all 200ms ease-in;
      -webkit-transform: scale(1.25);
      -ms-transition: all 200ms ease-in;
      -ms-transform: scale(1.25);
      -moz-transition: all 200ms ease-in;
      -moz-transform: scale(1.25);
      transition: all 200ms ease-in;
      transform: scale(1.25);
    }
    .icon-sm a {
      font-size: 37px;
      color: transparent;
      float: none;
      -webkit-transition: all 200ms ease-in;
      -webkit-transform: scale(1);
      -ms-transition: all 200ms ease-in;
      -ms-transform: scale(1);
      -moz-transition: all 200ms ease-in;
      -moz-transform: scale(1);
      transition: all 200ms ease-in;
      transform: scale(1);
    }
    .icon-sm a:hover {
      text-decoration: none;
    }
    .icon-sm a i{
      color: #E8E8E8;
    }
    .icon-sm.wechat a{
      font-size: 35px;
    }

  }

  div.display-footer{
    .foot-part {
      padding: 75px 0 77px !important;
    }
  }

  @media only screen and (max-width: 799px) {
    div.footer .foot-part{
      a,p{
        float: none;
        text-align: center;
      }
      p{
        font-size: 16px;
        color: #FFFFFF;
        padding: 16px 0 0 0;
        letter-spacing: 0.5px;
      }
      .col-5{
        text-align: center;
      }
      .icon-sm{
        margin:0 0 0 20px;
        &:first-child{
          margin: 0;
        }
      }
    }
    div.display-footer{
      .foot-part {
        padding: 13px 0 25px !important;
      }
    }
  }
</style>
