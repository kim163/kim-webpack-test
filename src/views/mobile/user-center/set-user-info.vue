<template>
  <div>
    <mobile-header v-if="!isPc">{{$t('userCenter.completeMaterial')}}</mobile-header>
    <div class="main">
      <div class="info-item">
        <div class="title">昵称:</div>
        <input class="info-input" type="text" v-model="nickName"/>
      </div>
      <div class="info-item">
        <div class="title">真实姓名:</div>
        <span v-if="userData.name != null">{{name}}</span>
        <input v-else class="info-input" type="text" v-model="name" placeholder="请输入真实姓名"/>
      </div>
      <div class="m-top-md">
        <div class="bind-def-btn" @click="setUserInfo">绑定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import {mapGetters} from 'vuex'
  import {
    bindUserInfo
  } from 'api/user-center'
  export default {
    name: "set-user-info",
    data(){
      return{
        nickName:'',
        name:'',
      }
    },
    watch:{
      'userData.name':function(val){
        this.userData.name = val
      }
    },
    computed:{
      ...mapGetters([
        'userData'
      ])
    },
    props:{
      isPc:{
        type:Boolean,
        default:false
      }
    },
    components:{
      MobileHeader
    },
    methods:{
      setUserInfo(){
        if(this.nickName === ''){
          toast('请输入昵称')
          return
        }
        if(this.name === ''){
          toast('请输入真实姓名')
          return
        }
        const data = {
          idCard:'',
          userId: this.userData.userId,
          name: this.name,
          nickname: this.nickName
        }
        console.log('set user',data)
        bindUserInfo(data).then(res => {
          if(res.code === 10000){
            toast('绑定成功')
            this.$store.dispatch('UPDATE_USERDATA')
            if(!this.isPc){
              this.$router.replace({name:'mUserCenter'})
            }
          }else{
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      }
    },
    created(){
      this.nickName = this.userData.nickname
      this.name = _.isNull(this.userData.name) ? '' : this.userData.name
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    padding: r(10);
    background: $white;
    .info-item{
      display: flex;
      justify-content: space-between;
      @include f(16px);
      height: r(50);
      line-height: r(50);
      border-bottom: 1px solid #d1d1d1;
      .info-input{
        flex-grow: 1;
        padding-left: r(15);
        @include f(16px);
      }
    }
    .m-top-md{
      margin-top: r(20);
    }
  }
</style>
