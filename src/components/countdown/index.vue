<template>
  <span>
    <slot>
        {{content}}
    </slot>
  </span>
</template>
<script>

  export default {
    name: "countdown",
    data() {
      return {
        content: '',
      }
    },
    watch: {
      endTime() {
        this.countdownTime(this.endTime)
      }
    },
    props: {
      endTime: {
        type: Number,
        default: 0
      },
      endText: {
        type: String,
        default: ''
      },
      timestamp: {
        type: Boolean,
        default: false
      },
      isNeedUpdate: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      countdownTime(t) {
        let self = this;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          t = t - 1000
          if (this.timestamp) {
            this.$emit('nowTime', t)
          }
          if (t > 0) {
            this.formatTime(t)
          } else {
            clearInterval(this.timer);
            self.content = self.endText;
            self.$emit('callBack')
          }
        }, 1000);
      },
      formatTime(t) {
        let day = Math.floor(t / 86400000);
        let hour = Math.floor((t / 3600000) % 24);
        let min = Math.floor((t / 60000) % 60);
        let sec = Math.floor((t / 1000) % 60);
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        let format = '';
        if (day > 0) {
          format = `${day}天${hour}小时${min}分${sec}秒`;
        }
        if (day <= 0 && hour > 0) {
          format = `${hour}小时${min}分${sec}秒`;
        }
        if (day <= 0 && hour <= 0) {
          format = `${min}分${sec}秒`;
        }
        if (min <= 0 && sec >= 0) {
          format = `${sec}秒`;
        }
        this.content = format;
      }
    },
    mounted() {
      this.formatTime(this.endTime)
      this.countdownTime(this.endTime)
    },
  }
</script>

<style lang="scss" scoped>

</style>
