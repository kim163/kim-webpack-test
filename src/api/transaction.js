import { service } from "@/util"

let numversion = '/api/v1/';   // 版本信息
// 交易大厅
// 获取代币订单列表页 (交易大厅 - 买入 UET 列表数据)
export const getOrderxPageForHallSell = jsonData => service({
  url: numversion+`account/chain/getOrderxPageForHallSell`,
  method: 'post',
  data: jsonData
});

// 获取代币订单列表页 （交易大厅 -- 卖出 UET 列表数据） -交易中
export const getOrderxPage = jsonData => service({
  url: numversion+`order/getOrderxPage`,
  method: 'post',
  data: jsonData
});

// 我要挂单--买入挂单
export const publishToBuy = jsonData => service({
  url: numversion+`order/c2c/publishToBuy`,
  method: 'post',
  data: jsonData
});
// 我要挂单--卖出挂单
export const publishToSell = jsonData => service({
  url: numversion+`order/c2c/publishToSell`,
  method: 'post',
  data: jsonData
});

// 挂单记录--挂单下架
export const putToDown = jsonData => service({
  url: numversion+`order/c2c/putToDown`,
  method: 'post',
  data: jsonData
});

// 挂单记录--挂单恢复上架
export const putToUp = jsonData => service({
  url: numversion+`order/c2c/putToUp`,
  method: 'post',
  data: jsonData
});

// 挂单记录--获取已下架订单
export const getOrderxPendingUnshelve = jsonData => service({
  url: numversion+`order/getOrderxPendingUnshelvePage`,
  method: 'post',
  data: jsonData
});

// 挂单记录--删除 已下架挂单
export const deleteUnshelve = jsonData => service({
  url: numversion+`order/c2c/deleteUnshelve`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录-交易结束
export const getTransactionPage = jsonData => service({
  url: numversion+`transaction/getTransactionPage`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录-挂单中
export const getOrderxPendingPage = jsonData => service({
  url: numversion+`order/getOrderxPendingPage`,
  method: 'post',
  data: jsonData
});
//  下单
export const placeAnOrder = jsonData => service({
  url: numversion+`order/c2c/placeAnOrder`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录- 详情
export const getOrderx = jsonData => service({
  url: numversion+`order/getOrderx`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录-已完成- 详情
export const getCoinTransactionHistory = jsonData => service({
  url: numversion+`transaction/getTransaction`,
  method: 'post',
  data: jsonData
});
// 获取 订单记录- 获取申诉列表
export const getAppealHistoryPage = jsonData => service({
  url: numversion+`appeal/getAppealHistoryPage`,
  method: 'post',
  data: jsonData
});
// 获取 订单记录- 获取申诉列表详情
export const getAppealHistoryDetail = jsonData => service({
  url: numversion+`appeal/getAppealDetailHistoryPage`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录- 申诉记录申诉与仲裁  进行中
export const getAppealDetailPage = jsonData => service({
  url: numversion+`appeal/getAppealDetailPage`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录- 申诉记录申诉与仲裁 申诉-点击发送 -（ 双方证据追加 ）
export const addAppealDetail = jsonData => service({
  url: numversion+`appeal/addAppealDetailV2`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录- 获取挂单详情
export const getOrderxPending = jsonData => service({
  url: numversion+`order/getOrderxPending`,
  method: 'post',
  data: jsonData
});

// 获取 代币账户列表信息- 实时账户余额
export const getAccountChainPage = jsonData => service({
  url: numversion+`account/chain/getAccountChainPage`,
  method: 'post',
  data: jsonData
});
// 订单详情--取消订单
export const cancelOrder = jsonData => service({
  url: numversion+`order/c2c/cancelOrder`,
  method: 'post',
  data: jsonData
});


// 获取 订单记录-详情-我已完成收款
export const payCompleted = jsonData => service({
  url: numversion+`order/c2c/payCompleted`,
  method: 'post',
  data: jsonData
});
// 获取 订单记录-详情-我已完成收款
export const payOrderV2 = jsonData => service({
  url: numversion+`order/c2c/payOrderV2`,
  method: 'post',
  data: jsonData
});

// 获取 订单记录-详情-我要申诉
export const createAppeal = jsonData => service({
  url: numversion+`order/c2c/createAppeal`,
  method: 'post',
  data: jsonData
});

// 获取实时余额
export const getRealBalance = jsonData => service({
  url: numversion+`account/chain/getRealBalance`,
  method: 'post',
  data: jsonData
});

//查询订单实时赠送的UET数量
export const getCouponAmount = jsonData => service({
  url: numversion +`coupon/getCouponAmountByOrderId`,
  method:'post',
  data:jsonData,
  loading:false
})
//查询订单最终赠送的UET数量
export const getFinallyAmount = jsonData=>service({
  url: numversion +`coupon/getCouponByOrderId`,
  method:'post',
  data:jsonData
});

// 获取个人中心主页信息
export const getHomeInfo = jsonData => service({
  url: numversion+`getHomeInfo`,
  method: 'post',
  data: jsonData
});
