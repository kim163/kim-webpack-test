<template>
  <div class="coin-activity-promot">
    <display-nav :isOfficialWeb="isOfficialWeb"></display-nav>
    <div class="activity-mobile-header"></div>
    <div class="activity-banner">
       <img src="~images/activity/coin/coin-mobile-banner.jpg" alt="久安免费赠币" />
    </div>

    <div class="participate-act">
      <div class="container max-width">
        <div class="row">
           <h1 class="title thirty-eight-font">如何参加赠币活动</h1>
           <h4 class="sub-title twenty-four-font">“进入久安钱包<span class="red">快速买币</span>或<span class="red">快速卖币</span>都可以获得我们赠币活动哦！”</h4>
           <div class="buysell-coins cfx">
              <div class="col-24">
                 <div class="fast-sell">
                    <span class="sell-bg bg-part"></span>
                    <h2 class="tips-title thirty-font">快速卖币 100% 赠币</h2>
                    <img src="~images/activity/coin/sell-coins.png" alt="" class="width-100">
                 </div>
                 <router-link tag="div" class="participate-btn eighteen-font" v-if="islogin" :to="gotoSellCoins()">
                   立即卖币
                 </router-link>
              </div>
              <div class="col-24">
                 <div class="fast-buy">
                    <span class="buy-bg bg-part"></span>
                    <h2 class="tips-title thirty-font">快速买币 100% 赠币</h2>
                    <img src="~images/activity/coin/buy-coins.png" alt="" class="width-100">
                 </div>
                 <router-link tag="div" class="participate-btn right-act eighteen-font" v-if="islogin" :to="gotoBuyCoins()">
                   立即买币
                 </router-link>
              </div>
           </div>
        </div>
      </div>
    </div>

    <div class="leader-board building-bg sixteen-font">
        <div class="container max-width">
           <div class="row">
              <h1 class="title thirty-eight-font">实时排行榜</h1>
              <div class="ranking-header cfx">
                 <div class="ranking-title left-part col-27">
                   <span>上榜排名</span>
                   <span>上榜用户</span>
                   <span>获得赠币</span>
                 </div>
                 <div class="ranking-title right-part col-27 pc-show">
                   <span>上榜排名</span>
                   <span>上榜用户</span>
                   <span>获得赠币</span>
                 </div>
              </div>

              <div class="ranking-body cfx">
                <div class="randing-part left-part col-27">
                  <div class="ranking-item cfx" v-for="(item,i) in rankingList" v-if="i<5">
                     <span><a href="javascript:void(0);" class="num">{{item.rankingsIndex}}</a></span>
                     <span>{{item.nickname}}</span>
                     <span>{{item.awardTotal}}</span>
                  </div>
                </div>

                <div class="randing-part right-part col-27">
                  <div class="ranking-item cfx" v-for="(item,i) in rankingList" v-if="i>=5">
                    <span><a href="javascript:void(0);" class="num">{{item.rankingsIndex}}</a></span>
                    <span>{{item.nickname}}</span>
                    <span>{{item.awardTotal}}</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
    </div>

    <div class="intro-product">
      <div class="container max-width">
        <div class="row center">
            <h1 class="title thirty-eight-font">什么是久安钱包</h1>
            <h4 class="sub-title twenty-four-font">交易送币、告别存款延迟不到账、告别大额提款限额银行管控</h4>
            <div class="video-part">
              <div class="video-cover" v-show="showVideoCover" @click="playVideo" ></div>
              <video ref="juanVideo" controls = "true" preload="auto"  webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow" x5-video-player-type="h5"  x5-video-player-fullscreen="true" style="object-fit:fill">
                <source src="https://9an.staticsources.com/jiuan/video/jiuan.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
           </div>
        </div>
      </div>
    </div>

    <div class="product-advantage building-bg">
        <div class="container max-width">
          <div class="row cfx">
            <div class="col-25 adv-item" v-for="(item,i) in proAdvantages" :key="i" >
              <p :class="item.advLogo"></p>
              <h2 class="eighteen-font">{{item.advTitle}}</h2>
              <h3 class="fourteen-font">{{item.advSubTitle}}</h3>
            </div>
          </div>
        </div>
    </div>

    <div class="recharge-withdrawal">
      <div class="container max-width">
        <div class="row cfx">
          <div class="rechwithd-navbar cfx">
            <div class="col-21" v-for="(item,i) in rechwithdNav" :key="i">
              <a href="javascript:void(0);" @click="rechwithdType=item.value" :class="[{active:rechwithdType==item.value},'thirty-eight-font']">
                {{item.name}}
              </a>
            </div>
          </div>

          <div class="rechwithd-content cfx twenty-four-font" v-show="rechwithdType=='proRecharge'">
            <div class="col-24">
              <img src="~images/activity/coin/recharge-bg.png" alt="" class="width-100">
            </div>
            <div class="col-24">
               <h2 class="twenty-four-font">1、登录合作商户平台，进入充值页面。</h2>
               <h2 class="twenty-four-font">2、选择久安定制存款，输入充值金额，点击确认充值。</h2>
               <h3 class="twenty-four-font">备注：</h3>
               <p>可以使用我的<span>UET余额</span>快速充值，如果<span>UET余额不足</span>，请<span>点击快速买币</span>进入久安钱包买币之后再返回商户平台充值。</p>
            </div>
          </div>

          <div class="rechwithd-content cfx twenty-four-font" v-show="rechwithdType=='proWithdrawal'">
            <div class="col-24">
              <img src="~images/activity/coin/withdrawal-bg.png" alt="" class="width-100">
            </div>
            <div class="col-24">
               <h2 class="twenty-four-font">1、登录合作商户平台，进入提款页面。</h2>
               <h2 class="twenty-four-font">2、选择久安定制提款，输入提款金额，点击确认提款。</h2>
               <h3 class="twenty-four-font">备注：</h3>
               <p>久安定制提款，安全高效。</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="trading-coinpart">
      <div class="container max-width">
        <div class="row posit-rel">
          <h1 class="title thirty-eight-font">如何用钱包买卖UET币</h1>
          <div class="trading-nav cfx">
            <div class="col-21" v-for="(item,i) in tradingCoinNav" :key="i">
              <a href="javascript:void(0);" @click="tradingType=item.value" :class="[{active:tradingType==item.value},'twenty-four-font']">
                {{item.name}}
              </a>
            </div>
          </div>

          <div class="trading-content cfx" v-show="tradingType=='buyCoin'">
             <div class="col-26">
               <img src="~images/activity/coin/buy-sell.png" alt="" class="width-100">
               <p class="sixteen-font">通过商户平台打开登录久安钱包</p>
             </div>
             <div class="col-26">
               <img src="~images/activity/coin/buy-two.png" alt="" class="width-100">
               <p class="sixteen-font">填写购买数量，点击买币 (人民币兑UET币比例为1:100)</p>
             </div>
             <div class="col-26">
               <img src="~images/activity/coin/buy-three.png" alt="" class="width-100">
               <p class="sixteen-font">按照卖家要求的付款方式付款，然后点击“付款后，请点击这里”，等待UET到账即可</p>
             </div>
          </div>

          <div class="trading-content cfx" v-show="tradingType=='sellCoin'">
            <div class="col-26">
              <img src="~images/activity/coin/buy-sell.png" alt="" class="width-100">
              <p class="sixteen-font">通过商户平台打开登录久安钱包</p>
            </div>
            <div class="col-26">
              <img src="~images/activity/coin/sell-two.png" alt="" class="width-100">
              <p class="sixteen-font">填写卖出数量，点击卖币 (人民币兑UET币比例为1:100)</p>
            </div>
            <div class="col-26">
              <img src="~images/activity/coin/sell-three.png" alt="" class="width-100">
              <p class="sixteen-font">确认买家的付款已经到账，然后点击“释放UET”，完成交易</p>
            </div>
          </div>
          <div class="hide-scroll-bar posit-abso"></div>

        </div>
      </div>
    </div>

    <div class="simple-footer">
      <div class="container max-width">
        <div class="row center">
           <p class="sixteen-font"> 国内早期区块链从业者，专注数字资产钱包，智能合约方向 &nbsp;&nbsp; Copyright &copy; 2018 久安钱包 All</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import displayNav from 'components/nav/display-nav';
  import {awardRankings} from 'api/activity';
  import {mapGetters} from 'vuex';
  export default {
    data() {
      return {
        proAdvantages:[
          {
            advLogo:"adv-safety",
            advTitle:"安全",
            advSubTitle:"用户与用户之间的独立交易，无中心机构参与，完全避开了相关部门对博彩公司的资金流的监控，最有效的降低对个人银行账户的影响，大额交易无忧。"
          },
          {
            advLogo:"adv-simple",
            advTitle:"简单",
            advSubTitle:"合作商户充值页面选择久安定制钱包，使用久安钱包余额可快速充值；合作商户提款页面选择久安定制钱包，可快速提现至久安钱包。"
          },
          {
            advLogo:"adv-welfare",
            advTitle:"福利",
            advSubTitle:"现阶段使用久安钱包，在合作商户充值和提款，在钱包快速买卖交易，都将获得赠送。"
          },
          {
            advLogo:"adv-invest",
            advTitle:"投资",
            advSubTitle:"目前可以快速充值到钱包合作商户平台，假以时日可实现主流虚拟数字货币的交易，创造新一轮的财富神话。"
          }
        ],
        rechwithdType:"proRecharge",
        rechwithdNav:[
          {name:"如何充值到商户平台", value:"proRecharge"},
          {name:"如何从商户平台提款", value:"proWithdrawal"}
        ],
        tradingType:"buyCoin",
        tradingCoinNav:[
          {name:"如何买入UET币", value:"buyCoin"},
          {name:"如何卖出UET币", value:"sellCoin"}
        ],
        reqData: {
          limit:10,
          offset:0
        },
        rankingList:[],
        showVideoCover:true
      };
    },
    props: {
      isOfficialWeb:{
        type:Boolean,
        default:false
      }
    },
    methods: {
      getAwardRankings() {
        awardRankings(this.reqData).then(res => {
          console.log('优惠券排行',res);
          if (res.code === 10000) {
             this.rankingList = res.data;
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      playVideo(){
        this.showVideoCover = false;
        this.$refs.juanVideo.play();
      },
      gotoSellCoins(){
        let routerName = '';
        if(_.isMobile()){
          routerName = 'mPendingBuy';
        }else {
          routerName = 'transaction';
        }
        return {name: routerName,query:{mode:'3'}};
      },
      gotoBuyCoins(){
        let routerName = '';
        if(_.isMobile()){
          routerName = 'mPendingBuy';
        }else {
          routerName = 'transaction';
        }
        return {name: routerName,query:{mode:'2'}};
      }
    },
    computed: {
      ...mapGetters([
        'islogin'
      ])
    },
    created() {
    },
    mounted() {
      this.getAwardRankings();
    },
    components: {
      displayNav
    }
  };
</script>
<style lang="scss">
.coin-activity-promot{
   .activity-mobile-header{
     display: none;
   }
   .activity-banner{
      min-height: 700px;
      background: url("~images/activity/coin/coin-banner.jpg") no-repeat center center;
      background-size: cover;
     img{
       display: none;
     }
   }
   .participate-act{
     padding: 20px 0 32px;
     text-align: center;
     .title{
       line-height: 70px;
       color: #6f91ff;
     }
     .sub-title{
       line-height: 55px;
       color: #333333;
       font-weight: normal;
       margin-bottom: 26px;
       .red{
         color: #e45b36;
       }
     }
     .buysell-coins{
       .fast-sell{
         position: relative;
         width: 93%;
         float: left;
         background-image: linear-gradient(120deg, #69EDFF 0%,#AD7EFD 100%);
         border-radius: 10px;
         margin-left: 7px;
         padding: 15px 0 34px;
       }
       .fast-sell,.fast-buy{
         &:hover{
           -webkit-transition: all 200ms ease-in;
           -webkit-transform: scale(1.05);
           -ms-transition: all 200ms ease-in;
           -ms-transform: scale(1.05);
           -moz-transition: all 200ms ease-in;
           -moz-transform: scale(1.05);
           transition: all 200ms ease-in;
           transform: scale(1.05);
           box-shadow: 0 2px 6px 0 rgba(0,0,0,0.19);
         }
       }
       .bg-part{
          position: absolute;
          top: -8px;
          left: -7px;
          width: 139px;
          height: 144px;
       }
       .sell-bg{
          background: url("~images/activity/coin/sell-coinbg.png") no-repeat center center;
       }
       .fast-buy{
         position: relative;
         width: 93%;
         float: right;
         background-image: linear-gradient(120deg, #FEE140 0%, #FCA96D 50%, #FCA96D 50%, #FA709A 100%);
         border-radius: 10px;
         padding: 15px 0 34px;
       }
       .buy-bg{
          background: url("~images/activity/coin/buy-coinbg.png") no-repeat center center;
       }
       .tips-title{
          line-height: 116px;
          color: #ffffff;
          font-weight: normal;
       }
       .participate-btn{
         width: 93%;
         height: 50px;
         line-height: 50px;
         border-radius: 10px;
         float: left;
         color: #ffffff;
         margin-top: 20px;
         background: #698EFF;
         margin-left: 7px;
         cursor: pointer;
         &.right-act{
           float: right;
           margin-left: 0;
         }
         &:hover{
           background: #D33474;
         }
       }
     }
   }

   .building-bg{
      min-height: 450px;
      background: #698EFF;
      position: relative;
   }

   .leader-board{
      text-align: center;
      color: #ffffff;
      .title{
        line-height: 116px;
      }
     .ranking-header{
        line-height: 50px;
     }
     .ranking-header,.ranking-body{
       position: relative;
       z-index: 10;
     }
     span{
       display: block;
       width: 33.33%;
       height: 50px;
       float: left;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
       .num{
         padding:2px 8px;
         background: #FFFFFF;
         border-radius: 35px;
         color: #5F80EC;
       }
     }
     .ranking-item{
        line-height: 50px;
     }
     .left-part{
       float: left;
     }
     .right-part{
       float: right;
     }
     .ranking-title{
       background: #5572D2;
     }
     .randing-part{
        background: #698eff;
        div:nth-child(even){
          background: #5F80EC;
        }
     }
   }

   .intro-product{
     padding: 26px 0 36px;
      .title{
         line-height: 60px;
         color: #6f91ff;
      }
      .sub-title{
         line-height: 40px;
         color: #333333;
         font-weight: normal;
         margin: 11px 0 32px;
      }
      .video-part{
        position: relative;
        display: inline-block;
        .video-cover{
          position: absolute;
          z-index: 2;
          background: url("~images/activity/coin/video-cover.jpg") no-repeat center center;
          background-size: cover;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          &:hover{
            -webkit-transition: all 200ms ease-in;
            -webkit-transform: scale(1.05);
            -ms-transition: all 200ms ease-in;
            -ms-transform: scale(1.05);
            -moz-transition: all 200ms ease-in;
            -moz-transform: scale(1.05);
            transition: all 200ms ease-in;
            transform: scale(1.05);
            box-shadow: 0 2px 6px 0 rgba(0,0,0,0.19);
          }
        }
        video{
          position: relative;
          z-index: 1;
          display: block;
          max-width: 1000px;
          max-height: 444px;
          width: 100%;
          height: auto;
          margin: auto;
        }
      }
   }

   .product-advantage{
      padding: 30px 0;
      .adv-item{
        position: relative;
        z-index: 10;
        background: #FFFFFF;
        border-radius: 10px;
        min-height: 370px;
        margin: 10px 1.5%;
        padding: 35px 30px 0;
        &:hover{
          -webkit-transition: all 200ms ease-in;
          -webkit-transform: scale(1.05);
          -ms-transition: all 200ms ease-in;
          -ms-transform: scale(1.05);
          -moz-transition: all 200ms ease-in;
          -moz-transform: scale(1.05);
          transition: all 200ms ease-in;
          transform: scale(1.05);
          box-shadow: 0 2px 6px 0 rgba(0,0,0,0.19);
        }
        p{
          height: 120px;
          margin-bottom: 16px;
          &.adv-safety{
            background: url("~images/activity/coin/adv-safety.png") no-repeat center center;
            background-size: contain;
          }
          &.adv-simple{
            background: url("~images/activity/coin/adv-simple.png") no-repeat center center;
            background-size: contain;
          }
          &.adv-welfare{
            background: url("~images/activity/coin/adv-welfare.png") no-repeat center center;
            background-size: contain;
          }
          &.adv-invest{
            background: url("~images/activity/coin/adv-invest.png") no-repeat center center;
            background-size: contain;
          }
        }
        h2{
          line-height: 34px;
          color: #333333;
          margin-bottom: 6px;
          text-align: center;
        }
        h3{
          color: #787876;
          line-height: 26px;
          font-weight: normal;
        }
      }
   }

   .recharge-withdrawal{
     padding:0 0 32px;
     .rechwithd-navbar{
        line-height: 114px;
        a{
          display: block;
          color:#b3c3f5;
          font-weight: bold;
          text-align: center;
          &.active,&:hover{
            color: #6f91ff;
          }
        }
     }
     .rechwithd-content{
       img{
         float: left;
       }
       h2{
         color: #333333;
         font-weight: normal;
         line-height: 40px;
         &:first-child{
           padding-top: 20px;
         }
       }
       h3{
         color: #e45b36;
         line-height: 30px;
         font-weight: normal;
         margin-top: 30px;
       }
       p{
         color: #333333;
         line-height: 36px;
         margin-top: 10px;
         span{
           color: #e45b36;
         }
       }
     }
   }

   .trading-coinpart{
      background: #698EFF;
      padding: 20px 0 54px;
      .title{
        color: #ffffff;
        text-align: center;
        line-height: 74px;
      }
     .trading-nav{
       line-height: 53px;
       text-align: center;
       .col-21{
         &:first-child{
           padding-left: 24%;
         }
         &:last-child{
           padding-right: 24%;
         }
       }
       a{
         display:inline-block;
         color: #c0cdff;
         border-bottom: 4px solid transparent;
         &.active,&:hover{
           color: #FFFFFF;
           border-bottom: 4px solid #FFFFFF;
         }
       }
     }
     .trading-content{
       padding-top: 20px;
       p{
         color: #ffffff;
         line-height: 30px;
         max-width: 320px;
         margin: 15px auto 0;
         text-align: center;
       }
     }
     .hide-scroll-bar{
       display: none;
     }
   }

  .simple-footer{
     height: 100px;
     line-height: 100px;
     background: #363636;
     p{
       color: #959595;
     }
  }
}



@media only screen and (max-width: 1199px) and (min-width: 800px) {
  .coin-activity-promot{
    .activity-banner{
      min-height: 460px;
    }
  }
}

@media only screen and (min-width: 800px) {
  .coin-activity-promot{
    .building-bg{
      &:before{
        content: '';
        width: 410px;
        height: 450px;
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        background:  url("~images/activity/coin/building-bg.png") no-repeat left bottom;
      }
      &:after{
        content: '';
        width: 410px;
        height: 450px;
        display: block;
        transform: rotateY(180deg);
        position: absolute;
        right: 0;
        bottom: 0;
        background: url("~images/activity/coin/building-bg.png") no-repeat right bottom;
      }
    }
  }
}

@media only screen and (max-width: 799px) {
  .coin-activity-promot {
    .activity-mobile-header{
      display: block;
      height: 44px;
      background: #063369;
    }
    .activity-banner {
      min-height: auto;
      background: none;
      img{
        display: block;
        width: 100%;
        height: auto;
      }
    }
    .participate-act{
      .title{
         line-height: 50px;
      }
      .sub-title{
         line-height: 35px;
      }
      .buysell-coins{
         .fast-sell,.fast-buy{
           margin: 0 auto;
           float: none;
         }
         .tips-title{
           line-height: 60px;
           margin-top: 10px;
           font-size: 18px;
         }
         .participate-btn{
            margin: 20px auto 0;
            float: none;
            &.right-act{
              float: none;
              margin: 20px auto 0;
            }
         }
      }
    }
    .leader-board{
       padding-bottom: 15px;
       .title{
         line-height: 80px;
       }
       .right-part{
         .ranking-item:nth-child(even){
           background: #698eff;
         }
         .ranking-item:nth-child(odd){
           background: #5F80EC;
         }
       }
    }
    .intro-product{
       .title{
          line-height: 40px;
       }
       .sub-title{
         line-height: 20px;
       }
    }
    .product-advantage{
       .adv-item{
         min-height: 350px;
         padding: 10px 10px 0;
         p{
           margin-bottom: 0;
         }
         h3{
           line-height: 22px;
         }

       }
    }
    .recharge-withdrawal{
      padding: 30px 0;
      .rechwithd-navbar{
         line-height: inherit;
         margin-bottom: 10px;
         a{
           font-size: 14px;
           font-weight: normal;
           text-align: center;
           width: 88%;
           display: block;
           margin: 0 auto;
           line-height: 22px;
           background: #b3c3f5;
           border-radius: 10px;
           color: #FFFFFF;
           padding: 4%;
           &:hover,&.active{
             background: #698EFF;
             color: #FFFFFF;
           }
         }
      }
      .rechwithd-content{
        h2{
          line-height: 24px;
        }
        h3{
          line-height: 24px;
          margin-top: 15px;
        }
        p{
          line-height: 22px;
        }
      }
    }
    .trading-coinpart{
      padding: 20px 0 0;
      .title{
         line-height: 60px;
      }
      .trading-nav{
        line-height: 33px;
        .col-21{
          padding: 0 !important;
        }
      }
      .trading-content{
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: nowrap;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        width: 100%;
        overflow: hidden;
        overflow-x: auto;
        .col-26{
          margin-right: 10px;
        }
        .width-100{
          min-width: 150px;
        }
        p{
          padding-bottom: 30px;
        }
      }
      .hide-scroll-bar{
        left: 0;
        bottom: 0;
        display: block;
        width: 100%;
        height: 30px;
        background: #698EFF;
        z-index: 10;
      }
    }
    .simple-footer{
       p{
         line-height: 24px;
         padding-top: 14px;
       }
    }

  }
}

</style>
