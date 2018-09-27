<template>
  <div class="main" v-if="showSysBullentin">
    <div class="container">
      <header class="title">{{dataInfo.title}}</header>
      <section class="content">{{dataInfo.content}}</section>
    </div>
    <a class="close-btn-radius" @click="showSysBullentin = false"></a>
  </div>
</template>

<script>
  import { announcement } from 'api/activity'
  import { $localStorage } from '@/util/storage'
  import aesutil from '@/util/aesutil';
  import {mapGetters} from 'vuex'
  export default {
    name: "sys-bullentin",  //系统公告
    data(){
      return{
        limit:1,
        offset:0,
        dataInfo:{},
        showSysBullentin:false
      }
    },
    computed:{
      ...mapGetters([
        'userId'
      ])
    },
    methods:{
      getAnnouncement(){
        announcement({limit: this.limit,offset: this.offset}).then(res => {
          if(res.code === 10000){
            console.log(res)
            if(res.data.length > 0){
              this.dataInfo = res.data[0]
              const locSysMsg = $localStorage.get(`sysb-${this.userId}`)
              if(_.isUndefined(locSysMsg) || _.isNull(locSysMsg)){
                this.showSysBullentin = true
                this.saveSysMsg()
              }else{
                const info = JSON.parse(aesutil.decrypt(locSysMsg))
                if(info.id != this.dataInfo.id){
                  this.showSysBullentin = true
                  this.saveSysMsg()
                }else{
                  const nowDay = new Date().getDate()
                  const showTimeDay = new Date(info.showTime).getDate()
                  if(nowDay != showTimeDay){
                    this.showSysBullentin = true
                    this.saveSysMsg()
                  }
                }
              }
            }
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      },
      saveSysMsg(){
        _.assign(this.dataInfo,{
          showTime: new Date().getTime()
        })
        $localStorage.set(`sysb-${this.userId}`,aesutil.encrypt(JSON.stringify(this.dataInfo)))
      }
    },
    mounted(){
      this.getAnnouncement()
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0,0,0,0.40);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container{
    width: 66%;
    max-width: r(400);
    background: $white;
    color: #333333;
    animation: flipInY 1s forwards;
    .title{
      @include f(16px);
      text-align: center;
      margin-top: r(20);
    }
    .content{
      padding: r(20);
      @include f(14px);
      line-height: r(24);
    }
  }
  /*.close-btn{*/
    /*width: r(25);*/
    /*height: r(25);*/
    /*background: url(~images/close-round.png) no-repeat;*/
    /*background-size: 100% 100%;*/
    /*margin-top: r(15);*/
    /*opacity: 0;*/
    /*animation: rotateIn 1s .5s forwards;*/
  /*}*/
</style>