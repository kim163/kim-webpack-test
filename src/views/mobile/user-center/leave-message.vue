<template>
  <div class="leave_message_container">
    <header class="mobile-header">
      <a @click="doClick" class="back-link"> <i class="iconfont icon-left-arrow"></i></a>
      <span>留言板 </span>
    </header>
    <div class="leave_message_content">
      <p><i class="iconfont icon-leave-message"></i> 留言 </p>
      <div class="message_content"><textarea type="text" placeholder="说点什么呗..." v-model="textValue"></textarea></div>
      <div class="upload_container" >
        <uploadPic :showClose="true" @gitPicUrl="getPicUrl"></uploadPic>
      </div>
    </div>
    <div class="send_btn" @click="sendInfo">发送</div>
  </div>
</template>

<script>
  import MobileHeader from 'components/m-header'
  import uploadPic from 'components/upload-img'
  import {userCenter} from 'api'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        textValue: '',
        attachmentUrls: '',
        isUpload:true,
      }
    },
    props:{
      idInfo:{
        default:''
      }
    },
    computed:{
      ...mapGetters([
        'userId','userData'
      ])
    },
    methods: {
      getPicUrl(res) {
        this.attachmentUrls = res
        if(res.length>3){
           this.isUpload =false
        }else {
          this.isUpload = true
        }
      },
      sendInfo() {
        if(!this.isUpload){
          toast('最多上传三张图片')
          return
        }
        if(this.textValue==''&&this.attachmentUrls==''){
          toast('留言信息不能为空')
          return
        }
        const requests = {
          'orderId': this.idInfo,
          'userId': this.userId,
          'userName': this.userData.nickname,
          'attachmentUrls':this.attachmentUrls?this.attachmentUrls.join(','):'',
          'content': this.textValue
        }
        userCenter.addAppealDetail(requests).then((res) => {
            if(res.code=='10000'){
              toast("发送成功")
              this.textValue=''
              this.attachmentUrls=''
              this.$emit('closeMessage',false)
            }else {
              toast(res.message)
            }
        })
      },
      doClick(){
        this.$emit('closeMessage',false)
      }
    },
    components: {
      MobileHeader,
      uploadPic
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .leave_message_container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 1;
  }
  .leave_message_content {
    padding: r(20);
    background: #fff;
    p {
      padding-bottom: r(20);
    }
    .message_content {
      textarea {
        display: inline-block;
        width: 100%;
        height: r(150);
        background-color: #F5F5F5;
        @include f(16px)
      }
    }
    .upload_container {
      .upload-imgpart {
        padding: r(20) r(0) r(0) r(0);
        .upload-btngroup {
          border: 1px solid #333333;
        }
      }
    }
  }

  .send_btn {
    background-color: #3573FA;
    color: #fff;
    text-align: center;
    width: 100%;
    height: r(45);
    line-height: r(45);
    position: fixed;
    bottom: 0;
    left: 0;
  }

</style>
