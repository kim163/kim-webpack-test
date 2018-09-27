<template>
  <div class="transell-main header-padding">
    <nav-menu></nav-menu>
    <bread-crumbs :bread-list="breadList"></bread-crumbs>
    <div class="section detail-content">
      <div class="container min-width" v-if="DetailList">
        <div class="row00 detail-box">
          <div class="detail-title">
            <span v-if="isCredit" class="title-btn btn-primary">买入</span>
            <span v-else-if="isDebit" class="title-btn btn-sell">卖出</span>
            <span class="order-num">
              订单号： {{orderId}}
            </span>
          </div>
          <div class="detail-in cfx">
            <div class="col-33">
              <h3 v-if="isCredit" class="h3">卖方 : {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})</h3>
              <h3 v-else-if="isDebit" class="h3">买方 : {{DetailList.creditName}}
                ({{DetailList.creditAccountNameTwin}})</h3>
              <ul class="details-data">
                <li>
                  <p>交易金额:</p>
                  <input type="text" class="red" readonly :value="DetailList.debitAmountTwin+' CNY'">
                </li>
                <li>
                  <p>交易数量:</p>
                  <input type="text" readonly :value="DetailList.debitAmount+' UET'">
                </li>
                <li>
                  <p>交易单价:</p>
                  <input type="text" readonly value="0.01 CNY">
                </li>
                <li>
                  <p>订单时间:</p>
                  <input type="text" readonly :value="DetailList.createtime | Date('yyyy-MM-dd hh:mm:ss')">
                </li>
              </ul>
            </div>
            <div v-if="isCredit" class="col-33">
              <h4 class="bank-title">卖家收款方式 : </h4>
              <div class="alipay-box"
                   v-if="DetailList.debitAccountMerchantTwin == '支付宝' || DetailList.debitAccountMerchantTwin == '微信'">
                <p class="alipay-box-title">
                  <i class="i-alipay" v-if="DetailList.debitAccountMerchantTwin == '支付宝'"></i>
                  <i class="i-wechat" v-else-if="DetailList.debitAccountMerchantTwin == '微信'"></i>
                  {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})<br> {{DetailList.debitAccountTwin}}
                </p>
                <div class="alipay-qrcode">
                  <img src="~images/qrcode.jpg" :src="DetailList.debitAccountQrCodeUrlTwin" class="qrcode-img"/>
                  <p>打开 {{DetailList.debitAccountMerchantTwin}} [扫一扫] </p>
                </div>
              </div>

              <div class="alipay-box" v-else>
                <p class="alipay-box-title text-center bank-title">
                  <i class="i-bank" :class="DetailList.debitAccountMerchantTwin | bankIcon"></i>{{DetailList.debitAccountMerchantTwin}}
                </p>
                <div class="alipay-qrcode text-left bank-txt-box">
                  <div class="bank-list-p">
                    <h3>银行卡号:</h3>
                    {{DetailList.debitAccountTwin}}
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.debitAccountTwin)">复制卡号</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>开户姓名：</h3>
                    {{DetailList.debitName}} ({{DetailList.debitAccountNameTwin}})
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.debitAccountNameTwin)">复制姓名</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>银行类别：</h3>
                    {{DetailList.debitAccountMerchantTwin}} (储蓄卡)<br>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="isDebit" class="col-33">
              <h4 class="bank-title">买家付款方式 : </h4>
              <div class="alipay-box"
                   v-if="DetailList.creditAccountMerchantTwin == '支付宝' || DetailList.creditAccountMerchantTwin == '微信'">
                <p class="alipay-box-title">
                  <i class="i-alipay" v-if="DetailList.creditAccountMerchantTwin == '支付宝'"></i>
                  <i class="i-wechat" v-else-if="DetailList.creditAccountMerchantTwin == '微信'"></i>
                  {{DetailList.creditName}}（{{DetailList.creditAccountNameTwin}}）<br>{{DetailList.creditAccountTwin}}
                </p>
                <div class="alipay-qrcode">
                  <img src="~images/qrcode.jpg" :src="DetailList.creditAccountQrCodeUrlTwin" class="qrcode-img"/>
                  <p>打开 {{DetailList.creditAccountMerchantTwin}} [扫一扫] </p>
                </div>
              </div>

              <div class="alipay-box" v-else>
                <p class="alipay-box-title text-center bank-title">
                  <i class="i-bank" :class="DetailList.creditAccountMerchantTwin | bankIcon"></i>{{DetailList.creditAccountMerchantTwin}}
                </p>
                <div class="alipay-qrcode text-left bank-txt-box">
                  <div class="bank-list-p">
                    <h3>银行卡号:</h3>
                    {{DetailList.creditAccountTwin}}
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.creditAccountTwin)">复制卡号</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>开户姓名：</h3>
                    {{DetailList.creditName}}（{{DetailList.creditAccountNameTwin}}）
                    <button class="copyBtn btn-copy" @click="copystr(DetailList.creditAccountNameTwin)">复制姓名</button>
                    <br>
                  </div>
                  <div class="bank-list-p">
                    <h3>银行类别：</h3>
                    {{DetailList.creditAccountMerchantTwin}} (储蓄卡)<br>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-33">
              <div class="order-time">
                <p class="red order-status-title">
                  <span v-if="DetailList.status =='45'">等待付款</span>
                  <span v-else-if="DetailList.status =='47'">等待释放UET</span>
                  <span v-else-if="DetailList.status =='61'">申诉锁定</span>
                  <span v-else-if="DetailList.status =='41'">订单已发布</span>
                  <span v-else-if="DetailList.status =='43'">订单已下架</span>
                  <span v-else>
                      {{DetailList.status}}
                    </span>
                </p>
                <p class="text-center time-stame">
                  <span v-if="DetailList.status =='45' && isCredit">请在倒计时结束前完成付款</span>
                  <span v-else-if="DetailList.status =='47' && isCredit">等待卖家释放UET倒计时</span>
                  <span v-else-if="DetailList.status =='45' && isDebit">等待买家付款倒计时</span>
                  <span v-else-if="DetailList.status =='47' && isDebit">释放UET倒计时</span>

                  <count-down v-if="DetailList.status !='61'"
                              :end-time="DetailList.intervalTime-DetailList.elapsedTime<=0 ? 0 : DetailList.intervalTime-DetailList.elapsedTime "
                              @callBack="countDownEnd">
                  </count-down>

                </p>
                <!--卖家优惠 添加对应信息-->
                <p class="pay_send" v-if="showDiscountInfo&couponValueStr>0&DetailList.status =='45' && isDebit">立即付款后预计获赠 <span>{{couponValueStr}} UET</span></p>
                <div class="btn-group" v-if="DetailList.status =='45' && isCredit">
                  <input type="button" class="btn btn-block btn-normal" @click="showConfirm=true" value="我已完成付款">
                  <p class="pay_send" v-if="showDiscountInfo&couponValueStr>0">立即付款后预计获赠 <span>{{couponValueStr}} UET</span></p>
                  <p class="payment-tips">
                    警告：为了您能快速完成交易，请尽量使用 <span class="red">您所绑定的银行卡/支付宝付款。</span>付款成功后，点击“我已完成付款”。
                  </p>
                  <input type="button" class="btn btn-block btn-orange" @click="cancelOrder" value="取消订单">
                  <p class="text-center">
                    <span class="red">如果您已向卖家付款，千万不要取消</span><br>
                    取消规则：买方当日连续取消2笔，或累计取消6笔，将限制交易24小时。
                  </p>
                </div>
                <div v-if="DetailList.status =='47' && isCredit">
                  <p class="pay_send" v-if="showDiscountInfo&couponValueStr>0">立即付款后预计获赠 <span>{{couponValueStr}} UET</span></p>
                  <p class="text-center red">您已确认付款，请勿重复付款</p>
                </div>
                <div class="btn-group" v-if="DetailList.status =='47' && isDebit">
                  <input type="button" class="btn btn-block btn-normal" @click="showConfirmPayment=true" value="释放UET">
                  <p class="pay_send" v-if="showDiscountInfo&couponValueStr>0">立即付款后预计获赠 <span>{{couponValueStr}} UET</span></p>
                  <p class="payment-tips">
                    确认收款前，请务必检查是否有收到买方付款
                  </p>
                  <input type="button" class="btn btn-block btn-orange" @click="createAppeal" value="我要申诉">
                  <p class="text-center">
                    申诉规则：申诉后，该笔订单将会被锁定。若仲裁结果为买方获胜，系统将会自动释放该笔订单的UET给买方。若仲裁结果为您获胜，则该笔订单交易失败。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-tips" v-if="isCredit">
            <p class="tips-title">温馨提示</p>
            <p>1.您的汇款将直接进入卖方账户，交易过程中卖方出售的UET由平台托管保护。<br>
              2.请在规定时间内完成付款，并务必点击“我已完成付款”，卖方确认收款后，系统会将UET划转到您的账户。</p>
          </div>
          <div class="detail-tips detail-tips-sell" v-if="DetailList.creditProofUrlTwin && isDebit">
            <p class="tips-title0">买家付款截图:</p>
            <ul class="pic-ul">
              <li v-for="proofImg in DetailList.creditProofUrlTwin||[]">
                <viewer :images="DetailList.creditProofUrlTwin">
                  <img :src="proofImg" alt="买家付款截图">
                </viewer>
              </li>
            </ul>
            <span class="fl friend-txt">提示：点击缩略图可放大查看</span>
          </div>
          <div class="detail-tips" v-if="isDebit">
            <p class="tips-title tips-title-i">温馨提示</p>
            <p>1.买方的汇款将直接进入您的账户，交易过程中您出售的UET由平台托管保护。<br>
              2.您在确认收款后，系统会将UET划转到您的账户，如果您申诉，订单将会被锁定。</p>
          </div>
        </div>

      </div>
      <div class="container min-width" v-else>
        <no-data-tip></no-data-tip>
      </div>
    </div>

    <confirm-dialog v-model="showConfirm" :is-pc="true">
      <div slot="title">{{$t('orderDetailPay.alreadyPaidTitle')}}</div>
      <div slot="content" class="color-red">{{$t('orderDetailPay.alreadyPaidCont')}}</div>
      <div slot="leftBtn" class="confirm-btn-cancel bg-gray">{{$t('orderDetailPay.alreadyPaidCancelBtn')}}</div>
      <div slot="rightBtn" @click="payOrder" class="bg-blue">{{$t('orderDetailPay.alreadyPaidBtn')}}</div>
    </confirm-dialog>

    <confirm-dialog v-model="showConfirmPayment" :is-pc="true">
      <div slot="title">释放数额 {{DetailList.debitAmount}} UET</div>
      <div slot="content">
        <div class="dialog-content">{{$t('orderDetailPay.confirmPayTitle')}}</div>
        <div class="dialog-content color-red">{{$t('orderDetailPay.confirmPayCont')}}</div>
      </div>
      <div slot="leftBtn" class="confirm-btn-cancel bg-gray">{{$t('postPend.cancel')}}</div>
      <div slot="rightBtn" @click="payCompleted" class="bg-blue">{{$t('orderDetailPay.confirmPayBtn')}}</div>
    </confirm-dialog>

    <div class="modal fade in" v-if="payOrderStep==2 && isCredit">
      <div class="modal-dialog popup modal-payorder">
        <div type="button" class="close close-w" @click="payOrderStep=1">
          <i class="iconfont icon-close"></i>
        </div>

        <div class="pop-con">
          <h2 class="alert-title txt-imcenter">充值订单</h2>
          <div class="recharge-payinst">

            <div class="payinst-order">
              <p>根据卖家要求，您需要对该笔订单补充付款说明</p>
              <p class="cfx">
                <span class="order-title fl">订单号：</span>
                <span class="order-id fr">{{orderId}}</span>
              </p>
            </div>
            <div class="payord-group cfx border-bot pcdetail-paymethod">
              <label>您的付款方式</label>
              <get-bankcard :setBankcard="setBankcard" v-model="bindCardReset" @selCardChange="selCardChange"></get-bankcard>
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
              <input type="button" class="btn cancel" value="取消" @click="payOrderStep=1"/>
              <input type="button" class="btn paycomfirm" value="提交" @click="payOrder"/>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="chatRoom" @click="showChatList()" v-if="chatOnline">
      <div class="chatRoom_content">
        <span class="iconfont icon-tab-talk"></span> 在线聊天
        <div class="unread-count" v-show="unreadCountUpdate>0" :class="{'upMax':unreadCountUpdate>99}">{{unreadCountUpdate}}
        <span class="add_symbol" v-show="unreadCountUpdate>99">+</span>
        </div>
      </div>
    </div>
    <div v-if="isPCstate" style="position: relative">
      <chatList :isPC="isPCstate" v-if="openListState" @closeChatroom="iscloseChatroom"></chatList>
      <chat
        class="chatWindow"
        v-if="chatState"
        :detail="orderId"
        :debitNum="DetailList.debitAmount"
        :historyState="DetailList.historyState"
        @chatShow="chatStateUpdate"
        :isPc="isPCstate"
        @openList="openListUpdate"
        @closeChatroom="iscloseChatroom"
      ></chat>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import navMenu from 'components/nav';
  import breadCrumbs from 'components/bread-crumbs';
  import vFooter from 'components/footer';
  import CountDown from 'components/countdown'
  import getBankcard from 'components/get-bankcard'
  import uploadImg from 'components/upload-img'
  import {generateTitle} from '@/util/i18n'
  import {transaction, chatWith} from 'api'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import NoDataTip from 'components/no-data-tip'
  import confirmDialog from 'components/confirm'
  import chatList from '../../../views/mobile/chatroom/chat-list'
  import chat from '../../../views/mobile/chatroom/chat'

  export default {
    data() {
      return {
        breadList: [
          {
            urlName: 'transaction',
            name: 'navbar.tradingHall'
          },
          {
            urlName: 'tranRecord',
            name: 'transactionHome.orderRecord'
          },
          {
            urlName: 'orderDetail',
            name: 'transactionRecord.orderDetails'
          }
        ],
        orderId: '',
        isPCstate: '',
        DetailList: {},
        chatState: '',
        payOrderStep: 1,
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
        bindCardReset:false,
        selAccountTypeTwin: {},
        showPayDetail: false,
        showPayBankName: false,
        isCredit: false,
        isDebit: false,
        showConfirm: false,
        showConfirmPayment: false,
        typeState: 1,
        openListState: false,
        chatOnline:true,
        buyTypeBuyBank: '',
        couponValueStr: 0,
        showDiscountInfo:false
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
            this.$router.push({name: 'transaction'});
            return;
          }
          if (res.data.status == '61') {
            this.$router.push({name: 'orderDetailAppeal', params: {id: this.orderId}});
            return;
          }
          if (res.data.intervalTime - res.data.elapsedTime <= 0) {
            toast('您好订单已过期');
            this.$router.back();
            return;
          }
          this.DetailList = res.data;
          this.fetchDiscountNum()
          if (this.DetailList.credit == this.userId) {
            this.isCredit = true;
          } else if (this.DetailList.debit == this.userId) {
            this.isDebit = true;
          }

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
      chatStateUpdate() {
        this.chatState = false
      },
      fetchDiscountNum(){
        const request={
          'orderId':this.orderId,
          'traderType': this.DetailList.credit == this.userId ? 1:2
        }
        transaction.getCouponAmount(request).then((res) => {
          console.log(res,'手机打开')
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
      openListUpdate() {
        this.openListState = true
        this.chatState = false
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
            this.$router.push({name: 'tranRecord'});
          }else {
            toast(res.message);
          }
        }).catch(err => {
          toast(err.message);
        });
        this.loading = false;
      },
      iscloseChatroom(){
        this.isPCstate = false
        this.chatOnline = true
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
              } else{
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
          }else {
            toast(res.message);
          }

        }).catch(err => {
          toast(err.message);
        });
      },
      showChatList() {
        if (!this.connectState) {
          toast('聊天功能正在初始化,请稍后片刻！')
          return
        }
        let params = {
          groupId: this.orderId,
          founderId: this.userData.userId,
          type: this.typeState,
          founderNickname: this.userData.nickname
        }
        chatWith.createChatGroup(params).then(res => {
          if (res.code === 10000) {
            this.$store.commit('GET_HISTORYSTATE',3)
            this.isPCstate = !this.isPCstate
            this.chatOnline = false
            this.chatState = true
          } else {
            toast(res.message)
          }
        }).catch(res => {
          toast(res.message)
        })
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
            this.$router.push({name: 'orderDetailOver', params: {id: this.orderId}});
          } else {
            toast(res.message)
          }

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
            this.$router.push({name: 'orderDetailAppeal', params: {id: this.orderId}});
          }else {
            toast(res.message);
          }
        }).catch(err => {
          toast(err.message);
        });
        this.loading = false;
      },
      countDownEnd() {
        this.fetchData();
      },
      copystr(text) {
        text.$copy();
        toast(this.$t('transactionHome.successCopy'));
      }

    },
    created() {
      if (this.$route.params.id) {
        this.orderId = this.$route.params.id;
        this.fetchData();
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
      }
    },
    computed: {
      ...mapGetters(["userData", "islogin", "userId", 'connectState','unreadCount']),
      unreadCountUpdate(){
        if(this.unreadCount<0){
          return 0
        }else if(this.unreadCount>99){
          return 99
        }else {
          return this.unreadCount
        }
      }
    },
    components: {
      navMenu, breadCrumbs, vFooter, NoDataTip, getBankcard, uploadImg, CountDown, confirmDialog, chatList, chat
    },
    filters: {
      bankIcon: function (value) {
        if (!value) return 'icbc';
        if (value == '工商银行') {
          return 'icbc';
        }
        if (value == '招商银行') {
          return 'cmbc';
        }
        //value = value.toString()
        return value
      }
    },
    beforeRouteEnter(to,from,next){
      if(from.name === 'orderDetailAppeal'){
        next({name:'tranRecord'})
      }else{
        next()
      }
    }
  };
</script>

<style lang="scss" scoped>
  .txt-imcenter {
    text-align: center !important;
  }

  div.pop-con {
    padding-bottom: 10px;
  }

  .order-status-title {
    text-align: center;
    span {
      font-size: 18px;
    }
  }

  .recharge-payinst {
    padding: 0 40px;
    .payinst-order {
      background: #FFFFFF;
      padding: 10px 10px 0;
      p {
        line-height: 30px;
        font-size: 15px;
        color: #333333;
        span {
          display: block;
        }
        .order-id {
          color: #787876;
          line-height: 20px;
          word-break: break-all;
          width: 80%;
        }
      }
    }
    .payord-group {
      background: #FFFFFF;
      line-height: 40px;
      padding: 0 10px;
      font-size: 15px;
      color: #333333;
      display: flex;
      p.bind-card-part{
        flex-grow: 1;
        width: auto;
        /*display: flex;*/
      }
      .payord-control,.my-input {
        height: 40px;
        line-height: 40px;
        width: auto;
        display: inline-block;
        font-size: 15px;
        color: #333333;
        padding: 0 30px 0 10px;
        border: none;
        outline: none;
        flex-grow: 1;
      }
      .tips-info {
        position: absolute;
        top: 0;
        right: 10px;
        display: block;
      }
    }
    .border-bot {
      border-bottom: 1px solid #EBEBEB;
    }
    .payord-form {
      margin-bottom: 9px;
      li {
        border-bottom: 1px solid #EBEBEB;
      }
    }
    .payinst-tips {
      padding: 0 10px;
      font-size: 15px;
      color: #8F8F8F;
      line-height: 30px;
    }
    .payscreen-part {
      background: #FFFFFF;
      font-size: 15px;
      color: #333333;
      .title {
        padding: 0 10px;
        line-height: 36px;
        span {
          color: #FF0000;
        }
      }
      .upload-imgpart {
        padding: 0 10px;
      }
    }
    .paybtn-group {
      padding: 0 10px;
      .btn {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width: 48%;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        font-size: 15px;
        color: #333333;
        &:first-child {
          margin-right: 2%;
        }
      }
      .cancel:hover {
        background: #eeeeee;
      }
      .paycomfirm {
        background: #619eff;
        border: 1px solid #619eff;
        color: #fff;
        &:hover {
          background: rgb(255, 166, 60);
          border: 1px solid rgb(255, 166, 60);
        }
      }
    }
  }
  .pay_send{
    font-size: 14px;
    color: #333;
    text-align: center;
    span{
      font-size: 14px;
      color: #ff1100;
    }
  }
  .detail-content {
    min-height: 300px;
    margin: 30px 0;
  }

  .detail-box {
    border: 1px solid #d4d4d4;
    input {
      height: 40px;
      line-height: 40px;
      border: 1px solid #d4d4d4;
      width: 100%;
      padding: 0 20px;
      font-size: 16px;
    }
    input:read-only {
      background: #f7f7f7;
    }
    .btn-sell {
      background: orange;
    }
    .time-stame {
      font-size: 22px;
      padding: 10px 0;
      span:last-child {
        color: red;
      }
    }
    .col-33 {
      display: block;
      float: left;
      width: 33%;
      border-right: 1px solid #d4d4d4;
      margin: 0;
      min-height: 435px;
      min-width: 350px;
      &:last-child {
        border: 0;
      }
    }
    p {
      font-size: 16px;
      padding: 5px 0;
      line-height: 25px;
    }
    .red {
      color: red;
    }
    .alipay-box {
      margin: 20px 50px;
      .alipay-box-title {
        border: 1px solid #d4d4d4;
        padding: 10px 10px 10px 10px;
        background-size: 30px;
        font-size: 16px;
        &.bank-ttile {
          font-size: 20px;
        }
      }
      .i-alipay {
        display: inline-block;
        float: left;
        height: 50px;
        width: 38px;
        background: url('~images/i-alipay.png') no-repeat left center;
        background-size: 30px;
      }
      .i-wechat {
        display: inline-block;
        float: left;
        height: 50px;
        width: 38px;
        background: url('~images/i-wechat.png') no-repeat left center;
        background-size: 30px;
      }
      .alipay-qrcode {
        background: #4aa9e9;
        color: #fff;
        text-align: center;
        padding: 18px;
        &.text-left {
          text-align: left;
        }
        &.bank-txt-box {
          padding: 18px 22px;
        }
        h3 {
          font-weight: normal;
          font-size: 18px;
          padding: 2px 0 8px;
        }
        img {
          width: 160px;
          height: 160px;
          padding: 12px;
          background: url('~images/j.png') no-repeat;
          margin-bottom: 5px;
          display: inline-block;
        }
      }
    }
  }

  .order-time {
    padding: 20px 50px;
  }

  .detail-title {
    height: 80px;
    border-bottom: 1px solid #d4d4d4;
  }

  .title-btn {
    height: 80px;
    line-height: 80px;
    display: inline-block;
    width: 140px;
    color: #fff;
    text-align: center;
    background: #5087ff;
    margin: 0 20px 0 0;
    font-size: 18px;
  }

  .detail-tips {
    border-top: 1px solid #d4d4d4;
    color: #787876;
    line-height: 30px;
    padding: 18px 30px 50px;
    p {
      font-size: 16px;
    }
    .tips-title {
      color: red;
      font-size: 18px;
      padding: 0 0 15px 0;
    }
    .tips-title-i {
      background: url(~images/tips.png) no-repeat left 4px;
      padding: 0 0 15px 25px;
    }
    .tips-title0 {
      padding: 0 0 15px 0;
    }
  }

  .detail-tips-sell {
    padding: 18px 30px 20px;
    overflow: hidden;
  }

  .h3, .bank-title {
    font-weight: normal;
    color: #333;
    font-size: 22px;
    padding: 20px 30px 0;
  }

  .details-data {
    padding: 0 30px 30px;
    li {
      padding: 16px 0 0 0;
    }
    p {
      font-size: 16px;
      padding: 0 0 8px 0;
    }
    .red {
      color: red;
    }
  }

  input[type="button"] {
    &.btn {
      display: inline-block;
      border: 1px solid #5087ff;
      color: #5087ff;
      border-radius: 4px;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      margin: 10px 0 0 0;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
    .btn-blue {
      border: 1px solid #5087ff;
      color: #5087ff;
    }
    &.btn-orange {
      border: 1px solid #ffa500;
      color: #ffa500;
    }
    &.btn-normal {
      border: 1px solid #5087ff;
      background: #5087ff;
      color: #fff;
    }
  }

  .item-info {
    color: #333;
  }

  .item-info.active {
    color: #5087FF;
  }

  .text-center {
    text-align: center;
  }

  .pic-ul {
    overflow: hidden;
    float: left;
  }

  .pic-ul li {
    float: left;
    margin-right: 15px;
  }

  .pic-ul li img {
    height: 190px;
  }

  .friend-txt {
    margin-top: 150px;
  }

  .bank-list-p {
    position: relative;
    margin-bottom: 18px;
  }

  .btn-copy {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #fff;
    border: 0;
    cursor: pointer;
  }

  .i-bank {
    display: inline-block;
    height: 40px;
    width: 46px;
    vertical-align: -13px;
    background: url(~images/bankIcon/juan-bank.png) no-repeat;
    background-size: contain;
    &.icbc {
      background: url(~images/bankIcon/icbc.png) no-repeat;
      background-size: 40px;
    }
    &.cmbc {
      background: url(~images/bankIcon/cmbc.png) no-repeat;
      background-size: 40px;
    }
  }

  .chatRoom {
    position: fixed;
    right: 0;
    bottom: 0;
    color: #fff;
    width: 150px;
    height: 50px;
    background-color: #FF6666;
    border-radius: 10px 10px 0 0;
    font-size: 18px;
    line-height: 50px;
    text-align: center;
    float: right;
    .chatRoom_content{
      position: relative;
    }
  }

    .unread-count {
      display: inline-block;
      border-radius: 50%;
      padding: 0 5px;
      background-color: red;
      font-size: 12px;
      text-align: center;
      margin: 0 auto;
      color: #fff;
      line-height: 17px;
      vertical-align: top;
      margin-top: 7px;
      position: relative;
      &.upMax{
        padding: 0 10px 0 5px;
      }
      .add_symbol {
        position: absolute;
        top: -3px;
        right: 0;
        margin-top: -1px;
        font-size: 14px;
        font-weight: bold;
      }
    }

</style>
