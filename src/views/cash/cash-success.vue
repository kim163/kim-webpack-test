<template>
  <div class="content-box">
    <div class="content">
      <div class="suc-con">
        <p class="i-suc">充值成功！</p>
        <div class="book-details">
          <p class="book-num">订单号：{{data.jiuanOrderid}}</p>
          <p class="book-time">订单时间：{{data.createtime | Date('yyyy-MM-dd h:mm:ss')}}   <span class="fr shop-user">商户名：{{data.businessName}}</span></p>
          <p class="book-money">
            应付金额：<span class="red">{{data.coinAmount}} {{data.assetCode}}</span>折合
            <span class="red">{{data.amount}} CNY </span>
            <span class="gray current-rate">&nbsp;&nbsp;当前汇率：100{{data.assetCode}} = {{formatCny(100)}}	</span>
          </p>
          <p class="book-tips gray">交易内容：商户账户充值
          </p>

          <div class="back-user">
            <a :href="data.notifyUrl" class="btn">返回商户界面</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "success",
    props:{
      data: {
        type: Object,
        default: {
          amount: '',//应付金额
          assetCode: '', //资产代码
          merchantId: '', //商户号
          merchantOrderid: '', //商户订单号
          merchantCallbackurl: '', //商户回调地址
          sign: '', //商户请求签名
          exchangeRate: 0, // 汇率
          businessName: '', //商户名
          jiuanOrderid: '',  //久安订单号
        }
      },
    },
    methods: {
      formatCny(data) {
        return data / this.data.exchangeRate
      }
    }
  }
</script>

<style lang="scss" scoped>
  .suc-con{
    padding:80px 0;
  }
  .i-suc{
    background: url(~images/suc.png) no-repeat top center;
    padding:146px 0 20px;
    width:156px;
    margin:0 auto;
    text-align: center;
    font-size:28px;
  }
  .book-details{
    width:600px;
    margin:0 auto;
    line-height: 35px;
  }
  .book-num{
    font-size:18px;
    text-align: left;
    padding:5px 0 10px;
  }
  .book-time{
    font-size:18px;
  }
  .back-user{
    width:250px;
    margin:40px auto 70px;
  }
  .back-user .btn{
    display:inline-block;
    background: url(~images/btn.png) no-repeat;
    height:99px;
    line-height: 75px;
    width:250px;
    text-align: center;
    color:#fff;
    font-size:20px;
  }
  .book-money{
    font-size:18px;
  }
</style>