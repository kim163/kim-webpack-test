<template>
    <div class="appealList-container">
        <div class="tab-list">
          <div class="tab-item"
               :class="{active:type===item.type}"
               v-for="(item,index) in navList"
               :key="index" @click="changeTab(item.type)">

          </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "appeal-list",
        data(){
          return{
            navList:[
              {
                name:'',
                type:1,
              },
              {
                name:''
              }
            ]
          }
        }
    }
</script>

<style lang="scss" scoped>

</style>
