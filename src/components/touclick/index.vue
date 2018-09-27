<template>
  <div v-show="showDom" ref="verifyWarp" class="touclick">
  </div>
</template>
<script>
  //  import touclicks from 'touclick'
//  import {getTouClickFlag} from "api/show"
  export default {
    data() {
      return {
        showDom: false,
        touclick: false,
        isOpenTouclick: false
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(val) {
        if (val&&!this.isOpenTouclick) {
          this.$emit("success", {
            token: "",
            checkAddress: "",
            sid: ""
          }, {
            destory: function () {
            }
          });
        } else {
          this.showDom = val;
        }
      },
      showDom(val) {
        if (this.isOpenTouclick) {
          if (!window.TouClick) {
            this.$emit("input", false)
            return toast("验证插件加载中请稍后...")
          }
          val && this.success();
        }
      }
    },
    created() {
      if (!document.querySelector('#touclick')) {
       /* getTouClickFlag().then(res => {
          if (res.success) {
            if (res.data == "1") {
              this.isOpenTouclick = true;
              if (!document.querySelector('#touclick')) {
                let $script = document.createElement("script")
                $script.type = "text/javascript";
                $script.id = "touclick";
                $script.src = "/static/js/touclick.js";
                document.body.appendChild($script);
              }
            } else {
              this.isOpenTouclick = false;
            }
          }
        });*/
      }else{
        this.isOpenTouclick = true;
      }
    },
    methods: {
      success() {
        let _this = this;
        let tc = TouClick(this.$refs.verifyWarp, {
          onSuccess(obj) {
            _this.$emit("success", obj, tc);
          },
          onMaskClick(e) {
            tc.close();   //点击关闭验证码
            tc.destory();   //点击关闭验证码
            _this.$emit("input", false);
          }
        });
        tc.start()
      }
    }
  };
</script>
