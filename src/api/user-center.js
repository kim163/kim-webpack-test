import { service } from "@/util"

let numversion = '/api/v1/';   // 版本信息
// 个人中心

//自动识别银行卡
export const autoRecognize = jsonData => service({
  url: numversion+`bank/card/autoRecognize`,
  method: 'post',
  data: jsonData
});

//绑定支付方式：银行卡/支付宝/微信
export const bindBankV2 = jsonData => service({
  url: numversion+`account/cash/bindBankV2`,
  method: 'post',
  data: jsonData
});

//获取银行卡
export const getBankList = jsonData => service({
  url: numversion+`account/cash/getBankList`,
  method: 'post',
  data: jsonData
});

//解绑银行卡
export const unbindBank = jsonData => service({
  url: numversion+`account/cash/unbindBank`,
  method: 'post',
  data: jsonData
});

//绑定用户信息：姓名，身份证，昵称等
export const bindUserInfo = jsonData => service({
  url: numversion+`account/cash/bindUserInfo`,
  method: 'post',
  data: jsonData
});

//我的获赠
export const myGift = jsonData => service({
  url:numversion+`coupon/getCouponDetailPage`,
  method:'post',
  data:jsonData
})

//获取进行中的申诉列表
export const getAppealPage = jsonData => service({
  url: numversion +`appeal/getAppealPage`,
  method:'post',
  data:jsonData
})

//获取历史申诉列表

export const getAppealHistoryPage = jsonData => service({
  url: numversion +`appeal/getAppealHistoryPage`,
  method:'post',
  data:jsonData
})

//获取历史申诉列表中的申诉详情
export const getAppealDetailHistoryPage = jsonData => service({
  url: numversion +`appeal/getAppealDetailHistoryPage`,
  method:'post',
  data:jsonData
})

//获取进行中申诉列表中的申诉详情
export const getAppealDetailPage = jsonData => service({
  url: numversion + `appeal/getAppealDetailPage`,
  method:'post',
  data:jsonData
})

//发送申诉信息
export  const addAppealDetail = jsonData => service({
  url: numversion + `appeal/addAppealDetailV2`,
  method:'post',
  data:jsonData
})
