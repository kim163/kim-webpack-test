<template>
  <div class="section guide-page">
    <div class="container">
      <div class="row txt-center nologin">
        <img src="~images/nologin.png">
        <p>{{!iscustomize ? '您好，请先登录' : '您还没有登录哦！请从久安的合作商户网址登陆'}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        iscustomize:_.customize()
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
    }
  };
</script>
<style lang="scss">
.guide-page{

}
  .nologin{
    padding:50px 0 100px;
    p{
      margin-top: 20px;
    }
  }

</style>
