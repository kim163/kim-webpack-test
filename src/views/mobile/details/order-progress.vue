<template>
  <div class="transell-main0 transell-main-box morder-page">
    <div class="m-order-details" v-if="DetailList.credit == userId">
      <m-header :mheadSet="mheadSet" @returnBtnEvent="returnBtnEvent">我的买币订单</m-header>
      <div v-if="payOrderStep==1">
        <div class="payOrder_progress">
          <div class="progress_state">
            <img src="~images/startpay.png" alt="">
            <p class="defaultColor">等待我付款</p>
            <span class="line" :class="{'lineColor':DetailList.status =='47'}"></span>
          </div>
          <div class="progress_state">
            <img src="~images/waitpay_next.png" alt="" v-if="DetailList.status=='47'">
            <img src="~images/waitpay_pro.png" alt="" v-else>
            <p :class="{'defaultColor':DetailList.status=='47'}">等待对方放币</p>
            <span class="line"></span>
          </div>
          <div class="progress_state">
            <img src="~images/trade_success_pro.png" alt="">
            <p>交易成功</p>
          </div>
        </div>
        <div class="trade-time-bar">
          <div>
            <img src="~images/order_time.png" alt="" class="order_time">
            <count-down v-if="DetailList.status !='61'"
                        :end-time="DetailList.intervalTime-DetailList.elapsedTime<=0 ? 0 : DetailList.intervalTime-DetailList.elapsedTime"
                        @callBack="countDownEnd" class="count_time">
            </count-down>
          </div>
          <p class="pay_send" v-if="showDiscountInfo&&couponValueStr>0">立即付款后预计获赠 {{couponValueStr}} UET</p>
        </div>
        <div>
          <ul class="details-ul">
            <li>
              <p class="l-title">订单 :</p>
              <p class="order-id-li extra_order"><span class="order_info">{{orderId}}</span>
                <a href="javascript:void(0);" class="copy-btn copy-btn-next" :data-clipboard-text="orderId"
                   @click="copy">{{$t('transactionHome.copyBtn')}}</a>
              </p>
            </li>
            <li>
              <span class="l-title">交易数量 :</span>
              <span>
                     <span class="l-title">{{DetailList.debitAmount}} UET</span> <span class="equal_money"> ≈ ¥ {{(DetailList.debitAmount*0.01).toFixed(2)}} </span>
                 </span>
            </li>
          </ul>
          <ul class="details-ul pay-detail">
            <li>
              <span class="l-title">
                 <img src="~images/chatWith/seller.png" alt="" class="character">
                {{DetailList.debitName}}</span>
              <span class="fr remind_info">请按照卖家要求的付款方式付款</span>
            </li>

            <li>
              <span class="l-title">收款</span>
              <div class="fr0">
                <span v-if="DetailList.debitAccountMerchantTwin == '支付宝'"><i
                  class="iconfont icon-pay-alipay"></i></span>
                <span v-else-if="DetailList.debitAccountMerchantTwin == '微信'"><i
                  class="iconfont icon-pay-wechat"></i></span>
                <span v-else><i class="iconfont icon-pay-bank"></i></span>
                {{DetailList.debitAccountMerchantTwin}}
              </div>
            </li>
            <li>
              <span class="l-title">姓名</span>
              <div class="fr0">{{DetailList.debitAccountNameTwin}}
                <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountNameTwin"
                   @click="copy">{{$t('transactionHome.copyBtn')}}</a>
              </div>
            </li>
            <li>
              <span class="l-title">卡号 : </span>
              <div class="fr0">
                <span class="">{{DetailList.debitAccountTwin}}</span>
                <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountTwin"
                   @click="copy">{{$t('transactionHome.copyBtn')}}</a>
              </div>
            </li>
            <li class="heightauto"
                v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'">
              <span class="l-title">收款二维码 : </span>
              <div class="qrcode-box">
                <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img"/>
                <span class="qrcode-tips copy-btn"></span>
              </div>
            </li>

          </ul>

          <ul class="morder-paymethod" v-if="DetailList.status =='45' ">
            <li class="cfx">
              <a href="alipay://">
                <span>  <i class="iconfont icon-pay-alipay"></i> 打开支付宝 </span>
              </a>
            </li>
            <li class="cfx">
              <a href="weixin://">
                <span>  <i class="iconfont icon-pay-wechat"></i> 打开微信 </span>
              </a>
            </li>
          </ul>
          <div class="btn-group" v-if="DetailList.status =='45' ">
            <p class="payment-tips">
              请在倒计时内完成付款,并点击下方的按钮,为了能快速完成交易,请尽量真实付款,切勿造假,一经发现将被禁用
            </p>
            <input type="button" class="btn btn-block btn-primary" @click="showConfirm=true" value="我已完成付款">
            <input type="button" class="btn btn-block btn-cancel gray-black" @click="cancelOrder"
                   v-if="DetailList.status =='45'"
                   value="取消订单">
            <input type="button" class="btn btn-block btn-primary"
                   v-if="DetailList.debit == userId || DetailList.status =='47'" value="提出反证">
          </div>
          <div v-if="DetailList.status =='47'">
            <p class="payment-tips">
              正在等待放币,在此期间您可以关闭该页面,卖家放币之后第一时间会有通知发送给您。
            </p>
            <p class="payed-txt">您已确认付款，请勿重复付款</p>
          </div>
        </div>

      </div>
      <!--payOrderStep==2-->
      <div v-if="payOrderStep==2" class="recharge-payinst">
        <div class="payinst-order">
          <p>根据卖家要求，您需要对该笔订单补充付款说明</p>
          <p class="cfx">
            <span class="order-title fl">订单号：</span>
            <span class="order-id fr">{{orderId}}</span>
          </p>
        </div>
        <div class="payord-group cfx">
          <label>您的付款方式</label>
          <get-bankcard :setBankcard="setBankcard" v-model="bindCardReset"
                        @selCardChange="selCardChange"></get-bankcard>
        </div>
        <div class="payinst-tips">
          请您提供真实的付款信息，否则您将可能无法顺利买入UET
        </div>
        <ul class="payord-form" v-show="showPayDetail">
          <li class="payord-group">
            <label>付款方式</label>
            <select class="payord-control" v-model="payOrderParam.creditAccountTypeTwin">
              <option value="">请选择付款方式</option>
              <option value="3">银行卡</option>
              <option value="1">支付宝</option>
              <option value="2">微信</option>
            </select>
          </li>
          <li class="payord-group" v-show="showPayBankName">
            <label>付款银行名称</label>
            <input class="payord-control" type="text" placeholder="银行名称"
                   v-model="payOrderParam.creditAccountMerchantTwin">
          </li>
          <li class="payord-group">
            <label>付款账号</label>
            <input class="payord-control" type="text" placeholder="银行卡号/支付宝/微信账号"
                   v-model="payOrderParam.creditAccountTwin">
          </li>
          <li class="payord-group posit-rel">
            <label>付款金额</label>
            <input class="payord-control" type="number" placeholder="请输入实际付款金额"
                   v-model="payOrderParam.creditAmountTwin">
            <span class="tips-info">CNY</span>
          </li>
          <li class="payord-group">
            <label>付款的户名</label>
            <input class="payord-control" type="text" placeholder="银行卡/支付宝/微信认证实名"
                   v-model="payOrderParam.creditAccountNameTwin">
          </li>
        </ul>
        <div class="payscreen-part">
          <p class="title">您的付款截图 <span>（选填项）</span></p>
          <upload-img :uploadImgSet="uploadImgSet" @gitPicUrl="gitPicUrl" :showClose="true"></upload-img>
        </div>
        <div class="paybtn-group">
          <input type="button" class="mobile-pubtn" value="提交" @click="payOrder"/>
        </div>
      </div>
    </div>
    <!--卖家-->
    <div class="cash-details0" v-if="DetailList.debit == userId">
      <m-header>我的卖币订单</m-header>
      <div class="payOrder_progress">
        <div class="progress_state">
          <img src="~images/startpay.png" alt="">
          <p class="defaultColor">等待对方付款</p>
          <span class="line" :class="{'lineColor':DetailList.status =='47'}"></span>
        </div>
        <div class="progress_state">
          <img src="~images/waitpay_pro.png" alt="">
          <p>等待我放币</p>
          <span class="line"></span>
        </div>
        <div class="progress_state">
          <img src="~images/trade_success_pro.png" alt="">
          <p>交易成功</p>
        </div>
      </div>
      <div class="trade-time-bar">
        <div>
          <img src="~images/order_time.png" alt="" class="order_time">
          <count-down v-if="DetailList.status !='61'"
                      :end-time="DetailList.intervalTime-DetailList.elapsedTime<=0 ? 0 : DetailList.intervalTime-DetailList.elapsedTime"
                      @callBack="countDownEnd" class="count_time">
          </count-down>
          <p class="pay_send" v-if="showDiscountInfo&couponValueStr>0">立即付款后预计获赠 {{couponValueStr}} UET</p>
        </div>
      </div>
      <div>
        <ul class="details-ul">
          <li>
            <p class="l-title">订单 :</p>
            <p class="order-id-li extra_order"><span class="order_info">{{orderId}}</span>
              <a href="javascript:void(0);" class="copy-btn-next copy-btn" :data-clipboard-text="orderId"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </p>
          </li>
          <li>
            <span class="l-title">交易数量 :</span>
            <span>
                     <span class="l-title">{{DetailList.debitAmount}} UET</span> <span class="equal_money"> ≈ ¥ {{(DetailList.debitAmount*0.01).toFixed(2)}} </span>
                 </span>
          </li>
        </ul>
        <ul class="details-ul pay-detail my-paymethod">
          <li>
              <span class="l-title">
                 <img src="~images/chatWith/buyer.png" alt="" class="character">
                {{DetailList.creditName}}</span>
            <div class="fr remind_info">如果收到款项不确定是否对方付的
              <p>请点下方跟对方会话</p></div>
          </li>
        </ul>
        <ul class="details-ul pay-detail">
          <li>
              <span class="l-title">
                 <img src="~images/chatWith/seller.png" alt="" class="character">
                我</span>
          </li>
          <li>
            <span class="l-title">收款</span>
            <div class="fr0">
              <span v-if="DetailList.debitAccountMerchantTwin == '支付宝'"><i class="iconfont icon-pay-alipay"></i></span>
              <span v-else-if="DetailList.debitAccountMerchantTwin == '微信'"><i
                class="iconfont icon-pay-wechat"></i></span>
              <span v-else><i class="iconfont icon-pay-bank"></i></span>
              {{DetailList.debitAccountMerchantTwin}}
            </div>
          </li>
          <li>
            <span class="l-title">姓名</span>
            <div class="fr0">{{DetailList.debitAccountNameTwin}}
              <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountNameTwin"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </div>
          </li>
          <li>
            <span class="l-title">卡号</span>
            <div class="fr0">
              <span class="">{{DetailList.debitAccountTwin}}</span>
              <a href="javascript:void(0);" class="copy-btn" :data-clipboard-text="DetailList.debitAccountTwin"
                 @click="copy">{{$t('transactionHome.copyBtn')}}</a>
            </div>
          </li>
          <li class="heightauto" v-if="DetailList.debitAccountMerchantTwin == '支付宝'">
            <span class="l-title">收款二维码 : </span>
            <div class="qrcode-box">
              <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img"/>
              <span class="qrcode-tips copy-btn"></span>
            </div>
          </li>
        </ul>
        <div class="payment-tips" v-if="DetailList.status=='47'">
          对方已付款,请及时查看账户,确认收款后立即点击下方按钮,放币给买家
        </div>
        <div class="payment-tips" v-else>
          请等待对方付款,等待时间在20分钟内,如果买家超时未付款,将为您匹配其他买家,请收到付款后立即给对方放币
        </div>
        <div class="btn-group" v-if="DetailList.status =='47'">
          <input type="button" class="btn btn-block btn-primary" @click="showConfirmPayment=true" value="释放UET">
          <input type="button" class="btn btn-block c-black" @click="createAppeal" value="没收到对方付款,点此申诉">
        </div>
        <div class="pic-box pic-box2" v-if="DetailList.creditProofUrlTwin">
          <p>买家付款截图:</p>
          <ul class="mpic-ul">
            <li v-for="proofImg in DetailList.creditProofUrlTwin||[]">
              <viewer :images="DetailList.creditProofUrlTwin">
                <img :src="proofImg" alt="买家付款截图">
              </viewer>
            </li>
          </ul>
          <p class="proof-twintip">提示：点击缩略图可放大查看</p>
        </div>
      </div>
    </div>

    <confirm-dialog v-model="showConfirm">
      <div slot="title">{{$t('orderDetailPay.alreadyPaidTitle')}}</div>
      <div slot="content" class="color-red">{{$t('orderDetailPay.alreadyPaidCont')}}</div>
      <div slot="leftBtn" class="confirm-btn-cancel bg-gray">{{$t('orderDetailPay.alreadyPaidCancelBtn')}}</div>
      <div slot="rightBtn" @click="payOrder" class="bg-blue">{{$t('orderDetailPay.alreadyPaidBtn')}}</div>
    </confirm-dialog>

    <confirm-dialog v-model="showConfirmPayment">
      <div slot="title">释放数额 {{DetailList.debitAmount}} UET</div>
      <div slot="content">
        <div class="dialog-content">{{$t('orderDetailPay.confirmPayTitle')}}</div>
        <div class="dialog-content color-red">{{$t('orderDetailPay.confirmPayCont')}}</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel bg-gray">{{$t('postPend.cancel')}}</div>
      <div slot="rightBtn" @click="payCompleted" class="bg-blue">确认释放UET</div>
    </confirm-dialog>

    <div class="Rongyunchatroom" @click="goChatroom()">
      <p>跟对方会话<span style="color: #ec3a4e" v-if="unreadCountUpdate>0">(未读{{unreadCountUpdate}})</span></p>
    </div>
    <transition name="toolSlideRight">
      <chat v-if="chatState" class="chatWindow"
            :detail="gameID"
            :debitNum="DetailList.debitAmount"
            @chatShow="chatStateUpdate"
      ></chat>
    </transition>
  </div>
</template>

<script>
  import mHeader from "components/m-header"
  import CountDown from 'components/countdown'
  import getBankcard from 'components/get-bankcard'
  import uploadImg from 'components/upload-img'
  import {generateTitle} from '@/util/i18n'
  import {chatWith, transaction} from 'api'
  import {mapGetters} from 'vuex'
  import Clipboard from 'clipboard';
  import chat from '../chatroom/chat';
  import confirmDialog from 'components/confirm';

  export default {
    data() {
      return {
        orderId: '',
        gameID: '',
        detailType: [
          {name: 'detail.buyUet', value: '订单详情'},
          {name: 'detail.saleUet', value: '申诉与仲裁'}
        ],
        DetailList: {},
        chatState: '',
        payOrderStep: 1,
        isOver: false,
        payOrderParam: {
          id: '',
          creditProofTypeTwin: 0,      // 卖方要求买方的付款证明
          creditProofUrlTwin: '',      // 买方支付证明截图，多个地址逗号分隔
          creditAccountTypeTwin: '',   // 买方法币账户类型
          creditAccountNameTwin: '',   // 买方法币账户名
          creditAccountTwin: '',       // 买方法币账户
          creditAccountMerchantTwin: '',   // 买方法币机构名
          creditAmountTwin: ''           // 买方实际支付金额
        },
        uploadImgSet: {
          maxUploadNum: 3,       // 最大上传数量，如果没有最大上传数量，传 -1
          uploadImgTips: 'component.uploadUpThree',  // 上传图片提示文字
          isShowUploadTip: true,             // 是否有上传文件提示信息
          maxWidth: 600,
          maxHeight: 600
        },
        setBankcard: {
          pleaseSelTitle: 'component.pleaseSelPayMet',         // 请选择标题文字
          addOption: [                                  // 添加的选项
            {type: -1, account: 'component.otherPayMethod'}
          ]
        },
        bindCardReset: false,
        selAccountTypeTwin: {},
        showPayDetail: false,
        showPayBankName: false,
        showConfirm: false,
        showConfirmPayment: false,
        mheadSet: {                      // 头部返回事件
          returnBtnFun: false,
          returnBtnEvent: 'returnBtnEvent'
        },
        countDownTime: 0,
        typeState: 1,
        buyTypeBuyBank: '',
        showDiscountInfo: false,
        couponValueStr: 0
      };
    },
    methods: {
      generateTitle,
      fetchData() {
        this.request = {
          orderId: this.orderId
        }
        transaction.getOrderx(this.request).then(res => {
          if (res.data == '' || res.data == null) {
            this.$router.push({name: 'mIndex'});
            return;
          }
          if (res.data.status == '61') {
            this.$router.replace({name: 'mOrderAppeal', params: {id: this.orderId}});
            return;
          }
          if (res.data.intervalTime - res.data.elapsedTime <= 0) {
            toast('您好订单已过期');
            this.$router.back();
            return;
          }
          this.DetailList = res.data;
          this.fetchDiscountNum()
          if (res.data.creditProofUrlTwin && res.data.creditProofUrlTwin.length > 1) {
            this.DetailList.creditProofUrlTwin = res.data.creditProofUrlTwin.split(',');
          }

          if (res.code == '10000') {
            if (this.DetailList.credit == this.userId) {
              toast('您已下单成功，请进入列表查询');
            } else {
              if (this.DetailList.status == '47' || this.DetailList.status == '48') {
                toast('对方已确认付款，请查收是否到账');
              }
              // toast('对方已确认付款，请查收是否到账');
            }

          }
        }).catch(err => {
          toast(err.message);
        });

      },
      fetchDiscountNum() {
        const request = {
          'orderId': this.orderId,
          'traderType': this.DetailList.credit == this.userId ? 1 : 2
        }
        console.log(request,'可是敬爱的萨达')
        transaction.getCouponAmount(request).then((res) => {
          console.log(res,'路上看见的萨达')
          if (res.code == '10000') {
            if (res.data.isAward) {
              this.showDiscountInfo = true;
              this.couponValueStr = res.data.couponValueStr
              if (this.showDiscountInfo) {
                setTimeout(() => {
                  this.fetchDiscountNum()
                }, 10000)
              }
            }
          } else {
            toast(res.message)
          }
        })


      },

      cancelOrder() {
        this.loading = true;
        this.request = {
          orderId: this.orderId
        }
        transaction.cancelOrder(this.request).then(res => {
          this.loading = false;
          if (res.code == '10000') {
            toast('您已取消，请勿重复操作');
            Vue.$global.bus.$emit('update:tranList');
            this.$router.push({name: 'mTranRecord'});
          } else {
            toast(res.message);
          }
        }).catch(err => {
          toast(err.message);
        });
        this.loading = false;
      },
      selCardChange(selCard) {
        this.selAccountTypeTwin = selCard;
        if (this.selAccountTypeTwin && JSON.stringify(this.selAccountTypeTwin) != "{}" && this.selAccountTypeTwin.type == -1) {
          this.showPayDetail = true;
        } else {
          this.showPayDetail = false;
        }
      },
      gitPicUrl(picUrlArr) {
        this.payOrderParam.creditProofUrlTwin = picUrlArr.join(',');
      },
      checkPayDetail() {
        if (this.payOrderParam.creditAccountTypeTwin == "" || !this.payOrderParam.creditAccountTypeTwin) {
          toast("请选择付款方式");
        } else if (this.payOrderParam.creditAccountTypeTwin == 3 && (this.payOrderParam.creditAccountMerchantTwin == "" || !this.payOrderParam.creditAccountMerchantTwin)) {
          toast("请输入付款银行名称");
        } else if (this.payOrderParam.creditAccountTwin == "" || !this.payOrderParam.creditAccountTwin) {
          toast("请输入付款账号");
        } else if (this.payOrderParam.creditAmountTwin == "" || !this.payOrderParam.creditAmountTwin) {
          toast("请输入付款金额");
        } else if (this.payOrderParam.creditAccountNameTwin == "" || !this.payOrderParam.creditAccountNameTwin) {
          toast("请输入付款的户名");
        } else {
          return true;
        }
      },
      payOrder() {
        this.showConfirm = false;
        if (this.DetailList.creditProofTypeTwin == 1 && this.DetailList.creditProofStatusTwin == 0) {
          if (this.payOrderStep == 1) {
            this.payOrderStep = 2;
            return;
          } else if (this.payOrderStep == 2) {
            if (!this.selAccountTypeTwin || JSON.stringify(this.selAccountTypeTwin) == "{}") {
              toast('请选择您的付款方式');
              return;
            }
            if (this.selAccountTypeTwin.type == -1) {
              if (!this.checkPayDetail()) return;
              if (this.payOrderParam.creditAccountTypeTwin == 1) {
                this.buyTypeBuyBank = '支付宝';
              } else if (this.payOrderParam.creditAccountTypeTwin == 2) {
                this.buyTypeBuyBank = '微信';
              } else {
                this.buyTypeBuyBank = this.payOrderParam.creditAccountMerchantTwin;
              }
            } else {
              if (this.selAccountTypeTwin.type == 1) {
                this.buyTypeBuyBank = '支付宝';
              } else if (this.selAccountTypeTwin.type == 2) {
                this.buyTypeBuyBank = '微信';
              } else {
                this.buyTypeBuyBank = this.selAccountTypeTwin.bank;
              }

              this.payOrderParam.creditAccountTypeTwin = this.selAccountTypeTwin.type;
              this.payOrderParam.creditAccountNameTwin = this.selAccountTypeTwin.name;
              this.payOrderParam.creditAccountTwin = this.selAccountTypeTwin.account;
              this.payOrderParam.creditAmountTwin = this.DetailList.debitAmountTwin;
            }
          }
        }

        this.payOrderParam.creditAccountMerchantTwin = this.buyTypeBuyBank;
        this.payOrderParam.id = this.orderId;
        this.payOrderParam.creditProofTypeTwin = this.DetailList.creditProofTypeTwin;
        transaction.payOrderV2(this.payOrderParam).then(res => {
          if (res.code == '10000') {
            toast('您已确认付款，请勿重复付款');
            this.fetchData();
            this.payOrderStep = 1;
          } else {
            toast(res.message);
          }

        }).catch(err => {
          toast(err.message);
        });
      },
      returnBtnEvent() {
        if (this.payOrderStep == 2) {
          this.payOrderStep = 1;
        } else {
          this.mheadSet.returnBtnFun = true;
        }

      },
      chatStateUpdate() {
        this.chatState = false
      },
      payCompleted() {
        this.showConfirmPayment = false;
        this.request = {
          orderId: this.orderId
        }
        transaction.payCompleted(this.request).then(res => {
          this.loading = false;
          if (res.code == '10000') {
            Vue.$global.bus.$emit('update:balance');
            toast('您已确认收款，请勿重复操作');
            this.$router.push({name: 'mOrderOver', params: {id: this.orderId}});
            /*从该入口进去需要弹窗*/
            this.$store.commit('GET_ISNEEDCOUPON', true)
          } else {
            toast(res.message)
          }
          this.typeState = 2
        }).catch(err => {
          toast(err.message);
        });
        this.loading = false;
      },
      createAppeal() {
        this.loading = true;
        this.request = {
          orderId: this.orderId,
          userId: this.userId,
          type: 2
        }
        transaction.createAppeal(this.request).then(res => {
          this.loading = false;
          if (res.code == '10000') {
            toast('申诉创建成功');
            this.$router.push({name: 'mOrderAppeal', params: {id: this.orderId}});
          } else {
            toast(res.message);
          }
        }).catch(err => {
          toast(err.message);
        });
        this.loading = false;
      },
      goChatroom() {
        if (!this.connectState) {
          toast('聊天功能正在初始化,请稍后片刻!')
          return
        }
        //先获取订单号
        this.gameID = this.$route.params.id;
        //
        let params = {
          groupId: this.gameID,
          founderId: this.$store.state.userData.userId,
          type: this.typeState,
          founderNickname: this.$store.state.userData.nickname
        }
        chatWith.createChatGroup(params).then(res => {
          if (res.code === 10000) {
            this.chatState = true
            this.$store.commit('GET_HISTORYSTATE', 3)
          } else {
            toast(res.message)
          }
        }).catch(res => {
          toast(res.message)
        })
      },
      countDownEnd() {
        this.fetchData();
      },
      copy() {
        var clipboard = new Clipboard('.copy-btn')
        clipboard.on('success', e => {
          toast('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        })
      }
    },
    created() {
      if (this.$route.params.id) {
        this.orderId = this.$route.params.id;
        this.fetchData()

      }
    },

    watch: {
      "$route"(val) {
        this.orderId = val.params.id;
        this.fetchData();
      },
      "payOrderParam.creditAccountTypeTwin"(val) {
        if (val == 3) {
          this.showPayBankName = true;
        } else {
          this.showPayBankName = false;
        }
      },
    },
    computed: {
      ...mapGetters(["userData", "islogin", "userId", 'unreadCount', 'connectState']),
      unreadCountUpdate() {
        if (this.unreadCount < 0) {
          return 0
        } else if (this.unreadCount > 99) {
          return 99
        } else {
          return this.unreadCount
        }
      }
    },

    components: {
      mHeader,
      getBankcard,
      uploadImg,
      CountDown,
      chat,
      confirmDialog
    }
  };

</script>

<style lang="scss">
  @import "~assets/scss/mobile";

  .recharge-payinst {
    .payinst-order {
      background: $white;
      padding: r(10);
      margin-bottom: r(9);
      p {
        line-height: r(30);
        @include f(15px);
        color: $font-color;
        span {
          display: block;
        }
        .order-id {
          color: #787876;
          line-height: r(28);
          word-break: break-all;
          width: 80%;
        }
      }
    }
    .payord-group {
      background: $white;
      line-height: r(44);
      padding: 0 r(10);
      @include f(15px);
      color: $font-color;
      display: flex;
      p.bind-card-part {
        flex-grow: 1;
        width: auto;
        display: flex;
      }
      .payord-control, .my-input {
        height: r(44);
        line-height: r(44);
        width: auto;
        display: inline-block;
        @include f(15px);
        color: $font-color;
        padding: 0 r(30) 0 r(10);
        border: none;
        outline: none;
        flex-grow: 1;
      }
      .tips-info {
        position: absolute;
        top: 0;
        right: r(10);
        display: block;
      }
    }
    .payord-form {
      margin-bottom: r(9);
      li {
        border-bottom: 1px solid #EBEBEB;
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .payinst-tips {
      padding: r(6) r(10);
      @include f(15px);
      color: #8F8F8F;
      line-height: r(30);
    }
    .payscreen-part {
      background: $white;
      @include f(15px);
      color: $font-color;
      margin-bottom: r(20);
      .title {
        padding: 0 r(10);
        line-height: r(36);
        border-bottom: 1px solid #F5F5F5;
        span {
          color: #FF0000;
        }
      }
    }
    .paybtn-group {
      padding: 0 r(10);
    }
  }

  .payOrder_progress {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    .progress_state {
      padding-top: r(20);
      width: 33%;
      text-align: center;
      position: relative;
      img {
        width: r(33);
        height: r(30);
      }
      p {
        font-size: r(16);
        color: #333;
      }
      .line {
        position: absolute;
        right: r(-15);
        top: r(35);
        display: inline-block;
        width: r(40);
        height: r(1);
        background-color: #D8D8D8;
        &.lineColor {
          background-color: #3573FA;
        }
      }
      .defaultColor {
        color: #3573FA;
      }
    }
  }

  .morder-page {
    padding-bottom: r(50);
  }

  .cas-main {
    background: #F5F5F5;
  }

  .order-id-li {
    width: 100%;
    word-break: break-all;
    color: #333333;
  }

  .c-red, .red {
    color: red;
  }

  .c-blue {
    color: #5087FF;
  }

  .c-orange {
    color: orange;
  }

  .c-black {
    color: #333 !important;
  }

  .trade-time-bar {
    background: #fff;
    padding: r(10) r(15);
    text-align: center;
    border-bottom: 1px solid #d8d8d8;
    height: auto;
    .pay_send {
      font-size: r(16);
      color: #ec3a4e;
    }
    .order_time {
      width: r(17);
      height: r(17);
      vertical-align: r(1);
    }
    .count_time {
      color: #ec3a4e;
      font-size: r(16);
    }
  }

  .details-ul {
    border-bottom: 1px solid #d8d8d8;
    li {
      background: #fff;
      min-height: r(35);
      padding: r(8) r(15);
      font-size: f(16px);
      color: #8f8f8f;
      overflow: hidden;
      position: relative;
      line-height: r(25);
      &.heightauto {
        height: auto;
      }

      .copy-btn {
        position: absolute;
        top: r(7);
        right: r(15);
        color: #5087ff;
      }
      .qrcode-img {
        width: r(140);
        height: r(140);
        margin-left: r(10);
      }
      .fr0 {
        display: inline-block;
        padding: 0 0 0 r(10);
      }
      .qrcode-tips {
        display: inline-block;
        word-break: break-all;
      }
      .l-title {
        display: inline-block;
        color: #333;
        .character {
          width: r(30);
          height: r(30);
          vertical-align: - r(8);
        }
      }
      .remind_info {
        font-size: r(12);
        color: #ec3a4e;
        vertical-align: - r(8);
        padding-top: r(3);
        text-align: right;
      }
      .equal_money {
        color: red;
        font-size: r(16);
      }
    }
  }

  .morder-paymethod {
    display: flex;
    li {
      text-align: center;
      width: 50%;
      line-height: r(45);
      background: $white;
      padding: 0 r(15);
      @include f(15px);
      color: $font-color;
      border-right: r(1) solid #F5F5F5;
      &:last-child {
        border-right: none;
      }

      a {
        display: block;
      }
      i.iconfont {
        @include f(20px);
        margin-right: r(10);
      }
      span.iconfont {
        display: block;
        float: right;
        @include f(18px);
        color: #000000;
      }

    }
  }

  .btn-group {
    padding: r(5) r(15) r(10);
    .btn {
      display: inline-block;
      color: #5087ff;
      border-radius: 4px;
      height: r(45);
      line-height: r(45);
      padding: 0 r(20);
      margin: r(10) 0 0 0;
      cursor: pointer;
      @include f(18px);
      text-align: center;
    }
    .btn-primary {
      border: 1px solid #5087ff;
      background: #5087ff;
      color: #fff;
    }
    .btn-cancel {
      color: #333333;
    }
    .btn-block {
      display: block;
      width: 100%;
    }
    .btn-gray {
      background: #E4E4E4;
      color: #787876;
    }
  }

  .countdown-line {
    line-height: r(45);
    background: #FFFFFF;
    margin-top: r(8);
    color: #FF0000;
    padding: 0 r(5);
    @include f(15px);
    text-align: center;
  }

  .payment-tips {
    @include f(15px);
    line-height: r(30);
    margin: r(13) 0;
    color: #ec3a4e;
    padding: r(0) r(15);
    span {
      color: #FF0000;
    }
  }

  .icon-pay-bank {
    color: red;
  }

  .icon-pay-wechat {
    color: #14CA39;
  }

  .icon-pay-alipay {
    color: #03A9F3;
  }

  .payed-txt {
    padding: r(10) 0;
    text-align: center;
    color: #5087ff;
  }

  .pic-box {
    padding: 0 r(15) r(30) r(15);
    .proof-twintip {
      color: #8F8F8F;
    }
  }

  .mpic-ul {
    padding: r(10) 0;
    overflow: hidden;
    li {
      display: block;
      margin: 5px 1%;
      width: 31%;
      float: left;

      div {
        height: 100px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .Rongyunchatroom {
    width: 100%;
    height: r(50);
    position: fixed;
    right: 0;
    bottom: 0;
    background-color: #fff;
    text-align: center;
    line-height: r(50);
    img {
      padding-top: r(9);
      display: block;
      width: r(20);
      height: r(20);
      margin: 0 auto;
    }
    .chatroom_num {
      font-size: r(12);
      color: #4982FF;
      line-height: r(12);
      padding-top: r(3);
    }
  }

  .toolSlideRight-enter-active, .toolSlideRight-leave-active {
    transition: transform .5s;
  }

  .toolSlideRight-enter {
    transform: translateX(100%);
  }

  .toolSlideRight-leave-to {
    transform: translateX(-100%);
  }

  .chatWindow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: #F5F5F5;
  }

  .extra_order {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .order_info {
      flex: 1;
    }
    .copy-btn-next {
      position: relative !important;
      color: #5087ff;
      top: auto !important;
      left: auto !important;
      right: auto !important;
    }
  }

</style>
