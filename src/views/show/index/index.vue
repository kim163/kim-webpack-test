<template>
  <div class="index-main"></div>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
    methods: {},
    created() {
      if(_.isMobile()){
        this.$router.replace({name: 'mIndex'});
      }else{
        window.location.href = "/static/index.html";
      }
    },
    mounted() {
    },
    activated() {
    },
    deactivated(){
    },
    beforeDestroy(){
    },
    components: {
    }
  };
</script>
<style lang="scss">
  .index-main {

  }
</style>
