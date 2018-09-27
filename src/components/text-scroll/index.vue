<template>
  <div class="text-scroll-content">
    <transition-group tag="ul" :name="scrollType" v-if="dataList.length>0">
        <li v-for="(item,index) in dataList" :key='index' v-show="index==count">
          {{item.content}}
        </li>
    </transition-group>
    <span v-else>
      抱歉！暂时找不到相关数据！
    </span>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        count: 0, // 当前索引  当v-for中的index等于count时 v-show=true 即显示当前元素
        intervalId: null, // 定时器ID
        playTime: 3000 // 定时器执行间隔
      };
    },
    props: {
      dataList: {
        type: Array,
        default() {
          return [];
        }
      },
      scrollType:{
        type: String,
        default: "scroll-up"
      }
    },
    methods: {
      getText() {
        let len = this.dataList.length; // 获取数组长度
        if (len == 0) {
          return // 当数组为空时，直接返回
        }
        if (this.count == len ) { // 当前为最后一个时
          this.count = 0 // 从第一个开始
        } else {
          this.count++ // 自增
        }
      }
    },
    computed: {},
    created() {
      this.intervalId = window.setInterval(()=>{ // 定义定时器
        this.getText();
      }, this.playTime);
    },
    destroyed() {
      window.clearInterval(this.intervalId) // 清除定时器
    },
    components: {}
  };
</script>
<style lang="scss">

</style>
