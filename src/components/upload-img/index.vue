<template>
  <div class="upload-imgpart">
    <div class="cfx" :class="{'item-list': uploadImgSet.maxUploadNum === 1}">
      <div v-for="(item,i) in picListArr||[]" class="upload-imgitem">
        <viewer :images="item.img">
          <img :src="item.img" alt="" class="contents_image">
        </viewer>
        <a class="close" v-show="showClose" @click="removeImg(item)">
          <i class="iconfont icon-close"></i>
        </a>
      </div>
      <div class="upload-btngroup" v-if="isShowUploadBtn">
        <input type="file" accept="image/*" value="打开照相机" class="open-camera-btn" @change="upload">
      </div>
    </div>
    <div class="upload-tipsinfo" v-show="uploadImgSet.isShowUploadTip">
      {{$t(uploadImgSet.uploadImgTips)}}
    </div>
  </div>
</template>

<script>
  import {chatWith} from 'api'
  import {mapGetters} from 'vuex'
  export default {
    name: "uploadImg",
    data() {
      return {
        dataURL: '',
        picUrlArr: [],
        picListArr: [],
        dataURLNext: '',
        base64: ''
      }
    },
    props: {
      uploadImgSet: {
        type: Object,
        default() {
          return {
            maxUploadNum: -1,        // 最大上传数量，如果没有最大上传数量，传 -1
            uploadImgTips: '',       // 上传图片提示文字
            isShowUploadTip: true,    // 是否有上传文件提示信息
            maxWidth: 400,   //图片尺寸
            maxHeight: 400,
          }
        }
      },
      showClose:{
        type:Boolean,
        default:false
      },
      reset:{
        type:Boolean,
        default:false
      }
    },
    model:{
      prop: 'reset',
      event: 'change'
    },
    computed: {
      isShowUploadBtn() {
        if (this.uploadImgSet.maxUploadNum == -1) {
          return true;
        } else {
          if (this.picUrlArr.length >= this.uploadImgSet.maxUploadNum) {
            return false;
          }
          return true;
        }
      },
      ...mapGetters([
        'userData'
      ])
    },
    watch: {
      reset(val){
        if(val){
          this.picListArr = []
          this.picUrlArr = []
          this.$emit("gitPicUrl", this.picUrlArr);
          this.$emit('change',false)
        }
      }
    },
    methods: {
      upload(e) {
        let reader = new FileReader();
        var file = e.target.files[0];

        // 给后台发
        if (file.type.indexOf('image') == 0) {
          reader.readAsDataURL(file)
          reader.onload = () => {
            var img = new Image()
            var canvas = document.createElement('canvas');
            var canvasNext = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var ctx = canvas.getContext('2d');
            img.src = reader.result
            this.base64 = reader.result;
            /*如果图片的base64大于100kb 那么久压缩*/

            img.onload = () => {
              var originWidth = img.width;
              var originHeight = img.height;
              // 最大尺寸限制
              if (this.base64.length > 100000) {
                canvasNext.width = 60;
                canvasNext.height = 60;
                ctx.clearRect(0, 0, 60, 60)
                ctx.drawImage(img, 0, 0, 60, 60)
                this.dataURLNext = canvasNext.toDataURL('image/png');
                this.base64 = this.dataURLNext.replace(/^data:.*?;base64,/, '')
              } else {
                this.base64 = this.base64.replace(/^data:.*?;base64,/, '')
              }
              var maxWidth = this.uploadImgSet.maxWidth,
                maxHeight = this.uploadImgSet.maxHeight;
              // 目标尺寸
              var targetWidth = originWidth,
                targetHeight = originHeight;
              if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                  // 更宽，按照宽度限定尺寸
                  targetWidth = maxWidth;
                  targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
              }
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              // 清除画布
              context.clearRect(0, 0, targetWidth, targetHeight);
              // 图片压缩
              context.drawImage(img, 0, 0, targetWidth, targetHeight);
              // canvas转为blob并上传
              this.dataURL = canvas.toDataURL('image/png');
              var blob = this.dataURItoBlob(this.dataURL);
              const RamdomValue = Math.random();
              var fd = new FormData();
              fd.append("file", blob, `${RamdomValue}.png`);
              fd.append('nodeId', this.userData.node && this.userData.node.customer ? `${this.userData.nodeId}_${this.userData.merchantId}` : process.env.NODE_ID)
              chatWith.uploadFile(fd).then(res => {
                console.log('文件上传', res);
                if (res.code == 10000) {
                  this.picListArr.push({img: [this.dataURL]});
                  this.picUrlArr.push(res.data.url);
                  this.$emit("gitPicUrl", this.picUrlArr);
                } else {
                  toast(res.message);
                }
              }).catch(err => {
                toast(err.message);
              })

            }
            //  fr.readAsDataURL(input.files[0]);
          }
        }
      },
      dataURItoBlob(base64Data) {
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(base64Data.split(',')[1]);
        } else {
          byteString = unescape(base64Data.split(',')[1]);
        }
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type: mimeString});
      },
      removeImg(item){
        const index = _(this.picListArr).findIndex((pic) => {
          return pic === item
        })
        this.picListArr.splice(index,1)
        this.picUrlArr.splice(index,1)
        this.$emit("gitPicUrl", this.picUrlArr);
      }
    }
  }
</script>

<style lang="scss">
  @import "~assets/scss/mixin";

  .upload-imgpart {
    padding: r(22) r(10) r(9);
  }

  .item-list {
    display: flex;
    justify-content: center;
  }

  .upload-imgitem {
    display: block;
    margin: r(5) 1%;
    width: 31%;
    float: left;
    position: relative;
    div {
      height: r(100);
    }
    img {
      width: 100%;
      height: 100%;
    }
    .close{
      position: absolute;
      display: block;
      width: r(20);
      height: r(20);
      background: #000000;
      border-radius: 50%;
      line-height: r(16);
      top: r(-10);
      right: r(-10);
      z-index: 999;
      text-align: center;
      .iconfont{
        @include f(12px);
        color: $white;
      }
    }
  }

  .upload-btngroup {
    width: 32%;
    height: r(100);
    margin: 5px 1%;
    display: inline-block;
    background: #F5F5F5 url("~images/plus-sign.png") no-repeat center center;
    background-size: 30%;
    .open-camera-btn {
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
    }
  }

  .upload-tipsinfo {
    @include f(15);
    color: #8F8F8F;
    line-height: r(36);
  }

</style>
