<template>
  <span class="pubeyes iconfont icon-closeeye" @click="checkpwd">
  </span>
</template>
<script>
    export default {
        name: "",
        data() {
            return {}
        },
        props:["dom"],
        computed: {},
        watch: {},
        methods: {
          checkpwd(e){
            e.currentTarget.classToggle("icon-closeeye icon-openeye")
            let dom= e.currentTarget.previousElementSibling;
            if(['text','password'].indexOf(dom.type)>-1){
              dom.type=dom.type=='password'?"text":"password";
            }else{
              dom=e.currentTarget.nextElementSibling;
              if(['text','password'].indexOf(dom.type)>-1){
                dom.type=dom.type=='password'?"text":"password";
              }
            }
          },
        },
        created() {
        },
        activated() {
        },
        components: {}
    }
</script>
<style spcoed>
  span.pubeyes {
    position: absolute;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
    line-height: 50px!important;
    height: 100%!important;
    color: #f66;
  }
</style>
