<template>
  <transition name="fade">
    <div class="container min-width main" v-if="activityList.length > 0">
      <swiper ref="mySwiper" :options="swiperOption">
        <swiper-slide v-for="(item,index) in activityList" :key="index" >
          <div class="act-item" :class="`item-${index}`" @click="quickBuyOrSell(item)">
            <div class="info-item">
              <img class="icon-img" :src="item.iconUrl">
              <div>
                <p class="title">{{item.title}}</p>
                <p class="des-title">{{item.subtitle}}</p>
              </div>
            </div>
            <div class="info-item lg">
              <div class="content-info" v-for="(info,i) in item.contentList" :key="i">{{info}}</div>
            </div>
            <div class="info-item">
            <span>赠币活动剩余：
              <span class="balance">{{coinBalance}}</span>
              <span class="f-md">UET</span>
            </span>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </transition>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {getAwardInfo} from 'api/activity'

  export default {
    name: "pc-activity",
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          // loop: true,
          simulateTouch : true,//禁止鼠标模拟
          preventLinksPropagation : false
        },
        activityList: [],
        coinBalance: 0,
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    methods: {
      getActivityList() {
        getAwardInfo({}).then(res => {
          console.log(res)
          if (res.code === 10000) {
            this.coinBalance = res.data.coinBalance
            this.activityList = [...res.data.awardList]
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      quickBuyOrSell(data){
        let type = ''
        switch (data.type){
          case 'sellCoins':
            type = 'sell'
            break
          case 'buyCoins':
            type = 'buy'
            break
          default:
            break
        }
        console.log('优惠类型',type)
        if(type != ''){
          this.$emit('quickBuySell',type)
        }
      }
    },
    mounted() {
      this.getActivityList()
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    margin-top: 30px;
    .swiper-container {
      height: 130px;
    }
  }

  .act-item {
    width: 100%;
    height: 100px;
    position: relative;
    display: flex;
    cursor: pointer;
    &:after {
      content: '';
      position: absolute;
      background: url(~images/act-border.png);
      width: 10px;
      height: 91px;
      left: -5px;
      top: 4.5px;
    }
    &:before {
      content: '';
      position: absolute;
      background: url(~images/act-border.png);
      width: 10px;
      height: 91px;
      right: -5px;
      top: 4.5px;
    }
    &.item-0{
      background-image: linear-gradient(45deg, #AD7EFD 0%, #69EDFF 100%);
    }
    &.item-1{
      background-image: linear-gradient(44deg, #FA709A 0%, #FCA96D 50%, #FCA96D 50%, #FEE140 100%);
    }
    &.item-2 {
      background-image: linear-gradient(47deg, #EE69FF 0%, #955AF9 100%);
    }
    &.item-3 {
      background-image: linear-gradient(-236deg, #FB9F75 0%, #FA709A 100%);
    }
    .info-item {
      width: 25%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      position: relative;
      font-size: 16px;
      &:after {
        content: '';
        width: 1px;
        height: 80px;
        position: absolute;
        background: #ffffff;
        right: 0;
        top: 10px;
        opacity: 0.3;
      }
      &.lg {
        width: 50%;
        flex-direction: column;
      }
    }
    .icon-img {
      width: 131px;
      height: 83px;
      margin-right: 5%;
    }
    .title {
      font-size: 18px;
      margin-bottom: 12px;
    }
    .content-info {
      width: 95%;
      text-align: center;
      line-height: 30px;
    }
    .balance {
      font-size: 24px;
    }
    .f-md {
      font-size: 14px;
    }
  }

  .swiper-pagination {
    bottom: 0px;
    > .swiper-pagination-bullet {
      width: 14px !important;
      height: 14px !important;
    }
  }
</style>