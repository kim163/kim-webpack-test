<template>
  <div>
    <v-header></v-header>
    <div class="bind-list-content">
      <bread-crumbs :bread-list="breadList"></bread-crumbs>
      <div class="section bind-list-section">
        <div class="container">
          <div class="row">
            <div class="table">
              <div class="th">
                <div class="td" v-for="(item,index) in thCfg" :key="index">{{item}}</div>
              </div>
              <div class="tbody">
                <div v-show="showRes">
                  <div class="tr" v-for="(item,index) in bindList" :key="index" v-if="bindList.length > 0">
                    <div class="td">{{index + 1}}</div>
                    <div class="td">{{item.bindUserid}}</div>
                    <div class="td">{{item.merchantName}}</div>
                    <div class="td">{{item.createTime | Date('yyyy-MM-dd h:mm:ss')}}</div>
                    <div class="td">
                      <a class="btn btn-primary" @click="showConfirmDialog(item.merchantId)">解绑</a>
                    </div>
                  </div>
                  <no-data-tip v-if="bindList.length === 0"></no-data-tip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <confirm-dialog v-model="showConfirm" :is-pc="true">
      <span slot="header-title">解绑商户</span>
      <div slot="title"><img src="~images/unbind-tip.png"/></div>
      <div slot="content">
        <div class="dialog-content">您是否确定解绑该商户？</div>
        <div class="dialog-content tip-dec">解绑后，从该商户进入久安钱包将无法自动登录</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel dialog-cancel">暂不解绑</div>
      <div slot="rightBtn" class="dialog-btn-yes" @click="unBind">确定解绑</div>
    </confirm-dialog>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import VFooter from 'components/footer'
  import VHeader from 'components/header-bind-create'
  import BreadCrumbs from 'components/bread-crumbs'
  import {mapGetters} from 'vuex'
  import ConfirmDialog from 'components/confirm'
  import NoDataTip from 'components/no-data-tip'

  import {
    userMerchantList,
    removeUserMerchant
  } from 'api/cashier'

  export default {
    name: "bind-list",
    data() {
      return {
        breadList: [
          {
            urlName: 'index',
            name: 'navbar.navHome'
          },
          {
            urlName: 'pcBindList',
            name: 'navbar.busineList'
          },
        ],
        thCfg: [
          '序号',
          '商户账号',
          '商户名称',
          '绑定时间',
          '操作'
        ],
        bindList: [],
        showConfirm: false,
        itemId: 0,
        showRes: false
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    components: {
      VFooter,
      VHeader,
      BreadCrumbs,
      ConfirmDialog,
      NoDataTip
    },
    methods: {
      getList() {
        userMerchantList({userId: this.userId}).then(res => {
          console.log(res)
          if (res.code === 10000) {
            this.bindList = res.data
            this.showRes = true
          } else {
            toast(res)
          }
        }).catch(err => {
          toast(err)
        })
      },
      showConfirmDialog(id) {
        this.itemId = id
        this.showConfirm = true
      },
      unBind() {
        this.showConfirm = false
        const data = {
          userId: this.userId,
          merchantId: this.itemId
        }
        removeUserMerchant(data).then(res => {
          if (res.code === 10000) {
            this.getList()
            toast('解除绑定成功')
          } else {
            toast(res.message)
          }
        }).catch(err => {
          toast(err)
        })
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  .bind-list-content {
    width: 100%;
    margin-top: 100px;
  }

  .bind-list-section {
    min-width: 1200px;
    margin-bottom: 50px;

  }

  .table {
    width: 100%;
    margin-top: 30px;
    .th, .tr {
      width: 100%;
      height: 50px;
      background-color: #f2f6ff;
      display: flex;
      justify-content: space-between;
      .td {
        text-align: center;
        line-height: 50px;
        /*flex-grow: 1;*/
        font-size: 16px;
        width: 20%;
      }
    }
    .tbody {
      width: 100%;
      min-height: 600px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .tr {
      height: 70px;
      background: #ffffff;
      border-bottom: 1px solid #d4d4d4;
      .td {
        line-height: 70px;
        .btn{
          width: 100px;
          height: 40px;
          background-color: #5087ff;
          border-radius: 5px;
          display: inline-block;
          line-height: 40px;
          font-size: 16px;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
  }

  .tip-dec {
    font-size: 16px;
    color: #787876;
    margin-top: 20px;
  }
</style>