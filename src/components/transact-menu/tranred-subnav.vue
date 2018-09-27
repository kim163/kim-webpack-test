<template>
  <div class="section tranred-subnav noborder">
    <div class="row">
      <span v-for="(item,i) in navList"
            class="item-info"
            :class="{active: i === navIndex}"
            @click="changTab(i,item.value)"
            :key="i">
        {{generateTitle(item.name)}}
      </span>

      <!--<span class="back-hall"> 返回交易大厅</span>-->
      <div class="search-box" v-if="showSearch">
        <input type="text" class="search-input" v-model.trim="searchKey" placeholder="请输入对方昵称、账号">
        <span class="search-btn" @click="checkSearch">搜索</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { generateTitle } from '@/util/i18n'

  export default {
    data() {
      return {
        navIndex:0,
        searchKey:''
      }
    },

    props:{
      navList:{
        type:Array,
        default:[],
        request:true
      },
      showSearch:{
        type:Boolean,
        default:true
      }
    },
    methods: {
      generateTitle,
      changTab(index,val){
        this.navIndex = index
        this.searchKey = ''
        this.$emit('changeTab',val)
        this.$emit('searchKey',this.searchKey)
      },
      checkSearch(){
        this.$emit('search',true)
        this.$emit('searchKey',this.searchKey)
      }
    },
  };
</script>
<style lang="scss">
.tranred-subnav{
  height: 80px;
  line-height: 80px;
  min-height: auto;
  border-bottom: 1px solid #D4D4D4;
  .item-info{
    display: inline-block;
    width: 200px;
    text-align: center;
    font-size: 16px;
    color: #333333;
    height: 77px;
    line-height: 77px;
    cursor: pointer;
    &:hover, &.active {
      color: #5087ff;
      border-bottom: 1px solid #5087FF;
    }
  }
}

.noborder{
  border:0;
}
  .border-box{
    border:1px solid #ccc;
  }
.back-hall{
  display:inline-block; float:right;
  height:42px;
  line-height: 42px;
  padding:0 20px;
  border:1px solid #5087FF;
  color:#5087FF;
  border-radius: 5px;
  margin:20px 20px 0 0;
}
  .search-box{
    display:inline-block; float:right;
    height:46px;
    margin:20px;
    width:330px;
  }
  .search-btn{
    display: inline-block;
    float:left;
    width: 100px;
    text-align: center;
    font-size: 16px;
    background: orange;
    color:#fff;
    height:42px;
    line-height: 42px;
    border-radius:0 5px 5px 0;
    cursor: pointer;
  }
  .search-input{
    float:left;
    width: 230px;
    border:1px solid #ccc;
    border-right:0;
    border-radius: 5px 0 0 5px;
    height:42px;
    line-height: 42px;
    padding:0 10px 0 30px;
  }
</style>
