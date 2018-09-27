<template>
  <div class="table-data">
    <table class="model2">
      <thead>
      <tr>
        <th class="sorting_disabled" v-for="(item,i) in thead"  @click="item.method||null">
          {{ item.name || item }}
        </th>
      </tr>
      </thead>
      <slot></slot>
    </table>

    <div class="loadding" v-show="!showLoad&&!data.hasOwnProperty('totalRecords')">
      尚未查询
    </div>
    <div class="loadding" v-show="showLoad">
      <loadding>正在查询...</loadding>
    </div>
    <div class="loadding" v-show="data.totalRecords==0&&!showLoad">空数据</div>
    <slot v-show="data.pageContents>0" name="footer">

    </slot>
    <page-By v-show="!showLoad" @search="search" :data="data"></page-By>
  </div>
</template>
<script>
  import pageBy from "components/paging-by";
  import loadding from "components/loadding";

  export default {
    data() {
      return {
        showLoad: false,
      }
    },
    watch: {},
    props: {
      thead: {
        type: Array,
        default() {
          return [];
        }
      },
      data: {
        type: Object,
        default() {
          return {
            pageContents: []
          };
        }
      },
      className: {
        type: String
      }
    },
    watch: {
      "data.pageContents"(val) {
        if (val.length > 0) {
          this.showLoad = false;
        } else {
          this.showLoad = !this.showLoad;
        }
      }
    },
    methods: {
      search(val, size) {
        this.$emit("search", val, size)
      }
    },
    components: {
      pageBy, loadding
    }
  }
</script>
<style lang="scss">
  .table-data {
    table {
      border-spacing: 0;
      border-collapse: collapse;;
      width: 100%;
    }
    .loadding {
      padding: 100px 0;
      text-align: center;
    }
    .mode1 {
      th {
        color: #333;
        padding: 20px 16px;
        border: 1px solid #ccc;
        background: #fff;
      }
      td {
        padding: 16px 10px;
        color: #333;
        font-size: 13px;
        text-align: center;
        border: 1px solid #ccc;
        background: #fff;
      }
    }
    .model2 {
      th {
        background: #dbd9d9;
        font-size: 12px;
        font-weight: normal;
        padding: 0;
        white-space: nowrap;
        border: 0;
        height: 32px;
        border-top: solid 1px #e5e5e5;
        text-align: center;
      }
      td {
        border: 0;
        height: 35px;
        width: auto;
        text-align:center;
        border-bottom: solid 1px #e5e5e5;
      }
      tr:nth-child(2n+1) {
        background: #f9f9f9;
      }
    }
  }
</style>
