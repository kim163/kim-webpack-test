<template>
  <div class="section tranhome-nav">
    <div class="container min-width">
      <div class="row">
        <span v-if="breadList.length > 0" v-for="(item,index) in breadList">
          <router-link :to="{name: item.urlName}" v-if="index < breadList.length - 1">
          {{$t(item.name)}}
          </router-link>
          <a class="active" v-else>{{$t(item.name)}}</a>
          <span v-if="index < breadList.length - 1"> &gt; </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    methods: {},
    created() {
    },
    mounted() {
    },
    activated() {
    },
    components: {
    },
    props:{
      breadList:{
        type: Array,
        default:[]
      },
    }
  };
</script>
<style lang="scss">
.tranhome-nav{
  height: 46px;
  line-height: 46px;
  min-height: auto;
  border-bottom: 1px solid #D4D4D4;
  a{
    font-size: 16px;
    color: #333333;
    &.active, &:hover{
      color: #5087ff;
    }
  }
}

</style>
